const express = require('express');
const app = express();

app.get("/",(req,res)=>{
    res.send("hello this is my homepage");
});

app.get("/about",(req,res)=>{
    res.send("hello this is my about");
});



var port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`My app started at port ${port}`);
});
