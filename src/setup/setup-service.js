const xss = require('xss')

const SetupService = {
    getAllSetups(knex) {
        return knex
        .select('*')
        .from('kitlab_setups')
    },
    getById(knex, id) {
        return knex 
        .from('kitlab_setups')
        .select('*')
        .where('setup_id', id)
        .first()
    },
    insertSetup(knex, newSetup) {
        return knex
        .insert(newSetup)
        .into('kitlab_setups')
        .returning('*')
        .then(rows => {
            return rows[0]
        })
    },
    deleteSetup(knex, id) {
        return knex('kitlab_setups')
        .where('setup_id', id)
        .delete()
    },
    serializeSetup(setup) {
        return {
            setup_id: setup.setup_id,
            user_id: setup.user_id,
            setup_name: xss(setup.setup_name),
            setup_info: xss(setup.setup_info),
        }
    },
}

module.exports = SetupService