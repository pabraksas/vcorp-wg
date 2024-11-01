.ONESHELL:
SHELL:=/usr/bin/bash
#
.DEFAULT_GOAL=setup
# Phony targets
#.PHONY: help env_load setup build start
# ###
#ALLOWED_CONFIGS=".defaults,.config,.env,.env.local,.ctx,"
#ALLOWED_CONFIGS=('.defaults','.config','.env','.env.local','.ctx')
# #########################################################################################################
# ###
# $#   :number of positional parameters.
# $?   :most recent foreground pipeline exit status.
# $-   :current options set for the shell.
# $$   :pid of the current shell (not subshell).
# $!   :is the PID of the most recent background command.
# $_   :last argument of the previously executed command, or the path of the bash script.
# $PWD					current directory
# $USER					current username
# $HOSTNAME			current hostname
#HOST_IP=$(ip -4 route list match 0/0 | awk '{print $3}')
#echo "Host ip is $HOST_IP"
# ###    Full path of the current script
#THIS=$(readlink -f "${BASH_SOURCE[0]}" 2>/dev/null || echo $0);
# ### The directory where current script resides
#DIR=$(dirname "${THIS}")
#CURRENT_USER=$(whoami)

# #########################################################################################################

nullstring =

log_ok = @echo -e '\033[38;2;0;255;32m$1\033[0m'
log_cmd = @echo -e '\033[38;2;0;155;200m$1\033[0m'
log_inf = @echo -e '\033[38;2;255;100;32m$1\033[0m'
log_warning=@echo -e '\033[38;2;0;0;255m$1\033[0m'
log_err = @echo -e '\033[38;2;255;0;32m$1\033[0m'
log_achtung = @echo -e '\033[38;2;200;50;50m$1\033[0m'

# all: hooks install build init serve
default: help

#: Testim
testim t:  init
	$(call log_ok, 'log_ok')
	$(call log_cmd, 'log_cmd')
	$(call log_inf, 'log_inf')
	$(call log_warning, 'log_warning')
	$(call log_err, 'log_err')
	$(call log_achtung, 'log_achtung')
	echo -e "testim: $@ $#"

#: Initialize same parametrs
init: vars
	@echo -e '\033[38;2;0;155;200m'
	#@if [[ -f ".env" ]] ; then echo "load .env"; set -a; source .env; set +a; fi ;
	#@if [[ -f ".env.local" ]] ; then echo "load .env.local"; set -a; source .env.local; set +a; fi ;
	#
	bash ~/.nvm/nvm.sh use --lts >/dev/null 2>&1
	#
	@echo -e '\033[0m'

#: Load .env or another file from '$ALLOWED_CONFIGS' if exists
vars:
	@echo -e '\033[38;2;0;155;200m'
	#
	if [[ -f ".env" ]]; then
	echo "load vars from: '.env'";
	set -a;
	source .env;
	set +a;
	fi;
	#
	if [[ -f ".env.local" ]]; then
	echo "load vars from: '.env.local'";
	set -a;
	source .env.local;
	set +a;
	fi;
	#
	echo -e "\033[0m"

#: Help and Commands list
h help: init
	$(call log_ok, 'Commands:')
	grep -B1 -E "^[a-zA-Z0-9_-]+\:([^\=]|$$)" Makefile \
	| grep -v -- -- \
	| sed 'N;s/\n/###/' \
	| sed -n 's/^#: \(.*\)###\(.*\):.*/\2:###\1/p' \
	| column -t  -s '###'

	__INTERACTIVE=""
	if [ -t 1 ]; then
		__INTERACTIVE="1"
	fi

#: Check runing at root
sudoer:
	if [[ $UID != 0 ]]; then
		@echo "Please run this script with sudo:"
		@echo -e "sudo $0 $*"
		@exit 1
	fi


#: Setuping
setup:  init
	@echo -e "\033[38;2;0;255;32m"
	@echo "               -=  Setuping  =-               "

	@$(MAKE) -s clean

	@pnpm install

	@$(MAKE) -s build

	@echo -e "\033[0m"
	#@echo -e "\a"

#: Remove files and folders
clear clean:
	@echo -e "\033[38;2;255;0;32m"
	@echo "               -=  Cleaning  =-               "

	rm -rf `find . -type d -name build`
	rm -rf `find . -type d -name _build`
	rm -rf `find . -type d -name dist`
	rm -rf `find . -type d -name node_modules`
	rm -rf `find . -type d -name cache`
	rm -rf `find . -type d -name .cache`
	rm -rf `find . -type d -name .next`
	rm -rf `find . -type d -name .turbo`
	#
	rm -f `find . -type f -name '*~' `
	rm -f `find . -type f -name '.*~' `
	#
	rm -f `find . -type f -name 'yarn.lock' ` >/dev/null 2>&1
	rm -f `find . -type f -name 'package-lock.json' `  >/dev/null 2>&1

	@echo -e "\033[0m"
	#@echo -e "\a"

