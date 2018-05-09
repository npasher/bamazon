//Require Dependencies//
const mysql=require("mysql");
const table=require("cli-table");
const inquirer=require("inquirer");
const colors=require("colors");
//connection for database//
const connection=mysql.createConnection({
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
  printItems(function(){
    itemSelect();
  });
});

var usersCart=[];
var totalCharge=0;


