const express = require('express');
const app = express(); 
const mongoose = require('mongoose');
const User = require('./users');



mongoose.connect(
	'mongodb://0.0.0.0:27017/pagination', 
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

const db = mongoose.connection;
db.once('open', async () => {
	if(await User.countDocuments().exec() > 0){
		return;
	}

	Promise.all([
		User.create({
			name: 'User 1',
		}),
		User.create({
			name: 'User 2',
		}),
		User.create({
			name: 'User 3',
		}),
		User.create({
			name: 'User 4',
		}),
		User.create({
			name: 'User 5',
		}),
		User.create({
			name: 'User 6',
		}),
		User.create({
			name: 'User 7',
		}),
		User.create({
			name: 'User 8',
		}),
		User.create({
			name: 'User 9',
		}),
		User.create({
			name: 'User 10',
		}),
		User.create({
			name: 'User 11',
		}),
		User.create({
			name: 'User 12',
		}),
		User.create({
			name: 'User 13',
		}),
	]).then(() => {
		console.log('Added Users');
	});
});

app.get('/users', paginatedResults(User), (req, res) => {

	res.header('Access-Control-Allow-Origin', '*');
	res.sendFile(__dirname + '/index.html');
});

app.listen(3000);

function paginatedResults(model){
	return async (req, res, next) => {
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);

		const results = {};

		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		if(endIndex < await model.countDocuments().exec()){
			results.next = {
				page: page + 1,
				limit: limit,
			};
		}

		if(startIndex > 0){
			results.previous = {
				page: page - 1,
				limit: limit,
			};
		}

		try{
			results.results = await model
				.find()
				.limit(limit)
				.skip(startIndex)
				.exec();
			next();
			res.paginatedResults = results;
		} catch (e){
			console.log(res.status(500).json(
					{
						message: e.message,
					}
				));
		}
	};
}


/*

app.get('/users', (req, res) => {
  const resultsIterator = paginatedResults(User);
  const page = parseInt(req.query.page) || 1;

  // Advance the iterator until we reach the desired page
  for (let i = 1; i < page; i++) {
    resultsIterator.next();
  }

  const { value, done } = resultsIterator.next();
  if (done) {
    res.status(404).json({ message: 'Page not found' });
  } else {
    res.json({
      page: value.page,
      limit: value.limit,
      results: value.results
    });
  }
});


*/

/*

function* paginatedResults(model) {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  if (endIndex < yield model.countDocuments().exec()) {
    yield { page: page + 1, limit: limit };
  }

  if (startIndex > 0) {
    yield { page: page - 1, limit: limit };
  }

  const results = yield model
    .find()
    .limit(limit)
    .skip(startIndex)
    .exec();

  return results;
}

*/