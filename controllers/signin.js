const MongoClient = require('mongodb').MongoClient;
const urlParse = { useNewUrlParser: true };

const handleSignin = (req, res, url, bcrypt) => {
	const { email, password } = req.body;

	if(!email || !password) {
		res.status(404).json('incorrect form submission')
	} else {
		getLoginCreds(url, email.toString(), (resp1) => {
			const passValid = bcrypt.compareSync(password.toString(), resp1.password);
			console.log(resp1);

			const db_email = resp1.email;
			const db_name = resp1.name;
			const db_id = resp1._id;
			console.log(db_id);

			isGod(url, db_id, (resp2) => {
				console.log("RESPONSE FROM GOD: ", resp2);
				const is_God = resp2 ? true: false;

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