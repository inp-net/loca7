set -xe

VERSION=1.0.3

docker build -t harbor.k8s.inpt.fr/net7/loca7:$VERSION ../
docker push harbor.k8s.inpt.fr/net7/loca7:$VERSION
