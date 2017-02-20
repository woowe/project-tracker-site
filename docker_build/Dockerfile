FROM ubuntu

RUN apt-get update -yqq && apt-get install -yqq npm wget

RUN npm cache clean -f && npm install -g n
RUN n 7.4.0

RUN npm install -g @angular/cli@1.0.0-beta.31 firebase-tools@3.3.0