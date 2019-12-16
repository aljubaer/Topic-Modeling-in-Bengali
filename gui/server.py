from data_processor import *
from news_classifier import *

from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/', methods=['POST'])
def get_classification():
    return getClassification(request)

@app.route('/topic-models', methods=['POST'])
def get_topics():
    return getTopicModels(request)

if __name__ == '__main__':
    app.run(debug=True)