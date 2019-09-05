//IMPORT MODULE
const axios = require("axios");

// //FUNCTION TO CALL API

// const API_URL = 'http://henryharvin.website/imakumar/api.php';

// const TOKEN = '';


// // function query(sql){
// // 	return new Promise(function(resolve, reject){
		
// // 	})
// // }



// // 

axios({
  method: 'post',
  url: 'http://henryharvin.website/imakumar/api.php',
  data: {
    query: "SELECT * FROM batch",
    token: '1234'
  },
  headers: {'Content-Type': 'multipart/form-data'}
}).then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });


// axios.post('http://henryharvin.website/imakumar/api.php', {
//     query: "SELECT * FROM batch",
//     token: '1234'
//   })
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });