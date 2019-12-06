// jshint esversion: 6

const request = require('request');
var input = {
    news: ''
};
const BASE_URL = 'http://localhost:5000/';

function onDataInput() {
    var textInput = document.getElementById('newsInput').value;
    var textStatus = document.getElementById('status');
    var textResult = document.getElementById('result');
    textStatus.innerText = 'খবরের শ্রেণি খোঁজা হচ্ছে ...';
    textResult.innerText = '';
    //console.log(textInput);
    input.news = textInput;

    request.post(BASE_URL, {
        json: {
            news: input.news
        }
    }, (error, res, body) => {
        if (error) {
            console.error(error);
            return;
        }
        console.log(`statusCode: ${res.statusCode}`);
        console.log(body);
    });
}