//IMPORT MODULES
const express = require("express");
const path = require("path");
const fs = require('fs');
const bodyParser = require("body-parser");
const hbs = require('handlebars');
const puppeteer = require('puppeteer');
const fileUpload = require('express-fileupload');
const csv = require('fast-csv');
const app = express();


//DEFINE PORT 
const port = process.env.PORT || 3000;


//IMPORT QUERY FUNCTIONS
const {getBatches, getStudentsByBatch} = require('./utils/queries');


//IMPORT CERTIFICATE GENERATOR FUNCTION
const generateCertificate = require('./utils/generate-certificate');


//IMPORT TODAY DATE
const todayDate = require('./utils/getTodayDate');


//SET OUTPUT FOLDER FOR GENERATED CERTIFICATE
const output = './output';


//USE BODY PARSER MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//USE TEMPLATE ENGINE
app.set("view engine", "hbs");


//USE FILE UPLOAD MIDDLEWARE
app.use(fileUpload());



//DEFINE ROUTES

//HOMEPAGE ROUTE
app.get('/',(req,res)=>{
  res.render('homepage');
});


//CRM ROUTE
app.get('/batches',(req,res)=>{
    getBatches((batches)=>{
      res.render('batches',{batches:batches});
    })
    
})


//GET BATCH STUDENTS ROUTES
app.get('/batch/:id',(req,res)=>{
    getStudentsByBatch(req.params.id,(students)=>{
      res.render('batch',{students:students});
    })
});


//GENERATE CERTIFICATE ROUTE
app.post('/generate-certificate', (req,res)=>{
  const id = req.body.id;
  const name = req.body.name;
  const course = req.body.course;
  const certificate = {
    id: id,
    name: name,
    course: course,
    date: todayDate
  };
  generateCertificate(certificate).then(status=>{
    if(status==true){
      res.json({status: 200, message: 'Certificate generated', success: true, error: false});
    }else{
      res.json({status: 500, message: 'Certificate generation failed', success: false, error: true});
    }
  }).catch(err=>{
    res.json({status: 500, message: 'Certificate generation failed', success: false, error: true, err: err});
  })
});


//UPLOAD CSV ROUTE
app.get('/upload-csv',(req,res)=>{
  res.render('upload-csv');
});

/* WORKED TILL HERE*/





var as='';
var ad='';

var token='';
var batch_date='';
  var course='';
  var length='';
  var csk=[];

app.post('/upload', function(req, res){
  if (req.files.length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  var csvFile = req.files.csvFile;
  var file2 = csvFile.name;
  ad=file2;
  as=file2.replace(/\.[^/.]+$/, "");
  var fileName = Date.now() + '.csv';

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./utils/'+ fileName, function(err) {
    if (err) return res.status(500).send(err);
    //Call Function to convert to json from file
  });
  
});


app.get("/db1",(req,resp)=>{



  
  
  var sql = 'SELECT * FROM cms WHERE token = ?';
  connection.query(sql, token, (err,results,fields)=>{
    if(err) throw err;
    queryResult=results;
    console.log(queryResult);
    var students;
resp.render('excel_table',{students:results});
  


   });

});

app.get("/db2",(req,resp)=>{


                    let que = `REPLACE INTO records(length,course,batch_date,token) VALUES ('${length}', '${course}', '${batch_date}','${token}');`
                    connection.query(que, (error, response) => {
                       
                     if(error) throw error;

                        console.log("records updated");
                        
                    });
});

app.get("/db3",(req,resp)=>{

var sql = 'SELECT * FROM records';
  connection.query(sql, (err,results,fields)=>{
    if(err) throw err;
   
    var jo;
resp.render('excel_table2',{jo:results});
  });
});


   

app.get('/certificate_no',(req,res)=>{
  res.render('base.hbs');
});




app.get('/show-certificates',(req,res)=>{
  var fileArray = [];
  fs.readdir(output, (err, files) => {
    files.forEach(file => {
      fileArray.push(file);
    });
    res.render('explorer',{files:fileArray});
  });
});


//RE-EDIT
app.get("/redit",function(req,res){
  res.render('edit-students');
});


//START APP ON GIVEN PORT
app.listen(port, ()=>{
  console.log(`My app started at port ${port}`);
});

