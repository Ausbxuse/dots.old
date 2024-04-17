![clangd](https://user-images.githubusercontent.com/36493671/152692205-837ec826-54d0-4257-9894-cc1a7ac8a114.svg)

Requires Neovim 0.7+

## Installation
Install this plugin using any plugin/package manager or see [`:h packages`](https://neovim.io/doc/user/repeat.html#packages)

## Configuration:
Set up clangd via lspconfig/vim.lsp.start, as usual.
You don't need to call `require("clangd_extensions").setup` if you like the defaults:
```lua
require("clangd_extensions").setup({
    inlay_hints = {
        inline = vim.fn.has("nvim-0.10") == 1,
        -- Options other than `highlight' and `priority' only work
        -- if `inline' is disabled
        -- Only show inlay hints for the current line
        only_current_line = false,
        -- Event which triggers a refresh of the inlay hints.
        -- You can make this { "CursorMoved" } or { "CursorMoved,CursorMovedI" } but
        -- not that this may cause  higher CPU usage.
        -- This option is only respected when only_current_line and
        -- autoSetHints both are true.
        only_current_line_autocmd = { "CursorHold" },
        -- whether to show parameter hints with the inlay hints or not
        show_parameter_hints = true,
        -- prefix for parameter hints
        parameter_hints_prefix = "<- ",
        -- prefix for all the other hints (type, chaining)
        other_hints_prefix = "=> ",
        -- whether to align to the length of the longest line in the file
        max_len_align = false,
        -- padding from the left if max_len_align is true
        max_len_align_padding = 1,
        -- whether to align to the extreme right or not
        right_align = false,
        -- padding from the right if right_align is true
        right_align_padding = 7,
        -- The color of the hints
        highlight = "Comment",
        -- The highlight group priority for extmark
        priority = 100,
    },
    ast = {
        -- These are unicode, should be available in any font
        role_icons = {
            type = "🄣",
            declaration = "🄓",
            expression = "🄔",
            statement = ";",
            specifier = "🄢",
            ["template argument"] = "🆃",
        },
        kind_icons = {
            Compound = "🄲",
            Recovery = "🅁",
            TranslationUnit = "🅄",
            PackExpansion = "🄿",
            TemplateTypeParm = "🅃",
            TemplateTemplateParm = "🅃",
            TemplateParamObject = "🅃",
        },
        --[[ These require codicons (https://github.com/microsoft/vscode-codicons)
            role_icons = {
                type = "",
                declaration = "",
                expression = "",
                specifier = "",
                statement = "",
                ["template argument"] = "",
            },

            kind_icons = {
                Compound = "",
                Recovery = "",
                TranslationUnit = "",
                PackExpansion = "",
                TemplateTypeParm = "",
                TemplateTemplateParm = "",
                TemplateParamObject = "",
            }, ]]

        highlights = {
            detail = "Comment",
        },
    },
    memory_usage = {
        border = "none",
    },
    symbol_info = {
        border = "none",
    },
})
```
## Features:
### [Switch between source/header](https://clangd.llvm.org/extensions#switch-between-sourceheader)
### Usage
`:ClangdSwitchSourceHeader`
### [Inlay hints](https://clangd.llvm.org/extensions#inlay-hints)
![image](https://user-images.githubusercontent.com/36493671/152699601-61ad1640-96bf-4082-b553-75d4085c3496.png)
#### Usage
Add this to your nvim-lspconfig / `vim.lsp.start()`'s `on_attach`:
```lua
require("clangd_extensions.inlay_hints").setup_autocmd()
require("clangd_extensions.inlay_hints").set_inlay_hints()
```
### [View AST](https://clangd.llvm.org/extensions#ast)
![image](https://user-images.githubusercontent.com/36493671/255611133-35f397d3-02f8-4d14-b70a-126be6c098fa.gif)
You can fold nodes using `zc` and friends - the AST window has `shiftwidth=2` and `foldmethod=indent`.

#### Usage
`:ClangdAST` to view the ast with the current line as the range, `:'<,'>ClangdAST` with a visual selection to view the ast with the selected lines as range.
See how ranges are handled at https://clangd.llvm.org/extensions#ast
### [Completion scores](https://clangd.llvm.org/extensions#code-completion-scores)
Usage: For nvim-cmp
```lua
local cmp = require "cmp"
cmp.setup {
    -- ... rest of your cmp setup ...

    sorting = {
        comparators = {
            cmp.config.compare.offset,
            cmp.config.compare.exact,
            cmp.config.compare.recently_used,
            require("clangd_extensions.cmp_scores"),
            cmp.config.compare.kind,
            cmp.config.compare.sort_text,
            cmp.config.compare.length,
            cmp.config.compare.order,
        },
    },
}
```
### [Symbol info](https://clangd.llvm.org/extensions#symbol-info-request)
![image](https://user-images.githubusercontent.com/36493671/152699367-dc928adf-d3ed-4e8e-a9d0-ca573f01c008.png)
#### Usage
`:ClangdSymbolInfo` with the cursor at the desired symbol.
### [Type hierarchy](https://clangd.llvm.org/extensions#type-hierarchy)

![image](https://user-images.githubusercontent.com/36493671/255609950-80bebd4a-9800-432d-9f0c-5e5519eeba6f.gif)
#### Usage
`:ClangdTypeHierarchy` with the cursor over the desired type or a symbol of that type.
`gd` with the cursor over a type in a window to go to its definition.
### [Memory usage](https://clangd.llvm.org/extensions#memory-usage)
You can fold items using `zc` and friends - the memory usage window has `shiftwidth=2` and `foldmethod=indent`.
![image](https://user-images.githubusercontent.com/36493671/152699322-9e537b1a-8253-45c1-ada3-752effeac39b.png)
#### Usage
`:ClangdMemoryUsage`. Preamble can be large so it is collapsed by default, to expand it use `:ClangdMemoryUsage expand_preamble`

## Implementation status of [extensions](https://clangd.llvm.org/extensions)
 ☑️ Memory usage

 ☑️ AST

 ☑️ Symbol info request

 ☑️ Type hierarchy

 ☑️ Inlay hints

 ☑️ Switch between source/header

 ☑️ File status (see lsp-status.nvim)

 ☑️ Compilation commands (can be specified in `vim.lsp.start()`/lspconfig `init_options` and `settings`)

 ☑️ Code completion scores

 ⬜ Force diagnostics generation (not sure)
## Credits
[simrat39](https://github.com/simrat39) - the code for inlay hints was taken from [rust-tools.nvim](https://github.com/simrat39/rust-tools.nvim) with very minor changes.
