const MongoClient = require('mongodb').MongoClient;
const urlParse = { useNewUrlParser: true };

const handleStats = (req, res, url) => {
	const { emp_id } = req.body;

	if (!emp_id) {
		res.status(404).json('invalid form submission');
	} else {
		getStat(url, emp_id, (resp) => {
			if (resp.stats.length === 0) {
				res.json('no stats yet');
			} else {
				res.json('success');
			}
		})
	}
}

const getStat = (url, id, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('EmployeeInfo')
			.findOne({_id: id}, {projection: {_id:0, stats: 1}}, 
				(err, resp) => {
					if (err) throw err;
					console.log('Getting stats...');
					callback(resp);
					db.close();
			});
	});
};

module.exports = { handleStats };