#.SILENT:
switch: init
	CONTAINER=backend
	# RUNNING=$(docker inspect --format="{{.State.Running}}" $CONTAINER 2> /dev/null)
	RUNNING=$(docker inspect --format="{{.State.Running}}" $CONTAINER)
	STARTED=$(docker inspect --format="{{.State.StartedAt}}" $CONTAINER)

	@echo -e "RUNNING: ${RUNNING}"
	@echo -e "STARTED: $(STARTED)"

	if [ "$RUNNING" == "true" ]; then
		# @$(MAKE) -s down
		@echo -e "down"
	else
		# @$(MAKE) -s start
		@echo -e "start"
	fi


d:
	@$(MAKE) -s down

#: Down
down:
	#@echo "============================================="
	@echo "               -= Down =-"
	#@echo "============================================="

	docker compose -f docker-compose.yml down -v

	#@echo -e "\a"

s:
	@$(MAKE) -s start

#: Starting
start: init
	@echo "               -= Starting =-               "

	#@echo -e "\a"


b:
	@$(MAKE) -s build

#: Building
build: init
	@echo -e "\033[38;2;10;0;255m"
	@echo "               -= Building =-               "

	@turbo build

	@echo -e "\033[0m"

bi:
	@$(MAKE) -s build-images

#: Build images
build-images: init
	@$(call log_ok, '	Docker build images start !')
	set DOCKER_BUILDKIT=1
	# set BUILDKIT_INLINE_CACHE=1

	#docker build --tag s3app-server --file ./packages/docker/Dockerfile.s3app-server ./apps/s3app-server/
	#docker build --tag s3app-web-panel --file ./packages/docker/Dockerfile.s3app-web-panel ./apps/s3app-web-panel/

	#docker build --tag s3app-bot --file ./packages/docker/Dockerfile.s3app-bot ./apps/s3app-bot/

	#@docker build --tag s3app-license-repository --file ./packages/docker/Dockerfile.s3app-license-repository ./apps/s3app-license-repository/
	#@docker build --tag s3app-license-repository-web-panel --file ./packages/docker/Dockerfile.s3app-license-repository-web-panel ./apps/s3app-license-repository-web-panel/

	@echo -e "\a"

#: Remove all docker containers and images
prune:
	$(call log_ok, '	Docker system prune !')
	@docker system prune --all --force  --volumes
	# command will remove all docker images:
	#@docker rmi --force $(docker images --all --quiet)

	@echo -e "\a"

#: certs
certs:
	$(call log_ok, '	check certs --fix !')
	@docker system prune --all --force  --volumes
	# command will remove all docker images:
	#@docker rmi --force $(docker images --all --quiet)

	@echo -e "\a"

# ############################################################
#	@echo ""
#	@echo "-- Help Menu"
#	@echo ""
#	@echo "   1. make build        - build the gitlab image"
#	@echo "   2. make quickstart   - start gitlab"
#	@echo "   3. make stop         - stop gitlab"
#	@echo "   4. make logs         - view logs"
#	@echo "   5. make purge        - stop and remove the container"

gitlab-build:
	#@docker build --tag=informatory/gitlab . --build-arg 	BUILD_DATE="$(shell date +"%Y-%m-%d %H:%M:%S%:z")" --build-arg VCS_REF=$(shell git rev-parse --short HEAD)
	cd /COD/informatory/packages/gitlab/
	make build
	cd /COD/informatory
	make build
	make gitlab-quickstart

gitlab-release: gitlab-build
	@docker build --tag=informatory/gitlab:$(shell cat VERSION) . \
		--build-arg BUILD_DATE="$(shell date +"%Y-%m-%d %H:%M:%S%:z")" \
		--build-arg VCS_REF=$(git describe --tags --always)

gitlab-quickstart:
	@echo "Starting postgresql container..."
	@docker run --name=gitlab-postgresql -d \
		--env='DB_NAME=gitlabhq_production' \
		--env='DB_USER=gitlab' --env='DB_PASS=password' \
		sameersbn/postgresql:latest
	@echo "Starting redis container..."
	@docker run --name=gitlab-redis -d \
		sameersbn/redis:latest
	@echo "Starting gitlab container..."
	@docker run --name='gitlab-demo' -d \
		--link=gitlab-postgresql:postgresql --link=gitlab-redis:redisio \
		--publish=10022:22 --publish=10080:80 \
		--env='GITLAB_PORT=10080' --env='GITLAB_SSH_PORT=10022' \
		informatory/gitlab:latest
	@echo "Please be patient. This could take a while..."
	@echo "GitLab will be available at http://localhost:10080"
	@echo "Type 'make logs' for the logs"

gitlab-stop:
	@echo "Stopping gitlab..."
	@docker stop gitlab-demo >/dev/null
	@echo "Stopping redis..."
	@docker stop gitlab-redis >/dev/null
	@echo "Stopping postgresql..."
	@docker stop gitlab-postgresql >/dev/null

gitlab-purge: stop
	@echo "Removing stopped containers..."
	@docker rm -v gitlab-demo >/dev/null
	@docker rm -v gitlab-redis >/dev/null
	@docker rm -v gitlab-postgresql >/dev/null


cmd:
	@echo $(filter-out $@,$(MAKECMDGOALS))

%:
	@:
