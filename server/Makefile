COMPOSE = docker-compose -f .docker/docker-compose.yaml -p mock_server

.PHONY: run
run:
	$(COMPOSE) build app
	$(COMPOSE) up -d app

.PHONY: down
down:
	$(COMPOSE) down --volumes --rmi local
