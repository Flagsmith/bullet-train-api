.EXPORT_ALL_VARIABLES:

DOCKER_TAG ?= flagsmith/flagsmith-api:local

COMPOSE_FILE ?= ../docker/api/docker-compose.local.yml
COMPOSE_PROJECT_NAME ?= flagsmith

DOTENV_OVERRIDE_FILE ?= .env

POETRY_VERSION ?= 2.0.1

GUNICORN_LOGGER_CLASS ?= util.logging.GunicornJsonCapableLogger

SAML_REVISION ?= v1.6.4
RBAC_REVISION ?= v0.11.2

-include .env-local
-include $(DOTENV_OVERRIDE_FILE)

.PHONY: install-pip
install-pip:
	python -m pip install --upgrade pip

.PHONY: install-poetry
install-poetry:
	curl -sSL https://install.python-poetry.org | python3 - --version ${POETRY_VERSION}

.PHONY: install-packages
install-packages:
	poetry install --no-root $(opts)

.PHONY: install-private-modules
install-private-modules:
	$(eval SITE_PACKAGES_DIR := $(shell poetry run python -c 'import site; print(site.getsitepackages()[0])'))
	git clone https://github.com/flagsmith/flagsmith-saml --depth 1 --branch ${SAML_REVISION} && mv ./flagsmith-saml/saml $(SITE_PACKAGES_DIR)
	git clone https://github.com/flagsmith/flagsmith-rbac --depth 1 --branch ${RBAC_REVISION} && mv ./flagsmith-rbac/rbac $(SITE_PACKAGES_DIR)
	rm -rf ./flagsmith-saml ./flagsmith-rbac

.PHONY: install
install: install-pip install-poetry install-packages

.PHONY: lint
lint:
	poetry run pre-commit run -a

.PHONY: docker-up
docker-up:
	docker compose up --force-recreate --remove-orphans -d
	docker compose ps

.PHONY: docker-down
docker-down:
	docker compose stop

.PHONY: docker-logs
docker-logs:
	docker compose logs --follow

.PHONY: docker-build
docker-build:
	@docker build \
		--tag=$(DOCKER_TAG) \
		--file=../Dockerfile \
		--target=oss-api \
		../

.PHONY: test
test:
	poetry run pytest $(opts)

.PHONY: django-make-migrations
django-make-migrations:
	poetry run python manage.py waitfordb
	poetry run python manage.py makemigrations $(opts)

.PHONY: django-migrate
django-migrate:
	poetry run python manage.py waitfordb
	poetry run python manage.py migrate
	poetry run python manage.py createcachetable

.PHONY: django-collect-static
django-collect-static:
	poetry run python manage.py collectstatic --noinput

.PHONY: serve
serve:
	poetry run gunicorn --bind 0.0.0.0:8000 \
		--logger-class ${GUNICORN_LOGGER_CLASS} \
		--reload \
		app.wsgi

.PHONY: generate-ld-client-types
generate-ld-client-types:
	curl -sSL https://app.launchdarkly.com/api/v2/openapi.json | \
	npx openapi-format /dev/fd/0 \
		--filterFile ld-openapi-filter.yaml | \
	datamodel-codegen \
		--output integrations/launch_darkly/types.py \
		--output-model-type typing.TypedDict \
		--target-python-version 3.10 \
		--use-double-quotes \
		--use-standard-collections \
		--wrap-string-literal \
		--special-field-name-prefix=

.PHONY: integrate-private-tests
integrate-private-tests:
	$(eval WORKFLOW_REVISION := $(shell grep -A 1 "\[tool.poetry.group.workflows.dependencies\]" pyproject.toml | awk -F '"' '{printf $$4}'))
	$(eval TASK_PROCESSOR_REVISION := $(shell grep -A 0 "flagsmith-task-processor" pyproject.toml | awk -F '"' '{printf $$4}'))
	$(eval AUTH_CONTROLLER_REVISION := $(shell grep -A 1 "\[tool.poetry.group.auth-controller.dependencies\]" pyproject.toml | awk -F '"' '{printf $$4}'))

	git clone https://github.com/flagsmith/flagsmith-saml --depth 1 --branch ${SAML_REVISION} && mv ./flagsmith-saml/tests tests/saml_tests
	git clone https://github.com/flagsmith/flagsmith-rbac --depth 1 --branch ${RBAC_REVISION} && mv ./flagsmith-rbac/tests tests/rbac_tests
	git clone https://github.com/flagsmith/flagsmith-workflows --depth 1 --branch ${WORKFLOW_REVISION} && mv ./flagsmith-workflows/tests tests/workflow_tests
	git clone https://github.com/flagsmith/flagsmith-auth-controller --depth 1 --branch ${AUTH_CONTROLLER_REVISION} && mv ./flagsmith-auth-controller/tests tests/auth_controller_tests

	git clone https://github.com/flagsmith/flagsmith-task-processor --depth 1 --branch ${TASK_PROCESSOR_REVISION} && mv ./flagsmith-task-processor/tests tests/task_processor_tests
	rm -rf ./flagsmith-saml ./flagsmith-rbac ./flagsmith-workflows ./flagsmith-auth-controller ./flagsmith-task-processor
