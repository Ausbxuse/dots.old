##lua-debug
@implement+=
function M.launch(opts)
  @abort_early_if_already_running
  @verify_launch_arguments

  @init_logger
  @spawn_nvim_instance_for_server
  @detect_if_nvim_is_blocking
  @set_hook_instance_address
  @clear_messages
  @launch_server
  print("Server started on port " .. server.port)
  M.disconnected = false
	@create_autocommand_when_exit
  vim.defer_fn(M.wait_attach, 0)

  return server
end

@script_variables+=
local nvim_server

@spawn_nvim_instance_for_server+=
@copy_args
@copy_env
@fill_env_with_custom
@fill_args_with_custom
nvim_server = vim.fn.jobstart(args, {rpc = true, env = env})

@script_variables+=
local hook_address

@set_hook_instance_address+=
if not hook_addres then
  hook_address = vim.fn.serverstart()
end

vim.fn.rpcrequest(nvim_server, 'nvim_exec_lua', [[debug_hook_conn_address = ...]], {hook_address})

@launch_server+=
local host = (opts and opts.host) or "127.0.0.1"
local port = (opts and opts.port) or 0
local server = vim.fn.rpcrequest(nvim_server, 'nvim_exec_lua', [[return require"osv".start_server(...)]], {host, port, opts and opts.log})
if server == vim.NIL then
	vim.api.nvim_echo({{("Server failed to launch on port %d"):format(port), "ErrorMsg"}}, true, {})
	@terminate_adapter_server_process
	return
end

@implement+=
function M.wait_attach()
  local timer = vim.loop.new_timer()
  timer:start(0, 100, vim.schedule_wrap(function()
    @wait_for_attach_message
    if not has_attach then return end
    timer:close()

    local handlers = {}
    @attach_variables
    @implement_handlers
    @attach_to_current_instance
  end))
end

@verify_launch_arguments+=
vim.validate {
  opts = {opts, 't', true}
}

if opts then
  vim.validate {
    ["opts.host"] = {opts.host, "s", true},
    ["opts.port"] = {opts.port, "n", true},
  }
end

@detect_if_nvim_is_blocking+=
local mode = vim.fn.rpcrequest(nvim_server, "nvim_get_mode")
if mode.blocking then
	vim.api.nvim_echo({{"Neovim is waiting for input at startup. Aborting.", "ErrorMsg"}}, true, {})
	@terminate_adapter_server_process
	return
end

@verify_launch_arguments+=
if opts then
  vim.validate {
    ["opts.config_file"] = {opts.config_file, "s", true},
  }
end

@fill_env_with_custom+=
if opts and opts.env then
	env = env or {}
	for k,v in pairs(opts.env) do
		env[k] = v
	end
end

@fill_args_with_custom+=
if opts and opts.args then
	for _, arg in ipairs(opts.args) do
		table.insert(args, arg)
	end
end

@copy_args+=
local has_embed = false
local has_headless = false
local args = {}
for _, arg in ipairs(vim.v.argv) do
	if arg == '--embed' then
		has_embed = true
	elseif arg == '--headless' then
		has_headless = true
	end
	table.insert(args, arg)
end

if not has_embed then
	table.insert(args, "--embed")
end

if not has_headless then
	table.insert(args, "--headless")
end

@copy_env+=
local env = {}
for k,v in pairs(vim.fn.environ()) do
	env[k] = v
end

@abort_early_if_already_running+=
if M.is_running() then
	vim.api.nvim_echo({{"Server is already running.", "ErrorMsg"}}, true, {})
  return
end
