var startDate = ''
var endDate = ''
$(function () {
    $('#daterange').daterangepicker({
        opens: 'left'
    }, function (start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
        startDate = start.format('YYYY-MM-DD');
        endDate = end.format('YYYY-MM-DD');
        console.log(startDate)
        console.log(endDate)
    });
});
function onDateInput() {
    console.log(startDate);
    console.log(endDate);
    var number_topics = document.getElementById('no_topic_input').value
    var number_words = document.getElementById('no_word_input').value
    console.log(number_topics)
    console.log(number_words)
}