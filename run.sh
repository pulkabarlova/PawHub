#!/usr/bin/env bash
# PawHub one-command Docker launcher.
#
#   ./run.sh          build + start the whole stack (mongo + backend + frontend)
#   ./run.sh restart  relaunch everything cleanly: down, rebuild, up (detached)
#   ./run.sh down     stop and remove the containers (DB volume is kept)
#   ./run.sh reset    stop and remove containers AND wipe the database volume
#
# If your user can't reach the Docker daemon yet (not in the `docker` group),
# this script automatically falls back to `sudo` and will prompt for your
# password. To run Docker without sudo in future:
#     sudo usermod -aG docker "$USER"   # then log out and back in
set -euo pipefail
cd "$(dirname "$0")"

# Decide whether we need sudo to talk to the Docker daemon.
if docker info >/dev/null 2>&1; then
  RUN=()
else
  echo "ℹ️  Docker daemon not reachable as $(whoami); using sudo (you'll be prompted)."
  echo "    Tip: 'sudo usermod -aG docker $USER' then re-login to drop the sudo."
  echo
  RUN=(sudo)
fi

action="${1:-up}"
case "$action" in
  up)
    echo "🐾 Building and starting PawHub…"
    echo "   Frontend → http://localhost:5173"
    echo "   Backend  → http://localhost:5001"
    echo
    exec "${RUN[@]}" docker compose up --build
    ;;
  restart)
    echo "🔄 Relaunching PawHub (down → rebuild → up)…"
    "${RUN[@]}" docker compose down
    "${RUN[@]}" docker compose up --build -d
    echo
    "${RUN[@]}" docker compose ps
    echo
    echo "✅ PawHub is up:"
    echo "   Frontend → http://localhost:5173"
    echo "   Backend  → http://localhost:5001"
    ;;
  down)
    exec "${RUN[@]}" docker compose down
    ;;
  reset)
    exec "${RUN[@]}" docker compose down -v
    ;;
  *)
    echo "Usage: ./run.sh [up|restart|down|reset]" >&2
    exit 1
    ;;
esac
