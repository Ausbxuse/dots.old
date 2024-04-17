local api = vim.api
local config = require('spectre.config')
local state = require('spectre.state')
local Path = require('plenary.path')
local state_utils = require('spectre.state_utils')
local utils = require('spectre.utils')

local M = {}

local open_file = function(filename, lnum, col, winid)
    if winid ~= nil then
        vim.fn.win_gotoid(winid)
    end
    vim.api.nvim_command([[execute "normal! m` "]])
    local escaped_filename = vim.fn.fnameescape(filename)
    vim.cmd('e ' .. escaped_filename)
    api.nvim_win_set_cursor(0, { lnum, col })
end

local is_absolute = function(filename)
    if vim.loop.os_uname().sysname == 'Windows_NT' then
        return string.find(filename, '%a:\\') == 1
    end
    return string.sub(filename, 1, 1) == '/'
end

local get_file_path = function(filename)
    -- if the path is absolute, return as is
    if is_absolute(filename) then
        return filename
    end
    -- use default current working directory if state.cwd is nil or empty string
    --
    if state.cwd == nil or state.cwd == '' then
        state.cwd = vim.fn.getcwd()
    end

    return vim.fn.expand(state.cwd) .. Path.path.sep .. filename
end

M.select_entry = function()
    local t = M.get_current_entry()
    if t == nil then
        return nil
    end
    if config.is_open_target_win and state.target_winid ~= nil then
        open_file(t.filename, t.lnum, t.col, state.target_winid)
    else
        open_file(t.filename, t.lnum, t.col)
    end
end

M.get_state = function()
    local result = {
        query = state.query,
        cwd = state.cwd,
        options = state.options,
    }
    return vim.deepcopy(result)
end

M.set_entry_finish = function(display_lnum)
    local item = state.total_item[display_lnum + 1]
    if item then
        item.is_replace_finish = true
    end
end

M.get_current_entry = function()
    if not state.total_item then
        return
    end
    local lnum = unpack(vim.api.nvim_win_get_cursor(0))
    local item = state.total_item[lnum]
    if item ~= nil and item.display_lnum == lnum - 1 then
        local t = vim.deepcopy(item)
        t.filename = get_file_path(item.filename)
        return t
    end
end

M.get_all_entries = function()
    local entries = {}
    for _, item in pairs(state.total_item) do
        if not item.disable then
            local t = vim.deepcopy(item)
            t.filename = get_file_path(item.filename)
            table.insert(entries, t)
        end
    end
    return entries
end

M.send_to_qf = function()
    local entries = M.get_all_entries()
    vim.cmd([[copen]])
    vim.fn.setqflist(entries, 'r')
    vim.fn.setqflist({}, 'r', {
        title = string.format('Result Search: [%s]', state.query.search_query),
    })
    return entries
end

-- input that comand to run on vim
M.replace_cmd = function()
    M.send_to_qf()
    local replace_cmd = ''
    if #state.query.search_query > 2 then
        local ignore_case = ''
        local search_regex = utils.escape_vim_magic(state.query.search_query)
        if state_utils.has_options('ignore-case') == true then
            ignore_case = 'i'
        end
        if state.query.is_file == true then
            vim.fn.win_gotoid(state.target_winid)
            replace_cmd = string.format(':%%s/\\v%s/%s/g%s', search_regex, state.query.replace_query, ignore_case)
        else
            replace_cmd = string.format(
                ':%s %%s/\\v%s/%s/g%s | update',
                config.replace_vim_cmd,
                search_regex,
                state.query.replace_query,
                ignore_case
            )
        end
    end
    if #replace_cmd > 1 then
        vim.api.nvim_feedkeys(replace_cmd, 'n', true)
    end
end

M.run_current_replace = function()
    local entry = M.get_current_entry()
    if entry then
        M.run_replace({ entry })
    else
        vim.notify('Not found any entry to replace.')
    end
end

local is_running = false

M.run_replace = function(entries)
    if is_running == true then
        print('it is already running')
        return
    end
    is_running = true
    entries = entries or M.get_all_entries()
    local replacer_creator = state_utils.get_replace_creator()
    local done_item = 0
    local error_item = 0
    state.status_line = 'Run Replace.'
    local replacer = replacer_creator:new(state_utils.get_replace_engine_config(), {
        on_done = function(result)
            if result.ref then
                done_item = done_item + 1
                state.status_line = 'Replace: ' .. done_item .. ' Error:' .. error_item
                M.set_entry_finish(result.ref.display_lnum)
                local value = result.ref
                value.text = ' DONE'
                vim.fn.setqflist(entries, 'r')
                api.nvim_buf_set_extmark(
                    state.bufnr,
                    config.namespace,
                    value.display_lnum,
                    0,
                    { virt_text = { { '󰄲 DONE', 'String' } }, virt_text_pos = 'eol' }
                )
            end
        end,
        on_error = function(result)
            if type(result.value) == 'string' then
                for line in result.value:gmatch('[^\r\n]+') do
                    print(line)
                end
            end
            if result.ref then
                error_item = error_item + 1
                local value = result.ref
                value.text = 'ERROR'
                vim.fn.setqflist(entries, 'r')
                state.status_line = 'Replace: ' .. done_item .. ' Error:' .. error_item
                api.nvim_buf_set_extmark(
                    state.bufnr,
                    config.namespace,
                    value.display_lnum,
                    0,
                    { virt_text = { { '󰄱 ERROR', 'Error' } }, virt_text_pos = 'eol' }
                )
            end
        end,
    })
    for _, value in pairs(entries) do
        if not value.is_replace_finish then
            replacer:replace({
                lnum = value.lnum,
                col = value.col,
                cwd = state.cwd,
                display_lnum = value.display_lnum,
                filename = value.filename,
                search_text = state.query.search_query,
                replace_text = state.query.replace_query,
            })
        end
    end
    is_running = false
    vim.cmd.checktime()
end

M.select_template = function()
    if not state.user_config.open_template or #state.user_config.open_template == 0 then
        vim.notify('You need to set open_template on setup function.')
        return
    end
    local target_bufnr = state.target_bufnr
    local target_winid = state.target_winid
    local is_spectre = vim.api.nvim_buf_get_option(0, 'filetype') == 'spectre_panel'
    vim.ui.select(state.user_config.open_template, {
        prompt = 'Select template',
        format_item = function(item)
            return item.search_text
        end,
    }, function(item)
        require('spectre').open(vim.tbl_extend('force', state.query, item))
        if is_spectre and target_bufnr and target_winid then
            state.target_bufnr = target_bufnr
            state.target_winid = target_winid
        end
    end)
end

M.copy_current_line = function()
    local line_text = vim.api.nvim_get_current_line()
    local row = unpack(vim.api.nvim_win_get_cursor(0))
    if row > state.user_config.lnum_UI then
        line_text = line_text:sub(#state.user_config.result_padding, #line_text)
    end
    vim.fn.setreg(vim.v.register, line_text)
end

return M
