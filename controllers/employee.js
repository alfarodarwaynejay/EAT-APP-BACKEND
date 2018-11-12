const MongoClient = require('mongodb').MongoClient;
const urlParse = { useNewUrlParser: true };

const handleAddEmployee = (req, res, url) => {
	const { employee_id } = req.body;

	if(!employee_id) {
		res.status(404).json('incorrect form submission')
	} else {
		isEmployee(url, employee_id, (resp) => {
			if (!resp) {
				//can add
				console.log('id not found...adding!')
				addToEmployee(url, employee_id, (resp) => {
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
	const { id, flag } = req.body;

	if((!id || !flag) && flag !== 'del') {
		res.status(404).json('incorrect form submission')
	} else {
		isEmployee(url, id, (resp) => {
			if (resp._id === employee_id) {
				//can delete
				deleteEntry(url, employee_id, () => {
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
	const { id, position, flag } = req.body;

	if (!id || !position || !flag) {
		res.status(404).json('incorrect form submission');
	} else {
		promoteEmployee(url, id, position, (resp) => {
			console.log("Promoted Employee...");
			if(resp.matchedCount == 0) {
				res.json('failed')
			} else {
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

		database.collection('Employees').insertOne({_id: data}, (err, resp) => {
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
	deleteFromEmployeeInfo(url, info);
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

