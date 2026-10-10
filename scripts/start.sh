#!/bin/bash
# Start all containers and wait until the app is reachable

cd "$(dirname "$0")/.." || exit 1

if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Start Docker Desktop and try again." >&2
    exit 1
fi

echo "Starting containers..."
docker compose up -d || exit 1

# "up -d" returns once the containers have started, not once they are usable --
# each service still runs "npm install" before it listens.
wait_for() {
    for _ in $(seq 90); do
        curl -s -o /dev/null "$2" && return 0
        sleep 2
    done
    echo "❌ $1 never became reachable. Check: docker compose logs $1" >&2
    exit 1
}

echo "Waiting for the API gateway..."
wait_for api-gateway http://localhost:3000

echo "Waiting for the frontend..."
wait_for frontend http://localhost:5173

echo "✅ All services started successfully!"
echo "Frontend:    http://localhost:5173"
echo "API gateway: http://localhost:3000"
echo "MongoDB:     mongodb://localhost:27017"
echo "Mailbox:     http://localhost:8025"
