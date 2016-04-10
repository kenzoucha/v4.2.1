var Admin = require(appRoot + '/api/models/Admin');
var bodyParser= require('body-parser');
module.exports = function(router,passport) {
    router
        .post('/login',function (req, res) {
            passport.authenticate('local-login', function(err, user, info){
                if(!user) {
                    return res.send({status: 'error', message: 'impossible de se connecter'});
                }
                else{
                    req.logIn(user, function(err){
                        return res.send({status: 'success', message: 'vous ete bien connecté'});
                    })
                }
            })(req,res);
    });
    router
        .use(bodyParser.urlencoded({ extented:false}))
        .post('/signup', passport.authenticate('local-signup'), function (req, res) {
         });
    router
        .get('/session', function(req, res){
            res.send({'auth': req.isAuthenticated()});
        })
    router
        .get('/logout', function(req, res){
            req.logOut();
            return res.send({status: 'success', message: 'déconnexion avec succès'});
        })
}