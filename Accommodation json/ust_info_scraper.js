var request = require("request");
var cheerio = require("cheerio");
const fs = require("fs");
var base = 'https://crtran.ust.hk/credit_instit?asOfTermCode=' //&orgID='

let rawdata = fs.readFileSync('combine.json');
let inputJSON = JSON.parse(rawdata);

let current = new Date();
//          [Jan  ,  Feb,  Mar,  Apr,  May,  Jun,  Jul,  Aug,  Sep,  Oct,  Nov, Dec ]
//         Winter | Spring              | Summer      | Fall                    | Winter
let month = ["20" , "30", "30", "30", "40", "40", "40", "10", "10", "10", "10", "20"];
base += current.getFullYear().toString().substr(-2, 2) + month[current.getMonth()-1];

console.log(base);

var uniList = []

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

// prepare the properties of each Uni object
inputJSON.forEach(element => {
    element.courses = [];
    uniList[element.id - 1] = clean(element.ustName);
});

// for generate final.json (add credit transfer info)
request.get(base,function(err,res,body){
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
            }
        });
    }
    let output = JSON.stringify(inputJSON);
    fs.writeFileSync('final.json', output);
});