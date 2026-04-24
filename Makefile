COMPOSE_FILE = docker-compose.yml
MKCERT_VERSION = v1.4.4
MKCERT_BIN = $(HOME)/.local/bin/mkcert

all: up

up:
	@echo "[i] Starting ft_transcendence..."
	@mkdir -p $(HOME)/data/sqlite
	@mkdir -p $(HOME)/.local/bin
	@if ! command -v mkcert > /dev/null 2>&1 && [ ! -f $(MKCERT_BIN) ]; then \
		echo "[i] Downloading mkcert..."; \
		curl -sLo $(MKCERT_BIN) https://github.com/FiloSottile/mkcert/releases/download/$(MKCERT_VERSION)/mkcert-$(MKCERT_VERSION)-linux-amd64; \
		chmod +x $(MKCERT_BIN); \
	fi
	@PATH="$(HOME)/.local/bin:$$PATH" mkcert -install 2>/dev/null || true
	@PATH="$(HOME)/.local/bin:$$PATH" mkcert \
		-key-file ./nginx/certs/key.pem \
		-cert-file ./nginx/certs/cert.pem \
		localhost 127.0.0.1 2>/dev/null || true
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