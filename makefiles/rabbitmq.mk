.PHONY: start-rabbitmq stop-rabbitmq down-rabbitmq restart-rabbitmq

start-rabbitmq:
	$(COMPOSE) up -d --no-deps rabbitmq

stop-rabbitmq:
	$(COMPOSE) stop rabbitmq

down-rabbitmq:
	$(COMPOSE) rm -sf rabbitmq

restart-rabbitmq:
	$(COMPOSE) restart rabbitmq
