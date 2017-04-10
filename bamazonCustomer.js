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



var runSearch = function() {

	// initial display of inventory
	displayInventory();

  inquirer.prompt(
  {
    name: "itemPicked",
    message: "Please pick an item to buy by ID#",
  },
   {
    name: "howMany",
    message: "How many would you like to add to your cart?",
  }
  ).then(function(answer) {

  	var item = answer.itemPicked;
  	var quantity = answer.howMany;

  	processOrder(item, quantity);

  });
};


function processOrder(item, quantity){



};





function displayInventory(){
	 var query = "SELECT * FROM products";

    connection.query(query, function(err, res) {

    	console.log("*********************************");
      	console.log("****** ITEMS AVAILABLE **********");
      	console.log("*********************************");

      for (var i = 0; i < res.length; i++) {
		console.log( "ID #"res[i].itemID ": " + res[i].productName + " || Price: $" + res[i].price);
      }

      runSearch();
    });
};


