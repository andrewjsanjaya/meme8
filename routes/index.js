const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')

// const loggedIn = function (req, res, next) {
//     console.log('masok login')
//     next()
// }

router.get('/', Controller.landing);

router.get('/login', Controller.login);

router.post('/login', Controller.loginPost);

router.get('/register', Controller.register);

router.post('/register', Controller.registerPost);

router.use(function(req, res, next) {
    if(req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
})

router.get('/verification', Controller.verification);

router.get('/home/:idUser', Controller.home);

router.get('/user/:idUser', Controller.user);

router.get('/user/:idUser/profile', Controller.profile);

router.post('/user/:idUser/profile', Controller.profilePost);

router.get('/user/:idUser/delete/:idPost', Controller.deletePost);

router.get('/post/add/:idUser', Controller.getAddPost);

router.post('/post/add/:idUser', Controller.postAddPost);

router.get('/post/:idPost/like', Controller.addLikePost);

module.exports = router