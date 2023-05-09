const Contato = require('../models/ContatoModel')

exports.index = async(req, res) => {
  const contatos = await Contato.prototype.buscaContatos()
  res.render('index',{contatos});
  return;
};


