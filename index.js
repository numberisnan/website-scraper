/*
By Faraz Malik

To run: node index.js your_url

Resulting html is placed in snapshots folder with timestamp - tell me if you need to change

To test it, run "npm test"

If there are tons of errors, no worry - it still work (idk why errors show up)

*/

const jsdom = require("jsdom"); //Imports
const rp = require('request-promise-native');
const fs = require("fs");

const url = process.argv[2];
const { JSDOM } = jsdom;

(async function main() {
    var htmlString = await rp(url).catch(err => console.log(err)); //Get request
    
    var dom = new JSDOM(htmlString, { runScripts: 'dangerously', resources: 'usable', url}); //Allow the execution of scripts and other resources -- make sure your site is safe!
    
    await Promise.resolve()
        .then(function() {
            return new Promise(function(resolve) {
                dom.window.onload = function() { //Wait for script to execute
                    resolve(dom);
                }
            })
            .catch(err => resolve(err));
        })
        .then(function(dom) {
            fs.appendFileSync("snapshots/" + Number(new Date()) + ".html", dom.window.document.querySelector("html").innerHTML); //Write file
        })
        .catch(function(err) {
            console.log(err);
        })
    
    console.log("Done!")
    process.exit()
})()