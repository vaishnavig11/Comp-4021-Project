const axios = require('axios');
const cheerio = require('cheerio');
var request = require('request');
fs = require('fs');


// try {
//   if (fs.existsSync('universityRanking.txt')) {
//     // delete file if exists
//     fs.unlinkSync('universityRanking.txt');
//   }
// } catch(err) {
//   console.error(err)
// }

try {
  if (fs.existsSync('rank.json')) {
    // delete file if exists
    fs.unlinkSync('rank.json');
  }
} catch(err) {
  console.error(err)
}

let rawdata = fs.readFileSync('StartingInfo.json');

var resultsLinks = [];
let inputJSON = JSON.parse(rawdata);
var urls= [];
let dictrank = {};


for (i = 1; i <= 55; i++) {
    const url = 'https://www.usnews.com/best-colleges/search?_sort=rank&_sortDirection=asc&study=Engineering&_mode=table&_page=' +i;
    urls.push(url);
}

for (let i = 0; i < inputJSON.length; i++) {
	let resultsLink = {
		id: inputJSON[i].id,
    name: inputJSON[i].name,
    term: inputJSON[i].term,
    minCGA: inputJSON[i].minCGA,
    english: inputJSON[i].english,
    SplNotes: inputJSON[i].SplNotes,
		rank: 'NA'
	};
	resultsLinks.push(resultsLink);
}

// console.log(resultsLinks)

function asyncFun(page, url){
    return new Promise(resolve => {

      axios(url).then((res) => {
      const html = res.data;
      const $ = cheerio.load(html);
      // console.log(url)
      // console.log('page ' + page)
      // var uniNames = []
      rankinpage = 0;
      const unilist = $('.TableTabular__TableContainer-febmbj-0.guaRKP > tbody > tr >td ');
      
      // rankingresultperpage[page] = new Array(20);
      unilist.each(function() {
          
          let title = $(this).find('div').attr("name");
          
          if (typeof(title) == 'string') {
              rankinpage= rankinpage+1;
              overallrank = rankinpage + (20 * (page-1))
              dictrank[title]= overallrank;
        
              // fs.appendFileSync('universityRanking.txt', overallrank +" " +title + '\n', function (err) {
              //   if (err) return console.log(err);
              // });
          }            
      });
      console.log("Done #"+page)
      resolve(true);
      return;
			// return dictrank;
  }).catch(e => {
        console.log(e);
        resolve(false);
      });

    });
  };


function performSearch(urls){
  const promises = [];
  for(let i = 0; i < urls.length; i++) {
    promises.push(asyncFun(i+1, urls[i]));
  }
  return Promise.all(promises);
}
  
let p = Promise.resolve();
p = p.then(() => {
  return performSearch(urls);
});


p.then(()=>{

  for (let i = 0; i < resultsLinks.length; i++) {
    var uniname = resultsLinks[i].name 
    
    if(uniname in dictrank){
      resultsLinks[i].rank = dictrank[uniname];
    }

  }
  console.log(resultsLinks)
  let output = JSON.stringify(resultsLinks);
  fs.writeFileSync('rank.json', output);
})




