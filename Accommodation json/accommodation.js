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


for (let i = 0; i < inputJSON.length /*&& i < 50*/; i++) {
	//treatSearch.push("https://www.google.com/search?q="+keyword+"+"+inputJSON.links[i].link);
	let resultsLink = {
		id: inputJSON[i].id,
		link: inputJSON[i].link,
		name: inputJSON[i].name,
		results: []
	};
	resultsLinks.push(resultsLink);
	treatSearch.push(keyword+" "+ inputJSON[i].link);
}

console.log(treatSearch.length);
// Promises
// ref: https://stackoverflow.com/questions/50924814/node-js-wait-for-multiple-async-calls-to-finish-before-continuing-in-code
function asyncFun(index, term){
	return new Promise(resolve => {
		googleIt({'query': term, 'limit': 2, 'disableConsole': true}).then(results => {
			for (let j = 0; j < results.length; j++) {
				resultsLinks[index].results.push(results[j]);
			}
			console.log("Done #"+index)
			resolve(true);
			return;
		}).catch(e => {
			console.log(e);
			resolve(false);
		});
	});
};

function performSearch(terms, start, end){
	const promises = [];
	for(let i = start; i < terms.length && i < end; i++) {
		promises.push(asyncFun(i, terms[i]));
	}
	return Promise.all(promises);
}

var p = Promise.resolve();
p = p.then(() => {
	return performSearch(treatSearch);
});

for (let i = 0; i < treatSearch.length; i+= 10) {
	p = p.then(() => {
		return performSearch(treatSearch, i, i + 10);
	});
}
p.then(()=>{
	let output = JSON.stringify(resultsLinks);
	fs.writeFileSync('accommodation.json', output);
})