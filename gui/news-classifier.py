
import json
import nltk
from b_parser import RafiStemmer

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


stopwords_file = open(
    'stop_words.txt', "r+", encoding='utf-8')
all_stopwords = stopwords_file.read()
stopwords_ready = [word.strip() for word in all_stopwords.split()]


def remove_stopwords(content):
    without_stopwords = []
    for word in content:
        if word not in stopwords_ready and len(word) > 2:
            without_stopwords.append(word)
    return without_stopwords


stemmer = RafiStemmer()

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

# from keras.models import load_model
# model = load_model('seven_class_model_2.h5')

dic = {}
# dic['খেলা'] = 0
# dic['রাজনীতি'] = 1
# dic['আন্তর্জাতিক'] = 2
# dic['অপরাধ'] = 3

dic['খেলা'] = 5
dic['রাজনীতি'] = 2
dic['অপরাধ'] = 4
dic['আন্তর্জাতিক'] = 1
dic['বিনোদন'] = 3
dic['বিজ্ঞান ও প্রযুক্তি'] = 0

topic_score_sum = {}


def valid_topic(arr):
  for topic in arr:
    if topic in dic:
      return topic
  return ''


def get_topic_from_int(value):
  val = str(value)
  for i in dic:
    if str(dic[i]) == val:
      return i


lda_json_src = 'model_score_six.json'
lda_score = json.load(open(lda_json_src, 'r', encoding='utf-8'))

topic_score_sum = {}
def get_total_sum_of_scores_for_topic():
  for word in lda_score:
    # print(word)
    for topic in lda_score[word]:
      if topic not in topic_score_sum:
        topic_score_sum[topic] = 0.0
      topic_score_sum[topic] += float(lda_score[word][topic]['value'])


get_total_sum_of_scores_for_topic()


def calc_score(array, topic):
  score = 0
  already_done = {}
  for word in array:
    if word in already_done:
      continue
    try:
      # already_done[word] = 1
      score += float(lda_score[word][str(topic)]
                     ['value'])/topic_score_sum[str(topic)]
    except:
      pass
#   print(score)
  return score


def pred_topic(array):
  max_score = 0.0
  topic_ans = 0
  for i in range(len(dic)):
    this_score = calc_score(array, i)
    if max_score < this_score:
      max_score = this_score
      topic_ans = i
#   print(topic_ans)
#   print(max_score)
  return get_topic_from_int(str(topic_ans))


# ---------------------------------------------------------


json_file = open('input.json', encoding='utf-8')
raw_data_json = json.load(json_file)
raw_news_data = raw_data_json['news']
data_processed = single_data_preprocessor(raw_news_data)

pred = pred_topic(data_processed.split())

print(pred)
