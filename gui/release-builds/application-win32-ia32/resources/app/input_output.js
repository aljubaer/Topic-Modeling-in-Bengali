// jshint esversion: 6

var colors = ['MediumVioletRed', 'DarkGreen', 'Red', 'MediumSlateBlue', 'Orange', 'Gold', 'Maroon', 'DarkBlue', 'DarkSlateGray', 'CadetBlue', 'Tomato', 'SeaGreen', 'Firebrick', 'BlueViolet', 'DimGray', 'DeepPink', 'Olive', 'RoyalBlue', 'Peru', 'DarkKhaki'];

var startDate = ''
var endDate = ''

function onDateInput() {
    console.log(startDate);
    console.log(endDate);
    var number_topics = document.getElementById('no_topic_input').value
    var number_words = document.getElementById('no_word_input').value
    console.log(typeof number_topics);
    console.log(typeof number_words);

    request.post(BASE_URL + 'topic-models', {
        json: {
            start: startDate,
            end: endDate,
            number_topics: number_topics,
            number_words: number_words
        }
    }, (error, result, body) => {
            if (error) {
                console.error(error);
                return;
            }
            console.log(`statusCode: ${result.statusCode}`);
            console.log(typeof body)
            //var newBody = body.replace(/'/g, '\"');
            let res = body;
            var topic_words = res.words;
            var topic_contribs = res.conts;
            var topic_words_str = [];
            var topic_contribs_100 = JSON.parse(JSON.stringify(topic_contribs));
            var topic_contribs_1000 = JSON.parse(JSON.stringify(topic_contribs));

            for (let i = 0; i < Object.keys(topic_contribs_100).length; i++) {
                for (let j = 0; j < topic_contribs_100[i.toString()].length; j++) {
                    topic_contribs_100[i.toString()][j] = Math.round(topic_contribs_100[i.toString()][j] * 100);

                }
            }
            for (let i = 0; i < Object.keys(topic_contribs_1000).length; i++) {
                for (let j = 0; j < topic_contribs_1000[i.toString()].length; j++) {
                    topic_contribs_1000[i.toString()][j] = Math.round(topic_contribs_1000[i.toString()][j] * 1000);
                }
            }

            for (let i = 0; i < Object.keys(topic_words).length; i++) {
                var topic_words_str_i = '';
                for (let j = 0; j < 20; j++) {
                    topic_words_str_i += '<' + topic_words[i.toString()][j] + '(' + topic_contribs_100[i.toString()][j] + '%)> | ';
                }
                topic_words_str.push(topic_words_str_i);
            }

            console.log(topic_contribs['0'][0]);
            console.log(topic_contribs_100['0'][0]);
            console.log(topic_contribs_1000['0'][0]);
            document.getElementById('topic-container').innerText = ''
            for (let i = 0; i < Object.keys(topic_words).length; i++) {
                var topicTitle = 'TOPIC - ' + i.toString();
                var topicOutputSection = `
                    <div class="col-md-6 output-section"
                        style="border-color: ` + colors[i] + `; border-width: 4px; padding: 0px">
                        <div class="col-md-12" style="background-color: ` + colors[i] + `; color: white; text-align: center">
                            <span id="topic-title` + i.toString() + `" style="font-size: 1.5rem">` + topicTitle + `</span>
                        </div>
                        <div class="col-md-12">
                            <div class="row">
                                <div class="col-md-12" id="topic-words` + i.toString() + `">
                                ` + topic_words_str[i] + `
                                </div>
                                <div class="col-md-12" style="height: 0px" id="topic-cloud` + i.toString() + `">
                                </div>
                            </div>
                        </div>
                    </div>        
                    `;
                $('#topic-container').append(topicOutputSection);
        }
    });
}