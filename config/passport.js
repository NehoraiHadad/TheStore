const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const validPassword = require('./passwordUtils').validPassword;
// const genPassword = require('./passwordUtils').genPassword;
// const User = connection.models.User;

const costomFields = {
    usernameField: 'email',
    passwordField: 'password'
}

const verifyCallback = (email, password, done) => {
    console.log('verifyCallback');
    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        console.log(JSON.stringify(user));
        console.log(email);
        if (err)
            { 
                return done(err); 
            }
        if (!user)
            { 
                return done(null, false, {err: 'שם משתמש שגוי.'}); 
            }

        const isValid = validPassword(password, user[0].hash, user[0].salt);
        
        if(isValid)
            {   
                console.log('isValid  ' + done);
                console.log(user);
                return done (null, user );
            }
        else 
            { 
                console.log('isNotValid  ' + done);
                return done (null, false );
            }
    });
}

const strategy = new LocalStrategy(costomFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    console.log('serializeUser  ');
    
    done (null, user[0]);
 } ) ;

passport.deserializeUser((user, done) => {
    console.log('deSerializeUser ');

    connection.query('SELECT * FROM users WHERE id = ?', [user.id], (err, user) => {
        console.log( 'result => ');
        done(null, user)
    });
});

 