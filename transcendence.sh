#!/bin/bash

# This script will boot transcendence, this is the only touch/start point

############################################ Colors ###########################################
black='\033[0;30m'
bold_black='\033[1;30m'
green='\033[0;32m'
bold_green='\033[1;32m'
red='\033[0;31m'
bold_red='\033[1;31m'
yellow='\033[0;33m'
bold_yellow='\033[1;33m'
dark_blue='\033[0;34m'
bold_dark_blue='\033[1;34m'
purple='\033[0;35m'
bold_purple='\033[1;35m'
light_blue='\033[0;36m'
bold_light_blue='\033[1;36m'
white='\033[0;37m'
bold_white='\033[1;37m'
cyan_filled='\033[0;7;96m'
bold_cyan_filled='\033[1;7;96m'
reset='\033[0m'
# The -e option of the echo command enables the parsing of the escape sequences
# (often represented by “^[” or “<Esc>” followed by some other characters:
# “\033[<FormatCode>m”). 033 is the octal number for esc ont the ascii table

############################################ Welcome ###########################################
if [[ ! $1 ]] ; then
	\clear
  echo -e "$reset ------------------------------------\n
  $bold_green WELCOME TO TRANSCENDENCE\n
  $bold_dark_blue To build (from scratch):
  $bold_white ./transcendence.sh build$reset\n
  $bold_dark_blue To run:
  $bold_white ./transcendence.sh run$reset\n
  $bold_dark_blue To clean:
  $bold_white ./transcendence.sh clean$reset\n
  $reset ------------------------------------"
	exit
fi

###################################### Build transcendence #####################################
if [[ $1 = 'build' ]] ; then
	\clear

  ################### Install Docker Desktop ###################
  echo -ne "$bold_white -> Checking if Docker Desktop is installed...\n"
  which docker > /dev/null
  if [[ $? == 0 ]] ; then
    echo -ne "$green Docker Desktop is already installed!\n"
    echo -e "$reset ------------------------------------\n"
  else
    echo -ne "$bold_red Docker Desktop is not installed! Please install it and run setup.sh again.\n\n"
    echo -ne "$light_blue To install Docker Desktop on a 42 machine: Download Docker Desktop with MSC and select destination to goinfre.\n\n"
    echo -e "$reset ------------------------------------\n"
  fi

  ################### Downloading npm dependencies ###################
  echo -ne "$bold_white -> Downloading dependencies for the backend:\n"
  echo -e "$reset ------------------------------------"
  cd ./backend/ || echo -ne "$red Can't cd to ./backend\n"
  npm install

  echo -ne "\n$bold_white -> Downloading dependencies for the frontend:\n"
  echo -e "$reset ------------------------------------"
  cd ../frontend/ || echo -ne "$red Can't cd to ./frontend\n"
  npm install

  cd ../ || echo -ne "$red Can't cd to ../\n"

  ################### Building docker compose ###################
  echo -ne "$bold_white -> Building docker compose:\n"
  echo -e "$reset ------------------------------------\n"
  docker compose up --build --remove-orphans
  # Found orphan containers ([transcendence_42-react-app-1 transcendence_42-nest-app-1 transcendence_42-database_host-1])
  # for this project. If you removed or renamed this service in your compose file, you can run this command with the
  # --remove-orphans flag to clean it up.
  exit
fi

###################################### Run transcendence #######################################
if [[ $1 = 'run' ]] ; then
	\clear
  ################### Running docker compose ###################
  echo -ne "$bold_white -> Running docker compose:\n"
  echo -e "$reset ------------------------------------\n"
  docker compose up
  exit
fi

##################################### Clean transcendence ######################################
if [[ $1 = 'clean' ]] ; then
	\clear
  echo -ne "$bold_white -> Cleaning up:\n"
  echo -e "$reset ------------------------------------\n"
  docker compose down -v
  # The -v flag removes all the volumes so you can have a fresh start.
#  docker system prune -> this cleans docker containers/volumes/networks not only for the compose - all in docker (besides images)
  exit
fi
