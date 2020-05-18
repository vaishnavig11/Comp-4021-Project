var request = require("request");
var cheerio = require("cheerio");
const fs = require("fs");

var nameurl = 'https://seng.ust.hk/academics/undergraduate/exchange';


request.get(nameurl,function(err,res,body){
    let university = []
    if(!err){
        $ = cheerio.load(body);
        $('div').each(function(i, elem) {
            if ($(this).text() == 'United States of America') {
                $ = cheerio.load($(this).next().html())
                $('li a').each(function(i, elem) {
                    inputJSON.name
                    let uniJSON ={
                        id: i+1,
                        link: $(this).attr('href'),
                        name: $(this).text()
                    };
                    // console.log($(this).attr('href')+" "+$(this).text()+" #"+i);
                    university.push(uniJSON);
                })
            }
        })
    }
    for(var i = 1; i < university.length; i ++){
        console.log(university[i]);
    }
    let output = JSON.stringify(university);
	fs.writeFileSync('link.json', output);
});