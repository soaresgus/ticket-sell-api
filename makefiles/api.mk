.PHONY: start-api stop-api down-api restart-api

start-api:
	$(COMPOSE) up -d --no-deps --build api

stop-api:
	$(COMPOSE) stop api

down-api:
	$(COMPOSE) rm -sf api

restart-api:
	$(COMPOSE) restart api
