var request = require("request");
var cheerio = require("cheerio");
const fs = require("fs");
var httpUrl = "https://crtran.ust.hk/credit_instit"
var base = 'https://crtran.ust.hk/credit_instit?asOfTermCode=' //&orgID='
//var uurl = ""
var uurl = 'https://crtran.ust.hk/credit_instit?asOfTermCode=1910&orgID=B0249'
var nameurl = 'https://seng.ust.hk/academics/undergraduate/exchange'

let rawdata = fs.readFileSync('combine.json');
let inputJSON = JSON.parse(rawdata);

let current = new Date();
//          [Jan  ,  Feb,  Mar,  Apr,  May,  Jun,  Jul,  Aug,  Sep,  Oct,  Nov, Dec ]
//         Winter | Spring              | Summer      | Fall                    | Winter
let month = ["20" , "30", "30", "30", "40", "40", "40", "10", "10", "10", "10", "20"];
base += current.getFullYear().toString().substr(-2, 2) + month[current.getMonth()-1];

console.log(base);

var uniList = []

// for scrap link
/* inputJSON.forEach(element => {
    element.link = ""
}); */
function clean(words) {
    words = words.replace(/&/g, "and");
    words = words.replace(/the/g, "");
    words = words.replace(/The/g, "");
    words = words.replace(/-/g, "");
    if (words.includes("University of Illinois,")){
        words = words.substring(0, words.indexOf(","));
        console.log(words);
    }
    if (words.includes("Stony Brook"))
    words = "Stony Brook";
    words = words.replace(/,/g, "");
    words = words.replace(/ /g, "");
    words = words.toLowerCase();
    if (words.includes("illinois"))
        console.log(words);
    return words;  
}

// for credit transfer
inputJSON.forEach(element => {
    element.courses = [];
    uniList[element.id - 1] = clean(element.ustName);
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
            let uniName = clean($(this).children().first().children().first().children().first().text());
            let compareName = (ele) => uniName.includes(ele) || ele.includes(uniName);
            let index = uniList.findIndex(compareName);
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
    fs.writeFileSync('final.json', output);
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


