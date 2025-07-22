# TheMovieHome 🎬

![Java](https://img.shields.io/badge/Java-17%2B-blue?logo=java&logoColor=white)
![Spring](https://img.shields.io/badge/Spring_Boot-3.x-green?logo=spring&logoColor=white)
![React](https://img.shields.io/badge/React-18-blue?logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-blue?logo=tailwind-css&logoColor=38B2AC)
![MySQL](https://img.shields.io/badge/MySQL-8.x-orange?logo=mysql&logoColor=white)

Uma plataforma social para amantes de cinema, permitindo buscar filmes, escrever resenhas e interagir com amigos.

Este projeto foi desenvolvido como parte de um trabalho acadêmico, com o objetivo de criar uma aplicação web Full-Stack utilizando tecnologias modernas de mercado para backend e frontend.

---

## ✨ Features (Funcionalidades)

-   **Backend (API REST):**
    -   🔎 **Busca de Filmes:** Integração com a API externa [OMDb](https://www.omdbapi.com/) para buscar filmes por título e por termo de pesquisa (com paginação).
    -   👤 **Gerenciamento de Usuários:** Sistema completo de CRUD (Criar, Ler, Atualizar, Deletar) para usuários, com senhas criptografadas (BCrypt).
    -   ✍️ **Sistema de Reviews:** Usuários podem criar, ler, atualizar e deletar suas próprias resenhas para filmes.
    -   ❤️ **Lista de Desejos (Watchlist):** Funcionalidade para usuários salvarem filmes que desejam assistir no futuro.
    -   🤝 **Sistema de Amizades:** Lógica para enviar, aceitar, recusar e listar pedidos de amizade.
-   **Frontend (Em desenvolvimento):**
    -   Interface reativa construída com React e Vite.
    -   Estilização moderna utilizando Tailwind CSS.

---

## 🛠️ Tecnologias Utilizadas

#### **Backend**
-   **Java 17+**
-   **Spring Boot:** Framework principal para a construção da API REST.
-   **Spring Data JPA:** Para persistência de dados de forma simplificada.
-   **Spring Security:** Para gerenciamento de segurança e criptografia de senhas.
-   **MySQL:** Banco de dados relacional para armazenamento dos dados.
-   **Lombok:** Para reduzir código boilerplate em modelos e DTOs.
-   **Maven:** Gerenciador de dependências do projeto.

#### **Frontend**
-   **Node.js 22.16+**
-   **React:** Biblioteca para construção da interface de usuário.
-   **Vite:** Ferramenta de build e servidor de desenvolvimento de alta performance.
-   **Tailwind CSS:** Framework de estilização CSS "utility-first".

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente local.

### **Pré-requisitos**
-   Java JDK (17 ou superior)
-   Maven 3.x
-   Node.js (22.16 ou superior)
-   NPM ou Yarn
-   MySQL Server 8.x
-   Um cliente de API como o [Postman](https://www.postman.com/downloads/) para testar os endpoints.

### **1. Clonando o Repositório**
```bash
git clone [https://github.com/TheMovieHome/TheMovieHome.git](https://github.com/TheMovieHome/TheMovieHome.git)
cd TheMovieHome
```

### **2. Configuração do Backend**

**a) Banco de Dados:**
-   Abra seu cliente MySQL (Workbench, DBeaver, etc.).
-   Crie um novo banco de dados (schema) chamado `syncine`.
    ```sql
    CREATE DATABASE syncine CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    ```

**b) Variáveis de Ambiente:**
-   Navegue até `src/main/resources/`.
-   Crie um arquivo chamado `application.properties` (se ele não existir).
-   Edite o `application.properties` com suas credenciais do banco e sua chave da API OMDb, usando o modelo abaixo.

    ```properties
    # Configuração do Banco de Dados
    spring.datasource.url=jdbc:mysql://localhost:3306/syncine
    spring.datasource.username=root
    spring.datasource.password=sua_senha_aqui # <-- TROQUE PELA SUA SENHA PADRÃO DO MYSQL
    spring.jpa.hibernate.ddl-auto=update

    # Chave da API do OMDb
    # Obtenha a sua em: [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)
    omdb.api.key=SUA_CHAVE_DA_API_AQUI # <-- TROQUE PELA SUA CHAVE
    ```

### **3. Executando o Backend**
Abra um terminal na raiz do projeto (`TheMovieHome/`) e execute:
```bash
./mvnw spring-boot:run
```
O servidor backend estará rodando em `http://localhost:8080`.

### **4. Configuração do Frontend**
-   Abra **um novo terminal**.
-   Navegue para a pasta do frontend:
    ```bash
    cd frontend
    ```
-   Instale as dependências:
    ```bash
    npm install
    ```

### **5. Executando o Frontend**
No mesmo terminal (dentro da pasta `frontend/`), execute:
```bash
npm run dev
```
A aplicação React estará disponível em `http://localhost:5173`.

---

## 🌐 Endpoints da API (Exemplos)

A API segue os padrões RESTful. Aqui estão alguns dos endpoints principais:

-   **Usuários:**
    -   `POST /api/users/register`: Cadastra um novo usuário.
    -   `GET /api/users`: Lista todos os usuários.
    -   `GET /api/users/{id}`: Busca um usuário por ID.
    -   `GET /api/users/nome/{nome}`: Busca um usuário por nome.
-   **Filmes (via OMDb):**
    -   `GET /api/movies/busca?termo={nome-do-filme}`: Busca uma lista de filmes.
    -   `GET /api/movies/busca/{titulo-exato}`: Busca um filme específico.
-   **Reviews:**
    -   `POST /api/reviews`: Cria uma nova review para um filme.
    -   `GET /api/movies/{imdbId}/reviews`: Lista todas as reviews de um filme.
    -   `PUT /api/reviews/{id}`: Atualiza uma review existente.
    -   `DELETE /api/reviews/{id}`: Deleta uma review.

---

## 👥 Autores

-   Ricardo Fragoso
-   [Nome do Colega 1]
-   [Nome do Colega 2]

*(Sinta-se à vontade para adicionar links para o GitHub ou LinkedIn de vocês aqui)*