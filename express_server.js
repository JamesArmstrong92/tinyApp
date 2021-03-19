//Dependencies

const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt');
const saltRounds = 10;

//Additional dependencies

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}));

//Helper Functions

const { generateRandomString, getUserByEmail, createNewUser} = require('./helperFunctions');

//Static users in database

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "bill@me.com",
    password: bcrypt.hashSync("test1", saltRounds)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("test2", saltRounds)
  }
};

//Static urls in database

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID"
  }
};

//JSON

app.get("/urls.json", (req, res) => {
  res.json(users); //only 1 of this will work at a time
  res.json(urlDatabase);
});

//Landing page

app.get("/", (req, res) => {
    
  const session = req.session.user_id;

  if (session && session !== null) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }

});


//Urls page

app.get("/urls", (req, res) => {
  
  const exisitingUser = users[req.session.user_id];
  
  const templateVars = {

    urls: urlDatabase,
    user: exisitingUser

  };

  res.render("urls_index", templateVars);
});

//Login page

app.get("/login", (req, res) => {
  
  const exisitingUser = users[req.session.user_id];

  const templateVars = {
    
    user: exisitingUser
  
  };

  res.render("urls_login", templateVars);
});

//Register page

app.get("/register", (req, res) => {
  
  const session = req.session.user_id;

  if (session && session !== null) {
    
    res.redirect("/urls");

  } else {
    const templateVars = {

      user: users[session]

    };
    res.render("urls_register", templateVars);
  }
});

//Creating new tiny URLs page

app.get("/urls/new", (req, res) => {
  const session = req.session.user_id;
  
  const templateVars = {
    
    user: users[session]
  };
  
  res.render("urls_new", templateVars);
  
});

//Edit page

app.get("/u/:shortURL", (req, res) => {

  let newURL = urlDatabase[req.params.shortURL].longURL;
  
  if (newURL) {
    
    res.redirect(newURL);
    
  } else (newURL === null);
  
  res.status(404).send("Please add http:// to the beginning of your URL");
  
});

//Storing short URLs

app.get("/urls/:shortURL", (req, res) => {
  
  let user1     = users[req.session.user_id];
  let longURL1  = urlDatabase[req.params.shortURL].longURL;
  let shortURL1 = req.params.shortURL;
  
  if (urlDatabase[req.params.shortURL]) {
    
    const templateVars = {
      shortURL: shortURL1,
      longURL: longURL1,
      user: user1
    };
    
    res.render("urls_show", templateVars);
  }
});

//Post responses

app.post("/urls", (req, res) => {
  
  let newID = generateRandomString();
  
  const newUrl = {

    longURL: req.body.longURL,
    userID: req.session.user_id

  };

  urlDatabase[newID] = newUrl;

  res.redirect("/urls/" + newID);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  
  if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    
    delete urlDatabase[req.params.shortURL];
    
    res.redirect("/urls");
  }
});


app.post("/register", (req, res) => {
  const newUser = generateRandomString();
  const password = bcrypt.hashSync(req.body.password, saltRounds);
  const email = req.body.email;
  
  if (req.body.email === "" || req.body.password === "") {
    
    res.status(400).send('Please enter a valid email and/or password');
    
  } else if (getUserByEmail(email, users)) {
    
    res.status(400).send('Seems like you are already registered. Please login!');

  } else {
    
    createNewUser(users, email, password, newUser);
    
    req.session['user_id'] = newUser;
    
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  
  let password = req.body.password;
  let email = req.body.email;
  
  const currentUser = getUserByEmail(email, users);
  if (currentUser) {
    if (bcrypt.compareSync(password, currentUser.password)) {

      req.session['user_id'] = currentUser.id;
      res.redirect("/urls");

    } else {

      res.status(401).send('Invalid Password');
    }
  } else {

    res.status(401).send('Invalid email');
  }
});

app.post("/urls/:shortURL/edit", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  
  req.session = null;
  res.redirect("/urls");

});

//Server

app.listen(PORT, () => {
  console.log(`Jims app listening on port: ${PORT}`);
});