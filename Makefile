IMAGE=harbor.liebi.com/slp/polkadot-monitor:v1.6

deploy:
	docker build -f Dockerfile -t ${IMAGE} .
	docker push ${IMAGE}
	kubectl set image deploy -n slp bifrost-polkadot-subql bifrost-polkadot-subql=${IMAGE}
	kubectl rollout restart deploy  -n slp bifrost-polkadot-subql
