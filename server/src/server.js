require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`NURA server running on port ${PORT}`);
});
