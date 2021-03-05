const express = require('express')
const SetupService = require('./setup-service')
const path = require('path')
const { requireAuth } = require('../middleware/jwt-auth')

const setupsRouter = express.Router()
const jsonBodyParser = express.json()

setupsRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        SetupService.getAllSetups(req.app.get('db'))
        .then(setups => {
            res.json(setups.map(SetupService.serializeSetup))
        })
        .catch(next)
    })
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const {user_id, setup_name, setup_info} = req.body
        const newSetup = {user_id, setup_name, setup_info}
 
        for (const [key, value] of Object.entries(newSetup))
            if (value === null)
                return res.status(400).json({
                    error: {message: `Missing ${key} in request body`}
                })
        SetupService.insertSetup(
            req.app.get('db'),
            newSetup
        )
        .then(setup => {
            res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${setup.id}`))
            .json(SetupService.serializeSetup(setup))
        })
    })

setupsRouter
    .route('/:setup_id')
    .all(requireAuth)
    .all((req, res, next) => {
        SetupService.getById(
            req.app.get('db'),
            req.params.setup_id
        )
            .then(setup => {
                if(!setup) {
                    return res.status(404),json({
                        error: {message: `Setup does not exist`}
                    })
                }
                res.setup = setup
                next()
            })
            .catch(next)
    })
    .get(requireAuth, (req, res) => {
        res.json(SetupService.serializeSetup(res.setup))
    })
    .delete(requireAuth, (req, res, next) => {
        SetupService.deleteSetup(
            req.app.get('db'),
            req.params.setup_id
        )
        .then(numberOfRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })

    module.exports = setupsRouter