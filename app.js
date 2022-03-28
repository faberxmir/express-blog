const express = require('express');
const bodyparser = require('body-parser');
const Router = require('./routes/routes')

const app = express();

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(Router);

app.listen(3000, _=> {
    console.log('Server started!');
})