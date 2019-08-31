var express = require("express");
 var path = require("path");



 const pdfFolder = './downloads';
const fs = require('fs');

var db = require('./db');
 
  var bodyParser = require("body-parser");

  app = express();

  const puppeteer=require('puppeteer');


var hbs=require('handlebars');
app.set("view engine", "hbs");

app.set("views", path.join(__dirname, "views"));
app.set("downloads", path.join(__dirname, "downloads"));


app.use(express.urlencoded());

app.use(express.static('templates2'));



const XLSXtoMYSQL = require('xlsx-mysql');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "downloads")));
var handlebars;


const fileUpload = require('express-fileupload');
app.use(fileUpload());

const file=require("fs");
var mysql = require('mysql');

app.get('/',function(request,response){
response.render('start2');
});






app.get('/app2',function(request,response){
response.render("page.hbs")
});

const csv = require('fast-csv');


var as='';
var ad='';
var queryResult = '';
var queryl='';
var token='';
var batch_date='';
  var course='';
  var length='';
  var csk=[];

app.post('/upload', function(req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  
  
var file2=sampleFile.name;
ad=file2;
  as=file2.replace(/\.[^/.]+$/, "");

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./utils/'+sampleFile.name, function(err) {
    if (err) return res.status(500).send(err);
    importCsvData2MySQL('./utils/'+as+'.csv');


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
            token= csvData[1][6];
            batch_date=csvData[1][4];
            course=csvData[1][2];
            length=csvData.length;
            
              /*csk.push(length);*/
              csk.push(course);
              csk.push(batch_date);
              csk.push(token);
console.log(csk);
            
            
           

            const connection = mysql.createConnection({
                
      host     : 'localhost',
      user     :"henrqfaw_henry",
      password : "^*OWu&u(Bbw=",
      database : "henrqfaw_henry"
            });

            // Open the MySQL connection
            connection.connect((error) => {
                if (error) {
                    console.error(error);
                } else {
                    let query = 'REPLACE INTO cms(s_no,name,course,certificate_no,batch_date,email,token) VALUES ?';
                    connection.query(query, [csvData], (error, response) => {
                      if(error) throw error;

                       
                      

                        console.log("done");
                 
                        
                    });
                    
                }
            });
        });

    stream.pipe(csvStream);
                               }


     
  });
  
});


app.get("/db1",(req,resp)=>{



  
  
  var sql = 'SELECT * FROM cms WHERE token = ?';
  db.query(sql, token, (err,results,fields)=>{
    if(err) throw err;
    queryResult=results;
    console.log(queryResult);
    var students;
resp.render('excel_table',{students:results});
  


   });

});

app.get("/db2",(req,resp)=>{


                    let que = `REPLACE INTO records(length,course,batch_date,token) VALUES ('${length}', '${course}', '${batch_date}','${token}');`
                    db.query(que, (error, response) => {
                       
                     if(error) throw error;

                        console.log("records updated");
                        
                    });


 



});

app.get("/db3",(req,resp)=>{

var sql = 'SELECT * FROM records';
  db.query(sql, (err,results,fields)=>{
    if(err) throw err;
   
    var jo;
resp.render('excel_table2',{jo:results});
  });
});












app.get('/table2',(req,res)=>{


  var connection = mysql.createConnection({
      multipleStatements: true,
      
      host     : 'localhost',
      user     :"henrqfaw_henry",
      password : "^*OWu&u(Bbw=",
      database : "henrqfaw_henry"
  }); 

  connection.connect((err)=>{
    if(err) throw err;
    var fg=4;
    
    connection.query("SELECT* FROM batch WHERE is_deleted = '0' order by bid desc",(err, result, fields)=>{
      /*connection.query(sql,(err, result, fields)=>{*/
      if(err) throw err;
      //var result=result[0]+result[1];
/*                console.log(result);*/

var students;
res.render('table2',{students:result});



      
      
    });
    //connection.end();
  });


});

