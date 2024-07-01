#####################################################
######## Parte 1: Gerar o build da aplicação ########
#####################################################

# define a imagem padrão para em que o container é baseado
FROM node:20-alpine AS build-front

# Diretório padrão para a aplicação - Se não existir ela vai ser criada automaticamente
WORKDIR /usr/src/app

# Copia tudo que está no diretório atual para dentro do diretório: "/usr/src/app"
COPY . /usr/src/app

# Instala dependências
RUN npm install


# TODO - TEM QUE TIRAR ESSA GAMBIARRA AQUI
# QUANDO NÃO TEM ESSA LINHA DA PROBLEMA NA HORA DE FAZER O BIULD
RUN npm i @esbuild/linux-x64
RUN npm i @lmdb/lmdb-linux-x64


# Gera o build da aplicação
RUN npm run build

#####################################################
## Parte 2: Subir a aplicação em um servidor Nginx ##
#####################################################

# Imagem original
FROM nginx:latest

# Copia a dist gerada para o caminho público padrão do nginx
COPY --from=build-front /usr/src/app/dist/browser /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80