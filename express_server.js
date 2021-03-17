//Dependencies

const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
const cookieParser = require("cookie-parser");
app.use(cookieParser());


//urlDatabase and static users

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
};

//Helper functions

const generateRandomString = function() {

  let output = '';
  let randomString = '1234567890abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < 6; i++) {
    output += randomString.charAt(Math.floor(Math.random() * randomString.length));
  }
  return output;
};


//GET requests

app.get('/urls.json', (req, res) => {

  res.json(urlDatabase);

});

app.get('/', (req, res) => {
  const templateVars = {

    urls: urlDatabase,
    email: users[req.cookies["user_ID"]]

  };

  res.render("urls_index", templateVars);
});

app.get('/urls', (req, res) => {

  const templateVars = {

    urls: urlDatabase,
    email: users[req.cookies["user_ID"]]
  };

  res.render("urls_index", templateVars);
});

app.get('/urls/new', (req, res) => {
  
  const templateVars = {

    email: users[req.cookies["user_ID"]]

  };

  res.render('urls_new', templateVars);

});


app.get("/urls/:shortURL", (req, res) => {

  const templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    email: users[req.cookies["user_ID"]]
  };

  res.render("urls_show", templateVars);
});

app.get('/login', (req, res) => {

  const templateVars = {
    email: undefined
  };

  res.render("urls_login", templateVars);

});

app.get('/register', (req, res) => {
  const templateVars = {
    
    email: undefined
    
  };
  
  res.render("urls_register", templateVars);
});


app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  
  res.redirect(longURL);
});

// POST responses

app.post("/urls/:shortURL/delete", (req, res) => {
  
  delete urlDatabase[req.params.shortURL];

  res.redirect('/urls');
});

app.post("/urls", (req, res) => {
  
  let shortenedURL = generateRandomString();

  urlDatabase[shortenedURL] = req.body.longURL;

  res.redirect('/urls/' + shortenedURL);
});


app.post("/urls/:shortURL/edit", (req, res) => {

  urlDatabase[req.params.shortURL] = req.body.update;

  res.redirect(`/urls`);
});

app.post("/login", (req, res) => {
  
  if (req.body.email === users[req.cookies["user_ID"]] && req.body.password === users[req.cookies["user_ID"]]) {
    res.cookie('user_ID', user_ID);
    res.redirect("/urls");
  }
  

});

app.post("/logout", (req, res) => {
  
  res.clearCookie("user_ID");
  res.redirect(`/login`);

});

app.post("/register", (req, res) => {
  
  const user_ID = generateRandomString();

  if (req.body.password === "" || req.body.email === "") {
    res.status(400).send("Please enter a valid email and/or password");

  }

  users[user_ID] = {
    id: user_ID,
    email: req.body.email,
    password: req.body.password
  };
  
  res.cookie('user_ID', user_ID);
  res.redirect(`/urls`);
  

});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});