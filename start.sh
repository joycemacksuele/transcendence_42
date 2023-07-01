#!/bin/bash

# This script will boot transcendence, this is the only touch/start point

############################ Colors ##############################
bold_black='\033[1;30m'
bold_red='\033[1;31m'
bold_green='\033[1;32m'
bold_yellow='\033[1;33m'
bold_dark_blue='\033[1;34m'
bold_purple='\033[1;35m'
bold_light_blue='\033[1;36m'
bold_white='\033[1;37m'
bold_cyan_filled='\033[1;7;96m'
reset='\033[0m'
# The -e option of the echo command enables the parsing of the escape sequences
# (often represented by “^[” or “<Esc>” followed by some other characters:
# “\033[<FormatCode>m”). 033 is the octal number for esc ont the ascii table


################### Install Docker Desktop ###################
echo -ne "$bold_white Checking if Docker Desktop is installed...\n"
which docker > /dev/null
if [[ $? == 0 ]] ; then
	echo -ne "$bold_green Docker Desktop is already installed!\n"
	echo -e "$reset ------------------------------------\n"
else
	echo -ne "$bold_red Docker Desktop is not installed! Please install it and run setup.sh again.\n\n"
	echo -ne "$bold_dark_blue To install Docker Deskto on a 42 machine: Download Docker Desktop with MSC and select destination to goinfre.\n\n"
	echo -e "$reset ------------------------------------\n"
fi


################### Downloading npm dependencies ###################
echo -ne "$bold_white downloading dependencies for the backend:\n"
echo -e "$reset ------------------------------------"
cd ./backend/
npm install

echo -ne "\n$bold_white downloading dependencies for the frontend:\n"
echo -e "$reset ------------------------------------"
cd ../frontend/
npm install

cd ../


################### Building docker compose ###################
echo -ne "\n$bold_white While developing: docker compose up\n"
echo -e "$reset ------------------------------------\n"
docker compose up --build
