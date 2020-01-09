class Fetch{

    //metodo para as requisicoes http ao servidor Nodejs via Fetch
    static request(method, url, params = {}){

        return new Promise((resolve, reject)=>{ 
            let request;
            switch(method.toLowerCase()){
                case 'get'://quando o metodo e GET nao enviado dados entao basta a url para a requisicao
                    request = url;
                break;

                default://caso seja PUT, POST, DELETE é necessario enviar dados 
                        request = new Request(url,{
                        method,
                        body: JSON.stringify(params),
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    });
            }

            //O fecth usa promise para validar as requisicoes
            fetch(url).then(response=>{
                response.json().then(json=>{
                    resolve(json);//Deu certo
                }).catch(e=>{
                    reject(e);//Deu ruim
                });
            }).catch(e=>{
                reject(e);//Deu ruim
            });
        });

    }

    //retorna os usuarios. Se passar o id retorna somente um, caso contrario todos 
    static get(url, params = {}){
        return Fetch.request('GET', url, params);
    }

    //deleta um usuario do banco
    static delete(url, params = {}){
        return Fetch.request('DELETE', url, params);
    }

    //altera os dados de um usuario do banco
    static put(url, params = {}){
        return Fetch.request('PUT', url, params);
    }

    //adicionar um usuario
    static post(url, params = {}){
        return Fetch.request('POST', url, params);
    }
}