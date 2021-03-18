//Helper functions

//Generates a random string

const generateRandomString = function () {
  const randomString = "1234567890abcdefghijklmnopqrstuvwxyz";
  let output = "";
  for (let i = 0; i < 6; i++) {
    output += randomString.charAt(Math.floor(Math.random() * randomString.length));
  }
  return output;
};

//Adds new user to the database of user or URL

const createNewUser = function(urlDatabase, email, password, user) {
  
  const newUser = {
    id: user,
    email: email,
    password: password
  };

  urlDatabase[user] = newUser;
};

//Finding user by email

const getUserByEmail = function(email, database) {
  
  const userInDb = Object.values(database).find(user => user.email === email);
  
  return userInDb;
};


module.exports = { generateRandomString, createNewUser, getUserByEmail };