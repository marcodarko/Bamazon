var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
	if (err) throw err;

	runSearch();

});


// mysql.server start # Start MySQL server
// mysql.server stop # Stop MySQL server
// mysql.server restart # Restart MySQL server



var runSearch = function() {


	inquirer.prompt(
	{
		type: "list",
		name: "managerCommand",
		message: "What would you like to do?",
		choices: ["View products for sale", "View low inventory", "Add to inventory", "Add a new product"]
	}
	).then(function(answer) {

		var command = answer.managerCommand;

		switch(command){
			case "View products for sale":
			viewProducts();
			break;

			case "View low inventory":
			viewLowInventory();
			break;

			case "Add to inventory":
			addInventory();
			break;

			case "Add a new product":
			newProduct();
			break;

		};
	});

};



function viewProducts(){

  var query = "SELECT * FROM products";

  connection.query(query, function(err, res) {

   console.log("\n*********************************");
   console.log("********* ITEMS FOR SALE **********");
   console.log("***********************************");

   for (var i = 0; i < res.length; i++) {
    console.log("ID #"+res[i].itemID+": " + res[i].productName + " || Price: $" + res[i].price+ " || In Stock: $" + res[i].stockQuantity);
  };

  keepGoing();

});

};



function viewLowInventory(){
inquirer.prompt(
	{
		name: "managerCommand",
		message: "View products with quantity lower than...(enter a number)",
	}
	).then(function(answer) {

	var command = answer.managerCommand;
  	var query = "SELECT * FROM products WHERE stockQuantity <"+command;

	  connection.query(query,function(err, res) {

	   console.log("********* LOW INVENTORY **********");

	   for (var i = 0; i < res.length; i++) {
	    console.log("ID #"+res[i].itemID+": " + res[i].productName+ " || In Stock: " + res[i].stockQuantity);
	  };

	  keepGoing();

	});

	});
};


function keepGoing(){

	inquirer.prompt(
	{
		name: "managerCommand",
		message: "Would you like to perform another operation? yes || no"
	}
	).then(function(answer) {
	var command = answer.managerCommand;

	if (command === "yes"){
		runSearch();
	}else{
		return false;
	}
	});
};


function newProduct(){

	inquirer.prompt([
	{
		name: "name",
		message: "Enter product name >"
	},
	{
		name: "department",
		message: "Enter department >"
	},
	{
		name: "price",
		message: "Enter item price >"
	},
	{
		name: "stock",
		message: "Enter stock quantity >"
	}
	]).then(function(answer) {

	var name = answer.name;
	var department = answer.department;
	var price = parseFloat(answer.price);
	var stock = parseInt(answer.stock);


		var query = "INSERT INTO products (productName, departmentName, price, stockQuantity) VALUES ?";

		 connection.query(query,{name, department, price, stock},function(err, res) {

		 	if(err) throw err;

			 console.log("ITEM ADDED SUCCESSFULLY!");

		  	keepGoing();

		});
	
	});
};

function addInventory(){

	inquirer.prompt([
	{
		name: "managerItem",
		message: "Which item would you like to add inventory to? (enter ID#)"
	},
	{
		name: "managerInventory",
		message: "How much inventory would you like to add?"
	}
	]).then(function(answer) {

	var item = answer.managerItem;
	var inventory = answer.managerInventory;

	var query = "UPDATE products SET ? WHERE ?";

		 connection.query(query,[{stockQuantity: inventory },{ itemID : item }],function(err, res) {

		 	if(err) throw err;

			 console.log("STOCK ADDED SUCCESSFULLY!");

		  	keepGoing();

		});
	
});
};






