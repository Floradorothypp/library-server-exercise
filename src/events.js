const express = require('express');
const fs = require('fs');
const path = require('path');

function createRouter(db){
	const router = express.Router();
	const owner = '';
	const delimiter = '.';

	router.get('/', (req, res)=>{
		res.status(200).send({message:"Hello from the server!"});
	});

	router.post('/event', (req, res, next)=>{
		db.query(
			'INSERT INTO events (owner, name, description, date, author) VALUES (?,?,?,?,?)',
			[owner, req.body.name, req.body.description, new Date(req.body.date), req.body.author],
			(error) => {
				if(error){
					console.error(error);
					res.status(500).json({status:'error'});
				}
				else{
					res.status(200).json({status:'ok'});
				}
			}
		);
	});

	router.get('/event', (req, res, next)=>{
		db.query(
			'SELECT id, name, description, date, author FROM events WHERE owner=? ORDER BY date LIMIT 10',
			[owner],
			(error, results)=>{
				if(error){
					console.log(error);
					res.status(500).json({status:'error'});
				}
				else{
					console.log('Get all data');
					res.status(200).json(results);
				}
			}
		);
	});

	router.get('/event/:id', (req, res, next)=>{
		db.query(
			'SELECT id, name, description, date, author FROM events WHERE id=? ORDER BY date LIMIT 10',
			[req.params.id],
			(error, results)=>{
				if(error){
					console.log(error);
					res.status(500).json({status:'error'});
				}
				else{
					console.log("Get one data with id");
					res.status(200).json(results);
				}
			}
		);
	});

	router.get('/event/cover/:id', (req, res, next)=>{
		db.query(
			'SELECT id, coverpage, coverpath, covertype FROM events WHERE id=? ORDER BY date LIMIT 10',
			[req.params.id],
			(error, results)=>{
				if(error){
					console.log(error);
					res.status(500).json({status:'error'});
				}
				else{
					let resultsJson = JSON.parse(JSON.stringify(results));
					if(results.length && req.params.id == resultsJson[0].id){
						let covername = resultsJson[0].coverpage;
						covername += resultsJson[0].id;
						covername += delimiter;
						covername += resultsJson[0].covertype;
						console.log("Book's name is "+covername);

						let dir = path.join(resultsJson[0].coverpath, covername);
						let s = fs.createReadStream(dir);
						s.on('open', ()=>{
							res.setHeader('Content-Type', 'image/png');
							s.pipe(res);
						});
						s.on('error', ()=>{
							res.status(404).json({message:"Not found"});
						});
					}
					else{
						res.status(404).json({message:"Not found or not match"});
					}
				}
			}
		);
	});

	router.put('/event/:id', (req, res, next)=>{
		db.query(
			'UPDATE events SET name=?, description=?, date=?, author=? WHERE id=? AND owner=?',
			[req.body.name, req.body.description, new Date(req.body.date), req.body.author, req.params.id, owner],
			(error)=>{
				if(error){
					res.status(500).json({status:'error'});
				}
				else{
					res.status(200).json({status:'ok'});
				}
			}
		);
	});

	router.delete('/event/:id', (req, res, next)=>{
		db.query(
			'DELETE FROM events WHERE id=? AND owner=?',
			[req.params.id, owner],
			(error)=>{
				if(error){
					res.status(500).json({status:'error'});
				}
				else{
					res.status(200).json({status:'ok'});
				}
			}
		);
	});

	return router;
}

module.exports = createRouter;