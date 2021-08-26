# Build Front End Application
FROM node:12 AS build

RUN mkdir /app 

#USER node

WORKDIR /app/

COPY . .

RUN cd frontend && npm install --quiet --production
ENV ENV=prod
ENV ASSET_URL=/
RUN cd frontend && npm run bundledjango


# Build Django Application
FROM python:3.8-slim as application

WORKDIR /app
COPY api/requirements.txt /app/
RUN pip install -r requirements.txt --no-cache-dir --compile

COPY api /app/
RUN python /app/manage.py collectstatic --no-input
COPY --from=build /app/api/static /app/static/


ARG ACCESS_LOG_LOCATION="/dev/null"
ENV ACCESS_LOG_LOCATION=${ACCESS_LOG_LOCATION}

ENV DJANGO_SETTINGS_MODULE=app.settings.production
EXPOSE 8000

USER nobody

CMD ["./scripts/run-docker.sh"]
