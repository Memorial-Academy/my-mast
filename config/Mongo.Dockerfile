FROM mongo

COPY ./mongod.conf /etc/mongod.conf
COPY ./mongo_docker_entrypoint.js /docker-entrypoint-initdb.d/mongo-init.js

ARG MONGO_INITDB_ROOT_USERNAME
ARG MONGO_INITDB_ROOT_PASSWORD
ARG MONGO_INITDB_ROOT_DATABASE
ARG MONGO_USER
ARG MONGO_PASSWORD

WORKDIR /docker-entrypoint-initdb.d
RUN echo "MONGO_INITDB_ROOT_USERNAME=$MONGO_INITDB_ROOT_USERNAME" >> .env && \
    echo "MONGO_INITDB_ROOT_PASSWORD=$MONGO_INITDB_ROOT_PASSWORD" >> .env && \
    echo "MONGO_INITDB_ROOT_DATABASE=$MONGO_INITDB_ROOT_DATABASE" >> .env && \
    echo "MONGO_USER=$MONGO_USER" >> .env && \
    echo "MONGO_PASSWORD=$MONGO_PASSWORD" >> .env

ENTRYPOINT [ "bash", "/usr/local/bin/docker-entrypoint.sh" ]
EXPOSE 27017
CMD ["mongod"]