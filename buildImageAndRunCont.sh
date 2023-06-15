# docker build -t img_nodejs00 .
docker build -t img_nodejs00:latest  .


if docker container inspect cont01 >/dev/null 2>&1; then
    docker rm -f cont01
else
    echo "Container does not exist: cont01"
fi


# docker run -p 3000:3000 --name cont01  img_nodejs00:latest
docker run --name cont01 -p 3000:3000 img_nodejs00:latest

