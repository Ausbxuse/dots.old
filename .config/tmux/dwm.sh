#!/bin/bash

# Get the current number of panes in the window
pane_count=$(tmux list-panes | wc -l)

if [ "$1" = "open" ]; then
	# If there is only one pane, split horizontally and resize
	if [ "$pane_count" -eq 1 ]; then
		tmux split-window -h -c "#{pane_current_path}"
		# Calculate half the window's width and resize the pane
	else
		# If there are multiple panes, split vertically
		tmux split-window -v -c "#{pane_current_path}"
	fi
else
	tmux kill-pane
fi

# half_width=$(tmux display -t 0 -p '#{window_width}' | awk '{print int($1/2)}')
# tmux resize-pane -t 0 -x $half_width
tmux select-layout main-vertical
