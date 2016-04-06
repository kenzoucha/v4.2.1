var  subCategory = require('../models/subCategory');
var  Product = require('../models/Product');

function getAllProducts(req,res){
    Product.find(function(err, products) {
        if(!err) {
            return res.json(products);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s',res.statusCode,err.message);
            return res.json({ error: 'Server error' });
        }
    });
};

module.exports = function(router) {

    router
        .route('/product')
        .get(function (req, res) {
            getAllProducts(req, res);
        })
        .post(function (req, res) {
            if (!req.body.scat) {
                return res.send({status: 'error', message: 'Choisir une sous catégorie', scategory: {}});
            }
            subCategory
                .findOne({_id: req.body.scat}, '_id', function (error, scategoryId) {
                    console.log(scategoryId);
                    if (error) {
                        return res.send({status: 'success', message: 'sous categorie n\'existe pas', scategory: {}});
                    }
                    var product = new Product({
                        designation: req.body.designation,
                        description: req.body.description,
                        price: req.body.price,
                        fields: req.body.fields,
                        designation: req.body.designation,
                        _scategoryId: scategoryId
                    });
                    product.save(function (err, sc) {
                        console.log(sc);
                    })
                });
        });
    router
        .param('id', function (req, res, next) {
            req.dbQuery = {id: req.params.id};
            next();
        })
        .route('/product/:id')
        .get(function (req, res) {
            Product.findOne({_id: req.dbQuery.id}, function (err, product) {
                if (!product) {
                    res.statusCode = 404;
                    return res.json({error: 'Not found'});
                }

                if (!err) {
                    return res.json(product);
                } else {

                    res.statusCode = 500;
                    console.log('Internal error(%d): %s', res.statusCode, err.message);
                    return res.send({error: 'Server error'});
                }
            });
        })
        .put(function (req, res) {
            Product.findOne({_id: req.dbQuery.id}, function (err, product) {
                if (!product) {
                    res.statusCode = 404;
                    return res.json({error: 'Not found'});
                }
                if (!err) {
                    product.designation = req.body.designation;
                    product.description = req.body.description;
                    product.price = req.body.price;

                    product.save(function (err, product) {
                        if (!err) {
                            res.send(product);
                        } else {
                            console.log('error');
                        }
                    });
                } else {

                    res.statusCode = 500;
                    console.log('Internal error(%d): %s', res.statusCode, err.message);
                    return res.send({error: 'Server error'});
                }
            });
        })
        .delete(function (req, res) {
            Product.findOne({_id: req.dbQuery.id}, function (err, products) {
                if (!products) {
                    res.statusCode = 404;
                    return res.send({error: 'Not found'});
                }
                products.remove(function (err, product) {
                    if (!err) {
                        product.images.forEach(function (image) {
                            fs.unlinkSync(appRoot + '/public/assets/images/' + image.name);
                            return res.send({status: 'success', message: 'Le produit a bien été supprimé'});
                        })
                    } else {
                        res.statusCode = 500;
                        console.log('Internal error(%d): %s', res.statusCode, err.message);
                        return res.send({error: 'Server error'});
                    }
                })
            });
        });
}