const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const url = 'mongodb+srv://darwayne:12345@eatcluster-x5wew.mongodb.net/test?retryWrites=true';

const MongoClient = require('mongodb').MongoClient;
const urlParse = { useNewUrlParser: true };


//import controllers
const signin 	= require('./controllers/signin.js');
const register 	= require('./controllers/register.js');
const employee 	= require('./controllers/employee.js');
const news 		= require('./controllers/news.js');
const schedule 	= require('./controllers/schedule.js');
const team 		= require('./controllers/team.js');
const evaluate 	= require('./controllers/evaluate.js');
const stats 	= require('./controllers/stats.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());

//root end-point
app.get('/', (req, res) => {
	res.send('Nag-andar ang server...pero wala xa gibuhat');
});

//end-points call
app.post('/signin', 	(req, res) => {signin.handleSignin(req, res, url, bcrypt)});
app.put('/register', 	(req, res) => {register.handleRegister(req, res, url, bcrypt)});
app.put('/add', 		(req, res) => {employee.handleAddEmployee(req, res, url)});
app.put('/delete', 		(req, res) => {employee.handleDeleteEmployee(req, res, url)});
app.put('/promote', 	(req, res) => {employee.handlePromoteEmployee(req, res, url)});
app.put('/news', 		(req, res) => {news.handleAddNews(req, res, url)});
app.post('/getnews', 	(req, res) => {news.handleGetNews(req, res, url)});
app.put('/setschedule', (req, res) => {schedule.handleSetSchedule(req, res, url)});
app.post('/getschedule',(req, res) => {schedule.handleGetSchedule(req, res, url)});
app.post('/team',		(req, res) => {team.handleTeam(req, res, url)});
app.put('/evaluate', 	(req, res) => {evaluate.handleEvaluate(req, res, url)});
app.post('/stats', 	(req, res) => {stats.handleStats(req, res, url)});


app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT||3000}`);
});

// const obj = [
//   {
//   	name: 'ervin', 
//   	email: 'ervin@gmail.com',
//   	position: 'SD', 
//   	_id: 1234567,
//   	team: 'alpha',
// 		stats: [],
//   	hasEvaluated: []
//   },

//   {
//   	name: 'monica', 
//   	email: 'monica@gmail.com', 
//   	position: 'TL', 
//   	_id: 1234568,
//   	team: 'alpha',
// 		stats: [],
//   	hasEvaluated: []
//   },

//   {
//   	name: 'ernesto', 
//   	email: 'ernesto@gmail.com', 
//   	position: 'SM', 
//   	_id: 1234569,
//   	team: 'alpha',
// 		stats: [],
//   	hasEvaluated: []
//   },

//   {
//   	name: 'jeane', 
//   	email: 'jeane@gmail.com', 
//   	position: 'IA', 
//   	_id: 1234560,
//   	team: 'alpha',
// 		stats: [],
//   	hasEvaluated: []
//   },

//   {
//   	name: 'lyndon', 
//   	email: 'aramina@gmail.com', 
//   	position: 'UX', 
//   	_id: 1234561,
//   	team: 'alpha',
// 		stats: [],
//   	hasEvaluated: []
//   },

//   {
//   	name: 'mauro', 
//   	email: 'mauro@gmail.com', 
//   	position: 'UI', 
//   	_id: 1234562,
//   	team: 'alpha',
// 		stats: [],
//   	hasEvaluated: []
//   },

//   {
//   	name: 'fillipo', 
//   	email: 'fillipo@gmail.com', 
//   	position: 'QA', 
//   	_id: 1234563,
//   	team: 'alpha',
// 		stats: [],
//   	hasEvaluated: []
//   },

//   {
//   	name: 'goku', 
//   	email: 'sangoku@gmail.com', 
//   	position: 'BE', 
//   	_id: 1234564,
//   	team: 'alpha',
// 		stats: [],
//   	hasEvaluated: []
//   },

//   {
//   	name: 'naruto', 
//   	email: 'naruto@gmail.com', 
//   	position: 'PM', 
//   	_id: 1234565,
//   	team: 'alpha',
// 		stats: [],
//   	hasEvaluated: []
//   },

//   {
//   	name: 'neo anderson', 
//   	email: 'matrix@gmail.com', 
//   	position: 'JD', 
//   	_id: 1234566,
//   	team: 'alpha',
// 		stats: [],
//   	hasEvaluated: []
//   },
// ];
// const hash = bcrypt.hashSync('9999999');
// const employeeobj = {  name: 'admin', email: 'admin@gmail.com', password: hash, _id: 9999999 };

// const addLogin = (url, data, callback) => {
// 	MongoClient.connect(url, urlParse, (err, db) => {
// 		if (err) throw err;
// 		const database = db.db('EatDB');

// 		database.collection('Logins').insertOne(data, (err, resp) => {
// 			if (err) throw err;
// 			callback(resp);
// 			db.close();
// 		})

// 	})
// };

// addLogin(url, employeeobj, (resp)=>console.log(resp));

console.log(`\n\n\n\n`)