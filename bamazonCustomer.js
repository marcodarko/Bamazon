var mysql = require('mysql');
var inquirer = require('inquirer');

// installs the required modules
// if no directory specified that means the modules come with NODE


// creates a connection to out mysql DB
var connection = mysql.createConnection({
  // local host is the same as 27.0.0.1
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

// global var to hold user's total
var total = 0;



var runSearch = function() {

	// initial display of inventory
	displayInventory();

  inquirer.prompt([
  {
    name: "itemPicked",
    message: "Please pick an item to buy by ID#",
  },
  {
    name: "howMany",
    message: "How many would you like to add to your cart?",
  }
  ]).then(function(answer) {

  	var item = answer.itemPicked;
  	var quantity = answer.howMany;

    //console.log("I:"+item);
    //console.log("Q:"+quantity);

    var query = "SELECT stockQuantity FROM products WHERE ?";

    connection.query(query,{ itemID : item }, function(err, res) {

      console.log("In Stock:"+res[0].stockQuantity);
      // if stock can support order then call the process order function which will 
      // update the total 
      if (parseInt(res[0].stockQuantity) >= parseInt(quantity)){

        processOrder(item, quantity);

      }
      else{
        // if stock is 0

        console.log("Sorry, there's not enough inventory to complete your request");
        runSearch();

      }

      
    });

  });
};

// this function gives the user the total and keeps track of the items added
// it passes the total to the updateCart in case they want to checkout
function processOrder(item, quantity){

  var query = "SELECT * FROM products WHERE ?";

  item = parseInt(item);

  connection.query(query,{ itemID : item }, function(err, res) {
    
    var pricePerItem = res[0].price;
    // subtracts ordered quantity from stock
    // new quantity is passed to updateInventory to update database
    var newQuantity = res[0].stockQuantity- quantity;
    // gives user the total for items purchased
    var totalAdded = pricePerItem *quantity;

    console.log("ADDED TO CART- "+quantity+" "+res[0].productName+" ="+"$"+totalAdded);

    // adds up total as you keep shopping
    total =+ totalAdded;

    // asks if you want to keep shoppping or checkout
    updateCart(total);

    // will update the DB with new quantity
    updateInventory(item, newQuantity);

  });
};

// takes the passed in new quantity minus the items purchased and updates 
// the DB
function updateInventory(item, newQuantity){

 var query = "UPDATE products SET ? WHERE ?";

 connection.query(query,[{stockQuantity: newQuantity },{ itemID : item }], function(err, res) {

  if(err) throw err;

  console.log("items successfully updated from DB");
});
};

// if you want to keep shopping routes you to the main function otherwise
// it gives you the total accumulated so far
function updateCart(total){

  inquirer.prompt(
  {
    type: "list",
    name: "keepShopping",
    message: "Would you like to keep shopping?",
    choices: ["KEEP SHOPPING!", "CHECK OUT"]
  }
  ).then(function(answer){

    if(answer.keepShopping === "KEEP SHOPPING!"){

      runSearch();

    }else{

      console.log("YOUR TOTAL IS: $"+ total);
      total = 0;
      return false;
    }

  });
};

// grabs all the data from our DB table and we loop through 
// the response to display all items

function displayInventory(){

  var query = "SELECT * FROM products";

  connection.query(query, function(err, res) {

   console.log("\n*********************************");
   console.log("****** ITEMS AVAILABLE **********");
   console.log("*********************************");

   for (var i = 0; i < res.length; i++) {

    console.log("ID #"+res[i].itemID+": " + res[i].productName + " || Price: $" + res[i].price);

  };

});
};


