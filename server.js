const fastify = require('fastify')({
  logger: true
})

fastify.use(require('cors')());
const mongoose = require('mongoose');
const url = 'mongodb://admin:rama@ds014808.mlab.com:14808/empdb';

var Schema = mongoose.Schema;

var empSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  age: Number,
  phone: String,
  department: String,
  designation: String,
  salary: Number
});

var Employee = mongoose.model('employee', empSchema);

const schema = {
  body: {
    type: 'object',
    properties: {
      firstname: { type: 'string' },
      lastname: { type: 'string' },
      gender: { type: 'string' },
      email: { type: 'string' },
      age: { type: 'number' },
      phone: { type: 'string' },
      department: { type: 'string' },
      designation: { type: 'string' },
      salary: { type: 'number' }
    }
  }
}

mongoose.connect(url);

fastify.post('/create', { schema }, function (req, reply) {
  const newEmp = new Employee(req.body.person);
  newEmp.save().then((result) => {
    reply.send(result);
  });
});

fastify.delete('/delete/:id', function (req, reply) {
  Employee.deleteOne({ _id: req.params.id }, function (err, res) {
    if (err) {
      fastify.log.error(err);
    }
    reply.send(res);
  });
});


fastify.put('/update', function (req, reply) {
  Employee.findByIdAndUpdate({ _id: req.body._id }, req.body, function (err, res) {
    if (err) {
      fastify.log.error(err);
    }
    reply.send(res);
  });
});

fastify.get('/all', function (req, reply) {
  Employee.find({}, function (err, person) {
    if (err) return handleError(err);
    reply.send(person);
  });
});

fastify.get('/', function (req, reply) {
  reply.send({ app: 'Employee CRUD PWA App using fasitfy and next.js' });
})

fastify.listen(5000, function (err) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`server listening on ${fastify.server.address().port}`);
})