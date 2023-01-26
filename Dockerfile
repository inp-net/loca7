FROM python:3.10

ARG DEBUG

ENV DockerHOME=/home/app/webapp
RUN mkdir -p $DockerHOME
WORKDIR $DockerHOME

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PIP_NO_CACHE_DIR off
ENV PIP_DISABLE_PIP_VERSION_CHECK on
ENV PIP_DEFAULT_TIMEOUT 100
ENV POETRY_VERSION 1.3.1
RUN pip install "poetry==$POETRY_VERSION"
RUN pip install gunicorn

COPY poetry.lock pyproject.toml $DockerHOME/
RUN poetry config virtualenvs.create false \
    && poetry install $(test "$DEBUG" == "False" && echo "--no-dev") --no-interaction --no-ansi

COPY . $DockerHOME
RUN ./ensure-dotenv

EXPOSE 8000
CMD ["gunicorn", "loca7.wsgi",  "--user", "www-data", "--bind", "0.0.0.0:8010", "--workers", "3"]
