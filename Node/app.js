const port = 3333;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());


// Send an Object
app.route('/api/cats').post((req, res) => {
  res.send(201, req.body);
});

// Change an Object
app.route('/api/cats/:name').put((req, res) => {
  res.send(200, req.body);
});

// Get an Object
app.route('/api/cats/:name').get((req, res) => {
  const requestedCatName = req.params['name'];
  res.send({ name: requestedCatName });
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(port, function () {
  console.log('Server is running on http://localhost:' + port);
});