app.get('/students/:id',(req,res)=>{
  var connection = mysql.createConnection({
      /*multipleStatements: true,*/
      
      host     : 'localhost',
      user     :"henrqfaw_henry",
      password : "^*OWu&u(Bbw=",
      database : "henrqfaw_henry"
  }); 

  connection.connect((err)=>{
    if(err) throw err;
/*    var sql = "SELECT * FROM batch_detail WHERE is_deleted = '0' AND batch_id = 69 AND day='"+req.params.id+"'";
*/    
    
      connection.query("SELECT r.*, l.batch, l.id as lead_id ,x.bid as batch,x.course,x.batchDate,k.batch_id as batch_detail,k.date,k.day, md.lead_id as moodleuser, md.lms_mail, md.payment_mail FROM registration r LEFT JOIN lswsheets l ON l.id = r.lead_id LEFT JOIN moodle_user md ON md.lead_id = l.id LEFT JOIN batch_detail k ON   k.batch_id=l.batch  AND day=4 LEFT JOIN batch x ON x.bid=l.batch     WHERE l.batch  ='"+req.params.id+"'",(err, result, fields)=>{
      if(err) throw err;
                 res.render('students',{students:result});
                queryResult=result;
                queryl=result.length;
                console.log(queryl);
                /*console.log(typeof(data));*/
//app.use(express.bodyParser())


 });
    //connection.end();
  });


});





app.post("/registeruser", function(req, resp) {
  /*console.log("values accepted!");*/
  var packet=req.body;

var jsonObj = {};
for (var i = 0 ; i < queryResult.length; i++) {
    /*jsonObj["newdate"+i] = packet[i];
    data[i].push(jsonObj);*/
    queryResult[i].newdate = packet[i];
    
}




});

app.get('/generate',(req,res)=>{
/*  res.render("prime",{length:length});*/
 

      var compile=async function(templateName,queryResult){
  var filePath=path.join(process.cwd(),'templates2',`${templateName}.hbs`);
  //console.log(filePath)
  var html=fs.readFileSync(filePath,'utf-8', function(err, result) {
    if (err) console.log("readFile error", err);
  });

 //console.log(result);
  return hbs.compile(html)(queryResult);

};


(async function(){

  try{
    var browser= await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true
  });

    for (var i = 0; i < queryResult.length; i++) {
    
    var page=await browser.newPage();
    if(queryResult[i].course=='GST'){
    
        var content= await compile('test11',queryResult[i]);
      }
    else if(queryResult[i].course=='CDCW'){
          var content= await compile('test12',queryResult[i]);
        }
    else if(queryResult[i].course=='CBAP'){

         var content= await compile('test13',queryResult[i]);

    } 

    else if(queryResult[i].course=='CSGB'){
      var content= await compile('test14',queryResult[i]);

    }  
    else{

      var content= await compile('test15',queryResult[i]);
    }
    await page.setContent(content);
    await page.setViewport({
        width: 1024,
        height: 730,
        deviceScaleFactor: 3
    });
    await page.emulateMedia('screen');

/*    await page.screenshot({fullPage: true, path: });
*/

   
    await page.screenshot({
      path:'./downloads/'+`${queryResult[i].name}`+(i+1)+'.png',
      /*width: '950px',
        height: '650px',
        pageRanges: '1-1',
      printbackground:true*/
      fullpage:true
      
    });}
    
    //alert(' All Certificates Generated!!');
    console.log('done');
    /*alert('pdf generated check directory');*/
    /*console.log(cd);*/
  
  
  }
  catch(e){
    console.log('our  error',e);

  }
})();


      //res.send("Hello");
     
});

   

app.get('/certificate_no',(req,res)=>{
  res.render('base.hbs');

});


app.get('/explorer',(req,res)=>{
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




app.post('/login',(req,res)=>{
  var username= req.body.username;
  var password= req.body.password;
  //res.render(__dirname+""+Login.html);
  console.log(username+''+password);

});


var port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`My app started at port ${port}`);
});

