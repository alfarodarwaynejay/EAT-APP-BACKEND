const MongoClient = require('mongodb').MongoClient;
const urlParse = { useNewUrlParser: true };

const handleSignin = (req, res, url, bcrypt) => {
	const { email, password } = req.body;

	if(!email || !password) {
		res.status(404).json('incorrect form submission')
	} else {
		getLoginCreds(url, email.toString(), (resp) => {
			const passValid = bcrypt.compareSync(password.toString(), resp.password);
			console.log(resp);

			const db_email = resp.email;
			const db_name = resp.name;
			const db_id = resp._id;
			console.log(db_id);

			isGod(url, db_id, (resp) => {
				console.log("RESPONSE FROM GOD: ", resp);
				const is_God = resp ? true: false;

				if (passValid && email === db_email) {
					res.json({
						status: 'correct',
						employee_id: db_id,
						name: db_name,
						email: db_email,
						isGod: is_God
					});
				} else {
					res.status(404).json({status: 'wrong'});
				}
			})
		})
		
	}
	
}

const getLoginCreds = (url, data, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');
		database.collection('Logins').findOne({email: data}, 
			(err, resp) => {
				if (err) throw err;
				callback(resp)
				db.close();
		})
	});
};

const isGod = (url, data, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');
		database.collection('Admin').findOne({_id: data}, 
			(err, resp) => {
				console.log("Inside god: ", resp);
				if (err) throw err;
				callback(resp)
				db.close();
		})
	});
};

module.exports = { handleSignin };