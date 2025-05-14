# AgendeJá - Frontend

Este é o frontend do sistema **AgendeJá**, uma aplicação desenvolvida em [Next.js](https://nextjs.org/) com o novo App Router, focada em facilitar o agendamento de serviços entre clientes e profissionais. O projeto conta com autenticação, gerenciamento de sessões, agendamentos e uma interface moderna e responsiva com [ShadCN UI](https://ui.shadcn.dev/).

## ✨ Funcionalidades

- Registro e login de usuários (clientes e profissionais)
- Interface separada para cliente e profissional
- Listagem e criação de agendamentos
- Cancelamento e histórico de agendamentos
- Integração com API REST via Axios
- UI moderna utilizando ShadCN + TailwindCSS
- Autenticação com armazenamento seguro de tokens

## 🚀 Tecnologias

- [Next.js (App Router)](https://nextjs.org/docs/app)
- [TypeScript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/)
- [ShadCN UI](https://ui.shadcn.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/) (formulários)
- [Zod](https://zod.dev/) (validações)
- [Lucide Icons](https://lucide.dev/) (ícones modernos)

## 📁 Estrutura do Projeto

```bash
app/
│
├── (auth)/           # Rotas de autenticação (login, registro)
├── api/              # API interna para o usuario
├── main/             # Paginas autenticadas

```

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/agendeja-frontend.git

# Acesse a pasta do projeto
cd agendeja-frontend

# Instale as dependências
npm install

# Crie o arquivo .env
JWT_SECRET=secret
NEXT_PUBLIC_API_URL=http://localhost:3000

# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar em produção local
npm start
```