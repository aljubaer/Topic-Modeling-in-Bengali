// jshint esversion: 6

// const request = require('request');
var input = {
	news: "",
};
const BASE_URL =
	"https://topic-modelling-bn.herokuapp.com/";
// const BASE_URL =
// 	"http://localhost:5000/";

function onDataInput() {
	var textInput = document.getElementById("newsInput").value;
	var textStatus = document.getElementById("status");
	var textResult = document.getElementById("result");
	textStatus.innerText = "খবরের শ্রেণি খোঁজা হচ্ছে ...";
	textResult.innerText = "";
	//console.log(textInput);
	input.news = textInput;

	$.ajax({
		url: BASE_URL + "classification/", 
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify({'news': input.news}),
		success: function( data ) { 
			// console.log(`statusCode: ${res.statusCode}`);
            var newBody = data.replace(/'/g, '\"');
            let result = JSON.parse(newBody);
            console.log(result);
            textStatus.innerText = ''
            textResult.innerText = 'খেলা' + ' :' +  result['খেলা'] + '%\t'
                                    + 'রাজনীতি' + ' :' +  result['রাজনীতি'] + '%\n'
                                    + 'অপরাধ' + ' :' +  result['অপরাধ'] + '%\t'
                                    + 'আন্তর্জাতিক' + ' :' +  result['আন্তর্জাতিক'] + '%\n'
                                    + 'বিনোদন' + ' :' +  result['বিনোদন'] + '%\t'
                                    + 'বিজ্ঞান ও প্রযুক্তি' + ' :' +  result['বিজ্ঞান ও প্রযুক্তি'] + '%\n';

            var ctx = document.getElementById('myChart');
            var myChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['খেলা', 'রাজনীতি', 'অপরাধ', 'আন্তর্জাতিক', 'বিনোদন', 'বিজ্ঞান ও প্রযুক্তি'],
                    datasets: [{
                        label: '# topic distribution',
                        data: [result['খেলা'], result['রাজনীতি'], result['অপরাধ'],
                        result['আন্তর্জাতিক'], result['বিনোদন'], result['বিজ্ঞান ও প্রযুক্তি']],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
		}   
	});
}
