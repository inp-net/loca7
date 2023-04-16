set -xe

VERSION=0.0.2

docker build -t harbor.k8s.inpt.fr/net7/loca7:$VERSION ../
docker push harbor.k8s.inpt.fr/net7/loca7:$VERSION