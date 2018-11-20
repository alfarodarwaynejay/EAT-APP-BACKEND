const MongoClient = require('mongodb').MongoClient;
const urlParse = { useNewUrlParser: true };

const handleRegister = (req, res, url, bcrypt) => {
	const { name, employee_id, email, password } = req.body;

	if(!name || !employee_id || !email || !password) {
		res.status(404).json('incorrect form submission');
		return;
	} else {
		isEmployee(url, employee_id, (resp) => {
			console.log(resp)

			if (!!resp) {
				// this only triggers when employee id is found in the DB
				console.log('id found');
				const hash = bcrypt.hashSync(password);
				const employee = {  name: name, email: email, password: hash, _id: parseInt(employee_id)};
				addLogin(url, employee, (resp) => {
					console.log('Adding to Logins...');
				});
				addEmployeeInfo(url, name, employee_id, email, (resp) => {
					console.log('Adding to EmployeeInfo...')
				});
					res.json('success');
			} else {
				res.status(404).json('failed');
			}
		});
	}
	
}

const isEmployee = (url, data, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('Employees').findOne({_id: parseInt(data)}, 
			(err, resp) => {
				if (err) throw err;
				callback(resp)
				db.close();
		})
	})
}

const addLogin = (url, data, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('Logins').insertOne(data, (err, resp) => {
			if (err) throw err;
			callback(resp);
			db.close();
		})

	})
}

const addEmployeeInfo = (url, name, emp_id, email, callback) => {
	const obj = {
	  	name: name, 
	  	profile: '',
	  	email: email,
	  	position: 'JD', 
	  	_id: parseInt(emp_id),
	  	team: 'intern',
		stats: [],
	  	hasEvaluated: []
  	}

  	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('EmployeeInfo').insertOne(obj, (err, resp) => {
			if (err) throw err;
			callback(resp)
			db.close();
		})
	})
}

module.exports = { handleRegister };