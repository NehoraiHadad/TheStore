const connection = require('../config/database');
const mainInfoController = require('../controller/mainInfoController');


exports.allProduct = (req, res) => {
    console.log('In ----> productController.allProduct');
    let promiseFirst = new Promise((resolve, reject) => {
        connection.query('select * from product', (err, rows) => {
            if (!err) {
                resolve(rows);
            }
            else{
                console.log(err);
            }
        });
    })
    return promiseFirst;
}

exports.searchProduct = (req, res) => {
    console.log('product controller -- searchProduct');
    const searchTerm = req.body.search;
    const promiseConnection = new Promise((resolve, reject) => {
        connection.query('SELECT * FROM product WHERE name LIKE ? OR details LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, Rows) => {
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



exports.editProduct = (req, res) => {
    console.log('product controller - editProduct');
    connection.query('SELECT * FROM product WHERE id = ?', [req.params.id], async (err, row) => {
        const categoryArray = await mainInfoController.categoryList();
        const costumerServicesStore = await mainInfoController.costumerServicesStore();
        
        if (!err) {
            res.render('editProduct', {row,alert:'' , name: req.user[0].first_name, costumerServicesStore: costumerServicesStore[0], categoryArray});
        }
        else {
            console.log(err);
        }
    });
}

exports.updateProduct = (req, res) => {
    console.log('Product controller - updateProduct');
    let {name, price, details, category, sale, stock, photo, img} = req.body;
    if (img == ''){
        img = photo.slice(8); // cut the string in start -> "/images/" + img .(from the parameters in connection.query)
    }
    connection.query('UPDATE Product SET name = ?, price = ?, details = ?, category = ?, sale = ?, stock = ?, photo = ? WHERE id = ?',[name, price, details, category, sale, stock,"/images/" + img, req.params.id], (err, row) => {
        if (!err) {
            connection.query('SELECT * FROM Product WHERE id = ?', [req.params.id], async (err, row) => {
                const categoryArray = await mainInfoController.categoryList();
                const costumerServicesStore = await mainInfoController.costumerServicesStore();
                
                if (!err) {
                    res.render('editProduct', {row, alert:`המוצר ${name} עודכן בהצלחה!`,name: req.user[0].first_name ,costumerServicesStore: costumerServicesStore[0], categoryArray});
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });
}

exports.addProduct = async (req, res) => {
    console.log('in ==> add product');
    const categoryArray = await mainInfoController.categoryList();
    const costumerServicesStore = await mainInfoController.costumerServicesStore();
    
    res.render('addProduct', {alert:'', name:'', costumerServicesStore: costumerServicesStore[0], categoryArray});
}

exports.addProductPost = (req, res) => {
    console.log('in ==> add product post');
    
    const productData = [req.body.name, req.body.price, req.body.details, req.body.category, req.body.sale, req.body.stock, req.body.img];
    connection.query('INSERT INTO product (name, price, details, category, sale, stock, photo) VALUES (?,?,?,?,?,?,?)', productData, async (err) => {
        const categoryArray = await mainInfoController.categoryList();
        const costumerServicesStore = await mainInfoController.costumerServicesStore();
        
        if (err) {
            console.log('err' + err);
        }
        else {
            res.render('addProduct', {alert:'מוצר נוסף בהצלחה', name:'', costumerServicesStore: costumerServicesStore[0], categoryArray});
        }
    });
}

exports.viewProduct = (req, res) => {
    console.log('in ==> view product');
    connection.query('SELECT * FROM product WHERE id = ?', [req.params.id], async (err, row) => {
        const categoryArray = await mainInfoController.categoryList();
        const costumerServicesStore = await mainInfoController.costumerServicesStore();
        
        if (!err) {
            res.render('viewProduct', {row, alert:'',name: req.user[0].first_name, costumerServicesStore: costumerServicesStore[0], categoryArray});
        }
        else {
            console.log(err);
        }
    });
}

exports.notInStock = (req, res) => {
    console.log('product controller - notInStock');
    
    connection.query('UPDATE product SET stock = 0 WHERE id = ?', [req.params.id], (err, rows) => {
        
        if(!err){
            res.redirect('/management/products');
        }
        else{
            console.log(err);
        }
    });
}


exports.categoryProduct = (req, res) => {
    console.log('product controller - categoryProduct');

    const categoryProductPromise = new Promise((resolve, reject) => {
        connection.query('SELECT * FROM product WHERE category = ?', [req.params.category], (err, rows) =>{
            if (err) {
                console.log(err);
                reject();
            } else {
                resolve (rows);
            }
        } )
    });
    return categoryProductPromise;
}

exports.saleProducts = (req, res) => {
    console.log('product controller - saleProducts');

    const saleProductsPromise = new Promise((resolve, reject) => {
        connection.query('SELECT * FROM product WHERE sale = "כן"', (err, rows) =>{
            if (err) {
                console.log(err);
                reject();
            } else {
                resolve (rows);
            }
        } );
    });
    return saleProductsPromise;
}