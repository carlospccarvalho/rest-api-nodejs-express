const router = require('express-promise-router')()
const passport = require('passport')
const passportJWT =  passport.authenticate('jwt', {session: false})
const {validateBody, schemas} = require('../helpers/routeHelpers')

const CategoriasController = require('../controllers/categorias')

router.route('/')
    .post(validateBody(schemas.categoriaSchema), passportJWT, CategoriasController.criar) 

router.route('/')
    .get(validateBody(schemas.categoriaSchema), passportJWT, CategoriasController.listar)

router.route('/:id')
    .get(validateBody(schemas.categoriaSchema), passportJWT, CategoriasController.ver)

router.route('/:id')
    .put(validateBody(schemas.categoriaSchema), passportJWT, CategoriasController.editar)

router.route('/:id')
    .delete(validateBody(schemas.categoriaSchema), passportJWT, CategoriasController.apagar)

module.exports = router