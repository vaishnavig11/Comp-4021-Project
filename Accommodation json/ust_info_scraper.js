var request = require("request");
var cheerio = require("cheerio");
const fs = require("fs");
var base = 'https://crtran.ust.hk/credit_instit?orgID='//asOfTermCode=' //&orgID='

let rawdata = fs.readFileSync('combine.json');
let inputJSON = JSON.parse(rawdata);

/* 
let current = new Date();
//          [Jan  ,  Feb,  Mar,  Apr,  May,  Jun,  Jul,  Aug,  Sep,  Oct,  Nov, Dec ]
//         Winter | Spring              | Summer      | Fall                    | Winter
let month = ["20" , "30", "30", "30", "40", "40", "40", "10", "10", "10", "10", "20"];
let year = (current.getMonth() < 7) ? (current.getFullYear() - 1).toString().substr(-2, 2): current.getFullYear().toString().substr(-2, 2);
base += year + month[current.getMonth()]; 
*/

console.log(base);

var uniList = []

function clean(words) {
    words = words.replace(/&/g, "and");
    words = words.replace(/the/g, "");
    words = words.replace(/The/g, "");
    words = words.replace(/-/g, "");
    if (words.includes("University of Illinois,")) {
        words = words.substring(0, words.indexOf(","));
    }
    if (words.includes("Stony Brook"))
        words = "Stony Brook";
    words = words.replace(/,/g, "");
    words = words.replace(/ /g, "");
    words = words.toLowerCase();
    return words;
}

// prepare the properties of each Uni object
inputJSON.forEach(element => {
    element.courses = [];
    uniList[element.id - 1] = clean(element.ustName);
});

function getTranCourse(link, index) {
    return new Promise(resolve => {
        // for generate final.json (add credit transfer info)
        console.log(link);
        console.log(inputJSON[index].creditCode);
        request.get(link, function (err, res, body) {
            var item = {
                exchangeCourse: "",
                hkustCourse: ""
            }
            if (!err) {
                $ = cheerio.load(body);
                $('tbody tr').each(function (i, elem) {
                    // comparing the
                    item = {
                        // university name: $(this).children().first().children().first().children().first().text()
                        exchangeCourse: $(this).children().first().children().first().children().first().next().text(),
                        hkustCourse: $(this).children().first().next().text(),
                        hkustCode: $(this).children().first().next().text().split(" ")[0]
                    }
                    inputJSON[index].courses.push(item);
                });
                resolve(true);
            }
        });
    })
}

function getAllTranCourse() {
    const promises = [];
    for (let i = 0; i < inputJSON.length; i++) {
        promises.push(getTranCourse(base + inputJSON[i].creditCode, i));
    }
    return Promise.all(promises);
}

let p = Promise.resolve();
p = p.then(() => {
    return getAllTranCourse();
})
p.then(() => {
    let output = JSON.stringify(inputJSON);
    fs.writeFileSync('final.json', output);
})