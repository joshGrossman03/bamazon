CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price INTEGER(10),
    stock_qty INTEGER(10),
    PRIMARY KEY(item_id)
);

INSERT INTO products (product_name,department_name,price,stock_qty)
VALUES  ("Jabra Headphones","Electronics",120,15),
        ("Wireless Phone Charger","Electronics",34,25),
        ("MacBook Pro 13-inch","Electronics",1652,10),
        ("Levi's Jeans","Apparel",32,10),
        ("Nike T-Shirt","Apparel", 18,5),
        ("Brooks Running Shoes", "Footwear", 115,20),
        ("Nike Running Shoes", "Footwear",110,10),
        ("Leather Belt","Accessories", 25,10),
        ("Leather Wallet", "Accessories", 20,5),
        ("Key Chain","Accessories", 10,10);
