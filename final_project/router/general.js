const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  // Check if email is provided in the request body
  if (req.body.username) {
    if (users.find(u => u.username === req.body.username)) {
      return res.send("The user " + req.body.username + " is already registered");
    }
    // Create or update friend's details based on provided email
    if (req.body.password) {
      users.push({
        username: req.body.username,
        password: req.body.password
      })
      // Send response indicating user addition
      res.send("The user" + (' ') + (req.body.username) + " Has been added!");
    } else {
      res.send("No password field provided");
    }
  } else {
    res.send("No username field provided");
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books[req.params.isbn]))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  res.send(JSON.stringify(Object.values(books).filter(book => book.author === author)))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  res.send(JSON.stringify(Object.values(books).filter(book => book.title === title)))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  res.send(JSON.stringify(books[isbn].reviews))
});

module.exports.general = public_users;
