const {User, Profile, Post, PostTag, Tag} = require('../models/');
const codeVerif = require('../helpers/codeVerif')
const { Op } = require('sequelize');

class Controller{
    static landing(req, res) {
      res.render('landing-page');
    }

    static login(req, res) {
        res.render('login', {loginFalse: false});
    }

    static loginPost(req, res) {
        const {email, password} = req.body

        User.findOne({where: {
            email: {[Op.eq]: email}, 
            password: {[Op.eq]: password}
            }})
            .then(user => {
                if (user) {
                    if(!user.status) {
                        const codeCheck = codeVerif(email, password);
                        res.render('login-verif', {user: user.id, codeCheck, codeFalse: false}) //tampilin input verif code
                    } else {
                        res.redirect(`/home/${user.id}`) //lanjut ke post
                    }
                } else {
                    res.render('login', {loginFalse: true}) //tampilin input wrong email/password
                }
            })
            .catch(err => {
                res.send(err)
            })
    }

    static register(req, res) {
        res.render('register', {emailstatus: false});
    }

    static registerPost(req, res) {
        const { email, password } = req.body;
        let codeCheck = codeVerif(email, password);
        const newUser = { email, password }

        User.findOne({where: {
            email: {[Op.eq]: email}
            }})
            .then(user => {
                if(!user) {
                    return User.create(newUser)
                } 
                res.render('register', {emailstatus: true});
            })
            .then((user) => {
                res.render('login-verif', {user: user.id, codeCheck, codeFalse: false});
            })
            .catch(err => {
                console.log(err);
            })
    }

    static verification(req, res) {
        const { id, code } = req.query;

        User.findByPk(id)
            .then(user => {
                let codeCheck = codeVerif(user.email, user.password);
                if (codeCheck === code) {
                    return User.update({status: true}, {where: {
                        id: {[Op.eq]: id}
                    }})
                }

                res.render('login-verif', {user: user.id, codeCheck, codeFalse: true});
            })
            .then((user) => {
                this.home;
            })
            .catch(err => {
                res.send(err);
            })
    }

    static home(req, res) {
        const { id } = req.params;

        Post.findAll({
            include: [{model: User}, {model: Tag, through: {}}]
        })
            .then(posts => {
                res.render('home', {posts, id});
            })
            .catch(err => {
                res.send(err);
            })
    }

    static profile(req, res) {
        const { id } = req.params;
        res.render('profile', {id});
    }

    static profilePost(req, res) {
        const { id } = req.params;
        const {fullName, birthDate, location, phoneNumber} = req.body;
        
        let dataProfile = {fullName, birthDate, location, phoneNumber, UserId: id};

        Profile.findOne({where : {
            UserId: {[Op.eq]: id}
        }})
            .then(profile => {
                if(!profile) {
                    return Profile.create(dataProfile)
                } else {
                    return Profile.update(dataProfile, {where: {
                        UserId: {[Op.eq]: id}
                    }})
                }
            })
            .then()
            .catch()
    }

    static user(req, res) {
        
    }

    static profileFeedPost(req, res) {

    }
}

module.exports = Controller