var express = require('express');
var exphbs = require('express-handlebars');
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

app.use(express.static('node_modules'));
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('home');
});

app.listen(3000, function () {
  console.log('Weather app listening on port 3000!');
});