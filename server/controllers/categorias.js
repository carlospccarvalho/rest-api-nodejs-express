const Categoria = require('../models/categoria')


module.exports = {

    listar: (req, res, next) => {
        Categoria.find({}, (err, categorias) => {
            if(err){
                next(err)
            }
            //responde todas as categorias
            res.status(200).json({categorias})
        })
    },

    criar: async (req, res, next) =>{

        const nome = req.value.body.nome
        const descricao = req.value.body.descricao
        
        //verificar se categoria ja existe
        const foundCategoria =  await Categoria.findOne({"nome": nome})
        if(foundCategoria){
            return res.status(403).json({error: 'categoria ja existe'})
        }

        //create a new categorie
        const newCategoria = new Categoria({

            nome: nome,
            descricao: descricao
            
        })
        await newCategoria.save()

        console.log('newCategoria', newCategoria)
        
        //responde a categoria criada
        res.status(200).json({categoria: newCategoria})

    },

    ver: async (req, res, next) => {

        const id = req.params.id

        //verificar se categoria ja existe
        const categoria =  await Categoria.findById(id)

        if(!categoria){
            return res.status(403).json({error: 'categoria não existe na base de dados'})
        }
        
        //responde a categoria criada
        res.status(200).json({categoria})

    },

    editar: async (req, res, next) => {

        const nome = req.value.body.nome
        const descricao = req.value.body.descricao
        const id = req.params.id

        //verificar se categoria ja existe
        const categoria =  await Categoria.findById(id)

        if(!categoria){
            return res.status(403).json({error: 'categoria não existe na base de dados'})
        }

        categoria.nome = nome
        categoria.descricao = descricao
        categoria.save()

        //responde a categoria criada
        res.status(200).json({categoria})

    },

    apagar: async (req, res, next) => {

        const id = req.params.id

        //verificar se categoria existe
        const categoria =  await Categoria.findById(id)

        if(!categoria){
            return res.status(403).json({error: 'categoria não existe na base de dados'})
        }

        categoria.remove()

        //responde a categoria criada
        res.status(200).json({message: 'Categoria removida'})

    }


    

}