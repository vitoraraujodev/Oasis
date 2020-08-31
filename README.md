<div align="center">
<h1>Oasis - Consultoria Ambiental</h1>
</div>
<br>
<p>Oasis será uma aplicação voltada para empresas e industrias que buscam se licenciar através do orgão ambiental INEA. A aplicação será constituida por um website e um servidor com backend, desenvolvidos em ReactJS e Node.js. O projeto terá como principal objetivo facilitar o sistema de licenciamento, através de um novo formulário inteligente e elaborado, que guiará a empresa no preenchimento, e esclarecerá posteriormente os dados ao orgão INEA.</p>

## :rocket: Tecnologias

-   [Node.js](https://nodejs.org/)
-   [Express](https://expressjs.com/)
-   [JWT](https://jwt.io/)
-   [Yup](https://www.npmjs.com/package/yup)
-   [Multer](https://github.com/expressjs/multer)
-   [ReactJS](https://reactjs.org/)
-   [NodeMailer](https://nodemailer.com/about/)
-   [Redux](https://redux.js.org/)
-   [Redux-Saga](https://redux-saga.js.org/)
-   [Redux-persist](https://github.com/rt2zz/redux-persist)
-   [Styled-components](https://www.styled-components.com/)
-   [Axios](https://github.com/axios/axios)
-   [React-icons](https://react-icons.netlify.com/)
-   [Reactotron](https://infinite.red/reactotron)
-   [Immer](https://github.com/immerjs/immer)
-   [Polished](https://polished.js.org/)
-   [Date-fns](https://date-fns.org/)
-   [ESLint](https://eslint.org/)
-   [Prettier](https://prettier.io/)
-   [VS Code](https://code.visualstudio.com/)

## :information_source: Instruções

### Pré-requisitos para rodar aplicação:

* [Git](https://git-scm.com)
* [Node](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/)

Utilizando [docker](https://docs.docker.com/engine/):

```bash
# Instalando imagem do Postgres
docker run --name IMAGE_NAME -e POSTGRES_PASSWORD=PASSWORD -p 5432:5432 -d postgres:11
# Instalando imagem do Redis
docker run --name IMAGE_NAME -p 6379:6379 -d -t redis:alpine
# Inicializando Postgres
docker start POSTGRES_IMAGE_NAME
# Inicializando Redis
docker start REDIS_IMAGE_NAME
```

Clone o repositório:

```bash
git clone https://github.com/vitoraraujodev/oasis.git
```

No seu VSCode, instale as extenções de padronização de código:

<blockquote><strong>ESLint</strong>, <strong>Prettier</strong> e <strong>EditorConfig</strong></blockquote>

Para permitir que o ESLint faça os ajustes automaticamente, adicione ao seu <b>settings.json</b>:

<blockquote><strong>Ctrl+Shift+P</strong></blockquote>

Selecione "Preferences: Open Settings (JSON)"

Adicione neste arquivo:

```json
  "editor.rulers": [80, 120],
  "editor.tabSize": 2,
  "[javascript]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true,
    }
  },
  "[javascriptreact]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true,
    }
  },
```

### Backend

```bash
# Entre no diretório do backend
cd Oasis/backend
# Instale as dependências
yarn
# Faça as migrações
yarn sequelize db:migrate
# Rode a API
yarn dev
```
