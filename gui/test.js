var fs = require('fs');

var testOutput = function () {
    fs.readFile('../code/topic_dist.txt', 'utf-8', (err, data) => {
        if (err) {
            //alert("An error ocurred reading the file :" + err.message);
            console.log(err.message);
            return;
        }
        var res = JSON.parse(data);
        var topic_words = res.words;
        for (var i = 0; i < 10; i++){
            console.log(topic_words[i.toString()][0]);
        }
        //console.log(typeof res);
    });
};

testOutput();