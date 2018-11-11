const MongoClient = require('mongodb').MongoClient;
const urlParse = { useNewUrlParser: true };

const handleSignin = (req, res, url, bcrypt) => {
	const { email, password } = req.body;

	if(!email || !password) {
		res.status(404).json('incorrect form submission')
	} else {
		getLoginCreds(url, email, (resp) => {
			const passValid = bcrypt.compareSync(password, resp.password);
			if (passValid && email === resp.email) {
				res.json('correct');
			} else {
				res.status(404).json('wrong')
			}
		})
		
	}
	
}

const getLoginCreds = (url, data, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');
		database.collection('Logins').findOne({email: data}, {projection: {_id:0, email:1, password: 1}}, 
			(err, resp) => {
				if (err) throw err;
				callback(resp)
				db.close();
		})
	})
}

module.exports = { handleSignin };