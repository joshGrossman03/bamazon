var inquirer = require("inquirer");
var mysql = require("mysql");
var item_id_requested;
var stock_qty_requested;
var itemID;
var productName;
var depoName;
var itemPrice;
var current_stock;


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
    storeFront();
});

var storeFront = function(){

    connection.query('SELECT item_id,product_name,price,stock_qty FROM `products`', function (err, results) {
        if (err) throw err;
        console.log("\n\n\n WELCOME TO BAMAZON!\n\n MAKE A SELECTION FROM OUR EXTENSIVE INVENTORY BELOW");
        console.table(results);

        inquirer.prompt([
            {
            type:"input",
            message:"Please enter the Item_id for your selection.",
            name:"itemSelection"
            },
            {
            type:"input",
            message:"How Many of this item would you like to order?",
            name:"order_qty"
            }
        ]).then(function(answers){
            item_id_requested = answers.itemSelection;
            stock_qty_requested = answers.order_qty;

            connection.query('SELECT * FROM `products` WHERE `item_id` =?',[item_id_requested], function(err, results){
                if (err) throw err;
                //console.log(results);
                itemID = results[0].item_id;
                productName = results[0].product_name;
                depoName = results[0].department_name;
                itemPrice = results[0].price;
                current_stock = results[0].stock_qty;

                calculatePurchase(item_id_requested,stock_qty_requested,current_stock,itemPrice,productName);
            
            });
        });
    });
};

var calculatePurchase = function(item_id_requested,stock_qty_requested,current_stock,itemPrice,productName){
    
    connection.query('SELECT * FROM `products` WHERE `item_id`=?',[item_id_requested],function(err,results){
        if (err) throw err;
        //console.table(results);
        current_stock = results[0].stock_qty;
        //console.log(current_stock);

            if(stock_qty_requested <= current_stock){
            var newStockQty = current_stock - stock_qty_requested;
            //console.log(newStockQty);
            var orderTotal = itemPrice * stock_qty_requested;
            console.log(" Your order total is: $"+orderTotal);
            updateProducts(newStockQty,item_id_requested);
        }
        else{
        console.log("Bamazon does not have enough of the "+ productName +" in stock to fulfill your order.");
        inquirer.prompt([
            {
                type:"confirm",
                message:"Would you like to continue shopping?",
                name: "continueShopping"
            }
        ]).then(function(answers){
            if (answers.continueShopping != true){
                console.log("\nThank you for shopping with BAMAZON please come again!\n Bye Bye!");
                connection.end(function(err) {
                    if(err) throw err;
                    console.log("You have been logged off.")
                  });
            }
            else{
                
                storeFront();
            }
        });
        }
    });    
};


var updateProducts = function(newStockQty,item_id_requested){

    connection.query('UPDATE `products` SET `stock_qty`=? WHERE `item_id`=?',[newStockQty,item_id_requested],function(err,results){
        if (err) throw err;
        console.table(results);
        storeFront();
    }); 
};