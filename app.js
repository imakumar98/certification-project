//IMPORT MODULES
const express = require("express");
const path = require("path");
const fs = require('fs');
const bodyParser = require("body-parser");
const hbs = require('handlebars');
const puppeteer = require('puppeteer');
const fileUpload = require('express-fileupload');
const file = require("fs");
const app = express();

//CODE TO REMOVE
const mysql = require('mysql');
const csv = require('fast-csv');
const XLSXtoMYSQL = require('xlsx-mysql');


//DEFINE PORT 
const port = process.env.PORT || 3000;


//IMPORT DATABASE CONNECTION FILE
const connection = require('./config/connection');


//IMPORT CERTIFICATE GENERATOR FUNCTION
const generateCertificate = require('./utils/generate-certificate');


//IMPORT TODAY DATE
const todayDate = require('./utils/getTodayDate');


//SET OUTPUT FOLDER FOR GENERATED CERTIFICATE
// const pdfFolder = './downloads';


//USE BODY PARSER MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//USE TEMPLATE ENGINE
app.set("view engine", "hbs");
// app.set("downloads", path.join(__dirname, "downloads"));


//DEFINE STATIC FOLDER
app.use(express.static('public'));


//USE FILE UPLOAD MIDDLEWARE
app.use(fileUpload());


// app.use(express.urlencoded());

// app.use(express.static('templates2'));






// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, "downloads")));
var handlebars;




//DEFINE ROUTES


//HOMEPAGE ROUTE
app.get('/',(req,res)=>{
  res.render('homepage');
});


//CRM ROUTE
app.get('/batches',(req,res)=>{
  connection.query("SELECT * FROM batch WHERE is_deleted = '0' order by bid desc",(err, batches, fields)=>{
      if(err) throw err;
      res.render('batches',{batches:batches});
  })
})


//GET BATCH STUDENTS ROUTES
app.get('/batch/:id',(req,res)=>{
    connection.query("SELECT r.*, l.batch, l.id as lead_id ,x.bid as batch,x.course,x.batchDate,k.batch_id as batch_detail,k.date,k.day, md.lead_id as moodleuser, md.lms_mail, md.payment_mail FROM registration r LEFT JOIN lswsheets l ON l.id = r.lead_id LEFT JOIN moodle_user md ON md.lead_id = l.id LEFT JOIN batch_detail k ON   k.batch_id=l.batch  AND day=4 LEFT JOIN batch x ON x.bid=l.batch     WHERE l.batch  ='"+req.params.id+"'",(err, result, fields)=>{
      if(err) throw err;
      res.render('batch',{students:result});
    });
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



//GENERATE FROM CSV ROUTE
app.get('/upload-csv',(req,res)=>{
  res.render('upload-csv');
});





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

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  
  
var file2=sampleFile.name;
ad=file2;
  as=file2.replace(/\.[^/.]+$/, "");

  var fileName = Date.now() + '.csv';

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./utils/'+ fileName, function(err) {
    if (err) return res.status(500).send(err);
    importCsvData2MySQL('./utils/'+fileName);


function importCsvData2MySQL(filename){
    let stream = fs.createReadStream(filename);
    let csvData = [];
    let csvStream = csv
        .parse()
        .on("data", function (data) {
            csvData.push(data);
        })
        .on("end", function () {
            // Remove Header ROW
            csvData.shift();
            token= csvData[1][7];
            batch_date=csvData[1][4];
            course=csvData[1][2];
            length=csvData.length;
            
              /*csk.push(length);*/
              csk.push(course);
              csk.push(batch_date);
              csk.push(token);
console.log(csk);

// console.log(csvData);
            
            
            
                    let query = 'REPLACE INTO cms(s_no, name, course, certificate_no, batch_date, email, contact, token) VALUES ?';
                    // let query = 'REPLACE INTO cms(course,batch_date,token) VALUES ?';
                    connection.query(query, [csvData], (error, response) => {
                      if(error) throw error;

                       
                      

                        console.log("done");
                 
                        
                    });
                    
                
            
        });

    stream.pipe(csvStream);
                               }


     
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
  fs.readdir(pdfFolder, (err, files) => {
  files.forEach(file => {
    fileArray.push(file);

  });
  
  res.render('explorer.hbs',{files:fileArray});
});

  

  

});

app.get("/redit",function(req,res){
console.log(queryResult);
res.render('students2',{students2:queryResult});

});


//START APP ON GIVEN PORT
app.listen(port, ()=>{
  console.log(`My app started at port ${port}`);
});

