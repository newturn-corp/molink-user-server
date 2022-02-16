#!/bin/bash
checkThenCreateDir () {
    name=$1
    if [ ! -d $name ]
    then
        echo "create dir: $name"
        mkdir $name
    else
        echo "already exist dir: $name"
    fi
}

cd /home/ubuntu
checkThenCreateDir log

# clean up old source code
if [ -d user ]
then
    echo "clean up: user"
    rm -r user
    mkdir user
else
    echo "create dir: user"
    mkdir user
fi
