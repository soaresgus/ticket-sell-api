.PHONY: start-redis stop-redis down-redis restart-redis

start-redis:
	$(COMPOSE) up -d --no-deps redis

stop-redis:
	$(COMPOSE) stop redis

down-redis:
	$(COMPOSE) rm -sf redis

restart-redis:
	$(COMPOSE) restart redis
