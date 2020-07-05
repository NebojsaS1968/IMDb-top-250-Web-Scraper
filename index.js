const rp = require('request-promise');
const cheerio = require('cheerio')
const Parser = require('json2csv').Parser //json2csv expects an OBJECT to be returned for parsing
const fs = require('fs')

const url = "https://www.imdb.com/chart/top/?ref_=nv_mv_250";

//ATTENTION TO THE SYNTAX OF THE FUNCTION WITH NO NAME
//  (() => {})()
(async() => {
    let imdb250 = []
    let data = await rp({
        uri: url,
        headers: {
            accept: 
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-US,en;q=0.9"
        },
        //gzip: true ---> content type
    })

    const $ = cheerio.load(data)

    for(i=0 ; i<250 ; i++){
        imdb250.push($('tr:nth-child(' + i + ') > td.titleColumn > a').text())
   }

   //getting an object of an array
   const imdbList = {imdb250}

    try {
        const parser = new Parser();
        const csv = parser.parse(imdbList);
        fs.writeFileSync("./imdb.csv", csv)
      } catch (err) {
        console.error(err);
      }

})()

