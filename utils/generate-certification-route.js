const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const hbs = require('handlebars');



hbs.registerHelper('ifeq', (a, b, options) => {
  if (a === b) {
    return options.fn(this)
  }
  return options.inverse(this)
})



//DEFINITION OF COMPILE FUNCTION
const compile = async function(frame,details){
  var filePath=path.join(process.cwd(),'views',`${frame}.hbs`);
  
  var html=fs.readFileSync(filePath,'utf-8', function(err, result) {
    if (err) console.log("File read error", err);
    console.log(result);
  });
  return hbs.compile(html)(details);

};




 function generateCertificate(certificate){
  return new Promise(async function(resolve, reject){
    try{
      var browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: true
      });

      var page = await browser.newPage();

      var content = await compile('certificate-frame',certificate);
    
      await page.setContent(content);

      await page.setViewport({
        width: 1024,
        height: 730,
        deviceScaleFactor: 3
      });

      await page.emulateMedia('screen');

      await page.screenshot({
        path:'./downloads/'+'test-me'+'.png',
        fullpage:true
      });

      await browser.close();
      process.exit();
      resolve("Certificate generated");
    }
    catch(e){
      reject("Function failed "+e);
    }
  });
}



const certificate = {
  name: 'Ashwani', 
  course: 'GST',
  id: '1234'
}

generateCertificate(certificate);






// (async function(){

  




  
// })();


      //res.send("Hello");