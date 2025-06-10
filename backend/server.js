const dotenv = require('dotenv');
dotenv.config(); // ✅ Must be first

const app = require('./app');
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});