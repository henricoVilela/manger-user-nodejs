const express = require('express'); //pacote usado para criar rotas
const consign = require('consign'); //pacote usado para gerenciar rotas
const bodyParser = require('body-parser');//extensao do express para interpretar o body de uma requisição POST
const expressValidator = require('express-validator');//extensao do express para validar dados
const port = 4000;
const ip   = 'localhost'; 
let app = express();

app.use(bodyParser.urlencoded({ extended: false,limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb'}));//faz o parse das informacoes recebidas em json


//inclui todas as rotas da pasta 'routes' em app
consign().include('routes').include('utils').into(app);

app.listen(port,ip,()=>{
    console.log('servidor rodando...');
});

/* Maneira padrao de chamar um outro arqivo 

//requerindo as rotas criadas em diferentes arquivos .js para dentro do escopo do 'main file'.
let routesIndex = require('./routes/index.js');
let routesUsers = require('./routes/users.js');

//Indicar ao express que deseja usar as rotas criadas
app.use(routesIndex);
app.use('/users',routesUsers);
*/


