/*
https://www.passportjs.org/
https://levelup.gitconnected.com/everything-you-need-to-know-about-the-passport-local-passport-js-strategy-633bbab6195

Here is a basic flow of our app:

1.  Express app starts and listens on http://www.expressapp.com (just assume this is true for the sake of the example).
2.  A user visits http://www.expressapp.com/login in the browser
3.  The express-session middleware realizes that there is a user connecting to the Express server. It checks the Cookie HTTP header on the req object. Since this user is visiting for the first time, there is no value in the Cookie header. Because there is no Cookie value, the Express server returns the /login HTML and calls the Set-Cookie HTTP header. The Set-Cookie value is the cookie string generated by express-session middleware according to the options set by the developer (assume in this case the maxAge value is 1 minute).
4.  The user realizes that he doesn’t want to login right now, but instead, wants to go for a walk. He closes his browser.
5.  The user returns from his walk, opens the browser, and returns to http://www.expressapp.com/login again.
6.  Again, the express-session middleware runs on the GET request, checks the Cookie HTTP header, but this time, finds a value! This is because the user had previously created a session earlier that day. Since the maxAge option was set to 1 minute on the express-session middleware, closing the browser does not destroy the cookie.
7.  The express-session middleware now takes the connect.sid value from the Cookie HTTP header, looks it up in the MongoStore (fancy way to say that it looks up the id in the database in the sessions collection), and finds it. Since the session exists, the express-session middleware does not do anything, and both the Cookie HTTP header value and the MongoStore database entry in the sessions collection stays the same.
8.  Now, the user types in his username and password and presses the “Login” button.
9.  By pressing the “Login” button, the user sends a POST request to the /login route, which uses the passport.authenticate() middleware.
10. On every request so far, the passport.initialize() and passport.session() middlewares have been running. On each request, these middlewares are checking the req.session object (created by the express-session middleware) for a property called passport.user (i.e. req.session.passport.user). Since the passport.authenticate() method had not been called yet, the req.session object did not have a passport property. Now that the passport.authenticate() method has been called via the POST request to /login, Passport will execute our user-defined authentication callback using the username and password our user typed in and submitted.
11. We will assume that the user was already registered in the database and typed in the correct credentials. The Passport callback validates the user successfully.
12. The passport.authenticate() method now returns the user object that was validated. In addition, it attaches the req.session.passport property to the req.session object, serializes the user via passport.serializeUser(), and attaches the serialized user (i.e. the ID of the user) to the req.session.passport.user property. Finally, it attaches the full user object to req.user.
13. The user turns off his computer and goes for another walk because our application is boring.
14. The user turns on his computer the next day and visits a protected route on our application.
15. The express-session middleware checks the Cookie HTTP header on req, finds the session from yesterday (still valid since our maxAge was set to 10 days), looks it up in MongoStore, finds it, and does nothing to the Cookie since the session is still valid. The middleware re-initializes the req.session object and sets to the value returned from MongoStore.
16. The passport.initialize() middleware checks the req.session.passport property and sees that there is still a user value there. The passport.session() middleware uses the user property found on req.session.passport.user to re-initialize the req.user object to equal the user attached to the session via the passport.deserializeUser() function.
17. The protected route looks to see if req.session.passport.user exists. Since the Passport middleware just re-initialized it, it does, and the protected route allows the user access.
18. The user leaves his computer for 2 months.
19. The user comes back and visits the same protected route (hint: the session has expired!)
20. The express-session middleware runs, realizes that the value of the Cookie HTTP header has an expired cookie value, and replaces the Cookie value with a new Session via the Set-Cookie HTTP header attached to the res object.
21. The passport.initialize() and passport.session() middlewares run, but this time, since express-session middleware had to create a new session, there is no longer a req.session.passport object!
22. Since the user did not log in and is trying to access a protected route, the route will check if req.session.passport.user exists. Since it doesn’t, access is denied!
23. Once the user logs in again and triggers the passport.authenticate() middleware, the req.session.passport object will be re-established, and the user will again be able to visit protected routes.
*/


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const validPassword = require('./passwordUtils').validPassword;

//By defult PASSPORT work with user name and password. 'costomFields' is the way to change that.
const costomFields = {
    usernameField: 'email',
    passwordField: 'password'
}

const verifyCallback = (email, password, done) => {
    console.log(' in --------> verifyCallback');
    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        console.log(email);
        if (err)
            { 
                console.log( 'verifyCallback - err => ' + err);
                return done(err); 
            }

            //If user not exists
        if (user == 0)
            { 
                console.log('user not exists');
                return done(null, false ,{message: 'משתמש לא קיים'}); 
            }

        const isValid = validPassword(password, user[0].hash, user[0].salt);
        
        if(isValid)
            {   
                console.log('isValid');
                console.log(user);
                return done (null, user);
            }
        else 
            { 
                console.log('isNotValid - password');
                return done (null, false, {message: 'סיסמה שגויה'});
            }
        });
}

const strategy = new LocalStrategy(costomFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    console.log('in serializeUser  ----> ');
    
    done (null, user[0]);
 } ) ;

passport.deserializeUser((user, done) => {
    console.log('in deSerializeUser ------> ');

    connection.query('SELECT * FROM users WHERE id = ?', [user.id], (err, user) => {
        console.log( 'result => ' + user.id);
        done(null, user)
    });
});

 