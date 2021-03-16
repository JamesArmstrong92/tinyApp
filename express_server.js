const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");



const generateRandomString = function() {

  let output = '';
  let randomString = '1234567890abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < 6; i++) {
    output += randomString.charAt(Math.floor(Math.random() * randomString.length));
  }
  return output;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//GET requests

app.get("/", (req, res) => {
  
  res.send("Hello!");

});

app.get("/urls.json", (req, res) => {
  
  res.json(urlDatabase);

});

app.get("/urls/new", (req, res) => {

  res.render("urls_new");

});
app.get("/urls", (req, res) => {
  
  const templateVars = {
    urls: urlDatabase
  };
  res.render("urls_index" ,templateVars);

});


app.get("/urls/:shortURL", (req, res) => {
  
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };
  res.render("urls_show", templateVars);

});

app.get("/u/:shortURL", (req, res) => {
  
  const longURL = 'http://' + urlDatabase[req.params.shortURL].longURL;
  
  res.redirect(longURL);

});

//Post responses

app.post("/urls", (req, res) => {
  
  const shortURL = generateRandomString();
  
  urlDatabase[shortURL] = 'http://' + req.body.longURL;
  
  res.redirect('/urls/' + shortURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {

  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});