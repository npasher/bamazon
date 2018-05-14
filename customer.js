//Require Dependencies//
const mysql=require("mysql");
const Table=require("cli-table");
const inquirer=require("inquirer");
const colors=require("colors");
//connection for database//
let connection=mysql.createConnection({
  host:"localhost",
  port:3306,
  user:"root",
  password:"",
  database:"bamazon"
});
//MySQL connect and show id of connection//
connection.connect(function(err){
  if (err) throw err;
  console.log("ID of Connection: "+connection.threadId);
  showItems(function(){
    itemSelect();
  });
});

let usersCart=[];
let totalCharge=0;
//Printing table to Console//
function showItems(displaytable){
  let table=new Table({
    head:["id","product","department","price","quantity"]
  });
  connection.query("SELECT * FROM Products",function(err,res){
    if(err) throw err;
    for (let i=0;i<res.length; i++){
      table.push([res[i].id,res[i].product,res[i].department,res[i].price,res[i].quantity]);
    }
    console.log(table.toString());
    displaytable();
  });
};

function itemSelect(){
  let items=[];
//Retrieving from Products table// 
  connection.query("SELECT product FROM Products",function(err, res){
    if (err)  throw err;
    for (let i=0;i<res.length;i++){
      items.push(res[i].product);
    }
//Inquirer for purchase addition to shopping cart//    
  inquirer.prompt([
    {
      name:"choices",
      type:"checkbox",
      message:"For Desired Product, please press the SPACE key to select and the RETURN/ENTER key when selections are completed.",
      choices:items
    }
    ]).then(function(purchaser){
      if (purchaser.choices.length===0){ //Print if no items selected//
        console.log("Item must be selected.");
      inquirer.prompt([
        {
          name:"choices",
          type:"list",
          message:"Cart is Empty of Items to Purchase. Will you keep shopping or choose to Exit?",
          choices:["Remain to Purchase","Exit Store"]
        }
      ]).then(function(purchaser){
        if(purchaser.choice==="Remain to Purchase"){
          showItems(function(){
          itemSelect();
          });
        }else{
          console.log("Exiting Program");
          connection.end(); //End of connection to database//
        }
      });
        }else{
          itemsPurchased(purchaser.choices);
        }
    });
  });
}

function itemsPurchased(itemSelected){
//new variables decalred for quantity of stock, cost of items and the repective department//
  let inStock;
  let costOfItem;
  let department;
//returns the first item of the array//
  let item=itemSelected.shift(); 

  connection.query("SELECT quantity,price,department FROM Products WHERE ?",{
    product:item
  },function(err,res){
    if(err) throw err;
    inStock=res[0].quantity;
    costOfItem=res[0].price;
    department=res[0].department;
  });
  inquirer.prompt([
    { //Asks for amount of product desired by user.//
      name:"amount",
      type:"text",
      message:"How many of "+item+" will you be purchasing?",
      validate:function(stocked){ //Checks selected amount vs. in stock amount//
        if(parseInt(stocked) <=inStock){
          return true
        }else{ //If product quantity will not meet selected amount, alerts user.//
          console.log("Apologies the amount of "+inStock+"is greater than in stock amount.");
          return false;
        }
      }
    }
  ]).then(function(user){
    let amount=user.amount;
    usersCart.push({ //Object for items in cart.//
      item:item,
      amount:amount,
      costOfItem:costOfItem,
      inStock:inStock,
      department:department,
      total:costOfItem*amount
    });
      if(itemSelected.length !=0){
        itemsPurchased(itemSelected);
      }else{ //Proceed to checkout when user is ready to checkout//
        checkout();
      };
  });
};
//Checkout function//
function checkout(){
  if(usersCart.length !=0){
    let finalTotal=0;
    console.log("Here are you items selected for purchase:");
    for (let i=0;i<usersCart.length;i++){
      let item=usersCart[i].item;
      let amount=usersCart[i].amount;
      let individualCost=usersCart[i].costOfItem;
      let total=usersCart[i].total;
      let costOfItem=individualCost*amount;
      finalTotal +=costOfItem;
      console.log(amount+" "+item+" "+"$"+total);
    }
      console.log("Final Total: $"+finalTotal);//Displays final total to user//
      inquirer.prompt([//Prompts user for checkout confirmation//
        {
          name:"checkout",
          type:"list",
          message:"If ready to checkout please select Checkout, if not select Back to Cart to edit choices.",
          choices:["Checkout","Back to Cart"]
        }
      ]).then(function(res){
        if(res.checkout==="Checkout"){ //Calls updateBamazon function if user checksout.//
          updateBamazon(finalTotal); 
        }else{//Calls cartEdit function if user chooses to edit cart.//
          cartEdit();
        }
      });    
  }else{//If purchases are complete and cart is empty, prompt user on how to proceed//
    inquirer.prompt([
      {
        name:"choice",
        type:"list",
        message:"Purchases completed.\nPlease choose either Continue Shopping or Exit Bamazon to proceed.",
        choices:["Continue Shopping.","Exit Bamazon."]
      }
    ]).then(function(user){
      if(user.choice==="Continue Shopping."){//Cycles back to showItems if user selects to keep shopping.//
        showItems(function(){
          itemSelect();
        });
      }else{//Ends Bamazon if user requests to exit.//
        console.log("Exiting Bamazon. \nPlease enjoy your party!");
        connection.end();
      }
    });
  };
};

