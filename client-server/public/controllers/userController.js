class UserController {

     //Construtor da classe UserController
	constructor(formIdCreate, formIdUpdate,tableId){
		this.formEl = document.getElementById(formIdCreate);
          this.formElUpdate = document.getElementById(formIdUpdate);
          this.tableEl = document.getElementById(tableId);

          this.onEdit();
          this.selectAll();
	}//cosntructor

     //Add o evento submit 'personalizado' ao btn salvar do formulario de cadastro.
     onSubmit(){

         //let _this =  this;
         //se usar arrow function o escopo do 'this' nao muda, caso contrario usar o codigo acima
          this.formEl.addEventListener('submit',(event)=>{

               event.preventDefault();
               let btnSubmit = this.formEl.querySelector('[type=submit]');
               btnSubmit.disabled = true;

               let values = this.getValues(this.formEl);
               if (!values){
                    return false;
               }
               //invocando o metodo que usa o promise / se deu certo executa a primeira func, se nao a segunda.
               this.getPhoto(this.formEl).then(
                    (content)=>{
                         values.photo = content;
                         values.save().then(user=>{

                              this.addLine(values);
                              this.formEl.reset();
                              btnSubmit.disabled = false;

                         });// metodo da classe User responsavel por salvar as informacoes no sessionStorage

                         //this.insert(values);//metodo para guardar valores na Section Storage
                         
                    },
                    (e)=>{
                         console.error(e);
                    }
               );


               /* exemplo usando o callback
               this.getPhoto((content)=>{
                    values.photo = content;
                    this.addLine(values,this.tableId);
               });*/
               
          });
     }//onSubmit

     //adiciona o evento 'click' no btn salvar do formulario de edicao, e ao btn cancelar
     onEdit(){
          document.querySelector('#box-user-update .btn-cancel').addEventListener("click", e=>{
               this.showPanelCreate();
          });

          this.formElUpdate.addEventListener("submit",event => {
               event.preventDefault();
               let btnSubmit = this.formElUpdate.querySelector('[type=submit]');
               btnSubmit.disabled = true;

               let values = this.getValues(this.formElUpdate);
               //guarda o index que esta alterando 
               let index  = this.formElUpdate.dataset.trIndex;


               if (!values){
                    return false;
               }


               let tr = this.tableEl.rows[index];
               let userOld = JSON.parse(tr.dataset.user);

               //result vai receber um novo objeto que é resultado da mesclagem de UserOld com Values(dados novos).
               let result  = Object.assign({},userOld,values); 

               //o uso do '_' se da pelo fato de que o objeto em questa nao é de fato uma instacia da classe user.js,
               //entao nao e possivel acessar os valores via metodo
               
              
               this.getPhoto(this.formElUpdate).then(
                    (content)=>{
                         if (!values.photo){
                              result._photo = userOld._photo;
                         }else{
                              result._photo = content;
                         }

                         //e necessario transforma esse json (result) em ojeto User para que o metodo getTr funcione corretamente
                         let user = new User();
                         user.loadFromJson(result);
                         user.save().then(user=>{
                              this.getTr(user,tr);
                              this.updateCount();
                              this.formElUpdate.reset;
                              btnSubmit.disabled = false;
                         }); // metodo da classe User responsavel por salvar as informacoes no sessionStorage

                         
                    },
                    (e)=>{
                         console.error(e);
                    }
               );

               this.showPanelCreate();
          });
     }//onEditCancel

     //Carrega a foto do seu computador usando a API FileReader(), e Promise().
     getPhoto(formEl){

          //usando a API Promise
          return new Promise((resolve,reject)=>{
               let fileReader = new FileReader();

               let elements = [...formEl.elements].filter((item)=>{
                    if (item.name === 'photo') {
                         return item;
                    }
               });

               let file = elements[0].files[0];

               //resolver -> deu certo
               fileReader.onload = ()=>{
                    resolve(fileReader.result);
               };

               //reject -> error
               fileReader.onerror = (e)=>{
                    reject(e);
               };

               if (file){
                    fileReader.readAsDataURL(file);
               }else{
                    resolve('dist/img/user1-128x128.jpg');
               }
               
          });     
     }//getPhoto

     //Pega os valores preenchido no formulario de cadastro.
	getValues(formEl){

		let user = {};
          let isValid = true;
          //forEach feito para percorer instacia de Arrey
          //usando os '[' ']' consegue transformar a colection em array, usando '...' ele formara um array com todos elementos presente na collection
		//'...' conhecido como SPREAD recurso novo do Js
          [...formEl.elements].forEach(function(field,index){

               if (['name','password','email'].indexOf(field.name) > -1 && !field.value){
                    field.parentElement.classList.add('has-error');
                    isValid = true;
                    return false;
               }

     		if(field.name == "gender"){

     			if(field.checked){
     				user[field.name] = field.id;
     			}
                    
     		}else if(field.name == "admin"){
                    user[field.name] = field.checked;
               }else{

     			user[field.name] = field.value;
     		}

     	});

          if (!isValid){return false;}

     	var objectUser = new User(
     		user.name,
     		user.gender,
     		user.birth,
     		user.country,
     		user.email,
     		user.password,
     		user.photo,
     		user.admin);

     	return objectUser;
	}//getValues

     //busca todos os usuarios da section
     selectAll(){
          //let users = User.getUsersStorage() ;

          User.getUsersStorage().then(data=>{
               data.users.forEach(dataUser=>{
                    let user = new User();
     
                    //metodo criado para carregar os dados a partir de um arquivo json
                    user.loadFromJson(dataUser);
     
                    this.addLine(user);
               });
          });
          
          
     }//selectAll

     //Adiciona uma linha na Tabela de usuario (novo usuario)
     addLine(dataUser){
          //console.log('Data',dataUser)  dist/img/user1-128x128.jpg;

          let tr = this.getTr(dataUser);

          this.tableEl.appendChild(tr) ;
          this.updateCount();
     }//addLine

     //quando atribui um valor no parametro, significa ser um valor por padrao caso nao seja passado esse parametro
     //na chamada do metodo.
     //metodo que cria a tag TR para ser adcionada na tabela ou editada.
     getTr(dataUser, tr = null){

          if(tr === null) tr = document.createElement('tr');

          tr.dataset.user = JSON.stringify(dataUser);

          tr.innerHTML = `
                    <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                    <td>${dataUser.name}</td>
                    <td>${dataUser.email}</td>
                    <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
                    <td>${Utils.dateFormat(dataUser.register)}</td>
                    <td>
                      <button type="button" class="btn btn-edit btn-primary btn-xs btn-flat">Editar</button>
                      <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
                    </td>
          `;

          this.addEventsTr(tr);
          return tr;
     }//getTr

     //Apresenta o formulario de cadastro
     showPanelCreate(){
          document.querySelector('#box-user-create').style.display = "block";
          document.querySelector('#box-user-update').style.display = "none";
     }//showPanelCreate

     //Apresenta o formulario para edicao dos cadastros
     showPanelUpdate(){
          document.querySelector('#box-user-create').style.display = "none";
          document.querySelector('#box-user-update').style.display = "block";
     }//showPanelUpdate

     //atualiza os valores em tela referente à quantidade de usuarios e adm entre eles
     updateCount(){
          let numberUsers = 0;
          let numberAdmin = 0;
          let user;
          [...this.tableEl.children].forEach(tr=>{
               numberUsers++;
               user = JSON.parse(tr.dataset.user)

               //chama a propriedade direto do json, ja que isso nao é uma instacia da class User entao nao possui os metodos get.
               if(user._admin){
                    numberAdmin++;
               }
          });

          document.querySelector('#number-users').innerHTML = numberUsers;
          document.querySelector('#number-users-admin').innerHTML = numberAdmin;
     }//updateCount

     //adiciona o evento 'click' no btn editar da tabela de usuarios(para cada linha criada), e ao btn excluir
     addEventsTr(tr){

          //evento para excluir uma linha
          tr.querySelector(".btn-delete").addEventListener("click", e=>{
               if(confirm("Deseja realmente excluir?")){
                    let user = new User();
                    user.loadFromJson(JSON.parse(tr.dataset.user));
                    user.remove().then(data=>{
                         tr.remove();//comando direto do elemento HTML
                         this.updateCount();
                    });//metodo criado por min
                    
               }
          });

          //evento para editar os valores da linha em questao
          tr.querySelector(".btn-edit").addEventListener("click", e=>{

               let json = JSON.parse(tr.dataset.user);
               let field;
               this.formElUpdate.querySelector('#exampleInputFile-update').value ='';

               //pega o index da linha corrente na tabela
               this.formElUpdate.dataset.trIndex = tr.sectionRowIndex;

               for (let name in json){
                    //fazendo comparacoes em parametro do query selector
                   field = this.formElUpdate.querySelector("[name="+name.replace("_","")+"]");
                   if(field){

                         switch(field.type){
                              case 'file':
                                   continue;
                              break;

                              case 'radio':
                                   
                                   field = this.formElUpdate.querySelectorAll("[name="+name.replace("_","")+"]");
                                   field.forEach(f=>{
                                        if (f.id == json[name]){
                                             f.checked = true;
                                        }
                                   });
               
                              break;

                              case 'checkbox':
                                   field.checked = json[name];
                              break;

                              default:
                                   field.value = json[name];
                         }

                         
                   }

                    
               }

               this.formElUpdate.querySelector('.photo').src = json._photo;
               this.showPanelUpdate();

          });
     }//addEventsTr
}