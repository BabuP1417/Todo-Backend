const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const connectionString = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

async function run() {
  try {
    const client = new MongoClient(connectionString);
    await client.connect();
    const database = client.db('todoapp'); // Replace with your database name
    const todos = database.collection('todos');

    app.get('/todos', async (req, res) => {
      const allTodos = await todos.find({}).toArray();
      res.json(allTodos);
    });

    app.post('/todos', async (req, res) => {
      const newTodo = req.body;
      const result = await todos.insertOne(newTodo);
      res.json(result);
    });

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

run();