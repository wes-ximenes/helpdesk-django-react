# HelpDesk — Sistema de Gerenciamento de Chamados

Sistema de Helpdesk desenvolvido como projeto acadêmico e de portfólio, com foco em simular um ambiente real de suporte técnico, incluindo autenticação, controle de permissões e comunicação entre usuários e administradores.

O projeto aplica na prática conceitos de desenvolvimento full stack, APIs REST, autenticação JWT, regras de negócio e integração frontend/backend.

---

## Visão Geral

O sistema permite que usuários abram chamados de suporte, acompanhem o andamento e interajam com a equipe através de um sistema de respostas (chat por chamado).

Administradores possuem controle total sobre os chamados, podendo atualizar status, responder e excluir registros.

---

## Funcionalidades

### Autenticação
- Login com JWT (JSON Web Token)
- Persistência de sessão no frontend
- Controle de acesso por tipo de usuário:
  - Admin
  - Usuário comum

---

### Chamados
- Criação de chamados
- Listagem com paginação
- Atualização de status (admin)
- Exclusão de chamados (admin)
- Associação automática ao usuário autenticado

---

### Status dos Chamados
- ATIVO  
- FINALIZADO  
- CANCELADO  

**Regra de negócio:**
- Apenas chamados ATIVOS podem ser alterados ou receber respostas

---

### Chat por Chamado (Diferencial do Projeto)
- Sistema de respostas vinculado ao chamado
- Comunicação entre usuário e administrador
- Histórico de mensagens
- Identificação do autor da mensagem

**Regra de negócio:**
- Respostas permitidas apenas para chamados ATIVOS

---

### Dashboard
- Exibição de estatísticas:
  - Total de chamados
  - Chamados resolvidos
- Visualização do usuário criador do chamado
- Interface moderna com Tailwind CSS

---

## Problema Resolvido

Empresas que lidam com múltiplas solicitações de suporte precisam de uma forma eficiente de gerenciar atendimentos e manter histórico de comunicação.

Este sistema resolve:
- Falta de organização em chamados
- Dificuldade de comunicação entre cliente e suporte
- Ausência de controle de status
- Falta de indicadores para acompanhamento

---

## Tecnologias Utilizadas

### Frontend
- React (Vite)
- JavaScript
- Tailwind CSS
- Axios

---

### Backend
- Python
- Django
- Django REST Framework
- Autenticação JWT (SimpleJWT)

---

### Banco de Dados
- PostgreSQL

---

## Arquitetura do Projeto

O projeto segue uma arquitetura baseada em API REST, com separação clara entre frontend e backend.

---

## Principais Conceitos Aplicados

- CRUD completo com API REST
- Autenticação e autorização com JWT
- Controle de permissões (admin vs usuário)
- Regras de negócio no backend
- Consumo de API no React
- Gerenciamento de estado com useState e useEffect
- Tratamento de erros (frontend e backend)
- Integração completa full stack

---

## Melhorias Implementadas Recentemente

- Implementação do sistema de chat por chamado
- Criação de endpoint `/respostas/`
- Controle de respostas por status (ATIVO)
- Exibição do usuário criador do chamado
- Estatísticas no dashboard
- Melhorias visuais com Tailwind CSS
- Correção de paginação (uso de `response.data.results`)
- Ajuste de arquitetura (usuario definido via `request.user`)

---

## Como Executar o Projeto

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Autor

**Wesley Ximenes**

- Backend Developer  
- Experiência com Python, Django, React e APIs REST  

---

## Objetivo do Projeto

Projeto desenvolvido com foco em:

- Consolidar conhecimentos em desenvolvimento full stack  
- Simular um sistema real de mercado  
- Servir como portfólio profissional  
