IMAGE=harbor.liebi.com/slp/polkadot-subql:v1.5
NAMESPACE=slp


deploy:
	docker build -f Dockerfile -t ${IMAGE} .
	docker push ${IMAGE}
	kubectl set image deploy -n slp polkadot-suql polkadot-suql=${IMAGE}
	kubectl rollout restart deploy  -n slp polkadot-suql 

create-cm:
	kubectl create cm polkadot-subql-project-yaml --from-file=project.yaml -n ${NAMESPACE}