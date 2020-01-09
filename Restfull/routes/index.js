/* ITEM 1 - Necessario caso nao use o consign 

let express = require('express');
let routes  = express.Router(); 

*/

//idem ITEM 1, adicionado no final do arquivo
//module.exports = routes;

module.exports = (app)=>{
    app.get('/',(req,res)=>{
        console.log('URL:', req.url);
        console.log('METHOD:', req.method);
    
        res.statusCode = 200;
        res.setHeader('Content-Type','text/html');
        res.end('<h1>Olá</h1>');
    });
};
