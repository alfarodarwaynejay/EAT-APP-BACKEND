const MongoClient = require('mongodb').MongoClient;
const urlParse = { useNewUrlParser: true };

const handleEvaluate = (req, res, url) => {
	const { evaluator, evaluated, score } = req.body;

	console.log(typeof score[0]);

	if (!evaluator || !evaluated || !score ) {
		res.status(404).json('invalid form submission');
		return;
	} else {
		setStat(url, evaluated, score, (resp) => {
			if (resp.modifiedCount === 0) {
				res.json('failed');
			}
		});
		setHasEvaluated(url, evaluator, evaluated, (resp) => {
			console.log(resp.modifiedCount)
			if (resp.modifiedCount === 0) {
				res.json('failed');
			}
		});
		res.json('success');
	}
}

const setStat = (url, evaluated, score, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('EmployeeInfo')
			.updateOne({_id: evaluated}, {$push: { stats: score }}, 
				(err, resp) => {
					if (err) throw err;
					console.log('Pushing score...');
					callback(resp);
					db.close();
			});
	});
};

const setHasEvaluated = (url, evaluator, evaluated, callback) => {
		MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('EmployeeInfo')
			.updateOne({_id: evaluator}, {$push: { hasEvaluated: evaluated }}, 
				(err, resp) => {
					if (err) throw err;
					console.log('Pushing score...');
					callback(resp);
					db.close();
			});
	});
}

module.exports = { handleEvaluate };