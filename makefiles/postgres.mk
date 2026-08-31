.PHONY: start-postgres stop-postgres down-postgres restart-postgres

start-postgres:
	$(COMPOSE) up -d --no-deps postgres

stop-postgres:
	$(COMPOSE) stop postgres

down-postgres:
	$(COMPOSE) rm -sf postgres

restart-postgres:
	$(COMPOSE) restart postgres
