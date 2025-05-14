# AgendeJá - Backend

Bem-vindo ao repositório do **AgendeJá**, o sistema de backend desenvolvido com [NestJS](https://nestjs.com/) para gerenciar agendamentos entre clientes e profissionais. Esta aplicação oferece uma API REST segura, escalável e de fácil manutenção.

## ✨ Funcionalidades

- Cadastro e autenticação de usuários (clientes e profissionais)
- Agendamento de serviços
- Listagem de agendamentos por usuário
- Cancelamento e gerenciamento de agendas
- Sistema de permissões por tipo de usuário
- Integração com banco de dados relacional 
- Gerenciamento de horários
- JWT para autenticação e autorização

## 🚀 Tecnologias

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/) ou outro banco compatível
- [Prisma](https://www.prisma.io/)
- Casl + JWT
- [Docker](https://www.docker.com/)

## 📁 Estrutura do Projeto

```bash
src/
│
├── auth/               # Módulo de autenticação (login, registro, JWT)
├── avatares/           # Módulo de avatares (upload)
├── casl/               # Módulo de permissoes (create, read, etc.)
├── categories/         # Módulo de categories (create, update, etc.)
├── prisma/             # Módulo de service do Prisma
├── profile/             # Módulo de profile (create, update, etc.)
├── schedulings/        # Módulo de scheduling (create, update, etc.)
├── timeslots/          # Módulo de timeslots (create, update, etc.)
├── users/              # Módulo de users (create, update, etc.)
└── main.ts             # Ponto de entrada da aplicação
```


## ⚙️ Instalação

```bash
# Clone o repositório
git clone https://gustavo-dividino@dev.azure.com/gustavo-dividino/TCC-AgendeJa/_git/backend-nestjs

# Acesse a pasta
cd backend-nestjs

# Instale as dependências
npm install


#Configure o .env
PORT=3000
DATABASE_URL=postgresql://usuario:senha@localhost:5432/agendeja
JWT_SECRET=seu_segredo


# Modo desenvolvimento
npm run start:dev

# Modo produção
npm run build
npm run start:prod


# Testes unitários
npm run test

# Testes de integração
npm run test:e2e

# Cobertura de testes
npm run test:cov


# Build da imagem
docker build -t backend-nestjs .

# Rodar o container
docker run -p 3000:3000 backend-nestjs
```