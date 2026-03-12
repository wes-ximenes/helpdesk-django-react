# HelpDesk — Sistema de Gerenciamento de Chamados

Sistema de Helpdesk desenvolvido como **projeto acadêmico e de portfólio**, com o objetivo de simular um ambiente real de suporte técnico utilizado por empresas de médio porte.

O projeto foi pensado para aplicar, na prática, conceitos de **desenvolvimento full stack**, **organização de chamados**, **persistência de dados** e **geração de relatórios**.

---

## Visão Geral

O HelpDesk permite que usuários abram chamados de suporte, acompanhem o status das solicitações e que a equipe técnica gerencie esses atendimentos de forma organizada e eficiente.

Este projeto representa a transição do aprendizado teórico para a prática, simulando desafios reais enfrentados no dia a dia de um time de tecnologia.

---

## Funcionalidades

### Usuários
- Cadastro e autenticação básica
- Abertura de chamados
- Acompanhamento do status do chamado

### Chamados
- Criação, edição e exclusão (CRUD)
- Controle de status:
  - 🟢 Ativo
  - 🟡 Finalizado 
  - 🔴 Cancelado
- Associação de chamados a usuários

### Relatórios
- Geração de relatórios estatísticos
- Processamento auxiliar desenvolvido em **Python**
- Análise de volume e status dos chamados

---

## Problema Resolvido

Empresas que lidam com múltiplas solicitações de suporte precisam de uma forma clara e organizada de gerenciar atendimentos sem perder informações importantes.

Este sistema resolve:
- Falta de organização nos atendimentos
- Dificuldade em acompanhar o andamento dos chamados
- Ausência de dados estatísticos para tomada de decisão

---

## Tecnologias Utilizadas

### Frontend
- HTML5  
- CSS3  
- JavaScript/ React 

### Backend
- Python/ Django

### Banco de Dados
O banco de dados do sistema HelpDesk foi modelado utilizando **PostgreSQL**.

##Estrutura inicial
O modelo contempla as entidades principais do sistema:
- Usuários
- Chamados
- Status dos chamados

Foram definidas:
- Chaves primárias (ID's)
- Chaves estrangeiras (usuario_id, status_id, chamado_id) para relacionamento entre tabelas
- Regras básicas de integridade referencial

##Observações
Esta é a modelagem inicial (MVP) do banco de dados e poderá evoluir(sofrer alterações) conforme novas funcionalidades forem adicionadas ao sistema.

### Processamento Auxiliar
- Linguagem C (relatórios estatísticos)

---

## Arquitetura e Organização

O projeto segue uma separação clara de responsabilidades entre frontend, backend e processamento auxiliar, facilitando manutenção e escalabilidade.


/
├── frontend/
│   ├── pages/
│   ├── css/
│   └── js/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   └── services/
├── database/
│   └── script.sql
├── reports/
│   └── relatorios.c
└── README.md


Alunos Envolvidos e Papéis

Devido ao contexto acadêmico e ao tamanho reduzido da equipe, os integrantes assumiram múltiplos papéis estratégicos e operacionais, prática comum em times ágeis, startups e projetos educacionais.

👤 Wesley Ximenes

Backend Developer

- Modelagem do banco de dados
- Implementação das regras de negócio
- Desenvolvimento de API e autenticação JWT
- Segurança e persistência dos dados

Justificativa Acadêmica

Projeto desenvolvido com intenção de permitir uma visão completa do ciclo de vida do produto — do planejamento à entrega.

Licença

Projeto desenvolvido para fins educacionais e de portfólio. Início FEV/2026