FROM node:16.14.2-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps --omit=dev
COPY server.js ./
COPY dist/ ./dist/
EXPOSE 8080
CMD ["node", "server.js"]
