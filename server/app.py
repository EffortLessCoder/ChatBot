#!/usr/bin/python3

from flask import Flask,request,jsonify
from flask_cors import CORS
app = Flask(__name__)
cors = CORS(app,resources={r'/*':{'origins':'http://127.0.0.1:5173'}})

#Model-Starts

from sklearn.feature_extraction.text import TfidfVectorizer
import random
from nltk import word_tokenize, sent_tokenize
from sklearn.metrics.pairwise import cosine_similarity
import sklearn
from nltk.stem import WordNetLemmatizer
import nltk
import string
data = open('Contents.txt', 'r')
data = data.read().lower()
nltk.data.find('tokenizers/punkt')
nltk.data.find('corpora/wordnet')
nltk.data.find('corpora/omw-1.4')
word_tokens = word_tokenize(data)
sent_tokens = sent_tokenize(data)
lemmer = nltk.stem.WordNetLemmatizer()


def lem_Token(tokens):
    return [lemmer.lemmatize(token) for token in tokens]


remove_punct = dict((ord(punct), None) for punct in string.punctuation)


def LemNormalize(text):
    return lem_Token(nltk.word_tokenize(text.lower().translate(remove_punct)))


input_greet = ('hi', 'how are you', 'hello', 'good morning',
               'greeting', 'may i get in', 'daii', 'hey')
output = ['hi', 'hey', 'hello', 'how are you',
          'good morning', 'greeting', 'may i get in', 'daii']


def greet(user_greet):

    for word in user_greet.split(" "):
        if word.lower() in input_greet:
            return random.choice(output)
        else:
            return None


def response(my_response):
    robot_response = ''
    tfidfV = TfidfVectorizer(tokenizer=LemNormalize, stop_words='english')
    tfidf = tfidfV.fit_transform(sent_tokens)
    sim = cosine_similarity(tfidf[-1], tfidf)
    idx = sim.argsort()[0][-2]
    flat = sim.flatten()
    flat.sort()
    my_flat = flat[-2]

    if my_flat == 0:
        robot_response = robot_response + \
            'i dont understand bec i dont have much amount of data'
        return robot_response
    else:
        robot_response = robot_response+sent_tokens[idx]
        return robot_response


def main(user_input,word_tokens):
    resp = user_input.lower()
    if (resp == 'bye' or resp == 'thanks'):
        resp = 'you are welcome'
    elif (greet(resp) != None):
        resp = greet(resp)
    else:
        sent_tokens.append(resp)
        word_tokens = word_tokens+nltk.word_tokenize(resp)
        final_words = list(set(word_tokens))
        resp = response(resp)
    return resp

#Model-Ends
resp = None
@app.route("/req",methods=["POST"])
def req():
    global resp
    if (request.method == "POST"):
        data = request.get_json()
        if(data['data']):
            resp = main(data['data'], word_tokens)
        return jsonify(data)
@app.route("/res",methods=["POST","GET"])
def res():
    return jsonify({"data" : resp})

if __name__ == '__main__' : 
    app.run(debug=True)