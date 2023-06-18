FROM postgres

# Create app directory
WORKDIR ./transacendence_database

COPY postgres.conf /etc/postgresql/postgresql.conf
#COPY db-seed-files/ /etc/docker-entrypoint-initdb.d/

# Expose the necessary port
EXPOSE 5432

CMD ["-c", "config_file=/etc/postgresql/postgresql.conf"]