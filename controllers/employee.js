const MongoClient = require('mongodb').MongoClient;
const urlParse = { useNewUrlParser: true };

const handleAddEmployee = (req, res, url) => {
	const { emp_id } = req.body;

	if(!emp_id) {
		res.status(404).json('incorrect form submission')
	} else {
		isEmployee(url, emp_id, (resp) => {
			if (resp !== null) {
				//can add
				console.log('id not found...adding!')
				addToEmployee(url, emp_id, (resp) => {
					console.log('employee added');
					res.json('success');
				})
			} else {
				res.status(404).json('employee already exist');
			}
		});
	}
	
}

const handleDeleteEmployee = (req, res, url) => {
	const { id } = req.body;

	if(!id) {
		res.status(404).json('incorrect form submission')
	} else {
		isEmployee(url, id, (resp) => {
			console.log(resp)
			if (resp !== null) {
				//can delete
				deleteEntry(url, id, () => {
					console.log('|--> User Deleted')
					res.json('success')
				})
				
			} else {
				res.status(404).json('id not found');
			}
		});
	}
	
}

const handlePromoteEmployee = (req, res, url) => {
	const { id, position } = req.body;
	console.log(req.body);

	if (!id || !position) {
		res.status(404).json('incorrect form submission');
	} else {
		promoteEmployee(url, id, position, (resp) => {
			
			if(resp.matchedCount == 0) {
				console.log("Employee not promoted...");
				res.json('failed')
			} else {
				console.log("Employee promoted...");
				res.json('success');
			}
			
		})
	}
}

const isEmployee = (url, data, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('Employees').findOne({_id: data}, 
			(err, resp) => {
				if (err) throw err;
				callback(resp)
				db.close();
		})
	})
}

const addToEmployee = (url, data, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('Employees').insertOne({_id: parseInt(data)}, (err, resp) => {
			if (err) throw err;
			console.log('From Employees: ', resp);
			callback(resp);
			db.close();
		})

	})
}

const promoteEmployee = (url, query, data, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('EmployeeInfo').updateOne({_id: query}, {$set: {position: data}},(err, resp) => {
			if (err) throw err;
			console.log('Promoting Employee');
			callback(resp);
			db.close();
		})

	})
}

const deleteEntry = (url, data, callback) => {
	deleteFromEmployee(url, data);
	deleteFromLogins(url, data);
	deleteFromEmployeeInfo(url, data);
	callback();
}

const deleteFromEmployee = (url, data) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('Employees').deleteOne({_id: data}, (err, resp) => {
			if (err) throw err;
			console.log('Deleting from Employees: ', resp);
			db.close();
		})

	})
}

const deleteFromLogins = (url, data) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('Logins').deleteOne({_id: data}, (err, resp) => {
			if (err) throw err;
			console.log('Deleting from Logins: ', resp);
			db.close();
		})

	})
}

const deleteFromEmployeeInfo = (url, data) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('EmployeeInfo').deleteOne({_id: data}, (err, resp) => {
			if (err) throw err;
			console.log('Deleting from EmployeeInfo: ', resp);
			db.close();
		})

	})
}

module.exports = { handleAddEmployee, handleDeleteEmployee, handlePromoteEmployee };

