var inquirer = require("inquirer");
var mysql = require("mysql");
var choices = [];


var connection = mysql.createConnection({
    //insecureAuth : true,
    host:"localhost",
    port:3306,
    user:'root',
    password:"password",
    database:"bamazon"
});

connection.connect(function(err){
    if (err) throw err;
    //console.log("connected as id " + connection.threadId);
    //connection.end();
    managerConsole();
});


var managerConsole = function(){
    console.log("*************************************************************************************\n");
    console.log("**                                                                                 **\n");
    console.log("**      Welcome to the Manager Console, What would you like to do today?           **\n");
    console.log("**                                                                                 **\n");
    console.log("*************************************************************************************\n");



    
    inquirer.prompt([
        {
            type:"list",
            name:"managerMenu",
            message:"\nPlease make a selction from the actions listed below:\n",
            choices:["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"]
        }
    ]).then(function(answers){

        switch (answers.managerMenu){
            case "View Products for Sale": productInventory();
            break;
            case "View Low Inventory" : lowInventory();
            break;
            case "Add to Inventory": updateInventory();
            break;
            case "Add New Product": addProduct();
            break;
        };
    });
};

var productInventory = function(){
    connection.query('SELECT * FROM `products`', function(err, results){
        if(err) throw err;
        console.log("\n\n\n\n");
        console.table(results);
        managerConsole();
    });  
};

var lowInventory = function(){
    connection.query('SELECT * FROM `products` WHERE `stock_qty` <= 5',function(err,results){
        if (err) throw err;
        console.table(results);
        managerConsole();
    });
};

var updateInventory = function(){

        connection.query('SELECT `item_id`, `product_name`,`stock_qty` FROM `products`', function(err,results){
            if (err) throw err;
            resultsArray = results;
            //console.log(results[0].item_id);
            //console.log(results[0].product_name);

            for(var i = 0; i < resultsArray.length;i++){
                var newItem = new Inventory(resultsArray[i].item_id,resultsArray[i].product_name,resultsArray[i].stock_qty);
                choices.push(newItem.product_name);
               
               
            };
            console.log(choices);
            //console.log(currentStock);
            //console.log(currentInventory);
            //console.table(currentInventory);

            inquirer.prompt([
                {
                    type:'rawlist',
                    name:"itemSelect",
                    message:"\nPlease select the item you would like to update the inventory for.\n",
                    choices:choices,
                    
                },
                {
                    type:"input",
                    name:"update_qty",
                    message:"Enter the Quantity to add to the inventory for the selcted item.\n",
                    
                }
            ]).then(function(answers){
                var itemSelected = answers.itemSelect;
                var update_qty = answers.update_qty;
                console.log(itemSelected)
                console.log(update_qty);
                updateItem(itemSelected,update_qty);
            });
        });
        
};

var Inventory = function(item_id,product_name,stock_qty){
    this.item_id = item_id;
    this.product_name = product_name;
    this.stock_qty = stock_qty;
};

var updateItem = function(itemSelected,update_qty,){
    var updatedQty = 0;
    connection.query('SELECT `stock_qty` FROM `products` WHERE `product_Name`=?',[itemSelected],function(err, results){
        if(err) throw err;
        //console.log(results);
        var quanity = (results[0].stock_qty);
        update_qty = parseInt(update_qty);
        updatedQty = quanity + update_qty;
        //console.log(quanity);
        //console.log(updatedQty);
        updateDB(updatedQty,itemSelected);
    });
};

var updateDB = function(updatedQty,itemSelected){
    connection.query('UPDATE `products` SET `stock_qty`=? WHERE `product_Name`=?',[updatedQty,itemSelected],function(err,results){
        //console.log(updatedQty);
        if (err) throw err;
        console.table("\n The stock quantity for "+itemSelected +" has been updated and there are now a total of " +updatedQty+" of this item in stock.\n\n");

        inquirer.prompt([
            {
                type:"rawlist",
                message:"Select from the options below to continue",
                name:"subMenu",
                choices: ["Update another item inventory","Return to Main Menu"]
            }
        ]).then(function(answers){
                switch (answers.subMenu){
                    case "Update another item inventory":updateInventory();
                    break;

                    case "Return to Main Menu": productInventory();
                    break;
                };
        });
    });
};

var addProduct = () =>{


    inquirer.prompt([
        {
            type:"input",
            message:"Product Name",
            name:"productName"
        },
        {
            type:"input",
            message:"Department",
            name:"department"
        },
        {
            type:"input",
            message:"Item Price",
            name:"price"
        },
        {
            type:"input",
            message:"Initial amount in stock",
            name:"initStock"
        }
    ]).then(function(answers){
        var addItem = {
            product_name: answers.productName,
            department_name: answers.department,
            price:answers.price,
            stock_qty:answers.initStock
        };

        connection.query('INSERT INTO `products`SET ?',addItem,function(err,results){
            if (err) throw err;
            console.log("THE NEW ITEM HAS BEEN ADDED TO THE BAMAZON INVENTORY");
            inquirer.prompt([
                {
                    type:"rawlist",
                    message:"Select from the options below to continue",
                    name:"subMenu",
                    choices: ["Add another new Item","Return to Main Menu"]
                }
            ]).then(function(answers){
                    switch (answers.subMenu){
                        case "Add another new Item":addProduct();
                        break;
    
                        case "Return to Main Menu": productInventory();
                        break;
                    };
            });
        });
    });
};