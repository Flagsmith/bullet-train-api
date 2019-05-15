<img width="100%" src="./hero.png"/>

# Bullet Train REST API

## Development Environment

Before running the application, you'll need to configure a database for the application. The steps 
to do this can be found in the following section entitled 'Databases'.  

```
pip install pipenv
pipenv install
pipenv run python src/manage.py migrate 
pipenv run python src/manage.py runserver
```

The application can also be run locally using Docker Compose if required, however, it's beneficial 
to run locally using the above steps as it gives you hot reloading. To run using docker compose, 
simply run the following command from the project root: 

```
docker-compose up
```

## Databases
Databases are configured in app/settings/\<env\>.py

The app is configured to use PostgreSQL for all environments. 

When running locally, you'll need a local instance of postgres running. The easiest way to do this 
is to use docker which is achievable with the following command: 

```docker run --name local_postgres -d -P postgres```

You'll also need to ensure that you have a value for POSTGRES_PASSWORD set as an environment 
variable on your development machine.

When running on a Heroku-ish platform, the application reads the database connection in production 
from an environment variable called `DATABASE_URL`. This should be configured in the Heroku-ish 
application configuration.

When running the application using Docker, it reads the database configuration from the settings 
located in `app.settings.master-docker`

## Initialising

### Locally

The application is built using django which comes with a handy set of admin pages available at 
`/admin`. To access these, you'll need to create a super user. This can be done with the following
command: 

```
pipenv run python src/manage.py createsuperuser
```

Once you've created the super user, you can use the details to log in at `/admin`. From here, you 
can create an organisation and either create another user or simply assign the organisation to your
admin user to begin using the application. 

### In a Heroku-ish environment

Once the app has been deployed, you can initialise it to create a super user by sending a GET request 
to  the `/api/v1/users/init` endpoint. This will create a super user with the details configured in 
`app.settings.common` with the following parameters: 

```
ADMIN_USERNAME,
ADMIN_EMAIL,
ADMIN_INITIAL_PASSWORD
``` 

Note that this functionality can be turned off in the settings if required by setting 
`ALLOW_ADMIN_INITIATION_VIA_URL=False`. 

## Deploying

### Using Heroku-ish Platform (e.g. Heroku, Dokku, Flynn)
The application should run on any Heroku-ish platform (e.g. Dokku, Flynn) by simply adding the 
required git repo and pushing the code. The code for running the app is contained in the Procfile.

To get it running, you'll need to add the necessary config variables as outlined below.


### Using ElasticBeanstalk
The application will run within ElasticBeanstalk using the default Python setup.
We've included the .ebextensions/ and .elasticbeanstalk/ directories which will run on ElasticBeanstalk.

The changes required to run in your environment will be as follows

`.elasticbeanstalk/config.yml` - update application_name and default_region to the relevant variables for your setup.

`.ebextensions/options.config` - within the root of the project `generate.sh` will add in all environment variables that are required using your chosen CI/CD. Alternatively, you can add your own `options.config`.


### Using Docker
The application can be configured to run using docker with simply by running the following command:

```
docker-compose up
``` 

This will use some default settings created in the `docker-compose.yml` file located in the root of 
the project. These should be changed before using in any production environments.

### Environment Variables
The application relies on the following environment variables to run: 

* `DJANGO_ALLOWED_HOSTS`: comma separated list of hosts the application will run on in the given environment
* `DJANGO_SETTINGS_MODULE`: python path to settings file for the given environment, e.g. "app.settings.develop"
* `SENDGRID_API_KEY`: API key from sendgrid account which will need to be set up for emails to be sent from platform successfully
* `DATABASE_URL`: required by develop and master environments, should be a standard format database url e.g. postgres://user:password@host:port/db_name
* `DJANGO_SECRET_KEY`: see 'Creating a secret key' section below
* `GOOGLE_ANALYTICS_KEY`: if google analytics is required, add your tracking code
* `GOOGLE_SERVICE_ACCOUNT`: service account json for accessing the google API, used for getting usage of an organisation - needs access to analytics.readonly scope 
* `GA_TABLE_ID`: GA table ID (view) to query when looking for organisation usage

### Creating a secret key
It is important to also set an environment variable on whatever platform you are using for 
`DJANGO_SECRET_KEY`. There is a function to create one in `app.settings.common` if none exists in 
the environment variables, however, this is not suitable for use in production. To generate a new 
secret key, you can use the function defined in `src/secret-key-gen.py` by simply running it from a 
command prompt: 

```
python secret-key-gen.py 
``` 

## Adding dependencies
To add a python dependency, run the following commands:

```
pipenv install <package name>
```

The dependency then needs to be added to the relevant requirements*.txt files as necessary. 

## Stack

- Python 2.7.14
- Django 1.11.13
- DjangoRestFramework 3.8.2 

## Documentation

Further documentation can be found [here](https://docs.bullet-train.io). 

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/kyle-ssg/c36a03aebe492e45cbd3eefb21cb0486) 
for details on our code of conduct, and the process for submitting pull requests to us.

## Getting Help

If you encounter a bug or feature request we would like to hear about it. Before you submit an 
issue please search existing issues in order to prevent duplicates. 

## Get in touch

If you have any questions about our projects you can email 
<a href="mailto:projects@solidstategroup.com">projects@solidstategroup.com</a>.

## Useful links

[Website](https://bullet-train.io)

[Documentation](https://docs.bullet-train.io/)

[Code Examples](https://github.com/SolidStateGroup/bullet-train-docs)

[Youtube Tutorials](https://www.youtube.com/channel/UCki7GZrOdZZcsV9rAIRchCw)


