const express = require("express");
const app = express();
const connectDB = require("./config/db");
connectDB();
//init middlewares
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("Api running"));

//Define Routes
app.use("/api/users", require("./Routes/api/Users"));
app.use("/api/auth", require("./Routes/api/auth"));
app.use("/api/profile", require("./Routes/api/profile"));
app.use("/api/posts", require("./Routes/api/posts"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Started On Port ${PORT}`);
});
