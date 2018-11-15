const MongoClient = require('mongodb').MongoClient;
const urlParse = { useNewUrlParser: true };


const handleEmpList = (req, res, url) => {
	const { get } = req.body;

	if(!get) {
		res.status(404).json('incorrect form submission')
	} else {
		MongoClient.connect(url, urlParse, (err, db) => {
			if (err) throw err;
			const database = db.db('EatDB');

			database.collection('Employees').find({}).toArray((err, resp) => {
				if (err) throw err;
				
				console.log(resp)
				const toClient = resp.map(item => ({ employee_id: item._id }))

				res.json(toClient);
				db.close();
			});
		});
	}
	
}

module.exports = { handleEmpList };