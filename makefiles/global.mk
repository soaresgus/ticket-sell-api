.PHONY: start-all stop-all down-all restart-all

start-all:
	$(COMPOSE) up -d --build

stop-all:
	$(COMPOSE) stop

down-all:
	$(COMPOSE) down

restart-all:
	$(COMPOSE) restart
