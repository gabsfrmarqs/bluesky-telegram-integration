FROM node:22

WORKDIR /app

COPY . .

EXPOSE 3600

HEALTHCHECK CMD curl --fail http://localhost:3600 || exit 1

CMD npx serve -s . -l 3600
