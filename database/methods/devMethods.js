'use strict';
var Models = require('../models/devModel');
var uri = 'mongodb://localhost/';
var sheepDB = require('../SheepDB');
var Promise = require("bluebird");
var mongoose = Promise.promisifyAll(require("mongoose"));
var apiKey = require('./devAPI/api-key-controller'); 

// returns all databases names/_id (NO ACTUAL DATA) for a dev
function getAllDatabases(req, res, next){
	var data = [];
	return Models.DB.find({_creator: req.params.devID}).execAsync()
	.then(function(results){
		console.log('results', results);
		return Promise.each(results, function(database){
			console.log('before nested promise',database._creator, database.name);
			var devDB = sheepDB.useDb(database._creator + '_' + database.name);
			return Promise.each(database.collections, function(collection){
				console.log('nested promise',collection.name, collection.devSchema);
				var devModel = devDB.model(collection.name, new mongoose.Schema(JSON.parse(collection.devSchema)));
				return devModel.find({}).execAsync()
				.then(function(result){
					console.log('result', result);
					result.push({
						'database': database.name,
						'collection': collection.name
					});
					data.push(result);
				});
			}).then(function(){
			});
		}).then(function(database){
		});
	}).then(function(){
		res.send(data);
	}).catch(function(err){
		console.log('error', err);
	});
	// 	var data = [];
	// 	if(!result) res.sendStatus(404);
	// 	// console.log('data result', result);
	// 	// console.log('result length', result.length);
	// 	result.forEach(function(database, index){
	// 		var devDB = sheepDB.useDb(database._creator + '_' + database.name);
	// 		each(database.collections, function(collection, callback){
	// 			var devModel = devDB.model(collection.name, new mongoose.Schema(JSON.parse(collection.devSchema)));
	// 			devModel.find({},function(err, result){
	// 				console.log('result', result);
	// 				result['collection'] = collection.name;
	// 				result['database'] = database.name;
	// 				console.log('result after adding names', result); 
	// 				data.push(result);

	// 			});
	// 			callback();
	// 		},
	// 		function(err){
	// 				if(err) console.log('error');
	// 			console.log('data in callback',data);
	// 		});
	// 		console.log('data1', data); 
	// 	});
	// 		console.log('data2', data);
	// });
	res.sendStatus(200);
}

// returns an array of all collection names/schema (NO ACTUAL DATA) for a dev's database
function getAllCollections(req, res, next){
	Models.DB.find({_creator: req.params.devID}, function(err, result){
		if(!result) res.sendStatus(404);
		console.log(result);
		var data = [];
		result.forEach(function(item){
			if(item._id.toString() === req.params.dbID){
				item.collections.forEach(function(col){
					data.push({'_id':col['_id'],'name':col['name'],'schema':JSON.parse(col['devSchema'])});
				})
			}
			res.send(result);
		});
	})
}

//Signup middleware. If addDev function is changed, need to change function in test file.
function addDev(req, res, next){
  var newDev ={
    userName: req.body.userName,
    password: req.body.password,
    api: {
      apiKey: apiKey.generateKey(),
      secretKey: apiKey.generateKey(),
      clientKey: apiKey.generateKey()
    }
  };

  Models.Dev.create(newDev, function(err, result){
    if(err) throw err;
    req.body.dev = result;
    next();
  });
}

// login middleware
function usernameExist(req, res, next){
	Models.Dev.findOne({'userName': req.body.userName}, 'userName', function(err, dev) {
		console.log('inside usernameExist')
		console.log('dev username exist',dev);
			if(dev === null) {
				console.log('name does not exist');
				next();
			} else {
				console.log('name exists!');
				res.status(422).send('User exists, please choose another username');
			}
	})
}

// create DB button middleware that adds to DB collection 
function addDB(req, res, next){
	var dev = req.body.dev;
	var db = new Models.DB({
		name: req.body.database,
		_creator: dev._id
	});
	var collection = {
		name: req.body.collectionName,
		devSchema: req.body.schema
	};
	db.collections.push(collection);
	console.log('db before saved', db);
	db.save(function(err){
		if (err) throw err;
		console.log('db after saved', db);
		req.body.db = db;
		req.body.dev = dev;
		next();
	});
}

// create DB button middleware that actually spools up database
function createDevDB(req, res, next) {
	console.log('in createDB', req.body);
	console.log('dev in createDB', req.body.dev);
	var devDB = sheepDB.useDb(req.body._id + '_' + req.body.database);
	var devModel = devDB.model('label', new mongoose.Schema({
		createdBy: String
	}));
	devModel({
		createdBy: req.body.dev.userName
	}).save(function(err, results){
		if (err) throw err;
		req.body.results = results;
		res.json(results);
	})
}

// saves collection and schema name to devs record of DBs (does not actually instantiate)
function addCollection(req, res, next){
	var collection = {
		name: req.body.collectionName,
		devSchema: req.body.schema
	}
	Models.DB.findOneAndUpdate({name: req.params.dbName}, { $push: { 'collections': collection } }, { new: true }, function(err, db){
		if (err) throw err;
		console.log(db);
		req.body.db = db;
		res.json(db);
	});
}

module.exports = { getAllDatabases, getAllCollections, addDev, usernameExist, addDB, createDevDB, addCollection };
