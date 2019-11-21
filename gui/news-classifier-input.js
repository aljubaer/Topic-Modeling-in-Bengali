// jshint esversion: 6

var elerem = require('electron').remote;
var fs = require('fs');
var ps = require("python-shell");
var path = require("path");
var dialog = elerem.dialog;
var app = elerem.app;
const exec = require('child_process').exec;

var input = {
    news: ''
};

function onDataInput() {
    var textInput = document.getElementById('newsInput').value;
    var textStatus = document.getElementById('status');
    var textResult = document.getElementById('result');
    textStatus.innerText = 'খবরের শ্রেণি খোঁজা হচ্ছে ...';
    textResult.innerText = '';
    //console.log(textInput);
    input.news = textInput;

    let fn = "input.json";
    fs.writeFile(fn, JSON.stringify(input), (err) => {
        if (err) {
            alert("An error ocurred creating the file " + err.message);
        }

        // var options = {
        //     scriptPath: path.join(__dirname, '/data_processing/')
        // };

        // ps.PythonShell.run('data-process.py', options, function (err, results) {
        //     console.log(results);
        // });

        var command = 'python3.7 ' + 'news-classifier.py';

        const child = exec(command,
            (error, stdout, stderr) => {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                }
                textStatus.innerText = 'আপনার খবরটির ধরন: ';
                textResult.innerText = stdout;
            });

    });
}