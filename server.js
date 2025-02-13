import express from  "express";

const app = express();

app.get("/",(req,res)=>{
    res.send("Api is running");
})

const PORT = process.env.PORT || 5000;

console.log(`Server is running on port ${PORT}`);

app.listen(PORT);