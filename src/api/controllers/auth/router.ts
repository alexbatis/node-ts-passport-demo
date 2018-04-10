import * as express from 'express';
import controller from './controller'

export default express.Router()
    .get('/me',controller.getUserInfo)
    .get('/logout',controller.logout)
    .post('/login', controller.login)
    .post('/signup',controller.signup);