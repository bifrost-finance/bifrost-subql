IMAGE=harbor.liebi.com/slp/polkadot-subql:v1.1

deploy:
	docker build -f Dockerfile -t ${IMAGE} .
	docker push ${IMAGE}
	kubectl set image deploy -n slp polkadot-suql polkadot-suql=${IMAGE}
	kubectl rollout restart deploy  -n slp polkadot-suql 
