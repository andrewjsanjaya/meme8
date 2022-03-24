const express = require('express');
const Controller = require('./controllers/controller');
const app = express();
const port = 3000;

app.use(express.urlencoded({extended: false}));

app.set('view engine','ejs');

app.get('/', Controller.landing);

app.get('/login', Controller.login);

app.post('/login', Controller.loginPost);

app.get('/register', Controller.register);

app.post('/register', Controller.registerPost);

app.get('/verification', Controller.verification);

app.get('/home/:id', Controller.home);

app.get('/user/:id', Controller.user);

app.get('/profile/:id', Controller.profile);

app.post('/profle/:id', Controller.profilePost);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
