const express = require('express');
var app = express()
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var methodOverride = require('method-override');

mongoose.connect('mongodb://romilrh:Prime2Echoes$@todolist-shard-00-00-8zaps.mongodb.net:27017,todolist-shard-00-01-8zaps.mongodb.net:27017,todolist-shard-00-02-8zaps.mongodb.net:27017/todolist?ssl=true&replicaSet=todolist-shard-0&authSource=admin');

app.use(express.static(__dirname + '/public'))
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({'extended':'true'}))
app.use(bodyParser.json())
app.use(bodyParser.json({type:'application.vnd.api+json'}))
app.use(methodOverride())

app.listen(8080)
console.log('App listening on 8080');


var Todo = mongoose.model('todo', {
	text : String
})

app.get('/api/todos', (req, res) => {
	Todo.find((err, todos) => {
		if (err) {
			res.send(err)
		}

		res.json(todos)
	})
})

app.post('/api/todos', (req, res) => {
	Todo.create({
		text : req.body.text,
		done : false
	}, (err, todo) => {
		if (err) {
			res.send(err)
		}

		Todo.find((err, todos) => {
			if(err) {
				res.send(err)
			}
			res.json(todos)
		})
	})
})

app.delete('/api/todos/:todo_id', (req, res) => {
	Todo.remove({
		_id : req.params.todo_id
	}, (err, todo) => {
		if(err) {
			res.send(err)
		}

		Todo.find((err, todos) => {
			if(err) {
				res.send(err)
			}
			res.json(todos)
		})
	})
})



app.get('*', (req, res) => {
	res.sendFile('./public/index.html')
})
