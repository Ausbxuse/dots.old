#!/bin/bash

# Get the current path from tmux
current_path=$(tmux display-message -p -F "#{pane_current_path}")

# Replace /home/USER/ with ~
formatted_path=${current_path/\/home\/$USER/\~}
# formatted_path=$current_path

# Function to truncate and add ellipsis in the middle if needed
truncate_path() {
	local path=$1
	local max_length=$2
	local part_length=$((max_length / 2 - 2))
	if [ ${#path} -gt $max_length ]; then
		echo "${path:0:$part_length}...${path: -$part_length}"
	else
		local string_length=${#path}
		local num_spaces=$((max_length - string_length))
		# Generate the spaces
		local FILL=$(printf '%*s' $num_spaces)
		# Concatenate your path with spaces

		# res=$(echo -n "${path}${FILL}" | sed 's/~\/\.local\/src/~src/')

		# res=$(echo -n "${path}${FILL}" | sed 's|~/.local/src|~src|')

		# if [ $res = "~/Documents/USC" ]; then
		# 	res="~USC"
		#   elif [ $res = "~/Documents/USC" ]; then
		# 	res="~USC"
		# fi

		# echo -n $res
		echo -n "${path}${FILL}"
	fi
}

# Call the function and print its output
truncate_path "$formatted_path" 30
