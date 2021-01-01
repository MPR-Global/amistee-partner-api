FROM node:10
WORKDIR /usr/src/app
COPY amistee-fe/ ./my-app/
RUN cd my-app && npm install @angular/cli && npm install && npm run build