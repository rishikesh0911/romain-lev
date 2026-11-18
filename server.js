const express =require("express");

const app =express();
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const cors = require("cors");
app.use(cors({ origin: "http://localhost:3000" }));

connectDb();

const PORT =process.env.PORT || 3300;
app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
const errorHandler = require("./middleware/errorMiddleware");
app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});