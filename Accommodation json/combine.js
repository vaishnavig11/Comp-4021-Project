const fs = require("fs");

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

locationJSON.forEach(element => {
    // let uniName = {id: element.id, locName: element.name.replace("--", ", ")}
    let uniName = element.name.replace("--", ", ")
    
    // let hasName = (element) => (element.name.localeCompare(uniName.locName) == 0)? true : false;
    let hasName = (element) => (element.name.localeCompare(uniName) == 0)? true : false;
    
    // 1st try: just match
    if(linkJSON.findIndex(hasName) !== -1){
        // uniName.linkName = linkJSON[linkJSON.findIndex(hasName)].name;
        element.ustName = linkJSON[linkJSON.findIndex(hasName)].name;
        element.link = linkJSON[linkJSON.findIndex(hasName)].link;
        element.accommodation_res = linkJSON[linkJSON.findIndex(hasName)].results;
    }
    else 
    {
        // 2nd try: match the name without things after ","
        // let hasNameRed = (element) => (element.name.localeCompare(uniName.locNameRed) == 0) ? true : false;
        
        // uniName.locNameRed = uniName.locName.substring(0,uniName.locName.indexOf(","));
        uniName = uniName.substring(0,uniName.indexOf(","));

        // if(linkJSON.findIndex(hasNameRed) !== -1){
        if(linkJSON.findIndex(hasName) !== -1){
            // uniName.linkName = linkJSON[linkJSON.findIndex(hasNameRed)].name;
            element.ustName = linkJSON[linkJSON.findIndex(hasName)].name;
            element.link = linkJSON[linkJSON.findIndex(hasName)].link;
            element.accommodation_res = linkJSON[linkJSON.findIndex(hasName)].results;
        }
        else
        {
            // 3rd try: match the things with the things before "," 
            // and delete any "University" inside the string
            // and use includes() instead of localeCompare()
            
            // uniName.locNameRed = uniName.locNameRed.replace("University","").trim();
            uniName = uniName.replace("University","").trim();
            
            linkJSON.forEach(ele => {
                // if(ele.name.includes(uniName.locNameRed))
                if(ele.name.includes(uniName)){
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
// console.log(compare);
let output = JSON.stringify(locationJSON);
fs.writeFileSync('combine.json', output);
