# 🥗 MiKcal - pt-BR

Uma aplicação web desenvolvida como Trabalho de Conclusão de Curso na Universidade do Vale do Rio dos Sinos (Unisinos), no curso de Análise e Desenvolvimento de Sistemas (ADS).

O MiKcal tem como objetivo auxiliar no acompanhamento alimentar diário, permitindo o cadastro de usuários, refeições e alimentos ingeridos. A partir dos registros, a aplicação permite acompanhar a ingestão calórica e de macronutrientes, oferecendo uma visão mais clara sobre os hábitos alimentares do usuário.

## 🚀 Funcionalidades

- **Cadastro de usuário**: criação de conta com informações pessoais utilizadas no acompanhamento alimentar.
- **Autenticação com JWT**: login seguro e controle de acesso às funcionalidades protegidas.
- **Cadastro de refeições**: registro de refeições realizadas pelo usuário ao longo do dia.
- **Associação de alimentos às refeições**: seleção de alimentos e quantidades consumidas em cada refeição.
- **Consulta de alimentos**: listagem, busca e paginação de alimentos cadastrados.
- **Acompanhamento diário**: visualização das refeições registradas no dia atual.
- **Histórico por data**: consulta de refeições cadastradas em datas específicas.
- **Relatórios calóricos**: acompanhamento da ingestão de calorias por período.
- **Interface web responsiva**: frontend desenvolvido em Angular com componentes visuais modernos.

## 🛠️ Tecnologias Utilizadas

### Frontend
- Angular 19 / TypeScript
- Angular Material
- RxJS
- Chart.js / ng2-charts
- SCSS

### Backend
- Java 21
- Spring Boot 3.4.5 (Web, Data JPA, Security)
- JWT / Lombok / Maven

### Banco de Dados
- PostgreSQL / Hibernate

## 📦 Como Rodar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/LuisLehr/MiKcal.git
cd MiKcal
```

### 2. Configure o banco de dados PostgreSQL

Crie o banco e o usuário conforme o arquivo `backend/mikcal/src/main/resources/application.properties`:

```sql
CREATE USER eu WITH PASSWORD '1234';
CREATE DATABASE banco_mikcal OWNER eu;
GRANT ALL PRIVILEGES ON DATABASE banco_mikcal TO eu;
```

> Caso prefira outros dados de acesso, altere o `application.properties` conforme necessário.

### 3. Inicie o backend

```bash
cd backend/mikcal

# Windows
./mvnw.cmd spring-boot:run

# Linux/macOS
./mvnw spring-boot:run
```

A API ficará disponível em `http://localhost:8080`.

### 4. Instale as dependências do frontend

```bash
cd frontend/projeto
npm install
```

### 5. Inicie o frontend

```bash
npm start
```

A aplicação estará disponível em `http://localhost:4200`.

## ⚠️ Observação para Usuários Windows

Se o PowerShell bloquear a execução de scripts, execute:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Depois, feche e reabra o terminal. Alternativamente, use `npm.cmd` no lugar de `npm`.

## 💾 Persistência de Dados

Os dados são armazenados no PostgreSQL. O Hibernate está configurado com `ddl-auto=update`, criando e atualizando as tabelas automaticamente.

O projeto inclui um arquivo `import.sql` em `backend/mikcal/src/main/resources/` para carga inicial de dados.

---

#### *Desenvolvido para quem busca mais consciência sobre seus hábitos alimentares através de dados.*

## Desenvolvido por
- Luis Henrique Lehr

---
# 🥗 MiKcal - EN

A web application developed as a Final Course Project at Universidade do Vale do Rio dos Sinos (Unisinos), in the Systems Analysis and Development (ADS) program.

MiKcal aims to assist with daily nutritional tracking, allowing users to register meals and foods consumed throughout the day. Based on these records, the app provides insights into caloric intake and macronutrients, offering a clearer view of the user's eating habits.

## 🚀 Features

- **User Registration**: account creation with personal information used in nutritional tracking.
- **JWT Authentication**: secure login and access control for protected features.
- **Meal Registration**: logging of meals consumed throughout the day.
- **Food-to-Meal Association**: selection of foods and quantities consumed per meal.
- **Food Lookup**: listing, searching, and pagination of registered foods.
- **Daily Tracking**: visualization of meals logged on the current day.
- **Date-based History**: lookup of meals registered on specific dates.
- **Caloric Reports**: tracking of caloric intake over a selected period.
- **Responsive Web Interface**: frontend built with Angular and modern UI components.

## 🛠️ Technologies Used

### Frontend
- Angular 19 / TypeScript
- Angular Material
- RxJS
- Chart.js / ng2-charts
- SCSS

### Backend
- Java 21
- Spring Boot 3.4.5 (Web, Data JPA, Security)
- JWT / Lombok / Maven

### Database
- PostgreSQL / Hibernate

## 📦 How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/LuisLehr/MiKcal.git
cd MiKcal
```

### 2. Set up the PostgreSQL database

Create the database and user as expected by `backend/mikcal/src/main/resources/application.properties`:

```sql
CREATE USER eu WITH PASSWORD '1234';
CREATE DATABASE banco_mikcal OWNER eu;
GRANT ALL PRIVILEGES ON DATABASE banco_mikcal TO eu;
```

> If you prefer different credentials, update `application.properties` accordingly.

### 3. Start the backend

```bash
cd backend/mikcal

# Windows
./mvnw.cmd spring-boot:run

# Linux/macOS
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`.

### 4. Install frontend dependencies

```bash
cd frontend/projeto
npm install
```

### 5. Start the frontend

```bash
npm start
```

The application will be available at `http://localhost:4200`.

## ⚠️ Note for Windows Users

If PowerShell blocks script execution, run:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Then close and reopen the terminal. Alternatively, use `npm.cmd` instead of `npm`.

## 💾 Data Persistence

Data is stored in PostgreSQL. Hibernate is configured with `ddl-auto=update`, automatically creating and updating tables based on backend entities.

The project includes an `import.sql` file at `backend/mikcal/src/main/resources/` for initial data seeding.

---

#### *Built for those who seek awareness of their eating habits through data.*

## Developed by
- Luis Henrique Lehr
