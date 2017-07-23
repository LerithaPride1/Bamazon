var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "Bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);

function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole number.';
	}
}


function promptUserPurchase() {

	inquirer.prompt([
	{
		type: "input",
		name: "item_id",
		message:  "Please enter the Item ID which you would like to purchase.",
		validate: validateInput,
		filter: Number
	},
	{
		type: "input",
		name: "quantity",
		message: "How many would you like to purchase?",
		filter: Number
	}

		]).then(function(input) {
			console.log('Customer has selected: \n item_id= ' + input.item_id + '\n quantify= ' + input.quantity);
		
		var item = input.item_id;
		var quantity = input.quantity;

		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {item_id: item}, function(err, data) {
			if(err) throw err;

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID.  Please select an item from the Inventory List');
				displayInventory();

			} else {
				var productData = data[0];
				if (quantity <= productData.stock_quantity){
					console.log('The product you requested in is the stock.');
				
					var updateQueryStr = 'Update products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
				
				connection.query(updateQueryStr, function(err, data) {
						if (err) throw err;

						console.log('Your oder has been placed! Your total is $' + productData.price * quantity);
						console.log('Thank you for shopping with us!');
				});
				connection.end();
				}
		};
				displayInventory();
		})
		})
	}
	function displayInventory() {
	console.log('___ENTER displayInventory___');

	// Construct the db query string
	queryStr = 'SELECT * FROM products';

	// Make the db query
	connection.query(queryStr, function(err, data) {
		// if (err) throw err;

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].item_id + '  //  ';
			strOut += 'Product Name: ' + data[i].product_name + '  //  ';
			strOut += 'Department: ' + data[i].department_name + '  //  ';
			strOut += 'Price: $' + data[i].price + '\n';

			console.log(strOut);
		}

	  	console.log("---------------------------------------------------------------------\n");

	  	//Prompt the user for item/quantity they would like to purchase
	  	promptUserPurchase();
	})
}

// runBamazon will execute the main application logic
function runBamazon() {
	// console.log('___ENTER runBamazon___');

	// Display the available inventory
	displayInventory();
}

// Run the application logic
runBamazon();
})