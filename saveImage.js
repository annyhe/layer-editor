const request = require('request');
const fs = require('fs');
// throws error if either request fails, or file save fails
// returns promise with the file saved
const stream = function(){
        request('https://images-na.ssl-images-amazon.com/images/I/31TsfgL0mzL._AC_SY200_.jpg').pipe(fs.createWriteStream('public/test1.png'));
    }
stream();