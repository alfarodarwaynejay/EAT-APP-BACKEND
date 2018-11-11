const MongoClient = require('mongodb').MongoClient;
const urlParse = { useNewUrlParser: true };

const handleEvaluate = (req, res, url) => {
	const { emp_id, score } = req.body;

	console.log(typeof score[0]);

	if (!emp_id || !score ) {
		res.status(404).json('invalid form submission');
	} else {
		setStat(url, emp_id, score, (resp) => {
			if (resp.modifiedCount === 0) {
				res.json('update failed');
			} else {
				res.json('success');
			}
		});
	}
}

const setStat = (url, id, score, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('EmployeeInfo')
			.updateOne({_id: id}, {$push: { stats: score }}, 
				(err, resp) => {
					if (err) throw err;
					console.log('Pushing score...');
					callback(resp);
					db.close();
			});
	});
};

module.exports = { handleEvaluate };