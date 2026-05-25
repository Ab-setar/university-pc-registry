FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install --build-from-source

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/index.js"]
