const xss = require('xss')

const ProductService = {
    getAllProducts(knex) {
        return knex
        .select('*')
        .from('kitlab_products')
    },
    getById(knex, id) {
        return knex 
        .from('kitlab_products')
        .select('*')
        .where('id', id)
        .first()
    },
    insertProduct(knex, newProduct) {
        return knex
        .insert(newProduct)
        .into('kitlab_products')
        .returning('*')
        .then(rows => {
            return rows[0]
        })
    },
    deleteProduct(knex, id) {
        return knex('kitlab_products')
        .where('id', id)
        .delete()
    },
    serializeProducts(product) {
        return {
            product_id: product.product_id,
            product_type: xss(product.product_type),
            name: xss(product.name),
            url: xss(product.url),
            product_image: product.product_image,
            price: product.price,
        }
    },
}

module.exports = ProductService