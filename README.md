# Agende Já

Este é um projeto de conclusão de curso de desenvolvimento full-stack da PUCRS

# Objetivo

Criação de uma plataforma de agendamentos online para micro e pequenos empresários

## Tech Stack

API:
* NestJS
* Prisma
* PostgreSQL
* Typescript

WEB:
* NextJS
* TailwindCSS
* Shadcn
	
Autenticação:
* JWT

Container:
* Docker


## Execução do projeto

Banco de dados
```bash
cd /infra/database
docker compose up -d
```
Backend:
```bash
cd /api
npx prisma migrate dev
npm run start:dev
```

Frontend:
```bash
cd /web
npm run dev
```
Abrir http://localhost:3000/
