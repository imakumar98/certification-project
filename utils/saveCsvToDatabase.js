//IMPORT MODULES
const fastCSV = require('fast-csv');
const fs = require('fs');





function saveCsvToDatabase(fileName){

    let stream = fs.createReadStream(fileName);
    let csvData = [];
    let csvStream = fastCSV.parse()
        .on("data", function (data) {
            csvData.push(data);
        })
        .on("end", function () {
            csvData.shift();
            token = csvData[1][6];
            batch_date=csvData[1][4];
            course=csvData[1][2];
            length=csvData.length;
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