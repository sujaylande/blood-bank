const express = require("express");
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 5000;
const dbConfig = require('./config/dbConfig.js');
app.use(express.json());

// routes:

const userRoutes = require('./routes/user.route.js');
const inventoryRoute = require('./routes/inventory.route.js');
const dashboardRoute = require('./routes/dashboard.route.js');


app.use('/api/users', userRoutes);
app.use('/api/inventory',inventoryRoute);
app.use('/api/dashboard', dashboardRoute);



// deployment config
const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}




app.listen(PORT, (err)=>{
    console.log(`Node js server started at ${PORT}`);
})