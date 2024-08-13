cd /home/evolve/evolve/backend
export DJANGO_SETTINGS_MODULE=src.settings
env/bin/celery -A auto.celery  worker --loglevel=INFO