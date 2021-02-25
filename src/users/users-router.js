const express = require('express')
const path = require('path')
const { hasUserWithUsername } = require('./users-service')
const UserService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .post('/', jsonBodyParser, (req, res, next) => {
        const {name, username, password} = req.body

        for (const field of ['name', 'username', 'password'])
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
        
        const passwordError = UserService.validatePassword(password)

        if (passwordError)
            return res.status(400).json({ error: passwordError })
        
        UserService.hasUserWithusername(
            req.app.get('db'),
            username
        )
            .then(hasUserWithUsername => {
                if(hasUserWithUsername)
                    return res.status(400).json({error: `Username is already taken`})

                return UserService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            name,
                            username,
                            password: hashedPassword,
                            date_created: 'now()',
                        }

                        return UserService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                res 
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(UserService.serializeUser(user))
                            })
                    })

            })
            .catch(next)
    })

    module.exports = usersRouter