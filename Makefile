COMPOSE_FILE = docker-compose.yml

all: up

up:
	@echo "[i] Starting ft_transcendence..."
	@mkdir -p $(HOME)/data/sqlite
	@docker compose -f $(COMPOSE_FILE) up --build -d
	@echo "[i] Done !"

down:
	@docker compose -f $(COMPOSE_FILE) down

clean:
	@docker compose -f $(COMPOSE_FILE) down -v --remove-orphans
	@docker system prune -f

fclean: clean
	@docker stop $$(docker ps -qa) 2>/dev/null || true
	@docker rm $$(docker ps -qa) 2>/dev/null || true
	@docker rmi -f $$(docker images -qa) 2>/dev/null || true
	@docker volume rm $$(docker volume ls -q) 2>/dev/null || true
	@rm -rf $(HOME)/data/sqlite

re: fclean all

.PHONY: all up down clean fclean re