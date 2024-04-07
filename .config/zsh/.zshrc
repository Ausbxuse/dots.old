# Autoload zsh add-zsh-hook and vcs_info functions (-U autoload w/o substition, -z use zsh style)
autoload -Uz add-zsh-hook vcs_info
# Enable substitution in the prompt.
setopt prompt_subst
# Run vcs_info just before a prompt is displayed (precmd)
add-zsh-hook precmd vcs_info
# add ${vcs_info_msg_0} to the prompt
# e.g. here we add the Git information in red  
# PROMPT='%1~ %F{red}${vcs_info_msg_0_}%f %# '
#󰚜󰚛
# Enable checking for (un)staged changes, enabling use of %u and %c
zstyle ':vcs_info:*' check-for-changes true
# Set custom strings for an unstaged vcs repo changes (*) and staged changes (+)
zstyle ':vcs_info:*' unstagedstr ' *'
zstyle ':vcs_info:*' stagedstr ' +'
# Set the format of the Git information for vcs_info
zstyle ':vcs_info:git:*' formats       ' %b%u%c'
zstyle ':vcs_info:git:*' actionformats '%b|%a%u%c'


# Enable colors and change prompt:
autoload -U colors && colors	# Load colors
setopt autocd		# Automatically cd into typed directory.
# stty stop undef		# Disable ctrl-s to freeze terminal.
setopt interactive_comments
#setopt menu_complete # for better auto complete
case $TERM in
  st-256color|alacritty)
      precmd () {printf "\033]0;%s@%s:%s\007" "${USER}" "${HOSTNAME%%.*}" "${PWD/#$HOME/~}"}
    ;;
esac
# History in cache directory:
HISTSIZE=10000000
SAVEHIST=10000000
HISTFILE=~/.cache/zsh/history

# Load aliases and shortcuts if existent.
[ -f "${XDG_CONFIG_HOME:-$HOME/.config}/shell/shortcutrc" ] && source "${XDG_CONFIG_HOME:-$HOME/.config}/shell/shortcutrc"
[ -f "${XDG_CONFIG_HOME:-$HOME/.config}/shell/aliasrc" ] && source "${XDG_CONFIG_HOME:-$HOME/.config}/shell/aliasrc"
[ -f "${XDG_CONFIG_HOME:-$HOME/.config}/shell/zshnameddirrc" ] && source "${XDG_CONFIG_HOME:-$HOME/.config}/shell/zshnameddirrc"

# Basic auto/tab complete:
autoload -U compinit
#zstyle ':completion:*' menu select
zstyle ':completion:*' matcher-list '' 'm:{a-zA-Z}={A-Za-z}' 'r:|[._-]=* r:|=*' 'l:|=* r:|=*'
#zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}'
zmodload zsh/complist
compinit
_comp_options+=(globdots)		# Include hidden files.
#⌾
# vi mode
#bindkey -v
#bindkey -r "^["
export KEYTIMEOUT=1

# Use vim keys in tab complete menu:
bindkey -M menuselect 'h' vi-backward-char
bindkey -M menuselect 'k' vi-up-line-or-history
bindkey -M menuselect 'l' vi-forward-char
bindkey -M menuselect 'j' vi-down-line-or-history
bindkey -v '^?' backward-delete-char

# Change cursor shape for different vi modes.
function zle-keymap-select {
  if [[ ${KEYMAP} == vicmd ]] ||
     [[ $1 = 'block' ]]; then
    echo -ne '\e[1 q'
  elif [[ ${KEYMAP} == main ]] ||
       [[ ${KEYMAP} == viins ]] ||
       [[ ${KEYMAP} = '' ]] ||
       [[ $1 = 'beam' ]]; then
    echo -ne '\e[5 q'
  fi
}
zle -N zle-keymap-select
zle-line-init() {
    zle -K viins # initiate `vi insert` as keymap (can be removed if `bindkey -V` has been set elsewhere)
    echo -ne "\e[5 q"
}
zle -N zle-line-init
echo -ne '\e[5 q' # Use beam shape cursor on startup.
preexec() { echo -ne '\e[5 q' ;} # Use beam shape cursor for each new prompt.

