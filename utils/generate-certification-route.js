const fs = require('fs');


//DEFINITION OF COMPILE FUNCTION
const  compile=async function(templateName,queryResult){
  var filePath=path.join(process.cwd(),'templates2',`${templateName}.hbs`);
  console.log(filePath)
  var html=fs.readFileSync(filePath,'utf-8', function(err, result) {
    if (err) console.log("Read File error", err);
  });

 console.log(html);
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