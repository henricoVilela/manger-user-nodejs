class User { //Classe com a finalidade de ter os metodos responsaveis pela manipulacao dos dados dos usuarios.

	//Contrutor da class User
	constructor(name, gender, birth, country, email, pass, photo, admin){
		this._id; //att para guardar o identificador unico de cada registro
		this._name = name;
		this._gender = gender;
		this._birth = birth;
		this._country = country;
		this._email = email;
		this._password = pass;
		this._photo = photo;
		this._admin = admin;
		this._register = new Date();
	}

	get id(){
		return this._id;
	}

	get name(){
		return this._name;
	}

	get gender(){
		return this._gender;
	}

	get birth(){
		return this._birth;
	}

	get country(){
		return this._country;
	}

	get email(){
		return this._email;
	}

	get password(){
		return this._pass;
	}

	get photo(){
		return this._photo;
	}

	get admin(){
		return this._admin;
	}

	get register(){
		return this._register;
	}

	set photo(value){
		this._photo = value;
	}

	//Apartir de um objeto Json carrega a instancia da classe 'User' com os respectivos valores
	loadFromJson(json){

		for (let name in json){

			switch(name){
				case '_register':
					this[name] = new Date(json[name]);
				break;

				default:
					if(name.substring(0,1) === '_') this[name] = json[name];
			}

			
		}
	}//loadFromJson

	//Metodo estatico para recuperar todos os dados da sessionStorage/localStorage
	static getUsersStorage(){

		return Fetch.get('/users');//uma outra maneira de fazer os request. Foi criado uma nova classe para tal

        //return HttpRequest.get('/users');
    }//getUsersStorage

	//Converte o obejto corrent em json e retorna
	toJSON(){
		let json = {};

		Object.keys(this).forEach(key=>{
			if (this[key] !== undefined) json[key] = this[key];
		});

		return json;
	}//toJSON

    //Salva os dados na sessionStorage/localStorage
	save(){
		
		return new Promise((resolve, reject)=>{

			let promise;

			if (this._id){
				promise = HttpRequest.put(`/users/${this._id}`,this.toJSON());
			}else{
				promise = HttpRequest.post('/users',this.toJSON());
			}
	
			promise.then(data=>{
				this.loadFromJson(data);

				//Deu certo
				resolve(this);
			}).catch(e=>{
				//Deu Ruim
				reject(e);
			});

		});
		
	}//save

	//Remove os valores da session de acordo com o seu ID
	remove(){
		return HttpRequest.delete(`/users/${this._id}`);
	}//remove
}