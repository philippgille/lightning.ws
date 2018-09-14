#!/bin/bash

set euxo -pipefail
SCRIPTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

sudo docker build -t philippgille/ln-ws-api $SCRIPTDIR
