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

						console.log(resp)

						res.json(resp)
						console.log('Updating profile...');
						
						db.close();
				});
		});
	}
	
}

module.exports = { handleProfile };