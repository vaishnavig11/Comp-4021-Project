const fs = require("fs");
// const cheerio = require("cheerio");
// const axios = require("axios");
// var scraper = require("google-search-scraper");
const  googleIt = require('google-it');

let rawdata = fs.readFileSync('link.json');
let inputJSON = JSON.parse(rawdata);
let keyword = "exchange housing accommodation";

var resultsLinks = [];
var treatSearch = [];
var f = false;

for (const i in inputJSON.links) {
	//treatSearch.push("https://www.google.com/search?q="+keyword+"+"+inputJSON.links[i].link);
	let resultsLink = {
		searchLink: inputJSON.links[i].link,
		results: []
	};
	resultsLinks.push(resultsLink);
	treatSearch.push(keyword+" "+ inputJSON.links[i].link);
}

// Promises
// ref: https://stackoverflow.com/questions/50924814/node-js-wait-for-multiple-async-calls-to-finish-before-continuing-in-code
function asyncFun(index, term){
	return new Promise(resolve => {
		googleIt({'query': term, 'limit': 2, 'disableConsole': true}).then(results => {
			for (let j = 0; j < results.length; j++) {
				resultsLinks[index].results.push(results[j]);
			}
			resolve(true);
			return;
		});
	});
};

function performSearch(terms){
	const promises = [];
	for(let i = 0; i < terms.length; i++) {
		promises.push(asyncFun(i, terms[i]));
	}
	return Promise.all(promises);
}

let p = Promise.resolve();
p = p.then(() => {
	return performSearch(treatSearch);
});
p.then(()=>{
	let output = JSON.stringify(resultsLinks);
	fs.writeFileSync('accommodation.json', output);
})