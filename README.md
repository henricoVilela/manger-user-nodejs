# manger-user-nodejs
Gerenciador de usuarios usando NodeJs/NeDB

## Descrição:
Este projeto ficou dividido em dois servidores, utilizando NodeJs no backend e banco de dados NeDB (Orientado a documentos e trabalha com o formato json):
- *_CLIENT-SERVER_* ->  hospeda de fato o projeto [**manager-user-session-storage**](https://github.com/henricoVilela/manager-user-session-storage) e comunica (via Ajax ou Fetch (front-end) / API Restify (back-end)) com o outro servidor (restfull), para realizar suas tarefas. O index.html fica no folder 'views' com a extensão .ejs.

- *_RESTFULL_* -> Esse tem o papel de fazer as consultas/inserções/exclusao no banco de dados e retornar para o servidor de aplicação as respostas geradas pelos 'Request'.

Para ajudar na criação/gerenciamento das rotas, direcionado cada requisição para sua devida funcionalidade através do que vem da URL e Cabeçalho HTTP, foram utilizados alguns pacotes e extensões para o NodeJs:
- express
- consig
- body-parser
- express-validator

## IMPORTANTE:
- Executar o comando *'npm install'* no diretorio do projeto para baixar e instalar todas as dependencias.
- Abrir um terminal na pasta *'client-server'* e executar o comando *'npm start'*
- Abiri um terminal na pasta *'restfull'* e executar o comando *'node index.js'*
