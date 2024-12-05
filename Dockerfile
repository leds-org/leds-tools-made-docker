FROM node:22-alpine

WORKDIR /app

# Copie os arquivos de configuração
COPY package*.json ./
COPY tsconfig.json ./

# Instale as dependências
RUN npm install

# Copie o código fonte
COPY src/ ./src/

# Compile o TypeScript
RUN npm run build

# Remove devDependencies após a compilação
RUN npm prune --production

CMD ["node", "dist/index.js"]