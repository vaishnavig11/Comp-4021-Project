var request = require("request");
var cheerio = require("cheerio");
const fs = require("fs");
var httpUrl = "https://crtran.ust.hk/credit_instit"
var base = 'https://crtran.ust.hk/credit_instit?asOfTermCode=1910' //&orgID='
//var uurl = ""
var uurl = 'https://crtran.ust.hk/credit_instit?asOfTermCode=1910&orgID=B0249'
var nameurl = 'https://seng.ust.hk/academics/undergraduate/exchange'

let rawdata = fs.readFileSync('join_link_location.json');
let inputJSON = JSON.parse(rawdata);

var uniList = []

// for scrap link
/* inputJSON.forEach(element => {
    element.link = ""
}); */


// for credit transfer
inputJSON.forEach(element => {
    element.courses = [];
    uniList[element.id - 1] = element.name;
});

// request.get(httpUrl,function(err,res,body){
//     if(!err){
//         $ = cheerio.load(body);
//         $('option').each(function(i, elem) {
//             if($(this).text() == 'Rice University') {
//                 uurl = base + $(this).attr('value')
//                 console.log(uurl)
//                 return;
//             }
//         });
//     }
// });

// for generate join_link_location_credit.json
request.get(base,function(err,res,body){
    //var course = [];
    var item = {
        exchangeCourse: "",
        hkustCourse: ""
    }
    if(!err){
        $ = cheerio.load(body);
        $('tr').each(function(i, elem) {
            // comparing the
            let index = uniList.indexOf($(this).children().first().children().first().children().first().text());
            if (index !== -1) {
                item = {
                    // university name: $(this).children().first().children().first().children().first().text()
                    exchangeCourse: $(this).children().first().children().first().children().first().next().text(),
                    hkustCourse: $(this).children().first().next().text(),
                    hkustCode: $(this).children().first().next().text().split(" ")[0]
                }
                inputJSON[index].courses.push(item);
                //course.push(item);
                //course[i] = $(this).children().first().next().text();//.split(" ")[0] ;
            }
        });
    }
    let output = JSON.stringify(inputJSON);
    // fs.writeFileSync('credit_transfer.json', output);
    fs.writeFileSync('join_link_location_credit.json', output);
    //console.log(inputJSON);
    // for(var i = 1; i < course.length; i ++){
    //     console.log(course[i])
    // }
});

// for generate link.json
/* request.get(nameurl,function(err,res,body){
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
}); */


