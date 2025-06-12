#!/bin/sh
pip3 install -r requirements.txt
exec gunicorn -w 4 "server:app" --timeout 600
