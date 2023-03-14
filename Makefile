IMAGE=harbor.liebi.com/slp/bifrost-subql:v1.5

deploy:
	docker build -f Dockerfile -t ${IMAGE} .
	docker push ${IMAGE}
	kubectl set image deploy -n slp bifrost-subql bifrost-suql=${IMAGE}
	kubectl rollout restart deploy  -n slp bifrost-subql
