CREATE DATABASE Bamazon;

USE Bamazon;
CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  PRIMARY KEY (item_id)
);

ALTER TABLE products
ADD product_sales DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

INSERT INTO products(product_name, department_name, price, stock_quantity)
    VALUES ("Toilet Paper", "Housewares", 15.95, 2000),
           ("Blue Couch", "Furniture", 400.42, 145),
           ("Waffle Maker", "Kitchen Supplies", 15.50, 1500),
           ("Dog Leash", "Animal Supplies", 25.95, 3200),
           ("Cat Food", "Animal Supplies", 32.25, 705),
           ("Desk Chair", "Furniture", 56.50, 1600),
           ("Yellow Lamp", "Housewares", 30.95, 3000),
           ("Dog Bed", "Pet Supplies", 25.42, 5),
           ("Record Player", "Electronics", 195.50, 1200),
           ("Ballcap", "Clothing", 12.50, 1300);

USE Bamazon;
CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs DECIMAL(12, 2) NOT NULL DEFAULT 10000.00,
  total_sales DECIMAL(12, 2) NOT NULL DEFAULT 00.0,
  PRIMARY KEY (department_id)
);

INSERT departments(department_name) SELECT DISTINCT department_name FROM products;