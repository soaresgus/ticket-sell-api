COMPOSE ?= docker compose

include makefiles/postgres.mk
include makefiles/redis.mk
include makefiles/rabbitmq.mk
include makefiles/api.mk
include makefiles/global.mk

.DEFAULT_GOAL := help

.PHONY: help
help:
	@echo "Per-service commands:"
	@echo "  make start-<svc>    start a service"
	@echo "  make stop-<svc>     stop a service"
	@echo "  make down-<svc>     remove a service container"
	@echo "  make restart-<svc>  restart a service"
	@echo ""
	@echo "Services: api, postgres, redis, rabbitmq"
	@echo ""
	@echo "All services:"
	@echo "  make start-all"
	@echo "  make stop-all"
	@echo "  make down-all"
	@echo "  make restart-all"
