#### intermediate for building frontend

# pick base image
FROM node:12.19.0-alpine3.12 as build-frontend

# copy frontend source project
COPY vedaweb-frontend /opt/vedaweb-frontend

# set workdir
WORKDIR /opt/vedaweb-frontend

# build frontend
RUN npm install --silent &> /dev/null \
&&  npm run build --quiet



#### intermediate for building backend (and full app)

# pick base image
FROM maven:3.6.3-adoptopenjdk-11 as build-backend

# create project dir
RUN mkdir -p /opt/vedaweb

# set wirk dir
WORKDIR /opt/vedaweb

# copy frontend build
COPY --from=build-frontend /opt/vedaweb-frontend vedaweb-frontend

# copy backend source project
COPY vedaweb-backend vedaweb-backend

# build backend and full app into fat jar
RUN cd vedaweb-backend && mvn clean install --quiet -DskipTests



#### image to actually run the application from

# pick base image
FROM adoptopenjdk/openjdk11:jre-11.0.8_10-alpine

# set encoding and locales
ENV LANG='en_US.UTF-8' LANGUAGE='en_US:en' LC_ALL='en_US.UTF-8'

# install additional packages (nothing atm)
# RUN apk add ...

# set working directory
WORKDIR /opt/vedaweb

# copy build app to image
COPY --from=build-backend /opt/vedaweb/vedaweb-backend/target/vedaweb-0.1.0-SNAPSHOT.jar vedaweb.jar

# copy configs etc. to image
COPY vedaweb-backend/src/main/resources/application.properties application.properties
COPY vedaweb-backend/res/snippets res/snippets

# download application import data into "res" directory
RUN mkdir /tmp/vedaweb/ \
&&  wget -q -O /tmp/vedaweb/tei.tar.gz https://github.com/cceh/c-salt_vedaweb_tei/archive/master.tar.gz \
&&  mkdir -p res/tei \
&&  tar -xf /tmp/vedaweb/tei.tar.gz -C res/tei --strip 1 \
&&  rm /tmp/vedaweb/tei.tar.gz \
&&  wget -q -O /tmp/vedaweb/references.tar.gz https://github.com/VedaWebPlatform/vedaweb-data-external/archive/master.tar.gz \
&&  mkdir -p res/references \
&&  tar -xf /tmp/vedaweb/references.tar.gz -C res/references --strip 1 \
&&  rm /tmp/vedaweb/references.tar.gz

# hint to expose port 8080
EXPOSE 8080

# app entrypoint
ENTRYPOINT [ \
    "java", \
    "-Dserver.port=8080", \
    "-Dserver.servlet.context-path=/rigveda", \
    "-Dspring.data.mongodb.host=mongodb", \
    "-Dspring.data.mongodb.port=27017", \
    "-Dspring.data.mongodb.database=vedaweb", \
    "-Des.host=elastic", \
    "-Des.port=9200", \
    "-Des.protocol=http", \
    "-Des.index.name=vedaweb", \
    "-jar", \
    "/opt/vedaweb/vedaweb.jar" \
]

# optional arguments
#CMD [""] # no optional arguments ATM