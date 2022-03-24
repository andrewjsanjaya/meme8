const {User, Profile, Post, PostTag, Tag} = require('../models/');
const codeVerif = require('../helpers/codeVerif')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'project.meme.8@gmail.com',
      pass: 'projectbersama1!'
    }
  });

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
            email: {[Op.eq]: email}
            }})
            .then(user => {
                if (user) {
                    const checkPassword = bcrypt.compareSync(password, user.password)
                    if (checkPassword) {

                        req.session.userId = user.id;
                        if(!user.status) {
                            const codeCheck = codeVerif(email, password);
                            res.render('login-verif', {user: user.id, codeCheck, codeFalse: false})
                        } else {
                            res.redirect(`/home/${user.id}`) 
                        }
                    } else {
                        res.render('login', {loginFalse: true})
                    }
                    
                } else {
                    res.render('login', {loginFalse: true})
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
        
        const newUser = { email, password }

        User.findOne({where: {
            email: {[Op.eq]: email}
            }})
            .then(user => {
                if(!user) {
                    return User.create(newUser)
                } 
                // bug juga nih keknya wkwk
                res.render('register', {emailstatus: true});
            })
            .then((user) => {
                return User.findOne({where: {
                    email: {[Op.eq]: email}
                    }})
            })
            .then(user => {
                let codeCheck = codeVerif(user.email, user.password);
                const mailOptions = {
                    from: 'project.meme.8@gmail.com',
                    to: email,
                    subject: 'Verification Code',
                    text: `your verfication code : ${codeCheck}`
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                res.render('login-verif', {user: user.id, codeCheck, codeFalse: false});
            })
            .catch(err => {
                res.send(err);
            })
    }

    static verification(req, res) {
        const { id, code } = req.query;

        User.findByPk(id)
            .then(user => {
                let codeCheck = codeVerif(user.email, user.password);
                if (codeCheck !== code) {
                    // ERROR MASIH GAN
                    console.log(codeCheck, code);
                    res.render('login-verif', {user: user.id, codeCheck, codeFalse: true});
                } else {
                    return User.update({status: true}, {where: {
                        id: {[Op.eq]: id}
                    }})
                }
            })
            .then(user => {
                res.redirect(`/home/${id}`)
            })
            .catch(err => {
                res.send(err);
            })
    }

    static home(req, res) {
        const id = req.params.idUser;
        // let include = [{model: User}, {model: Tag, through: {}}]

        Post.popularPost(User, Tag)
            .then(posts => {
                res.render('home', {posts, id});
            })
            .catch(err => {
                res.send(err);
            })
    }

    static profile(req, res) {
        const { idUser } = req.params;

        Profile.findOne({where: {
            UserId: {[Op.eq]: idUser}
        }})
            .then(profile => {
                res.render('profile', {idUser, profile}) 
            })
            .catch(err => {
                res.send(err);
            })
    }

    static profilePost(req, res) {
        const { idUser } = req.params;
        const {fullName, birthDate, location, phoneNumber, statusProfile} = req.body;
        
        let dataProfile = {fullName, birthDate, location, phoneNumber, UserId: idUser};
        if(statusProfile === "update") {
            Profile.update(dataProfile, {where: {
                UserId: {[Op.eq]: idUser}
            }})
                .then(() => {
                    res.redirect(`/user/${idUser}`)
                })
                .catch(err => {
                    res.send(err);
                })
        } else {
            Profile.create(dataProfile)
                .then(() => {
                    res.redirect(`/user/${idUser}`);
                })
                .catch(err => {
                    let errors = err.errors.map(el => el.message);
                    res.send(errors);
                })
        }
    }

    static user(req, res) {
        const id = req.params.idUser

        let storage = {}
        User.findByPk(id, {
            include: [{model: Profile}]
        })
            .then(user => {
                if (!user.Profile) {
                    res.redirect(`/user/${id}/profile`)
                }

                storage.user = user

                return Post.findAll({
                    where: {UserId: {[Op.eq]: id}},
                    include: [{model: Tag, through: {}}]
                })
            })
            .then(posts => {
                res.render('detail-user', {user: storage.user, posts})
            })
            .catch(err => {
                res.send(err)
            })
    }

    static deletePost(req, res) {
        const idPost = req.params.idPost
        const idUser = req.params.idUser

        PostTag.destroy({
            where: {PostId: {[Op.eq]: idPost}}
            })
            .then(() => {
                return Post.destroy({
                where: {id: {[Op.eq]: idPost}}
                })
            })
            .then(() => {
                res.redirect(`/user/${idUser}`)
            })
            .catch(err => {
                res.send(err)
            })
    }

    static addLikePost(req, res) {
        const id = req.params.idPost

        Post.increment('like', {
                where: {id: {[Op.eq]: id}}
            })
            .then(user => {
                const idUser = user[0][0][0].UserId
                res.redirect(`/home/${idUser}`)
            })
            .catch(err => {
                res.send(err)
            })
    }

    static getAddPost(req, res) {
        const {idUser} = req.params

        Tag.findAll({
                order: [['id', 'ASC']]
            })
            .then(tags => {
                res.render('add-post', {tags, idUser})
            })
            .catch(err => {
                res.send(err)
            })
    }

    static postAddPost(req, res) {
        const {caption, url, tags} = req.body
        const UserId = req.params.idUser
        const newPost = { UserId, caption, url }
        Post.create(newPost)
            .then(post => {
                let promises = []
                
                if (tags.length > 1) {
                    tags.forEach(el => {
                        promises.push(PostTag.create({PostId: post.id, TagId: el}))
                    })  
                } else {
                    promises.push(PostTag.create({PostId: post.id, TagId: tags}))
                }
                
                Promise.all(promises)
            })
            .then(data => {
                res.redirect(`/home/${UserId}`)
            })
            .catch(err => {
                if (err.name = 'SequelizeValidationError') {
                    err = err.errors.map(el => el.message)
                }
                res.send(err)
            })
    }

}

module.exports = Controller