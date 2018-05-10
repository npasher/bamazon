DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE Products (
    id INTEGER(10) AUTO_INCREMENT NOT NULL,
    product VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    price FLOAT(7, 2) NOT NULL,
    quantity INTEGER(7) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO Products (product,department,price,quantity)
VALUES ("Molcajete Each", "Smallwares", 24.99, 10);
INSERT INTO Products (product,department,price,quantity)
VALUES ("Avocados Each", "Produce", 1.50, 48);
INSERT INTO Products (product,department,price,quantity)
VALUES ("Roma Tomatoes Each", "Produce", 0.95, 100);
INSERT INTO Products (product, department,price,quantity)
VALUES ("Red Onions LB", "Produce", 0.50, 50);
INSERT INTO Products (product,department,price,quantity)
VALUES ("Cilantro LB", "Produce", 1.50, 25);
INSERT INTO Products (product,department,price,quantity)
VALUES ("Lime Each", "Produce", 0.25, 165);
INSERT INTO Products (product,department,price,quantity)
VALUES ("Don Julio Blanco 750ml", "Liquor", 59.95, 5);
INSERT INTO Products (product,department,price,quantity)
VALUES ("Grand Marnier 750ml", "Liquor", 34.95, 2);
INSERT INTO Products (product,department,price,quantity)
VALUES ("Modelo Negra 24pk", "Beer", 23.95, 12);
INSERT INTO Products (product, department,price,quantity)
VALUES ("Scratch Made Sour Mix .5L", "N/A Beverage", 4.95, 105);
INSERT INTO Products (department, department,price,quantity)
VALUES ("Magarita Glass", "Stemware", 13.99, 200);

select * from Products;

CREATE TABLE Categories (
 id INTEGER(10) AUTO_INCREMENT NOT NULL,
 department VARCHAR(50) NOT NULL,
 sales FLOAT(7, 2) NOT NULL,
 PRIMARY KEY (id)
 );
 
 INSERT INTO Categories (department,sales)
 VALUES("Smallwares",0);
 INSERT INTO Categories (department,sales)
 VALUES("Produce",0);
 INSERT INTO Categories (department,sales)
 VALUES("Liquor",0);
 INSERT INTO Categories (department,sales)
 VALUES("Beer",0);
 INSERT INTO Categories (department,sales)
 VALUES("N/A Beverage",0);
 INSERT INTO Categories (department,sales)
 VALUES("Stemware",0);
 
 select * from Categories;