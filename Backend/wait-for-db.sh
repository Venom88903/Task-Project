#!/bin/sh
set -e

host="$1"
shift
cmd="$@"

until pg_isready -h "$host" -p 5432 -U postgres > /dev/null 2>&1; do
  echo "⏳ Waiting for database at $host:5432..."
  sleep 2
done

echo "✅ Database is up! Starting app..."
exec $cmd
