run:
	docker-compose -f docker/docker-compose.yml up

run-detached:
	docker-compose -f docker/docker-compose.yml up -d

stop:
	docker-compose -f docker/docker-compose.yml stop

down:
	docker-compose -f docker/docker-compose.yml down

init-dev-config:
	cp src/environments/environment.dev.ts src/environments/environment.ts
	wget -O scripts/new_version.py https://raw.githubusercontent.com/iqb-berlin/iqb-scripts/master/new_version.py
	chmod +x scripts/new_version.py

build:
	docker-compose -f docker/docker-compose.yml build

test:
	echo "There are not tests yet... :-("

new-version-major:
	scripts/new_version.py major

new-version-minor:
	scripts/new_version.py minor

new-version-patch:
	scripts/new_version.py patch
