/* 
 * Como boa pratica tudo que for relacionado a usuario, as rotas correspodente deve
 * estar neste arquivo, gerando assim uma melhor organizacao e facilitando na manutencao.

 *ITEM 1 - Necessario caso nao use o consign 

 let express = require('express');
 let routes  = express.Router(); 


 module.exports = routes; //adicionado no final do arquivo

*/

let NeDB = require('nedb'); //banco de dados que trabalha com json (orientado a documento)
let db = new NeDB({
    filename: 'users',
    autoload: true
});

const { check, validationResult } = require('express-validator');


module.exports = (app)=>{

    //definindo uma rota padrao
    let route = app.route('/users')

    route.get((req,res)=>{

        //comando para encontrar um registro do banco. Sort ordena pelo campo espeificado
        //1 asc, -1 desc.
        //dentro do find vai os filtros da consulta
        db.find({}).sort({name:1}).exec((err,users)=>{
            if(err){
                app.utils.error.send(err, req, res);
            }else{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
        
                //usando metodo do express para responder um JSON
                res.json({
                    users: users
                });
            }
        });

        /*
        //Metodo trivial para mandar um json
        res.end(JSON.stringify({
        users: [{
                name: 'Henrico',
                email: 'Henrico@gmail.com',
                id: 1
                }]
        }));*/
    });
    
    route.post(
        [
            check('_name', 'O nome é obrigatório.').notEmpty(),
            check('_email', 'O e-mail está inválido.').notEmpty().isEmail()
        ],
        (req,res)=>{
        

        let errors = validationResult(req);
        if (errors.notEmpty){
            app.utils.error.send(errors, req, res);
            return false;
        }
        //metodo para inserir no banco de dados. insert('dados',function para tratar possiveis erros);
        db.insert(req.body,(err,user)=>{
            if(err){
                app.utils.error.send(err, req, res);
            }else{
                res.status(200).json(user);
            }
        });

    });

    let routeId = app.route('/users/:id');


    routeId.get((req,res)=>{

        //Metodo para encontrar um registo com base nos paramentros passados
        db.findOne({_id: req.params.id}).exec((err, user)=>{
            if(err){
                app.utils.error.send(err, req, res);
            }else{
                res.status(200).json(user);
            }
        });

    });

    //Metodo PUT - Editar
    routeId.put(
        [
            check('_name', 'O nome é obrigatório.').notEmpty(),
            check('_email', 'O e-mail está inválido.').notEmpty().isEmail()
        ],
        (req,res)=>{

        let errors = validationResult(req);
        if (errors.notEmpty){
            app.utils.error.send(errors, req, res);
            return false;
        }

        //Metodo para editar os dados de um registro
        db.update({_id: req.params.id}, req.body, (err)=>{
            if(err){
                app.utils.error.send(err, req, res);
            }else{
                res.status(200).json(req.body);
            }
        });

    });

    routeId.delete((req,res)=>{

        //Metodo para excluir um registro
        db.remove({_id: req.params.id}, {}, (err)=>{
            if(err){
                app.utils.error.send(err, req, res);
            }else{
                res.status(200).json(req.params.id);
            }
        });

    });
};