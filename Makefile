COMPOSE_FILE = docker-compose.yml
MKCERT_VERSION = v1.4.4
MKCERT_BIN = $(HOME)/.local/bin/mkcert

all: up

up:
	@echo "[i] Starting ft_transcendence..."
	@mkdir -p $(HOME)/data/sqlite
	@mkdir -p $(HOME)/.local/bin
	@mkdir -p ./nginx/certs
	@if ! command -v mkcert > /dev/null 2>&1 && [ ! -f $(MKCERT_BIN) ]; then \
		echo "[i] Downloading mkcert..."; \
		curl -sLo $(MKCERT_BIN) https://github.com/FiloSottile/mkcert/releases/download/$(MKCERT_VERSION)/mkcert-$(MKCERT_VERSION)-linux-amd64; \
		chmod +x $(MKCERT_BIN); \
	fi
	@echo "[i] Generating SSL certificates..."
	@CAROOT=$(HOME)/.local/share/mkcert \
		PATH="$(HOME)/.local/bin:$$PATH" \
		TRUST_STORES=nss \
		mkcert \
		-key-file ./nginx/certs/key.pem \
		-cert-file ./nginx/certs/cert.pem \
		localhost 127.0.0.1 2>/dev/null || true
	@docker compose -f $(COMPOSE_FILE) up --build -d
	@sleep 2 && (cmd.exe /c start chrome --ignore-certificate-errors --ignore-urlfetchfailures https://localhost:8443 2>/dev/null || \
		powershell.exe -Command "Start-Process 'chrome' '--ignore-certificate-errors --ignore-urlfetchfailures https://localhost:8443'" 2>/dev/null || \
		google-chrome --ignore-certificate-errors https://localhost:8443 2>/dev/null || \
		chromium-browser --ignore-certificate-errors https://localhost:8443 2>/dev/null) &
	@echo "[i] Done !"

test:
	@echo "[i] Running backend tests..."
	@docker run --rm -v $(PWD)/backend:/app -w /app node:20-alpine npm test

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

.PHONY: all up down clean fclean re test