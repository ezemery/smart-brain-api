FROM postgres:10.3-alpine

ADD /tables/ /docker-entrypoint-initdb.d/tables/
ADD /seed/ /docker-entrypoint-initdb.d/seed/
ADD create_schemas.sql /docker-entrypoint-initdb.d/