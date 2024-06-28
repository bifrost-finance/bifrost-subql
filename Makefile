GIT_COMMIT := $(shell git rev-parse --short HEAD)
IMAGE=harbor.liebi.com/slp/bifrost-collator-subql:$(GIT_COMMIT)
DEPLOY=bifrost-collator-subql
NAMESPACE=slp
K8S_DEPLOYMENT := deploy/*

create-ns:
	@kubectl create ns ${NAMESPACE} || true

create-pull-secret:create-ns
	kubectl create secret generic harbor \
		--from-file=.dockerconfigjson=/root/.docker/config.json \
		--type=kubernetes.io/dockerconfigjson -n ${NAMESPACE}

create-cm:
	kubectl delete cm -n ${NAMESPACE} ${DEPLOY}-project-yaml
	kubectl create cm -n ${NAMESPACE} ${DEPLOY}-project-yaml --from-file=project.yaml
	
update-yaml:
	sed -i 's,image: .*,image: $(IMAGE),' $(K8S_DEPLOYMENT)

build:
	docker build -f Dockerfile -t ${IMAGE} .

push:build
	docker push ${IMAGE}

.PHONY: deploy
deploy:
	kubectl apply -f deploy/deploy.yaml

update:push
	kubectl set image deploy -n ${NAMESPACE}  ${DEPLOY} ${DEPLOY}=${IMAGE}	



