const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password:{type: String, required: true}
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
 constructor(body){
    this.body = body
    this.errors =[];
    this.user = null;
 }
 //utilizando aync pois o LoginModel me retorna uma promisse
  async register(){
    this.valida()
    if(this.errors.length > 0) return;
    await this.userExists()
    if(this.errors.length > 0) return;
    const salt = bcrypt.genSaltSync();
    this.body.password=bcrypt.hashSync(this.body.password,salt);
    this.user = await LoginModel.create(this.body)
    
     
 }
 async login(){
  this.valida()
  if(this.errors.length > 0) return;
   this.user =  await LoginModel.findOne({email:this.body.email})
   if(!this.user){
    this.errors.push('Usuário invalido')
    return;
   }
  if(!bcrypt.compareSync(this.body.password,this.user.password))
  {
    this.errors.push('Senha Invalida');
    this.user = null
    return;
  }
 }

 async userExists(){
   const user =  await LoginModel.findOne({email:this.body.email})
   if(user)this.errors.push('Esse email já está cadastrado')
 }
 valida(){
    this.cleanUp()
    //validação dos campos do formulario
    if(!validator.isEmail(this.body.email))this.errors.push('E-mail invalido');
    if(this.body.password.length <3 || this.body.password.length >=50)this.errors.push('Senha necessita ter entre 3 e 50 caracteres');
    


 }
 cleanUp(){
    // percorre todas as chaves do body e verifica se so tem string
    for(const x in this.body){
        if(typeof this.body[x]!='string'){
            // caso tenha outro tipo primitivo de dados colocando como string vazia
            this.body[x]=''
        }
    }
    this.body={
        email: this.body.email,
        password: this.body.password
    }
    
 }
}

module.exports = Login;
