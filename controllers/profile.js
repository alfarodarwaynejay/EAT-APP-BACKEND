const MongoClient = require('mongodb').MongoClient;
const urlParse = { useNewUrlParser: true };


const handleProfile = (req, res, url) => {
	const { user_id, img_src } = req.body;

	if(!user_id || !img_src) {
		res.status(404).json('incorrect form submission')
	} else {
		MongoClient.connect(url, urlParse, (err, db) => {
			if (err) throw err;
			const database = db.db('EatDB');

			database.collection('EmployeeInfo')
				.updateOne({_id: user_id}, {$set: { profile: img_src }}, (err, resp) => {
						if (err) throw err;

						console.log('Request has modified: ', resp.modifiedCount)

						if(resp.modifiedCount !== 0) {
							res.json('success');
							console.log('Profile Updated...');
						} else {
							res.json('failed')
						}
						db.close();
				});
		});
	}
	
}

module.exports = { handleProfile };