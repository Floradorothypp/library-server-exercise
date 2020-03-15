const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const events = require('./events');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'library',
	password: '123',
	database: 'library'
});

connection.connect();

const port = process.env.PORT || 8080;

const app = express().use(cors())
					 .use(bodyParser())
					 .use(events(connection));

app.listen(port, ()=>{
	console.log(`Express server listening on port ${port}`);
});

/*app.get('/', (req, res)=>{
	res.send("Hello World!");
});*/