# Stratos Loteria - Sistema Profissional

Sistema modular para geração e armazenamento de jogos de loteria.

## Estrutura
- `/backend`: Servidor Node.js + Express + SQLite.
- `/frontend`: Aplicação React + Vite + Tailwind CSS.

## Como Executar (Isolado)

### 1. Iniciar o Backend
```bash
cd backend
npm install
npm run dev
```
O servidor rodará em `http://localhost:5000`.

### 2. Iniciar o Frontend
```bash
cd frontend
npm install
npm run dev
```
A aplicação rodará em `http://localhost:5173`.

## Funcionalidades Implementadas
- **Gerador Inteligente:** Geração de jogos para Mega-Sena, Lotofácil, Quina, etc.
- **Armazenamento:** Salva seus jogos favoritos diretamente no banco de dados SQLite local.
- **Histórico:** Visualize todos os seus jogos salvos com data e metadados.
- **Design HUD:** Interface futurista (Dark Mode) responsiva.
- **Segurança:** Sistema de aviso de jogo responsável e dicas.

---
*Desenvolvido com foco em isolamento de ambiente e performance.*
