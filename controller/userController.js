const connection = require('../config/database');
const mainInfoController = require('../controller/mainInfoController');
const addNewUser = require('../config/database').addNewUser;

// view users

exports.viewAll = (req, res) => {
    console.log('user controller - viewAll ----> ' );
    const promiseConnection = new Promise((resolve, reject) => {
        connection.query('select * from users', (err, Rows) => {
            if (!err) {
                resolve(Rows);
            }
            else{
                console.log(err);
            }
        });
    });
    return promiseConnection;
}

exports.viewUser = (req, res) => {
    console.log('user controller - viewUser');
    connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], async (err, row) => {
        const costumerServicesStore = await mainInfoController.costumerServicesStore();

        if (!err) {
            res.render('viewUser', {row, name: req.user[0].first_name, costumerServicesStore: costumerServicesStore[0]});
        }
        else {
            console.log(err);
        }
    });
}

exports.editUser = (req, res) => {
    console.log('user controller - editUser');
    connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], async (err, row) => {
        const costumerServicesStore = await mainInfoController.costumerServicesStore();

        if (!err) {
            res.render('editUser', {row,alert:'' , name: req.user[0].first_name, mainTitle: "מנהלה",   costumerServicesStore: costumerServicesStore[0]});
        }
        else {
            console.log(err);
        }
    });
}

exports.updateUser = (req, res) => {
    console.log('user controller - updateUser');

    const {first_name, last_name, email, phone, admin, status} = req.body;
    connection.query('UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, admin = ?, status = ? WHERE id = ?',[first_name, last_name, email, phone, admin, status, req.params.id], (err, row) => {
        console.log("connection work");
        if (!err) {
            connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], async (err, row) => {
                const costumerServicesStore = await mainInfoController.costumerServicesStore();

              if (!err) {
                res.render('editUser', {row, alert:`המשתמש ${first_name} עודכן בהצלחה!`,name: req.user[0].first_name,mainTitle: "מנהלה",   costumerServicesStore: costumerServicesStore[0]});
              } else {
                console.log(err);
              }
            });
          } else {
            console.log(err);
          }
    });
}


exports.addUser = async (req, res) => {
    console.log('user controller - addUser');
    const costumerServicesStore = await mainInfoController.costumerServicesStore();

    res.render('addUser', {alert:'' , name: req.user[0].first_name,   costumerServicesStore: costumerServicesStore[0]});
}

exports.addUserPost = async (req, res) => {
    console.log('user controller - addUserPost');
    const costumerServicesStore = await mainInfoController.costumerServicesStore();

    addNewUser(req,res);

    res.render('addUser', {alert:`המשתמש ${req.body.first_name} נוסף בהצלחה!`,name: req.user[0].first_name,  costumerServicesStore: costumerServicesStore[0]});
    }


exports.deleteUser =  (req, res) => {
    console.log('user controller - hideUser');

    connection.query('UPDATE users SET status = "לא פעיל" WHERE id = ?', [req.params.id], (err, rows) => {

        if(!err){
            res.redirect('/management/users');
        }
        else{
            console.log(err);
        }
    });
}


exports.searchUser = (req, res) => {
    console.log('user controller -- searchUser');
    const searchTerm = req.body.search;
    const promiseConnection = new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, Rows) => {
            if (!err) {
                resolve(Rows);
            }
            else {
                console.log(err);
            }
        });
    });
    return promiseConnection;
}

