# Globals

TAG=moderation-tool
DOCKERFILE=Dockerfile
BUILD_CMD=docker build
RUN_CMD=docker run -p 3000:3000 -it --name $(TAG) $(TAG)


# Targets

clean:
	@echo "Cleaning old container"
	docker container rm -f moderation-tool

run-prod: clean
	@echo "Building & running production environment"
	$(BUILD_CMD) -t $(TAG) --build-arg MODE=prod .
	$(RUN_CMD)

run-dev: clean
	@echo "Running development environment"
	export MODE=dev
	$(BUILD_CMD) -t $(TAG) --build-arg MODE=dev .
	$(RUN_CMD)

run-test: clean
	@echo "Building & running unit tests"
	export MODE=test
	$(BUILD_CMD) --build-arg MODE=test -t $(TAG) .
	$(RUN_CMD)
