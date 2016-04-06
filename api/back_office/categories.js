var Category = require('../models/Category');

module.exports = function(router){

router
    .route('/cats')
    .get(function(req, res){
        Category
            .find()
            .populate({
                path: 'subCats',
                select: 'designation fields'
            })
            .exec(function(error, Cats){
                if(error){
                    console.log('Error: ' + error);
                }else{
                    res.json(Cats);
                }
            });
    });

router
    .route('/category')
    .get(function (req,res) {
        Category
            .find()
            .populate('subCats')
            .exec(function(err, categories){
                if(err) {
                    console.log('Error: ' + err);
                }else{
                    return res.send(categories);
                }
            })
    })
    .post(function (req, res) {

        var category = new Category({
            designation: req.body.designation,
            description: req.body.description
        });
        category.save(function(err, cat){
            if(!err){
                res.send({status: 'success', message: 'Categorie ajouter avec succès', cat:cat})
            }
            else{
                res.send({status: 'error', message: 'Impossible d\'ajouter cette catégorie'});
            }
        });
    });

router
    .param('id', function(req, res, next){
        req.dbQuery = {id: req.params.id};
        next();
    })
    .route('/category/:id')
    .get(function (req, res) {
        Category.findOne({_id:req.dbQuery.id}, function(err, pc) {
            if(!pc) {
                res.statusCode = 404;
                return res.json({ error: 'Not found' });
            }

            if(!err) {
                return res.json(pc);
            } else {

                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error' });
            }
        });
    })
    .put(function(req, res){
        Category.findOne({_id:req.dbQuery.id}, function(error, category) {
            if(!category) {
                return res.send({status: 'error', message: 'Catégorie n\'existe pas'});
            }
            else{
                category.designation = req.body.designation;
                category.description = req.body.description;
                category.save(function(err, cat){
                    if(!err){
                        res.send({status: 'success', message: 'Categorie modifié avec succès', cat:cat})
                    }else{
                        console.log(err);
                        return false;
                    }
                });
            }
        });
    })
    .delete(function (req, res) {
        Category.findOne({_id:req.dbQuery.id}, function(err, category) {
            if(category.subCats.length != 0){
                return res.send({status: 'error', message: 'Impossible de supprimer la catégorie'});
            }
            if(!category) {
                return res.send({status: 'error', message: 'Catégorie n\'existe pas'});
            }
            category.remove(function(err) {
                if(!err) {
                    return res.send({status: 'success', message:'La categorie a bien été supprimé'});
                }
            })
        });

    })
}
