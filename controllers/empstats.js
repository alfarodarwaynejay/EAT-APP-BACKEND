const MongoClient = require('mongodb').MongoClient;
const urlParse = { useNewUrlParser: true };

const handleEmpStats = (req, res, url) => {
	const { get } = req.body;

	if (!get) {
		res.status(404).json('invalid form submission');
		return;
	} else {
		getEmpStat(url, (resp) => {
			if (resp.length === 0) {
				res.json({ status: 'falied' })
			} else {
				res.json({ status: 'success', list: resp})
			}
		})
	}
}

const getEmpStat = (url, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

	
		database.collection('EmployeeInfo')
			.find({},{projection: {_id:1, stats: 1, position: 1, name: 1, profile: 1, team: 1}})
			.toArray((err, resp) => {
					if (err) throw err;
					console.log('Getting employee stats...');
					callback(resp);
					db.close();
			});

	});
};

module.exports = { handleEmpStats };
