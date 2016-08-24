var express = require('express');
var cookieParser = require('cookie-parser');
var path = require('path');
var signup = require('./routes/signup');
var login = require('./routes/login');
var userCheck = require('./routes/userCheck');
var bodyParser = require('body-parser');
var devMethods = require('../database/methods/devMethods');
var devModel = require('../database/models/devModel');
var db = require('../database/SheepDB');
var api = require('./routes/api');
var createDevDB = require('./routes/createDevDB');

var app = express();

// var webpack = 'webpack';
// var webpackMiddleware = 'webpack-dev-middleware';
// var webpackConfig = '../webpack.config.js';
// var webpackHotMiddleware = 'webpack-hot-middleware';

// const compiler = webpack(webpackConfig);
//
// app.use(webpackMiddleware(compiler, {
// 	hot: true,
// 	publicPath: webpackConfig.output.publicPath,
// 	onInfo: true,
// 	historyApiFallback:true
// }));
//
// app.use(webpackHotMiddleware(compiler));

//node-restful consider post-MVP
// app.use(morgan('dev'));
// app.use(methodOverride());

//node-restful consider post-MVP
// var methodOverride = 'method-override';
// var morgan = 'morgan';
// var restful ='node-restful';

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));


// app.use(bodyParser.json({type:'application/vnd.api+json'}));

//api for creating account
app.use('/signup', signup);

app.use('/login', login);

//click 'createDB' button
app.use('/createDevDB', createDevDB);

app.use('/api', api);


app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

//for react router - will allow back and forth - will render /index.html no matter what
app.get('*', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

var port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('listening on port 3000');
});
