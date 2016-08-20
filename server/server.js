import express from 'express'
import path from 'path';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../webpack.config.js';
import webpackHotMiddleware from 'webpack-hot-middleware';
import signup from './routes/signup';
import userCheck from './routes/userCheck'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import devMethods from '../database/methods/devMethods';
import devModel from '../database/models/devModel';
import db from '../database/sheepDB';
import postDevDB from '../database/methods/devAPI/postDevDBMethods';
import createDevDB from './routes/createDevDB'


let app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json())

//api for creating account
app.use('/signup', signup)

//api for logging in
app.use('/api/checkUserLogin', userCheck)

app.use('/createDevDB', createDevDB)

// app.use(webpackMiddleware(webpack(webpackConfig)));

const compiler = webpack(webpackConfig);

app.use(webpackMiddleware(compiler, {
	hot: true,
	publicPath: webpackConfig.output.publicPath,
	onInfo: true,
	historyApiFallback: true
}));
app.use(webpackHotMiddleware(compiler))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, './index.html'));
})


app.post('/signup', devMethods.addDev);


app.post('/postDevDB', postDevDB.validateDev, postDevDB.populateDB);

// mongoose.connect('mongodb://localhost/new-practice-db', () => {
//   console.log('connected to local mongoDB');
// });

//all route handling in routes.js

//for react router - will allow back and forth - will render /index.html no matter what
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, './index.html'));
});

app.listen(3000, () => {
  console.log('listening on port 3000');
})

