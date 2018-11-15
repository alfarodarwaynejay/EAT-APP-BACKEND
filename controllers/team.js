const MongoClient = require('mongodb').MongoClient;
const urlParse = { useNewUrlParser: true };

const handleTeam = (req, res, url) => {
	const { emp_id } = req.body; //team is removed....
	console.log(typeof emp_id);

	if(!emp_id) {
		res.status(404).json('incorrect form submission');
	} else {

		isGod(url, emp_id, (resp1) => {
			const is_God = resp1 ? true: false;
			//looking for teammates already evaluated
			getTeam(url, emp_id, (resp2) => { 
					

				if (is_God) {
					populateTeam( url, {}, (resp3) => {
						const toClient = resp3.map( item => {
							const { _id, ...others } = item;
							 return { ...others, employee_id: _id };
						});

						console.log(resp3.length)
						res.json(toClient);
					})
				} else {

					if(resp2.length === 0) {
						res.json('failed');
					} else {
						const userSearch = {team: resp2[0].team, _id: { $nin: resp2[0].hasEvaluated.map(item => parseInt(item))}}

						populateTeam( url, userSearch, (resp3) => {
							const toClient = resp3.map( item => {
								const { _id, ...others } = item; 
								return { ...others, employee_id: _id };
							});

							console.log(resp3.length)
							res.json(toClient);
							
						})
					}	
				}
			});
		})
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

const populateTeam = (url, data, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('EmployeeInfo')
			.find(data, {projection: {_id: 1, name: 1, email: 1, position: 1, team: 1}})
			.toArray((err, resp) => {
				if (err) throw err;
				console.log('Populating team...');
				callback(resp);
				db.close();
			})
	})
}

const isGod = (url, data, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');
		database.collection('Admin').findOne({_id: data}, 
			(err, resp) => {
				console.log("Inside god: ", resp);
				if (err) throw err;
				callback(resp)
				db.close();
		})
	});
};

module.exports = { handleTeam };

