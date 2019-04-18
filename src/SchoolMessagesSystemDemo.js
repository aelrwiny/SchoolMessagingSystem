// prepare inmemory db
var loki = require('lokijs');
var db = new loki('db.json');

var person = db.addCollection('person');
person.insert({id:1, name:'Admin', username: 'admin', email: 'admin@schoolMessagesSystem', password: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwia…yMDN9.heCVGm2AoRGTxfErzYxPzCBZjek1AUU4LW4DznrWzu0', isAdmin: 'T'});
person.insert({id:2, name:'User One', username: 'userone', email: 'userone@schoolMessagesSystem', password: '1234', isAdmin: 'F'});
person.insert({id:3, name:'User Two', username: 'usertwo', email: 'usertwo@schoolMessagesSystem', password: '1234', isAdmin: 'F'});

var message = db.addCollection('message');
message.insert({id:1, createdBy: 1, sentTo: 2, isRead: 'F', messageContent: 'First Message and Second 123456789456'});
message.insert({id:2, createdBy: 1, sentTo: 3, isRead: 'F', messageContent: 'Second Message and Three 123456789456'});

// var results = message.find({sentTo:2});
// console.log(results);

// implement dao layer
var SystemDAO = (function (){
	function x() {};
	x.prototype.addStudent = function (newStudent) {
		var newId = person.count() + 1;
		var newlyAdded = person.insert({id:newId, 
			name: newStudent.name, 
			username: newStudent.username, 
			email: newStudent.email, 
			password: newStudent.password, 
			isAdmin: 'F'});
		return newlyAdded;
	};

	x.prototype.addMessage = function (newMessage) {
		var newId = message.count() + 1;
		var newlyAdded = message.insert({id: newId,
			createdBy: newMessage.createdBy,
			sentTo: newMessage.sentTo,
			isRead: 'F',
			messageContent: newMessage.messageContent});
		return newlyAdded;
	};

	x.prototype.getStudent = function (loggingStudent) {
		return person.find({username: loggingStudent.username, password: loggingStudent.password, isAdmin: 'F'});
	};

	x.prototype.getPersonById = function (personId) {
		return person.find({id: personId});
	};

	x.prototype.getPersonByUsername = function (username) {
		return person.find({username: username});
	};

	x.prototype.getAdmin = function (loggingAdmin) {
		return person.find({username: loggingAdmin.username, password: loggingAdmin.password, isAdmin: 'T'});
	};

	x.prototype.getStudents = function () {
		var allStudents = person.find({isAdmin: 'F'});
		allStudents.map(function(item, index) {
			item.password = 'XYX';
		});

		console.log(allStudents);

		return allStudents;
	};

	x.prototype.getStudentMessages = function (loggedinStudent) {
		console.log(loggedinStudent);
		return message.find({sentTo: loggedinStudent.id});
	};

	x.prototype.getMessage = function (currentMessage) {
		return message.find({id: currentMessage.id});
	};

	x.prototype.updateMessageToRead = function(readMessage) {
		var tempMessage = message.find({id: readMessage.id});
		tempMessage.isRead = 'T';
		message.update(tempMessage);
	};

	return x;
}());

var systemDAO = new SystemDAO();

// implement service layer
var bodyParser = require('body-parser');

var express = require('express');
var schoolMessagesSystemApp = express();
// parse application/x-www-form-urlencoded
schoolMessagesSystemApp.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
schoolMessagesSystemApp.use(bodyParser.json());

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
//console.log('awl ', bcrypt.hashSync('50000', 8));

var config = require('./config');

schoolMessagesSystemApp.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	next();
  });

  // to log-in a student
schoolMessagesSystemApp.post('/student', function (req, res) {
	if (!req.body.password) {
		console.log('no passed password');
		res.status(200).send({ auth: false, token: undefined, username: undefined, isAdmin : false });
		return;
	}  

	var foundPerson = systemDAO.getPersonByUsername(req.body.username);
	console.log('the foundPerson is ', foundPerson);
	if (!foundPerson || !foundPerson[0] ||foundPerson[0].isAdmin == true) {
		res.status(200).send({ auth: false, token: undefined, username: undefined, isAdmin : false });
		return;
	}

	foundPerson = foundPerson[0];
	console.log('found person', foundPerson);
	console.log('found person password is hashed', foundPerson.password);
	console.log('sent password', req.body.password);
	var result = bcrypt.compareSync(req.body.password, foundPerson.password);
	console.log('result is ', result);
	if (result == true) {
		var token = jwt.sign({ id: foundPerson.id }, config.secret, {expiresIn: 86400});
		console.log('FIRST');
		console.log('send found ', foundPerson.username);
		res.status(200).send({ auth: true, token: token, username: foundPerson.username, isAdmin : false });
	} else {
		console.log('NOTNOT found ');
		res.status(200).send({ auth: false, token: undefined, username: undefined, isAdmin : false });
	}
});

schoolMessagesSystemApp.post('/admin', function (req, res) {
	if (!req.body.password) {
		res.status(200).send({ auth: false, token: undefined, username: undefined, isAdmin : false });
		return;
	}  

	var hashedPassword = bcrypt.hashSync(req.body.password, 8);
	var loggedInAdmin = systemDAO.getAdmin({username: req.body.username, password: hashedPassword});
	
	
	if(loggedInAdmin) {
		var token = jwt.sign({ id: loggedInAdmin.id }, config.secret, {expiresIn: 86400});
		res.status(200).send({ auth: true, token: token, username: loggedInAdmin.username, isAdmin : true });
	} else {
		res.status(200).send({ auth: false, token: undefined, username: undefined, isAdmin : false });
	}  
});

