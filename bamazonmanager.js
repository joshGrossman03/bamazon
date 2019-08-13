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
    productInventory();
});

var productInventory = function(){
    connection.query('SELECT * FROM `products`', function(err, results){
        if(err) throw err;
        console.table(results);
    });  
};

