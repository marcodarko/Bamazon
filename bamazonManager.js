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


// the main function that points the command chosen to the appropiate
// function that does what the user needs to do
var runSearch = function() {


	inquirer.prompt(
	{
		type: "list",
		name: "managerCommand",
		message: "What would you like to do?",
		choices: ["View products for sale", "View low inventory", "Add to inventory", "Add a new product"]
	}
	).then(function(answer) {

// store the command from answer to a variable
		var command = answer.managerCommand;

// switch to the corresponding function
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


// query's the DB for the table products and * in it.
// at the end it loops through the response to display all the content found
function viewProducts(){

  var query = "SELECT * FROM products";

  connection.query(query, function(err, res) {

   console.log("\n*********************************");
   console.log("********* ITEMS FOR SALE **********");
   console.log("***********************************");

   for (var i = 0; i < res.length; i++) {
    console.log("ID #"+res[i].itemID+": " + res[i].productName + " || Price: $" + res[i].price+ " || In Stock: " + res[i].stockQuantity);
  };

  keepGoing();

});

};


// querys the database table for items with stock lower then the number you give it
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

// all this does is ask the user if he would like to keep going or not
// so operations don't have to stop once something is chosen, you can do more.
function keepGoing(){

	inquirer.prompt(
	{
		name: "managerCommand",
		message: "Would you like to perform another operation? yes || no"
	}
	).then(function(answer) {
	var command = answer.managerCommand;

	if (command === "yes"){
		// runsearch is executed if they want to keep going
		runSearch();
	}else{
		return false;
	}
	});
};


// this function takes specific user input and creates a new row in our table

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

//creates a new row with the user input
		var query = "INSERT INTO products SET ?";

		 connection.query(query,{productName: name, departmentName: department,price: price, stockQuantity: stock},function(err, res) {

		 	if(err) throw err;

			 console.log("ITEM ADDED SUCCESSFULLY!");

		  	keepGoing();

		});
	
	});
};


// this function lets you pick an item by ID and modify it's stock
// in case it's low you can add more inventory to it

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