schoolMessagesSystemApp.get('/studentMessages', function (req, res) {
	console.log('trying to read the message');
	var token = req.headers['x-access-token'];

	if (!token) return res.status(200).send({ auth: false, message: 'No token provided.' });
	console.log('after the return');
	jwt.verify(token, config.secret, function(err, decoded) {
	  if (err) {
		res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
	  } else {
		decoded = parseInt(decoded, 10);
		var foundPerson = systemDAO.getPersonById(decoded);
		if(foundPerson && foundPerson.isAdmin === 'F') {
			var messages = systemDAO.getStudentMessages({id:parseInt(req.query.studentId, 10)});
   			res.send(messages);
		} else {
			res.status(500).send({ auth: false, message: 'Unauthorized action.' });
		}
	  }
	});
});

schoolMessagesSystemApp.get('/message', function (req, res) {
	var token = req.headers['x-access-token'];
	if (!token) return res.status(200).send({ auth: false, message: 'No token provided.' });
	
	jwt.verify(token, config.secret, function(err, decoded) {
	  if (err) {
		res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
	  } else {
		decoded = parseInt(decoded, 10);
		var foundPerson = systemDAO.getPersonById(decoded);
		if(foundPerson && foundPerson.isAdmin === 'F') {
			console.log('the passed id is ', req.query.messageId);
			var message = systemDAO.getMessage({id: parseInt(req.query.messageId, 10)});
			console.log(message[0]);
			res.send(message);
		} else {
			res.status(500).send({ auth: false, message: 'Unauthorized action.' });
		}
	  }
	});
});

schoolMessagesSystemApp.post('/readMessage', function (req, res) {
	var token = req.headers['x-access-token'];
	if (!token) return res.status(200).send({ auth: false, message: 'No token provided.' });
	
	jwt.verify(token, config.secret, function(err, decoded) {
	  if (err) {
		res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
	  } else {
		decoded = parseInt(decoded, 10);
		var foundPerson = systemDAO.getPersonById(decoded);
		if(foundPerson && foundPerson.isAdmin === 'F') {
			systemDAO.updateMessageToRead({id: req.body.messageId});
			res.send({isError: false, message : 'A new Message Added successfully'});
		} else {
			res.status(500).send({ auth: false, message: 'Unauthorized action.' });
		}
	  }
	});
});

schoolMessagesSystemApp.get('/students', function (req, res) {
	var token = req.headers['x-access-token'];
	console.log('the token is ', token);
	if (!token) return res.status(200).send({ auth: false, message: 'No token provided.' });
	
	jwt.verify(token, config.secret, function(err, decoded) {
		console.log('in the verify');
	  if (err) {
		res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
	  } else {
		console.log('IN THE ELSE');
		console.log('before decoded ', decoded);
		decoded = parseInt(decoded, 10);
		console.log('decoded ', decoded);
		var foundPerson = systemDAO.getPersonById(decoded);
		if(foundPerson && foundPerson.isAdmin === 'T') {
			decodedconsole.log('foundPerson.isAdmin ', foundPerson.isAdmin);
			res.send(systemDAO.getStudents());
		} else {
			res.status(500).send({ auth: false, message: 'Unauthorized action.' });
		}
	  }
	});
});

schoolMessagesSystemApp.put('/student', function (req, res) {
	if(!req.body.username || !req.body.email || !req.body.name || !req.body.password) {
		console.log('insufficient data');
		res.status(200).send({ error: 'insufficient data' });
		return;
	} else {
		var foundPerson = systemDAO.getPersonByUsername(req.body.username);
		if(foundPerson.username) {
			console.log('FOUND ',foundPerson);
			res.status(200).send({ error: 'username exists' });
			return;
		}
	}
	
	var hashedPassword = bcrypt.hashSync(req.body.password, 8);
   var newlyAdded = systemDAO.addStudent({name: req.body.name, 
			username: req.body.username, 
			email: req.body.email, 
			password: hashedPassword});
		console.log('added', newlyAdded);
   //var token = jwt.sign({ id: newlyAdded.id }, config.secret, {expiresIn: 86400});
   if (newlyAdded) {
	res.status(200).send({ isError: false, message: 'success'});
   } else {
	res.status(200).send({ isError: true, message: 'failed to register new student'});
   }
   
});

schoolMessagesSystemApp.put('/message', function (req, res) {
	var token = req.headers['x-access-token'];
	if (!token) return res.status(200).send({ auth: false, message: 'No token provided.' });
	
	jwt.verify(token, config.secret, function(err, decoded) {
	  if (err) {
		res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
	  } else {
		decoded = parseInt(decoded, 10);
		var foundPerson = systemDAO.getPersonById(decoded);
		if(foundPerson && foundPerson.isAdmin === 'T') {
			var newlyAdded = systemDAO.addMessage({createdBy: decoded,
				sentTo: req.body.sentTo,
				isRead: 'F',
				messageContent: req.body.messageContent});
			   res.send(newlyAdded);
		} else {
			res.status(500).send({ auth: false, message: 'Unauthorized action.' });
		}
	  }
	});
});

schoolMessagesSystemApp.get('/me', function(req, res) {
	var token = req.headers['x-access-token'];
	if (!token) return res.status(200).send({ auth: false, message: 'No token provided.' });
	
	jwt.verify(token, config.secret, function(err, decoded) {
	  if (err) return res.status(200).send({ auth: false, message: 'Failed to authenticate token.' });
	  
	  res.status(200).send(decoded);
	});
  });

schoolMessagesSystemApp .get('/logout', function(req, res) {
	res.status(200).send({ auth: false, token: null });
});

var server = schoolMessagesSystemApp.listen(8083, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Example app listening at http://%s:%s", host, port)
});
