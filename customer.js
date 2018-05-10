//Require Dependencies//
const mysql=require("mysql");
const table=require("cli-table");
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

  connection.query("SELECT ")


}
