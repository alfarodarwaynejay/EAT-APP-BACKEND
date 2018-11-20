const MongoClient = require('mongodb').MongoClient;
const urlParse = { useNewUrlParser: true };


const handleEmplist = (req, res, url) => {
	const { get } = req.body;

	if(!get) {
		res.status(404).json('incorrect form submission');
		return;
	} else {
		MongoClient.connect(url, urlParse, (err, db) => {
			if (err) throw err;
			const database = db.db('EatDB');

			database.collection('EmployeeInfo')
				.find({}, {projection: {_id: 1, name: 1, email: 1, position: 1, team: 1}}).toArray( (err, resp) => {
						if (err) throw err;

						console.log(resp)

						res.json(resp)
						console.log('Getting Employees...');
						
						db.close();
				});
		});
	}
	
}

module.exports = { handleEmplist };