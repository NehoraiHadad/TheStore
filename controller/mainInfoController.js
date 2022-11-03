const connection = require('../config/database');


exports.updateChanges = async (req, res) => {
    console.log('In ========> mainInfoController.updateChanges');

    await this.costumerServicesStoreUpdate(req, res);
    await this.categoryChange(req, res);

    const categoryArray = await this.categoryList();
    const costumerServicesStore = await this.costumerServicesStore();
    res.render('management',{name:'', alert: 'השינויים עודכנו', categoryArray, costumerServicesStore});
}


exports.categoryList = () => {
    console.log("In ========> mainInfoController.categoryList");

    const promiseCategory = new Promise((resolve, reject) => {
        connection.query("show columns from product where field = 'category'" , (err, rows) => {
            let data = JSON.parse(JSON.stringify(rows))[0].Type.slice(4, -1).split(',');
            if (!err) {
                resolve(data);
            }
            else {
                console.log(err);
            }
        });
    });
    return promiseCategory;
}
 

exports.categoryChange = async (req, res) => {
    console.log("In ========> mainInfoController.CategoryChange");

    const change = req.body;
    const categorySelect = change.categorySelect;
    const categoryArray = await this.categoryList();
    if (change.category != '') {
        if (change.category != categorySelect) {
            if (categorySelect == 'הוסף קטגוריה') {             //add new category
                categoryArray.push("'" + change.category + "'");
                await this.categoryUpdate(req, res, categoryArray);
            } else {    // edit category
                for (let index = 0; index < categoryArray.length; index++) {
                    const element = categoryArray[index].slice(1,-1);
                    if (element == categorySelect.slice(0, -1)) {
                        categoryArray[index] = "'" + change.category + "'";
                        await this.categoryUpdate(req, res, categoryArray);
                    }
                }
            }
        }
    } else if(categorySelect != 'הוסף קטגוריה') { //del category (not possible on category in use !! )
        await this.delCategory(req, res, categoryArray);
    }
}


exports.categoryUpdate = (req, res, categoryArray) => {
    console.log("In ========> mainInfoController.categoryUpdate");

    const promiseCategoryUpdate = new Promise((resolve, reject) => {
        connection.query(`alter table product modify category set(${categoryArray.toString()})`, (err) => {
            if (err){
                console.log(err);
                reject(err)
            }
            else{
                resolve();
            }        
        });
    });

    return promiseCategoryUpdate;
}


exports.delCategory = async (req, res, categoryArray) => {
    console.log("In ========> mainInfoController.delCategory");
    
    const categorySelect = req.body.categorySelect;
    const index = categoryArray.indexOf(categorySelect);
    categoryArray.splice(index, 1);

    await this.categoryUpdate(req, res, categoryArray);
}


exports.costumerServicesStoreUpdate = (req, res) => {
    console.log("In ========> mainInfoController.costumerServicesStoreUpdate");

    const promiseCostumerServices = new Promise((resolve, reject) => {
    const dataCostumer = [req.body.storeName, req.body.storeMail, req.body.storePhone, req.body.storeAddress]
    connection.query("UPDATE mainInfo SET storeName = ?, storeMail = ?, storePhone = ?, storeAddress = ? WHERE id = 1", dataCostumer,(err) => {
        if (err){
            console.log('err' + err);
            reject()
        }
        else {
            resolve()
        }
    });
});

    return promiseCostumerServices;

}


exports.costumerServicesStore = () => {
    console.log("In ========> mainInfoController.costumerServicesStore");
    
    const promiseCostumerServicesStore = new Promise((resolve, reject) => {
        connection.query("select * from mainInfo where id = 1", (err, row) => {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                resolve(row)
            }
        });
        
    });

    return promiseCostumerServicesStore;
}