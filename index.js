// Step 1: Import required modules
const express = require('express'); // Express framework
const app = express(); // Create an Express application
const mongoose = require('mongoose'); // Mongoose library for MongoDB interaction
const path = require('path'); // Node.js path module for working with file paths
const methodOverride = require('method-override'); // Middleware for HTTP method overriding
const User = require('./models/user'); // Import the User model defined in ./models/user.js







//Step 2: Set up the view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));




//Step 3: Set up middleware to handle form data and URL encoding
// Middleware for handling form data and URL encoding 
// use for req.body
app.use(express.urlencoded({ extended: true }));


 //Step 4: Set up middleware for method overriding
// Middleware for method overriding (to handle PUT/PATCH/DELETE requests)
app.use(methodOverride('_method'));



//Step 5: Connect to the MongoDB database
// Connect to the MongoDB database named "ISA-DB" running on localhost (127.0.0.1) on port 27017
mongoose.connect('mongodb://localhost:27017/curd')
    .then(() => { console.log('ISA-DB connected') })
    .catch((err) => { console.log(err) });





    //Step 6: Define the routes and their corresponding handlers
// Route for the homepage, responds with "Working Fine!" when accessed via HTTP GET on '/'
app.get('/', (req, res) => {
    res.send('Working Fine!');
});

// Route to display all users
app.get('/users',  async(req, res) => {
    const users = await User.find({});
    res.render('index', { users });
});


// Route to display the form for creating a new user
app.get('/user/new', (req, res) => {
    res.render('new');
});

// // Route for creating a new user
app.post('/users', async (req, res) => {
    const { name, age, email, contact, address, gender } = req.body;
    await User.create({ name, age, email, contact, address, gender });
    res.redirect('/users');
});

// // Route to display details of a specific user based on the provided ID
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render('show', { user });
});

// Route to display the form for updating a user's information
app.get('/users/:id/edit', async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render('edit', { user });
});

// // Route for updating a user's information
app.patch('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, email, contact, address, gender } = req.body;
    const user = await User.findById(id);
    user.name = name;
    user.age = age;
    user.email = email;
    user.contact = contact;
    user.address = address;
    user.gender = gender;
    await user.save()
    res.redirect('/users');
});

// // Route for deleting a user based on the provided ID
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.redirect('/users');
});








//Step 7: Start the server and listen on a specific port
// Start the server and listen on port 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log('Server is up at port', PORT);
});

