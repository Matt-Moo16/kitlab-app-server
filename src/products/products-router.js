const express = require('express')
const ProductService = require('./products-service')
const path = require('path')
const { requireAuth } = require('../middleware/jwt-auth')

const productsRouter = express.Router()
const jsonBodyParser = express.json()

productsRouter
    .route('/')
    .get((req, res, next) => {
        ProductService.getAllProducts(req.app.get('db'))
        .then(products => {
            res.json(products.map(ProductService.serializeProducts))
        })
        .catch(next) 
    })

productsRouter
    .route('/:product_id')
    .all((req, res, next) => {
        ProductService.getById(
            req.app.get('db'),
            req.params.product_id
        )
            .then(product => {
                if(!product) {
                    return res.status(404),json({
                        error: {message: `Product does not exist`}
                    })
                }
                res.product = product
                next()
            })
            .catch(next)
    })
    .get((req, res) => {
        res.json(ProductService.serializeProducts(res.product))
    })
    .delete((req, res, next) => {
        ProductService.deleteProduct(
            req.app.get('db'),
            req.params.product_id
        )
        .then(numberOfRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })

    module.exports = productsRouter