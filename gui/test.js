var fs = require('fs');

var colors = ['MediumVioletRed', 'DarkGreen', 'Red', 'MediumSlateBlue', 'Orange', 'Gold', 'Maroon', 'DarkBlue', 'DarkSlateGray', 'CadetBlue', 'Tomato', 'SeaGreen', 'Firebrick', 'BlueViolet', 'DimGray', 'DeepPink', 'Olive', 'RoyalBlue', 'Peru', 'DarkKhaki'];

var testOutput = function () {
    fs.readFile('../code/topic_dist.txt', 'utf-8', (err, data) => {
        if (err) {
            //alert("An error ocurred reading the file :" + err.message);
            console.log(err.message);
            return;
        }
        var res = JSON.parse(data);
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
            for (let j = 0; j < 10; j++) {
                topic_words_str_i += '<' + topic_words[i.toString()][j] + '(' + topic_contribs_100[i.toString()][j].toString() + '%)> | ';
            }
            topic_words_str.push(topic_words_str_i);
        }

        console.log(topic_contribs['0'][0]);
        console.log(topic_contribs_100['0'][0]);
        console.log(topic_contribs_1000['0'][0]);

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
                            <div class="col-md-12" id="topic-cloud` + i.toString() + `">
                            </div>
                        </div>
                    </div>
                </div>        
                `;
            $('#topic-container').append(topicOutputSection);
            for (let i = 0; i < Object.keys(topic_words).length; i++) {
            
                initWordCloud('topic-cloud' + i.toString(), colors[i], topic_words[i.toString()], topic_contribs_1000[i.toString()]);
            
            }
        }


    });
};

testOutput();