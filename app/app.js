//Exemplo de Web Service REST utilizando NodeJS e MongoDB em Containers Docker

var express = require('express');
var mongo = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

mongo.connect('mongo:27017/testeapi');

//Esquema da collection do Mongo
var taskListSchema = mongo.Schema({
	descricao : { type: String }, 
	concluido : Boolean,
	updated_at: { type: Date, default: Date.now },
});


//Model da aplicação
var Model = mongo.model('Model', taskListSchema);

//GET param - Retorna o registro correspondente da ID informada
app.get("/get/:descricao?", function (req, res) {
	var descricao = req.params.descricao;
	Model.find({'descricao': descricao}, function(err, regs) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.json(regs);
		}
	});
});

//GET - Retorna todos os registros existentes no banco
app.get("/api/all", function (req, res) {
	Model.find(function(err, todos) {
		if (err) {
			res.json(err);
		} else {
			res.json(todos);
		}
	})
});

//POST - Adiciona um registro
app.post("/api/add", function (req, res) {
	var register = new Model({
		'descricao' : req.body.descricao,
		'concluido' : req.body.concluido
	});
	register.save(function (err) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.json({'status' : 200});
		}
	});
	res.send(register);
});

//PUT - Atualiza um registro
app.put("/api/add/:id", function (req, res) {
	Model.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    	res.json(post);
  });
});

//DELETE - Deleta um registro
app.delete("/api/delete/:id", function (req, res) {
 Model.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});	

//Porta de escuta do servidor
app.listen(8080, function() {
	console.log('Funcionando');
});

