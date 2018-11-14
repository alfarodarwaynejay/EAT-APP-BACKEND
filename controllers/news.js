const MongoClient = require('mongodb').MongoClient;
const urlParse = { useNewUrlParser: true };

const handleAddNews = (req, res, url) => {
	const { news } = req.body;

	if(!news) {
		res.status(404).json('incorrect form submission');
	} else {
		//adding news here:
		addNews(url, news, (resp) => {
			console.log('news added...');
			res.json('success');
		});
	}
	
}

const handleGetNews = (req, res, url) => {
	const { reqNews } = req.body;

	if(!reqNews) {
		res.status(404).json('incorrect form submission');
	} else {
		//getting news here:
		getNews(url, (resp) => {
			console.log('getting news...');
			res.json(resp.map(item => item.news));
		})
	}
}

const addNews = (url, data, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('News').insertOne({news: data}, (err, resp) => {
			if (err) throw err;
			callback(resp);
			db.close();
		})

	})
}

const getNews = (url, callback) => {
	MongoClient.connect(url, urlParse, (err, db) => {
		if (err) throw err;
		const database = db.db('EatDB');

		database.collection('News').find({}).toArray((err, resp) => {
			if (err) throw err;
			callback(resp);
			db.close();
		})

	})
}

module.exports = { handleAddNews, handleGetNews };