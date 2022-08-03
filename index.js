// index.js
const express = require("express");
const connectDB = require("./db")
const app = express();
const port = 5000;
const cookieParser = require('cookie-parser');

app.get("/", (req, res) => {
    res.send("API RUNNING...");
})
// allow us to get the data in request.body
app.use(express.json({ extended: false })); 
// Define Routes
app.use("/api/register", require("./routes/api/register"));
connectDB();
app.use("/api/auth", require("./routes/api/auth"));
app.use(cookieParser());
app.get('/api/logOut', function(req, res) {
    return res.clearCookie('User').end();
});
app.listen(port, () => console.log(`Server started on port ${port}`));