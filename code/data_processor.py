from bs4 import BeautifulSoup
import re
import requests
import json
import nltk
nltk.download('punkt')
from b_parser import RafiStemmer
from datetime import datetime, timedelta
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

def range_day_data_preprocessor(start_date_str, end_date_str):
    base_url = '/content/drive/My Drive/Colab Notebooks/sample_data/newspaper/prothom_alo_'
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
    delta = end_date - start_date
    for i in range(delta.days + 1):
        date = start_date + timedelta(days = i)
        url = '/content/drive/My Drive/Colab Notebooks/sample_data/newspaper/prothom_alo_' + date.strftime("%Y-%m-%d") + ".txt"
        print(url)
        file_name='/content/drive/My Drive/Colab Notebooks/sample_data/newspaper_final/'
        with open(url, encoding = 'utf-8') as json_file:
            raw_data_json = json.load(json_file)
            preprocessed_data = one_day_data_preprocessor(raw_data_json)
            print(url[-26:-4] + '_preprocessed2.txt')
            wf = url[-26:-4] + '_preprocessed2.txt'
            write = open(file_name + wf, 'w+', encoding='utf-8')
            json.dump(preprocessed_data, write, indent=2, ensure_ascii=False)
            write.close()

range_day_data_preprocessor('2018-01-01', '2018-01-02')