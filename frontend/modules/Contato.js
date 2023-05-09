import validator from 'validator';

export default class Contato{
    constructor(formContato){
        this.formContato = document.querySelector(formContato)

    }
    init(){
        this.events();
    }
    events(){
        if(!this.formContato) return;
        this.formContato.addEventListener('submit',e =>{
            e.prevenDeafult();
            this.validate(e);
        })
    }
    validate(e){
        const el =  e.target;
        const nameInput = el.querySelector('input[name="nome"]');
        const secondNameInput = el.querySelector('input[name="sobrenome"]');
        const emailInput = el.querySelector('input[name="email"]');
        const telephoneInput = el.querySelector('input[name="telefone"]');

        let error = 0;
        if(!nameInput || !secondNameInput) {
            alert('Nome e sobrenome precisam estar preenchidos');
            error = 1;
        }
        if(!validator.isEmail(emailInput.value)) {
            alert('Email Invalido');
            error = 1;
        }
        if(telephoneInput.value.length !==14) {
            alert("numero de telefone invalido");
            error = 1;
        }
        if(!error)el.submit();


    }
}