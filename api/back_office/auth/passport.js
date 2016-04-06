var LocalStrategy = require('passport-local').Strategy;
var Admin         = require(appRoot + '/api/models/Admin');

module.exports = function(passport){
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done){
        Admin.findById(id, function(err, user){
            done(null, user);
        });
    });
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, username, password, done) {
        process.nextTick(function(){
            Admin.findOne({'username' : username}, function(err, admin){
                if(err) return done(err);
                if(admin){
                    return done(null, false, admin);
                }else{
                    var newAdmin = new Admin();
                    newAdmin.username = username;
                    newAdmin.password = newAdmin.generateHash(password);

                    newAdmin.save(function(err,admin){
                        if(err){
                            throw err;
                        return done(null, newAdmin );
                        }
                    });
                }
            });
        });
    }));
    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
        session: false
    }, function (req, username, password, done) {
        Admin.findOne({'username': username}, function(err, admin){
            if(err)
                return done(err);
            if(!admin)
                return done(null, false, req.message);
            if(!admin.validPassword(password))
                return done(null, false, 'password missing');
            return done(null, admin);

        });
    }));
};

