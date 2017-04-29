FROM kkarczmarczyk/node-yarn:6.9-slim

COPY ./ /app
WORKDIR /app
RUN yarn

EXPOSE 3000
CMD npm start
