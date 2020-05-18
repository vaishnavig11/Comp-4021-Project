const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio")

let linkFile = fs.readFileSync('accommodation.json');
let linkJSON = JSON.parse(linkFile);
// linkJSON = linkJSON.map((val, index) => {
//     return {id:index+1, name:val.name}
// })

let locationFile = fs.readFileSync('location.json');
let locationJSON = JSON.parse(locationFile);
// locationJSON = locationJSON.map((val, index) => {
//     return { id: index, name: val.name }
// })

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

locationJSON.forEach(element => {
    // let uniName = {id: element.id, locName: element.name.replace("--", ", ")}
    let uniName = element.name.replace("--", ", ")

    // let hasName = (element) => (element.name.localeCompare(uniName.locName) == 0)? true : false;
    let hasName = (element) => (element.name.localeCompare(uniName) == 0) ? true : false;

    // 1st try: just match
    if (linkJSON.findIndex(hasName) !== -1) {
        // uniName.linkName = linkJSON[linkJSON.findIndex(hasName)].name;
        element.ustName = linkJSON[linkJSON.findIndex(hasName)].name;
        element.link = linkJSON[linkJSON.findIndex(hasName)].link;
        element.accommodation_res = linkJSON[linkJSON.findIndex(hasName)].results;
    }
    else {
        // 2nd try: match the name without things after ","
        // let hasNameRed = (element) => (element.name.localeCompare(uniName.locNameRed) == 0) ? true : false;

        // uniName.locNameRed = uniName.locName.substring(0,uniName.locName.indexOf(","));
        uniName = uniName.substring(0, uniName.indexOf(","));

        // if(linkJSON.findIndex(hasNameRed) !== -1){
        if (linkJSON.findIndex(hasName) !== -1) {
            // uniName.linkName = linkJSON[linkJSON.findIndex(hasNameRed)].name;
            element.ustName = linkJSON[linkJSON.findIndex(hasName)].name;
            element.link = linkJSON[linkJSON.findIndex(hasName)].link;
            element.accommodation_res = linkJSON[linkJSON.findIndex(hasName)].results;
        }
        else {
            // 3rd try: match the things with the things before "," 
            // and delete any "University" inside the string
            // and use includes() instead of localeCompare()

            // uniName.locNameRed = uniName.locNameRed.replace("University","").trim();
            uniName = uniName.replace("University", "").trim();

            linkJSON.forEach(ele => {
                // if(ele.name.includes(uniName.locNameRed))
                if (ele.name.includes(uniName)) {
                    // uniName.linkName = ele.name;
                    element.ustName = ele.name;
                    element.link = ele.link;
                    element.accommodation_res = ele.results;
                }
            });

        }
        // delete uniName.locNameRed;
    }

    // compare.push(uniName);
});

var uniList = []

locationJSON.forEach(element => {
    uniList[element.id - 1] = clean(element.ustName);
});

request.get("https://crtran.ust.hk/credit_instit", (err, res, body) => {
    if (!err) {
        $ = cheerio.load(body);
        $('[label="' + "United States" + '"] option').each(function (i, elem) {
            let uniName = clean($(this).text());
            let compareName = (ele) => uniName.includes(ele) || ele.includes(uniName);
            let index = uniList.findIndex(compareName);
            if (index !== -1) {
                locationJSON[index].creditCode = $(this).attr("value");
            }
        });
        let output = JSON.stringify(locationJSON);
        fs.writeFileSync('combine.json', output);
    }
});

// console.log(compare);
// let output = JSON.stringify(locationJSON);
// fs.writeFileSync('combine.json', output);