# Use lf to switch directories and bind it to ctrl-o
lfcd () {
    tmp="$(mktemp)"
    lf -last-dir-path="$tmp" "$@"
    if [ -f "$tmp" ]; then
        dir="$(cat "$tmp")"
        rm -f "$tmp" >/dev/null
        [ -d "$dir" ] && [ "$dir" != "$(pwd)" ] && cd "$dir"
    fi
}

bindkey -s '^a' 'R -q\n'

bindkey '^[[P' delete-char

# Edit line in vim with ctrl-e:
autoload edit-command-line; zle -N edit-command-line
bindkey '^e' edit-command-line

export LESSOPEN='| lessfilter-fzf %s'
# View manpage with neovim
# export MANPAGER="nvim -c 'set ft=man' -"
export MANPAGER='nvim +Man!'
# export MANPAGER="sh -c 'col -bx | bat -l man -p'"

[ -f /opt/miniconda3/etc/profile.d/conda.sh ] && source /opt/miniconda3/etc/profile.d/conda.sh

# shell
if [[ $UID -eq 0 ]]; then
    user_symbol="%F{8}%K{8}%F{1} %{%k%}%F{8}%f"
else
    user_symbol="%F{8}%K{8}%F{5} %{%k%}%F{8}%f"
fi

# Configuration
num_dirs=0 # Use 0 for full path
NEWLINE=$'\n'
#truncated_path="%F{8}%K{8}%F{4} %K{0} %F{white}%$num_dirs~%{%k%}%F{0}%f%F{13}❯%F{5}❯%F{14}❯%{%k%}%F{white}"
truncated_path="%F{4}%$num_dirs~$NEWLINE%{%k%}%f%F{5}❯%{%k%}%F{white}"
background_jobs="%(1j.%F{0}%K{0}%F{3}%{%k%}%F{0}%f.)"
non_zero_return_value="%(0?..%F{0}%K{0}%F{1}%{%k%}%F{0}%f)"

# Left part of prompt
#PROMPT="$truncated_path $user_symbol "
PROMPT_COMMAND='echo -ne "\033]0;${USER}@${HOSTNAME}:${PWD}\007"'
PROMPT='$truncated_path '
# Right part of prompt
RPROMPT='$background_jobs $non_zero_return_value %F{cyan}${vcs_info_msg_0_}%f %F{10}%D{%H:%M:%S %m-%d}'
# Input in bold
zle_highlight=(default:bold)

# cd ls
cl() {
  cd "$@" && ls;
}

### Added by Zinit's installer
if [[ ! -f $HOME/.local/share/zinit/zinit.git/zinit.zsh ]]; then
    print -P "%F{33} %F{220}Installing %F{33}ZDHARMA-CONTINUUM%F{220} Initiative Plugin Manager (%F{33}zdharma-continuum/zinit%F{220})…%f"
    command mkdir -p "$HOME/.local/share/zinit" && command chmod g-rwX "$HOME/.local/share/zinit"
    command git clone https://github.com/zdharma-continuum/zinit "$HOME/.local/share/zinit/zinit.git" && \
        print -P "%F{33} %F{34}Installation successful.%f%b" || \
        print -P "%F{160} The clone has failed.%f%b"
fi

source "$HOME/.local/share/zinit/zinit.git/zinit.zsh"
autoload -Uz _zinit
(( ${+_comps} )) && _comps[zinit]=_zinit

zinit ice depth=1;
# zinit light unixorn/fzf-zsh-plugin
zinit light Aloxaf/fzf-tab
zinit light zdharma-continuum/fast-syntax-highlighting
zinit light zsh-users/zsh-autosuggestions
zinit light zsh-users/zsh-history-substring-search
# zinit ice wait atload'_history_substring_search_config'
# zinit light jeffreytse/zsh-vi-mode
zinit light kutsan/zsh-system-clipboard
# zinit light romkatv/powerlevel10k