function updateBamazon(finalTotal){
  let item=usersCart.shift();
  let itemName=item.item;
  let costOfItem=item.costOfItem;
  let userPurchase=item.amount;
  let department=item.department;
  let categoryTransaction=costOfItem*userPurchase;
  connection.query("SELECT category_sales FROM Categories WHERE ? ",{ //query amount on hand// 
    department:department
  },function(err,res){
    let categoryTotal=res[0]["category_sales"];
    connection.query("UPDATE Categories SET ? WHERE ?",[
      {
      category_sales:categoryTotal+=categoryTransaction
      },
    {
      department:department
    }],function(err){
      if(err) throw err;
    });
  });
    connection.query("SELECT quantity FROM Products WHERE ?", {
      product:itemName
    },function(err,res){
      let inStock=res[0].quantity;
      console.log("On Hand:"+inStock);
      connection.query("UPDATE Products SET ? WHERE ?",[ //updating database quantities//
        {
          quantity:inStock-=userPurchase
      },
      {
        product:itemName
      }],function(err){
        if(err) throw err;
        if(usersCart.length !=0){ //Checks if cart is not empty and if so, runs updateBamazon again.//
          updateBamazon(finalTotal);
        }else{ //If Cart is empty, user will receive total and well wishes.//
          finalTotal=finalTotal.toFixed(2);
          console.log("Thank You for using Bamazon for your party needs!"+"\n Your Final Total is: $ "+finalTotal);
          connection.end();
        }
      });
    });
  };

  function cartEdit(){ //Will push items in Shopping Cart to an array
    let items=[];
    for (let i=0; i<usersCart.length;i++){
      let item=usersCart[i].item;
      items.push(item);
    }
    inquirer.prompt([
      {
        name:"choices",
        type:"checkbox",
        message:"Please select which items you will like to edit.",
        choices:items
      }
    ]).then(function(user){
      if(user.choices.length===0){
        console.log("No items, in cart, have been selected, please do so now.");
        checkout();
      }else{
        let cartEdit=user.choices;
        editCartItems(cartEdit);
      }
    });
  };
  function editCartItems(cartEdit){
    if(cartEdit.length!=0){
      let item=cartEdit.shift();//Removes first item from array and returns it.//
      inquirer.prompt([
        {
          name:"choice",
          type:"list",
          message:"Reomve: "+item+" from cart or change current quantity?",
          choices:["Remove Item.","Change Current Quantity."]
        }
      ]).then(function(user){
        if(user.choice==="Remove Item."){//User has selected to remove item.//
          for(let i=0;i<usersCart.length;i++){
            if(usersCart[i].item===item){
              usersCart.splice(i,1);
              console.log("Item removed and Cart updated.");
            }
          }
          editCartItems(cartEdit);
        }else{
          inquirer.prompt([
            {
              name:"amount",
              type:"text",
              message:"How much of "+item+" will you require for purchase?",
            }
          ]).then(function(user){
            for (let i=0;i<usersCart.length;i++){
              if (usersCart[i].item===item){
                usersCart[i].amount=user.amount;
                usersCart[i].total=usersCart[i].costOfItem*user.amount;
                console.log("Cart is updated.");
              }
            }
            editCartItems(cartEdit);
          });
        }
      });
    }else{
      checkout();
    }
  };