const axios = require('axios');
const cheerio = require('cheerio');
var request = require('request');
fs = require('fs');


try {
  if (fs.existsSync('location.json')) {
    // delete file if exists
    fs.unlinkSync('location.json');
  }
} catch(err) {
  console.error(err)
}

let rawdata = fs.readFileSync('rank.json');
let inputJSON = JSON.parse(rawdata);
var resultsLinks = [];

// const url = 'https://www.google.com/search?q=' 
const url ="https://www.findlatitudeandlongitude.com/l/"

// all url in this dict 
var locationdict={};

for (let i = 0; i < inputJSON.length; i++) {
    
	let resultsLink = {
		    id: inputJSON[i].id,
        name: inputJSON[i].name,
        term: inputJSON[i].term,
        minCGA: inputJSON[i].minCGA,
        english: inputJSON[i].english,
        rank: inputJSON[i].rank,
        SplNotes: inputJSON[i].SplNotes,
        location: []
    };
    resultsLinks.push(resultsLink);
    
    var uniname = inputJSON[i].name
    // var uniname = (inputJSON[i].name).split("--")[0]

    
    if(!(uniname.includes("University of California"))){
      uniname = uniname.split("--")[0]
    } else if(uniname.includes("University of California")){
      uniname = uniname.replace("--", " ");
    }
  
    if(uniname.includes(" & ")){
      uniname = uniname.replace(" & ", " and ");
    }

    // console.log(uniname)
    var encoded = encodeURIComponent(uniname);
    // https://www.findlatitudeandlongitude.com/l/Arizona%20State%20University

    locationdict[inputJSON[i].id] = url+encoded
}

// console.log(resultsLinks);

function asyncFun(id, url){
    return new Promise(resolve => {

      axios(url).then((res) => {
      const html = res.data;
      const $ = cheerio.load(html);

      rankinpage = 0;
      // console.log(url);

      var latitude = $('#lat_address').children().first().next().text().trim();
      latitude =  parseFloat(latitude)
      latitude = latitude.toFixed(3);
      var longitude = $('#lon_address').children().first().next().text().trim();
      longitude =  parseFloat(longitude)
      longitude = longitude.toFixed(3);


      locationdict[id]= [latitude,longitude]

      resolve(true);
      return;
  }).catch(e => {
        console.log(e);
        resolve(false);
      });

    });
  };

function performSearch(locationdict){
  const promises = [];
  
  for (var key in locationdict) {
      if (locationdict.hasOwnProperty(key)) {
          promises.push(asyncFun(key, locationdict[key]));
      }
  }
  return Promise.all(promises);
}
  
let p = Promise.resolve();
p = p.then(() => {
  
  return performSearch(locationdict);
});

p.then(()=>{
  for (let i = 0; i < resultsLinks.length; i++) {
    
    var id = resultsLinks[i].id 

    resultsLinks[i].location.push(parseFloat(locationdict[id][0]));
    resultsLinks[i].location.push(parseFloat(locationdict[id][1]));
  }

  console.log(resultsLinks)
  let output = JSON.stringify(resultsLinks);
  fs.writeFileSync('location.json', output);


})