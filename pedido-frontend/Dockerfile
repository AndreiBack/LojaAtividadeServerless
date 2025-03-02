# Usando a imagem base do Node.js
FROM node:16 AS build

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos de pacotes
COPY package*.json ./

# Instala as dependências do front-end
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Executa o build da aplicação React
RUN npm run build

# Usa a imagem do Nginx para servir os arquivos estáticos
FROM nginx:alpine

# Copia os arquivos de build para o diretório do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expõe a porta para o servidor React
EXPOSE 80
