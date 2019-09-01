const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const hbs = require('handlebars');

//DEFINITION OF COMPILE FUNCTION
var compile=async function(templateName,queryResult){

  var filePath=path.join(process.cwd(),'templates2',`${templateName}.hbs`);
  
  var html=fs.readFileSync(filePath,'utf-8', function(err, result) {
    if (err) console.log("File read error", err);
  });

 // console.log(html);
  return hbs.compile(html)(queryResult);

};


(async function(){


  var queryResult = [{
    id: 216,
    lead_id: 73165,
    name: 'Siddharth Jha',
    image: '73165-Screenshot_20190625_220549.jpg',
    email: 'siddharth.jh2005@hotmail.com',
    mobile: '9958797991',
    address: 'Plot no 717A, Flat No F5, Sector5, Vaishali, Ghaziabad, UP',
    paymentMode: 'Pay U Money (Link Payment)',
    paymentTransaction: '254567806',
    dob: '1996-08-31',
    gender: 'Male',
    qualification: 'ECE, MS Engg Collage Bangalore, VTU, 2019',
    postQualification: 'NA',
    profession: 'NA',
    experience: '',
    expactation: 'Carrier Orientation',
    batch: 68,
    referral: 'Pushpen',
    added_date: '2019-06-25 22:20:23',
    is_deleted: 0,
    is_send_trainer: 0,
    is_send_venue: 0,
    is_repeat: 0,
    course: 'GST',
    batchDate: '2019-07-21',
    batch_detail: 68,
    date: '2019-08-14',
    day: '4',
    moodleuser: 73165,
    lms_mail: 1,
    payment_mail: 0
  
  }]

  try{
    var browser= await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true
  });

    for (var i = 0; i < queryResult.length; i++) {
    
    var page = await browser.newPage();
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
        pageRanges: '1-1',*/
      printbackground:true,
      fullpage:true
      
    });}
    
    //alert(' All Certificates Generated!!');
    console.log('done');
    /*alert('pdf generated check directory');*/
    /*console.log(cd);*/
  
  
  }
  catch(e){
    console.log('Error: ',e);

  }
})();