const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {username: "dshatz",
  password: "password"}
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let user = users.find(u => u.username === username)
  return user && user.password === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {

  let username = req.body.username;
  let password = req.body.password;
  if (authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 })
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username
  let text = req.query.review
  let isbn = req.params.isbn
  if (text && isbn) {
    books[isbn].reviews[username] = {username: username, review: text}
    res.send("Review added")
  } else {
    res.send("Invalid request")
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn
  let username = req.session.authorization.username
  if (isbn && username) {
    let existing = books[isbn].reviews[username]
    delete books[isbn].reviews[username]
    if (existing) {
      res.send("Review deleted successfully")
    } else {
      res.send("No review to delete")
    }
  } else {
    res.send("Invalid request")
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