bindkey '^[[A' history-substring-search-up
bindkey '^[[B' history-substring-search-down
export HISTORY_SUBSTRING_SEARCH_ENSURE_UNIQUE=true

# it is an example. you can change it
zstyle ':fzf-tab:complete:git-(add|diff|restore):*' fzf-preview \
	'git diff $word | delta'
zstyle ':fzf-tab:complete:git-log:*' fzf-preview \
	'git log --color=always $word'
zstyle ':fzf-tab:complete:git-help:*' fzf-preview \
	'git help $word | bat -plman --color=always'
zstyle ':fzf-tab:complete:git-show:*' fzf-preview \
	'case "$group" in
	"commit tag") git show --color=always $word ;;
	*) git show --color=always $word | delta ;;
	esac'
zstyle ':fzf-tab:complete:git-checkout:*' fzf-preview \
	'case "$group" in
	"modified file") git diff $word | delta ;;
	"recent commit object name") git show --color=always $word | delta ;;
	*) git log --color=always $word ;;
	esac'

# give a preview of commandline arguments when completing `kill`
# zstyle ':completion:*:*:*:*:processes' command "ps -u $USER -o pid,user,comm -w -w"
# zstyle ':fzf-tab:complete:(kill|ps):argument-rest' fzf-preview \
#   [[ $group == "[process ID]" ]] && ps --pid=$word -o cmd --no-headers -w -w
# zstyle ':fzf-tab:complete:(kill|ps):argument-rest' fzf-flags --preview-window=down:3:wrap

zstyle ':fzf-tab:complete:_zlua:*' query-string input
# disable sort when completing `git checkout`
zstyle ':completion:*:git-checkout:*' sort false
# set descriptions format to enable group support
#
# NOTE: don't use escape sequences here, fzf-tab will ignore them
#
zstyle ':fzf-tab:complete:*:*' fzf-preview 'less ${(Q)realpath}'
export LESSOPEN='|~/.config/zsh/.lessfilter %s'

zstyle ':completion:*:descriptions' format '[%d]'
# set list-colors to enable filename colorizing
zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}
# force zsh not to show completion menu, which allows fzf-tab to capture the unambiguous prefix
zstyle ':completion:*' menu no
# preview directory's content with eza when completing cd
zstyle ':fzf-tab:complete:cd:*' fzf-preview 'eza -1 --color=always $realpath'
# switch group using `<` and `>`
zstyle ':fzf-tab:*' switch-group '<' '>'
zstyle ':fzf-tab:*' fzf-command fzf
zstyle ':fzf-tab:*' fzf-bindings 'tab:accept'
zstyle ':fzf-tab:*' accept-line enter
zstyle ':fzf-tab:*' continuous-trigger '/'
# zstyle ':fzf-tab:*' fzf-command ftb-tmux-popup
## apply to all command
# zstyle ':fzf-tab:*' popup-min-size 50 8
# only apply to 'diff'
# zstyle ':fzf-tab:complete:diff:*' popup-min-size 80 12
unalias zi
eval "$(zoxide init zsh)"

if command -v tmux &> /dev/null && [ -n "$PS1" ] && [[ ! "$TERM" =~ screen ]] && [[ ! "$TERM" =~ tmux ]] && [ -z "$TMUX" ]; then
  exec tmux new-session -A -s main
fi
eval "$(fzf --zsh)"

fzf-file-widget() {
  FILE="$(__fsel | sed 's/ $//')"
  if [[ -n $FILE ]]; then
    nvim $FILE
    local ret=$?
    zle reset-prompt
    return $ret
  else
    zle reset-prompt
    return 1
  fi
}

bindkey -M emacs '^g' fzf-cd-widget
bindkey -M vicmd '^g' fzf-cd-widget
bindkey -M viins '^g' fzf-cd-widget

bindkey -M emacs '^f' fzf-file-widget
bindkey -M vicmd '^f' fzf-file-widget
bindkey -M viins '^f' fzf-file-widget

FZF_ALT_C_COMMAND='fd -H --max-depth 6 -t d'
FZF_CTRL_T_COMMAND='fd -H --max-depth 4 -t f -t l'
