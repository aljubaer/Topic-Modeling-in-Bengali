from bs4 import BeautifulSoup
import re
import requests
import json
import nltk
nltk.download('punkt')
import gensim
import gensim.corpora as corpora
from gensim.utils import simple_preprocess
from gensim.models import CoherenceModel
from gensim.models.callbacks import PerplexityMetric
from gensim.test.utils import datapath
from b_parser import RafiStemmer
from datetime import datetime, timedelta
import pandas as pd
from flask import Flask, request, jsonify

app = Flask(__name__)

stemmer = RafiStemmer()

def valid_bengali_letters(char):
    return ord(char) >= 2433 and ord(char) <= 2543 

def get_replacement(char):
    if valid_bengali_letters(char):
        return char
    newlines = [10, 2404, 2405, 2551, 9576]
    if ord(char) in newlines: 
        return ''
    return ' '

def get_valid_lines(line):
    copy_line = ''
    for letter in line:
        copy_line += get_replacement(letter)
    return copy_line

stopwords_file = open('./stop_words.txt', "r+", encoding = 'utf-8')
all_stopwords = stopwords_file.read()
stopwords_ready = [word.strip() for word in all_stopwords.split()]
def remove_stopwords(content):   
    without_stopwords = []
    for word in content:
        if word not in stopwords_ready and len(word) > 2:
            without_stopwords.append(word)
    return without_stopwords

def stemming_data(content):
    for i, word in enumerate(content):
        content[i] = stemmer.stem_word(word)
    return content

def merge_to_string(content_list):
    strLine = ''
    for word in content_list:
        strLine += word + ' '
    return strLine

def single_data_preprocessor(content):
    content_valid = get_valid_lines(content)
    content_tokenized = nltk.word_tokenize(get_valid_lines(content_valid))
    content_without_stopwords = remove_stopwords(content_tokenized)
    content_stemmed = stemming_data(content_without_stopwords)
    content_str = merge_to_string(content_stemmed)

    return content_str

def one_day_data_preprocessor(content_json):
    preprocessed_content_json = []
    for news_json in content_json:
        preprocessed_news_json = {}
        preprocessed_news_json['content'] = single_data_preprocessor(news_json['content'])
        preprocessed_content_json.append(preprocessed_news_json)
    return preprocessed_content_json

def read_index():
    path = './word_index_for_seven_topics.txt'
    with open(path, encoding = 'utf-8') as json_file:
        index_file = json.load(json_file)
    print(len(index_file))
    return index_file

all_data = []

def range_day_data_preprocessor(start_date_str, end_date_str):
    base_url = '../data/final_data/prothom_alo_'
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
    delta = end_date - start_date
    index_file = read_index()
    for i in range(delta.days + 1):
        date = start_date + timedelta(days = i)
        url = '../data/final_data/prothom_alo_' + date.strftime("%Y-%m-%d") + ".txt"
        print(url)
        with open(url, encoding = 'utf-8') as json_file:
            raw_data_json = json.load(json_file)
            preprocessed_data = one_day_data_preprocessor(raw_data_json)
            for data in preprocessed_data:
                all_data.append([word for word in data['content'].split() if word in index_file])
                if len(all_data) % 1000 == 0:
                    print('Read data: ', len(all_data))

def run_lda(no_topic, alpha='auto', iterations=20):
    # Create Dictionary
    id2word = corpora.Dictionary(all_data)

    # Create Corpus: Term Document Frequency
    corpus = [id2word.doc2bow(text) for text in all_data]

    perplexity_logger = PerplexityMetric(corpus=corpus, logger='shell')

    # Build LDA model
    lda_model = gensim.models.ldamodel.LdaModel(corpus=corpus,
                                            id2word=id2word,
                                            num_topics=10, 
                                            random_state=50,
                                            update_every=1,
                                            chunksize=20,
                                            passes=20,
                                            alpha='auto',
                                            iterations=20,
                                            callbacks=[perplexity_logger],
                                            per_word_topics=True)

    print(lda_model.print_topics(num_words = 10))
    return lda_model

def convertToDataFrame(data_json):
    df = pd.DataFrame(data_json)
    print('DataFrame shape' + str(df.shape))
    return df

def ldaOutputProducer(lda_model, no_topics, no_words):
    x = (lda_model.show_topics(num_topics=no_topics, num_words=no_words,formatted=False))
    topics_words = [(tp[0], [wd[0] for wd in tp[1]], [wd[1] for wd in tp[1]]) for tp in x]
    output_json_list = []
    for topic,words,conts in topics_words:
        topic_json = {}
        topic_content = {}
        topic_content["words"] = words
        topic_content["conts"] = conts
        #topic_json[str(topic)] = topic_content
        output_json_list.append(topic_content)
    out_df = convertToDataFrame(output_json_list)
    out_json = out_df.to_json(force_ascii=False)
    print(out_json)
    return str(out_json)

@app.route('/topic-models', methods=['POST'])
def getTopicModels():
    start = request.get_json()['start']
    end = request.get_json()['end']
    no_topic = int(request.get_json()['number_topics'])
    no_words = int(request.get_json()['number_words'])
    range_day_data_preprocessor(start, end)
    print(len(all_data))
    return ldaOutputProducer(run_lda(no_topic), no_topic, no_words)

if __name__ == '__main__':
    app.run(debug=True)