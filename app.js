const express = require('express');
const Controller = require('./controllers/controller');
const app = express();
const routes = require('./routes/');
const session = require('express-session');
const port = 3000;

app.use(express.urlencoded({extended: false}));

app.set('view engine','ejs');

app.use(session({
  secret: 'meme8 bersifat rahasia',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    sameSite: true
  }
}))

app.use('/', routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
