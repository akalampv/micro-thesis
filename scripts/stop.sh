#!/bin/bash
# Stop and remove all containers (database data is kept)

cd "$(dirname "$0")/.." || exit 1

echo "Stopping containers..."
docker compose down || exit 1

echo "🛑 All services stopped!"
