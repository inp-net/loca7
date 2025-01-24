set -xe

VERSION=1.14.0

echo "{ \"version\": \"$VERSION\", \"commit\": \"$(git rev-parse HEAD)\" }" > ../public/version.json

docker build -t registry.inpt.fr/net7/loca7:$VERSION ../
docker push registry.inpt.fr/net7/loca7:$VERSION
