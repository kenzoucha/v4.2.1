var subCategory = require('../models/subCategory');

module.exports = function(router) {
    router
        .route('/scategory')
        .get(function (req, res) {
            subCategory
                .find()
                .populate({
                    path: '_categoryId',
                    select: 'designation'
                })
                .exec(function (error, subCats) {
                    if (error) {
                        console.log('Error: ' + error);
                    } else {
                        res.send(subCats);
                    }
                });
        })
        .post(function (req, res) {
            var fields = {'category': '', 'designation': '', 'description': ''};
            if (!req.body.category[0]) {
                return res.send({status: 'error', message: 'Choisir une catégorie', scategory: {}});
            }
            Category
                .findOne({_id: req.body.category[0]}, '_id', function (error, categoryId) {
                    if (error) {
                        return res.send({status: 'success', message: 'Categorie n\'existe pas', scategory: {}});
                    }
                    var subCat = new subCategory({
                        designation: req.body.designation[0],
                        description: req.body.description[0]
                    });
                    subCat._categoryId = categoryId;
                    _.forIn(req.body, function (value, key) {
                        if (!_.hasIn(fields, key)) {
                            var o = Object.create(null);
                            console.log(value);
                            o[key] = value;
                            subCat.fields.push(o);
                        }
                    });
                    subCat.save(function (err, sCat) {
                        if (!err) {
                            subCategory
                                .findOne(sCat)
                                .populate({
                                    path: '_categoryId',
                                    select: 'designation'
                                })
                                .exec(function (er, scat) {
                                    console.log(scat);
                                    if (er) {
                                        console.log('Error: ' + er);
                                    } else {
                                        res.send({
                                            status: 'success',
                                            message: 'sous catégorie ajouter avec succès',
                                            scategory: scat
                                        });
                                    }
                                });
                        } else {
                            res.send({status: 'error', message: 'Impossible d\'ajouter cette scatégorie'});
                        }
                    });
                });
        });
    router
        .param('id', function (req, res, next) {
            req.dbQuery = {id: req.params.id};
            next();
        })
        .route('/scategory/:id')
        .get(function (req, res) {
            subCategory.findOne({_id: req.dbQuery.id}, function (err, pc) {
                if (!pc) {
                    res.statusCode = 404;
                    return res.json({error: 'Not found'});
                }

                if (!err) {
                    return res.json(pc);
                } else {

                    res.statusCode = 500;
                    console.log('Internal error(%d): %s', res.statusCode, err.message);
                    return res.send({error: 'Server error'});
                }
            });
        })
        .put(function (req, res) {
            subCategory.findOne({_id: req.dbQuery.id}, function (err, scategory) {
                if (!scategory) {
                    return res.send({status: 'error', message: 'sous catégorie n\'existe pas'});
                }
                else {
                    scategory._categoryId = req.body.category[0];
                    scategory.designation = req.body.designation[0];
                    scategory.description = req.body.description[0];
                    scategory.save(function (err, scat) {
                        if (!err) {
                            subCategory
                                .findOne(scat)
                                .populate('_categoryId', 'designation')
                                .exec(function (error, subCat) {
                                    if (error) {
                                        console.log('Error: ' + error);
                                    } else {
                                        res.send({
                                            status: 'success',
                                            message: 'sous categorie modifié avec succès',
                                            scat: subCat
                                        })
                                    }
                                });
                        } else {
                            console.log(err);
                            return false;
                        }
                    });
                }

            });
        })
        .delete(function (req, res) {
            subCategory.findOne({_id: req.dbQuery.id}, function (err, scategory) {
                if (scategory.products.length != 0) {
                    return res.send({status: 'error', message: 'Impossible de supprimer la sous catégorie'});
                }
                if (!scategory) {
                    return res.send({status: 'error', message: 'la sous catégorie n\'existe pas'});
                } else {
                    scategory.remove(function (err) {
                        if (!err) {
                            return res.send({status: 'success', message: 'La sous categorie a bien été supprimé'});
                        } else {
                            return res.send({status: 'error', message: 'Impossible de suppriumer la sous catégorie'});
                        }
                    })
                }
            });

        });
}