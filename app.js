const express = require('express');

let app = express();

let storeService = require('./lib/storeService.js');
let bodyParser = require('body-parser');

// set up handlebars view engine
let handlebars = require('express-handlebars')
	.create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('body-parser').json());

app.get('/', function(req, res) {
	res.render('home');
});

app.get('/viewStores', function(req, res){
	storeService.getAllStores().then(function(results){
		res.render('store', {stores:results});
	});
});

let stres; // Used for McHackery becuase this is doing something wierd
app.get('/viewStore/:id', function(req, res){
		storeService.getStoresbyId(req.params.id).then(function(result){
			if(result.length > 0)
			{
				stres = result;
			}
			res.render('storedetail', {store:stres[0]});
		});
});

app.post('/saveStore/:id', function(req, res) {
	storeService.updateStore(req.body, req.params.id).then(function(result) {
		res.redirect('/viewStore/'+req.params.id);
	})
});

app.post('/saveStore', function(req, res) {
	storeService.saveStore(req.body).then(function(result){
		res.redirect('/viewStores');
	});
});

app.get('/itemSearch', function(req, res) {
	res.render('itemsearch', {stores:{}, itemSearched:""});
});

app.post('/search', function(req, res) {
	storeService.itemSearch(req.body).then(function(results) {
			res.render('itemsearch', {stores:results, itemSearched:req.body.name});
	});
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
  console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});
