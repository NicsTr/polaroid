#!/bin/sh

(
cd website/static/polaroid/ && compass compile
)

./manage.py collectstatic --noinput -c

./manage.py migrate
