const MongoClient = require('mongodb').MongoClient;
const urlParse = { useNewUrlParser: true };

const handleEvaluate = (req, res, url) => {
	const { emp_id_evaluator, emp_id_evaluated, score } = req.body;

	console.log(typeof score[0]);

	if (!emp_id_evaluator || !emp_id_evaluated || !score ) {
		res.status(404).json('invalid form submission');
	} else {
		setStat(url, emp_id_evaluated, score, (resp) => {
			if (resp.modifiedCount === 0) {
				res.json('update failed');
			}
		});
		setHasEvaluated(url, emp_id_evaluator, emp_id_evaluated, (resp) => {
			console.log(resp.modifiedCount)
			if (resp.modifiedCount === 0) {
				res.json('update failed');
			}
		});
		res.json('success');
	}
}

const setStat = (url, emp_id_evaluated, score, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('EmployeeInfo')
			.updateOne({_id: emp_id_evaluated}, {$push: { stats: score }}, 
				(err, resp) => {
					if (err) throw err;
					console.log('Pushing score...');
					callback(resp);
					db.close();
			});
	});
};

const setHasEvaluated = (url, emp_id_evaluator, emp_id_evaluated, callback) => {
		MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('EmployeeInfo')
			.updateOne({_id: emp_id_evaluator}, {$push: { hasEvaluated: emp_id_evaluated }}, 
				(err, resp) => {
					if (err) throw err;
					console.log('Pushing score...');
					callback(resp);
					db.close();
			});
	});
}

module.exports = { handleEvaluate };