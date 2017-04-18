const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "cdbrannon",
  database: "Bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  getProducts();
});

function getProducts() {
    connection.query(
    "SELECT item_id, product_name, price, stock_quantity FROM products",
        function(err, res) {
        if (err) throw err;
        res.forEach(currentItem => {
            console.log("ID: " + currentItem.item_id + " || Product: " + currentItem.product_name + " || Price: " + currentItem.price + " || Stock: " + currentItem.stock_quantity);
        });
        inquireCommand();
    });
}

function getLowStock() {
    connection.query(
    "SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5",
        function(err, res) {
        if (err) throw err;
        if (res.length) {
            res.forEach(currentItem => {
                console.log("ID: " + currentItem.item_id + " || Product: " + currentItem.product_name + " || Price: " + currentItem.price + " || Stock: " + currentItem.stock_quantity);
            });
            inquireCommand();
        } else {
            console.log("No products with low stock");
            inquireCommand();
        }
    });
}

function addStock(id, quantity) {
    connection.query(
    "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id=?",
        [quantity, id],
        function(err, res) {
        if (err) throw err;
        getProducts();
    });
}

function addProduct(name, department, price, quantity) {
    connection.query(
        "SELECT department_name FROM products WHERE department_name=?",
        [department],
        function(err, res) {
            if (err) throw err;
            if (res.length) {
                connection.query(
                "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
                    [name, department, price, quantity],
                    function(err, res) {
                    if (err) throw err;
                    getProducts();
                });
            } else {
                console.log("Department does not exist. Please wait for supervisor to add department.");
                getProducts();
            }
        }
    )
}

function inquireCommand() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "choice"
        },
        {
            type: "confirm",
            message: "Are you sure:",
            name: "confirm",
            default: true
        }
    ])
    .then((response) => {
        if (response.confirm) {
            switch (response.choice) {
                case "View Products for Sale":
                    getProducts();
                    break;
                case "View Low Inventory":
                    getLowStock();
                    break;
                case "Add to Inventory":
                    inquireAddStock();
                    break;
                case "Add New Product":
                    inquireAddProduct();
                    break;
            }
        } else {
            inquireCommand();
        }
    })
    .catch((error) => {
        throw error;
    })
}

function inquireAddStock() {
     inquirer.prompt([
        {
            type: "input",
            message: "Enter ID of product you would like to add stock to",
            name: "item_id"
        },
        {
            type: "input",
            message: "How many would you like to add?",
            name: "quantity"
        },
         {
            type: "confirm",
            message: "Are you sure:",
            name: "confirm",
            default: true
        }
    ])
    .then((response) => {
        if (response.confirm) {
            addStock(response.item_id, response.quantity);
        } else {
            inquireCommand();
        }
    })
    .catch((error) => {
        throw error;
    })
}

function inquireAddProduct() {
     inquirer.prompt([
        {
            type: "input",
            message: "Name of product",
            name: "product_name"
        },
        {
            type: "input",
            message: "Name of department",
            name: "department_name"
        },
        {
            type: "input",
            message: "Price of product",
            name: "price"
        },
        {
            type: "input",
            message: "Current stock quantity",
            name: "quantity"
        },
         {
            type: "confirm",
            message: "Are you sure:",
            name: "confirm",
            default: true
        }
    ])
    .then((response) => {
        if (response.confirm) {
            addProduct(response.product_name, response.department_name, response.price, response.quantity);
        } else {
            inquireCommand();
        }
    })
    .catch((error) => {
        throw error;
    })
}