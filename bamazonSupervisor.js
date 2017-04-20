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
    inquireCommand();
});

function getDepartments() {
    connection.query(
    "SELECT department_id, department_name, over_head_costs, total_sales, total_sales - over_head_costs AS total_profit FROM departments",
        function(err, res) {
        if (err) throw err;
        res.forEach(currentItem => {
            console.log("ID: " + currentItem.department_id + " || Department Name: " + currentItem.department_name + " || Overhead Costs: " + currentItem.over_head_costs + " || Sales: " + currentItem.total_sales  + " || Profit: " + currentItem.total_profit);
        });
        inquireCommand();
    });
}

function addDepartment(name, overhead, sales) {
    connection.query(
        "SELECT department_name FROM departments WHERE department_name=?",
        [name],
        function(err, res) {
            if (err) throw err;
            if (!res.length) {
                if (department_name !== "") {
                    connection.query(
                    "INSERT INTO departments (department_name, over_head_costs, total_sales) VALUES (?, ?, ?)",
                        [name, overhead, sales],
                        function(err, res) {
                        if (err) throw err;
                        inquireCommand();
                    });
                } else {
                    console.log("Not a valid department name.");
                    inquireCommand();
                }
            } else {
                console.log("Department already exists.\n");
                inquireCommand();
            }
        }
    )
}

function inquireCommand() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Product Sales by Department", "Create New Department"],
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
                case "View Product Sales by Department":
                    getDepartments();
                    break;
                case "Create New Department":
                    inquireCreateDepartment();
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

function inquireCreateDepartment() {
     inquirer.prompt([
        {
            type: "input",
            message: "Name of department",
            name: "department_name"
        },
        {
            type: "input",
            message: "What is the overhead cost?",
            name: "over_head_costs"
        },
        {
            type: "input",
            message: "What are the total sales?",
            name: "total_sales"
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
            addDepartment(response.department_name, response.over_head_costs, response.total_sales);
        } else {
            inquireCommand();
        }
    })
    .catch((error) => {
        throw error;
    })
}

