# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar apenas os arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências sem bcrypt
RUN npm ci --omit=optional

# Gerar o Prisma Client
RUN npx prisma generate

# Copiar o restante do código fonte
COPY . .

# Compilar a aplicação
RUN npm run build

# Etapa final
FROM node:20-alpine

WORKDIR /app

# Instalar dependências de compilação
RUN apk add --no-cache --virtual .gyp \
    python3 \
    make \
    g++

# Copiar arquivos necessários
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN npm install

RUN npm uninstall bcrypt

RUN npm install bcrypt

# Remover dependências de compilação para reduzir tamanho
RUN apk del .gyp

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Definir variáveis de ambiente
ENV NODE_ENV production

# Expor a porta
EXPOSE 3000

# Mudar para o usuário não-root
USER nestjs

# Comando para iniciar a aplicação
CMD ["node", "dist/src/main.js"]