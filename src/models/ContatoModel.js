const mongoose = require('mongoose');
const validator = require('validator')
const ContatoSchema = new mongoose.Schema({
  nome:{type:String, required:true},
  sobrenome:{type:String, required:false, default:''},
  email:{type:String, required:false, default:''},
  telefone:{type:String, required:false, default:''},
  criadoEm:{type:Date, default:Date.now}
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

class Contato {
  constructor(body){
    this.body = body;
    this.errors = [];
    this.contato =null;
  }
 async register(){
  this.valida();
  if(this.errors.length>0)return;
  this.contato = await ContatoModel.create(this.body)
    
  }
  valida(){
    this.cleanUp()
    //validação dos campos do formulario
    if(this.body.email && !validator.isEmail(this.body.email))this.errors.push('E-mail invalido');
    if(!this.body.nome)this.errors.push('Nome é um campo obrigatorio');
    if(!this.body.email && !this.body.telefone)this.errors.push('Pelo menos um telefone ou um e-mail');
  }

  cleanUp(){
    // percorre todas as chaves do body e verifica se so tem string
    for(const x in this.body){
        if(typeof this.body[x]!='string'){
            // caso tenha outro tipo primitivo de dados colocando como string vazia
            this.body[x]='';
        }
    }
    this.body={
      nome: this.body.nome,
      sobrenome: this.body.sobrenome,
      email: this.body.email,
      telefone: this.body.telefone
    }
  
  }
  async buscarId(id){
    if(!typeof id =='string')return
    const user = await ContatoModel.findById(id)
    return user
  }
  async edit(id){
    if (!typeof id == 'string')return;
    this.valida();
    if(this.errors.length>0)return;
    this.contato = await ContatoModel.findByIdAndUpdate(id,this.body,{new:true})
  }

  async buscaContatos(){
    const contatos = await ContatoModel.find().sort({criadoEm:-1});
    return contatos
  }

  async delete(id){
    if(!typeof id =='string') return;
    const contato = await ContatoModel.findByIdAndDelete({_id:id});
    return contato
  }
}
module.exports = Contato;
