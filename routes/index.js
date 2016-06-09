var express = require('express');
var router = express.Router();
var api = require('../lib/api');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

/*
* Task 1:
* Make models alphabetically sortable (ascending, descending, default)
*/
router.get('/models', function(req, res, next) {
	// use api to get models and render output
    api.fetchModels().then(function(models) {
        if(req.query.sort) {
            return models.sort(function(a, b) {
                return req.query.sort == 'asc' ? a > b : b > a;
            });
        } else
            return models;
    }).then(function(models) {
        res.render('models', {models: models});
    }).catch(function(err) {
        res.send(500, err);
    });
});

/*
* Task 2:
* Make services filterable by type (repair, maintenance, cosmetic)
*/
router.get('/services', function(req, res, next) {
	// use api to get services and render output
	// use api to get models and render output
    api.fetchServices().then(function(services) {
        if(req.query.filter) {
            return services.filter(function(o) {
                return req.query.filter == o.type;
            });
        } else
            return services;
    }).then(function(services) {
        res.render('services', {services: services, filter: req.query.filter});
    }).catch(function(err) {
        res.send(500, err);
    });
});

/*
* Task 3:
* Bugfix: Something prevents reviews from being rendered
* Make reviews searchable (content and source)
*/
router.get('/reviews', function(req, res, next) {
	return Promise.all([api.fetchCustomerReviews(), api.fetchCorporateReviews()])
		.then(function(both) {
			// Combine output arrays
			return both[0].concat(both[1]);
		}).then(function(reviews) {
			if(req.query.search) {
				reviews = reviews.filter(function(o) {
					return o.content.indexOf(req.query.search) > -1 || o.source.indexOf(req.query.search) > -1;
				});
			}
		
			res.render('reviews', {reviews: reviews});
		});
});

module.exports = router;
