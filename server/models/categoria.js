const mongoose = require('mongoose')
const Schema = mongoose.Schema

//create a schema
const categoriaSchema = new Schema({

    nome: {
        type: String,
        required: true
    },
    descricao: {
        type: String
    }

})


//create a model
const Categoria = mongoose.model('categoria', categoriaSchema)

//export the model
module.exports = Categoria