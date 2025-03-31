const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const departments = [
  { id: 1, name: "Administration" },
  { id: 2, name: "Customer Service" },
  { id: 3, name: "Human Resources" }
];

app.get('/api/departments', (req, res) => {
  res.json(departments);
});

app.listen(3000, () => console.log('3000'));
