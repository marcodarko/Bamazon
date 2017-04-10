CREATE DATABASE `bamazon`;

USE  `bamazon`;

CREATE TABLE `products` (
  `itemID` INT(11) AUTO_INCREMENT NOT NULL,
  `productName` VARCHAR(30) NOT NULL,
  `departmentName` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `stockQuantity` INTEGER(10) NOT NULL,
  PRIMARY KEY (`itemID`)
);

select * from `products`;

INSERT INTO `products` VALUES 
(1,"Macbook Pro","Electronics",900.50,10),
(2,"Old Shoe","Clothing",19.99,14),
(3,"Fork","Home",4.99,2),
(4,"Mamma Mia DVD","Movies",100.00,4),
(5,"VHS Rewinder","Electronics",120.90,23),
(6,"Walkman","Electronics",20.50,3),
(7,"Nintendo Switch","Electronics",499.50,45),
(8,"PS7","Electronics",1900.99,12),
(9,"Bernie Sticker","Other",2.99,8),
(10,"Mambo No.5 Single","Music",20.99,6);

SELECT * FROM `products`;