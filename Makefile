COMPOSE_FILE = docker-compose.yml

all: up

up:
	@echo "[i] Starting ft_transcendence..."
	@mkdir -p $(HOME)/data/sqlite
	@if ! command -v mkcert > /dev/null 2>&1; then \
		sudo apt-get install -y mkcert libnss3-tools; \
	fi
	@mkcert -install 2>/dev/null || true
	@mkcert -key-file ./nginx/certs/key.pem -cert-file ./nginx/certs/cert.pem localhost 127.0.0.1 2>/dev/null || true
	@google-chrome --ignore-certificate-errors --ignore-urlfetcher-cert-requests https://localhost &
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