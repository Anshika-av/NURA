
const express = require('express');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json());

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NURA backend is running!',
  });
});

app.listen(PORT, () => {
  console.log(`NURA server running on port ${PORT}`);
});
