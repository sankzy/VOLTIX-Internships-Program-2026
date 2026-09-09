require("dotenv").config();
const createApp = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 4000;
const app = createApp();

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  });
