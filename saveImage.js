const request = require('request');
const fs = require('fs');
const stream = function(){
        request('https://images-na.ssl-images-amazon.com/images/I/31TsfgL0mzL._AC_SY200_.jpg').pipe(fs.createWriteStream('test1.png'));
    }
stream();