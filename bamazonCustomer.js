const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "PASSWORD",
  database: "Bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  getProducts();
});

function getProducts() {
    connection.query(
    "SELECT item_id, product_name, price FROM products",
        function(err, res) {
        if (err) throw err;
        res.forEach(currentItem => {
            console.log("ID: " + currentItem.item_id + " || Product: " + currentItem.product_name + " || Price: " + currentItem.price);
        });
        inquireCommand();
    });
}

function makePurchase(item, price, department, quantity, currentStock) {
    let total = (price * quantity).toFixed(2);
    connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ?, product_sales = product_sales + ? WHERE item_id=?",
        [quantity, total, item],
        function(err, res) {
        if (err) throw err;
        connection.query(
            "UPDATE departments SET total_sales = total_sales + ? WHERE department_name=?",
            [total, department],
            function(err, res) {
                console.log("Your total is: $" + total + "\n");
                getProducts();
            }
        )
    });
}

function inquireCommand() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter ID of product you would like to order",
            name: "item_id"
        },
        {
            type: "input",
            message: "How many would you like to order?",
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
            connection.query(
                "SELECT * FROM products WHERE item_id=?",
                [response.item_id],
                 function(err, res) {
                    if (err) throw err;
                    if (!res.length || isNaN(response.quantity)) {
                        console.log("Please choose product and enter valid quantity.\n");
                        getProducts();
                        
                    } else {
                        if (response.quantity > res[0].stock_quantity) {
                            console.log("Insufficient quantity!\n");
                            getProducts();
                        } else if (response.item_id){
                            makePurchase(res[0].item_id, res[0].price, res[0].department_name, response.quantity, res[0].stock_quantity);
                        }
                    }
                });
        } else {
            getProducts();
        }
    })
    .catch((error) => {
        throw error;
    });
}