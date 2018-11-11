const MongoClient = require('mongodb').MongoClient;
const urlParse = { useNewUrlParser: true };

const handleSetSchedule = (req, res, url) => {
	const { start, end } = req.body;

	if(!start || !end) {
		res.status(404).json('incorrect form submission')
	} else {
		//setting schedule here:
		updateSchedule(url, { start, end }, (resp) => {
			console.log('schedule set...');
			res.json(resp);
		})
	}
	
}

const handleGetSchedule = (req, res, url) => {
	const { getSched } = req.body;

	if (!getSched) {
		res.status(404).json('incorrect form submission');
	} else {
		//getting schedule here:
		getSchedule(url, (resp) => {
			console.log('getting schedule...');
			res.json(resp);
		})
	}
}


const updateSchedule = (url, data, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('Schedule').updateOne(
			{_id: 1},
			{$set: {start: data.start, end: data.end }},
			(err, resp) => {
				if (err) throw err;
				console.log('Updating Schedule: ');
				callback(resp);
				db.close();
		})

	})
}

const getSchedule = (url, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('Schedule').findOne({},{projection: {_id:0}},(err, resp) => {
			if (err) throw err;
			console.log('Updating Schedule: ');
			callback(resp);
			db.close();
		})

	})
}


module.exports = { handleSetSchedule, handleGetSchedule };