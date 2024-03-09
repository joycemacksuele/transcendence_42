#!/bin/bash

# This script cleans up your Docker environment by removing unused Docker containers, images, volumes, and networks.

echo "Starting Docker cleanup process..."


echo "Listing unused volumes and their approximate disk usage:"

for volume in $(docker volume ls -qf dangling=true); do
    volumePath="/var/lib/docker/volumes/$volume/_data"
    echo "Volume: $volume"
    echo "Approximate Usage:"
    sudo du -sh $volumePath
    echo ""
done



# Remove all stopped containers
echo "Removing all stopped containers..."
docker container prune -f

# Remove all dangling images (those not tagged and not used by any container)
echo "Removing all dangling images..."
docker image prune -a -f

# Remove all unused networks (not used by any containers)
echo "Removing all unused networks..."
docker network prune -f

# Optional: Remove all unused volumes (not used by any containers)
echo "WARNING: This will remove all unused volumes!"
read -p "Do you want to remove all unused volumes? (y/N): " REMOVE_VOLUMES
if [[ "$REMOVE_VOLUMES" == "y" || "$REMOVE_VOLUMES" == "Y" ]]; then
    echo "Removing all unused volumes..."
    docker volume prune -f
else
    echo "Skipping volume removal."
fi

echo "Docker cleanup process completed."
