# API Bloco de Notas

Esta é uma API simples para gerenciar notas, criada como trabalho. A API permite criar, listar, buscar, atualizar e deletar notas.

**Link da API publicada:** [https://bloco-de-notas-api.onrender.com](https://bloco-de-notas-api.onrender.com )

---

## Como Rodar o Projeto Localmente

1.  Clone o repositório:
    ```bash
    git clone https://github.com/AntonVsc2/Bloco-De-Notas-API.git
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Crie um arquivo `.env` na raiz do projeto e adicione suas chaves do Supabase:
    
    SUPABASE_URL=SUA_URL_DO_SUPABASE
    SUPABASE_KEY=SUA_CHAVE_PUBLICA_DO_SUPABASE
    

4.  Inicie o servidor:

    bash
    npm start
    

---

## Endpoints da API

### Listar todas as notas
- **GET** `/notas`

### Buscar uma nota por ID
- **GET** `/notas/:id`

### Criar uma nova nota
- **POST** `/notas`
- **Corpo da requisição (JSON ):**
  ```json
  {
    "titulo": "Minha Primeira Nota",
    "conteudo": "Este é o conteúdo da nota."
  }
  ```

### Atualizar uma nota
- **PUT** `/notas/:id`
- **Corpo da requisição (JSON):**
  ```json
  {
    "titulo": "Título Atualizado",
    "conteudo": "Conteúdo atualizado."
  }
  ```

### Deletar uma nota
- **DELETE** `/notas/:id`

