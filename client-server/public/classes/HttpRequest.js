class HttpRequest{

    //metodo para as requisicoes http ao servidor Nodejs via Ajax
    static request(method, url, params = {}){

        return new Promise((resolve, reject)=>{
            let ajax = new XMLHttpRequest();
            ajax.open(method.toUpperCase(),url);

            ajax.onerror = (e)=>{
                reject(e);
            };

            ajax.onload = (event)=>{
                let obj = {};

                try{
                    obj = JSON.parse(ajax.responseText);
                }catch(e){
                    reject(e);
                    console.error(e);
                }
               
                resolve(obj);

            }; 

            ajax.setRequestHeader('Content-Type','application/json');
            ajax.send(JSON.stringify(params));
        });

    }

    //retorna os usuarios. Se passar o id retorna somente um, caso contrario todos 
    static get(url, params = {}){
        return HttpRequest.request('GET', url, params);
    }

    //deleta um usuario do banco
    static delete(url, params = {}){
        return HttpRequest.request('DELETE', url, params);
    }

    //altera os dados de um usuario do banco
    static put(url, params = {}){
        return HttpRequest.request('PUT', url, params);
    }

    //adicionar um usuario
    static post(url, params = {}){
        return HttpRequest.request('POST', url, params);
    }
}