const MongoClient = require('mongodb').MongoClient;
const urlParse = { useNewUrlParser: true };

const handleTeam = (req, res, url) => {
	const { emp_id } = req.body; //team is removed....
	console.log(typeof emp_id);

	if(!emp_id) {
		res.status(404).json('incorrect form submission');
	} else {

		//looking for teammates already evaluated
		getTeam(url, emp_id, (resp) => { 
			if(resp.length === 0) {
				res.json('failed');
			} else {
				populateTeam( url, resp[0].team, resp[0].hasEvaluated, (resp2) => {
					const toClient = resp2.map( item => {const { _id, ...others } = item; return { ...others, employee_id: _id };})
					console.log(resp2.length)
					res.json(toClient);
				})
			}
		});
	}	
}



const getTeam = (url, id, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('EmployeeInfo')
			.find({_id: id}, {projection: { hasEvaluated: 1, team: 1 }} )
			.toArray((err, resp) => {
				if (err) throw err;
				console.log('Getting Team...');
				callback(resp);
				db.close();
			})
	})
}

const populateTeam = (url, data, filter, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('EmployeeInfo')
			.find(
				{team: data, _id: { $nin: filter.map(item => parseInt(item))}}, 
				{projection: {_id: 1, name: 1, email: 1, position: 1}})
			.toArray((err, resp) => {
				if (err) throw err;
				console.log('Populating team...');
				callback(resp);
				db.close();
			})
	})
}

module.exports = { handleTeam };

