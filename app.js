const express = require('express');
const os = require('os');
const cors = require('cors');

//Routers
const authRouter = require('./auth/router');
const v1Router = require('./api/v1');

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('dist'));

//Routes
app.use(authRouter);
app.use(v1Router);

app.get('/', (req, res) => {
  res.send('CJ Jewelry Backend');
});
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

const start = (port = process.env.PORT) => {
  app.listen(port, () => {
    console.log(`Listening on port ${process.env.PORT}`);

  });
}; 

module.exports = {app, start };
