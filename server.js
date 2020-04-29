// Setup empty JS object to act as endpoint for all routes
const projectData = [];

//Require Body Parser and CORS middlewares
const bodyParser = require('body-parser');
const cors = require('cors');

// Require Express to run server and routes
const express = require('express');


// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

//Get Route
app.get('/getProjectData', (req, res) => {
    res.send(projectData);
})

app.post("/addData", addData);

function addData(req, res){
    projectData.push(req.body);
    console.log(projectData);
}


// Setup Server
const port = 8080;
app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
})