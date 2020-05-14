var request = require("request");
var cheerio = require("cheerio")

// var https = require('https');

var httpUrl = "https://crtran.ust.hk/credit_instit"
var base = 'https://crtran.ust.hk/credit_instit?asOfTermCode=1910&orgID='


const fs = require('fs');
'use strict';
var all_universities = [];
// var uni_dict = new Object();

// read the universities
function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            return cb && cb(err)
        }
        try {
            const object = JSON.parse(fileData)
            return cb && cb(null, object)
        } catch(err) {
            return cb && cb(err)
        }
    })
}

jsonReader('./englishReq_term.json', (err, universities) => {
    if (err) {
        console.log(err)
        return
    }else{
        for (var i=0; i<universities.length; i++){
            all_universities.push(universities[i]['university']); 
        }
    }
//  console.log(all_universities);
})


function courseList(uurl,uni_name){
    // console.log(uurl)
    
    // console.log(uni_name)
    request.get(uurl,function(err,res,body){ 
        var course  = []
        if(!err){
            $ = cheerio.load(body);
            $('tr').each(function(i, elem) {
            course[i] = $(this).children().first().next().text().split(" ")[0] ;
            });
            // console.log(uni_name)
            // uni_dict[uni_name]= course
            // update JSON file here 
        }
        
        // for(var i = 1; i < course.length; i ++){
        //     console.log(course[i])
        // }
    });
}

request.get(httpUrl,function(err,res,body){
    
    var urls =[];
    
    if(!err){
        $ = cheerio.load(body);
        $('option').each(function(i, elem) {
            
            // make request to a university every uni in the list
            for (var i = 0; i < all_universities.length; i++) {
                var uni_name = all_universities[i]
                
                if($(this).text() ==uni_name ) {
                    var uurl = base + $(this).attr('value')
                    courseList (uurl,uni_name);
                    urls.push(uurl);
                }
            }    

        });
    }
});




