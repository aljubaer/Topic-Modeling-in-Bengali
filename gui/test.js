var fs = require('fs');

var testOutput = function () {
    fs.readFile('../code/topic_output.txt', 'utf-8', (err, data) => {
        if (err) {
            //alert("An error ocurred reading the file :" + err.message);
            console.log(err.message);
            return;
        }
        var res = JSON.parse(data);
        console.log(typeof res);
    });
};

testOutput();