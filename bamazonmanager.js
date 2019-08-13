var inquirer = require("inquirer");
var mysql = require("mysql");
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
    console.log("Welcome to the Manager Console, What would you like to do today?\n");
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
            /*case "Add to Inventory": updateInventory();
            break;
            case "Add New Product": addProduct();
            break;*/
        };
    });
};

var productInventory = function(){
    connection.query('SELECT * FROM `products`', function(err, results){
        if(err) throw err;
        console.table(results);
    });  
};

var lowInventory = function(){
    connection.query('SELECT * FROM `products` WHERE `stock_qty` <= 5',function(err,results){
        if (err) throw err;
        console.table(results);
    });
};

