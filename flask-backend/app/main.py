from function import postOnExpressIt
from decouple import config
from flask import Flask, request
from flask_cors import CORS
import time
application = Flask(__name__)
CORS(application)
EXPRESS_IT_IP_DICT = {}
EXPRESS_IT_BANNED_IP = []
EXPRESS_IT_SEEDHEX = config('EXPRESS_IT_SEEDHEX')


@application.route('/expressIt', methods=['POST'])
def expressIt():
    try:
        data = request.get_json()
        ip = None
        content = data['content']
        if len(content) > 700:
            return {"status": False, "message": "Content is too long. Make sure it's less than 700"}
        # dear reader, sorry that you are going to read some abusive words
        bannedWordList = [
            "die",
            "vulva"
            "ass",
            "dick",
            "boob",
            "boobs",
            "fuck",
            "fuc*",
            "dickhead",
            "motherfucker",
            "fucker",
            "mofo",
            "semen",
            "pussy",
            "cum",
            "cuckhold",
            "fucked",
            "bitch",
            "fu*k",
            "butt",
            "b00b",
            "coc*",
            "co*k",
            "fart",
            "squirt",
            "creampie",
            "shithole",

        ]
        englishChars = '''"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@!#$%^&*()_+-=[]|;':,./<>?`~"'''
        for banWords in bannedWordList:
            if banWords in content:
                return {"status": False, "message": "Your post has some words which are banned"}
        trimmedContent = ''.join(content.split())
        for characters in trimmedContent:
            if characters not in englishChars:
                return {"status": False, "message": "Your post contains non-english characters"}
        content = content.replace('@', '(@)')
        content = content.replace('$', 'USD')

        if request.environ.get('HTTP_X_FORWARDED_FOR') is None:
            ip = request.environ['REMOTE_ADDR']
        else:
            ip = request.environ['HTTP_X_FORWARDED_FOR']

        firstIp = ip.split(',')[0]
        if firstIp in EXPRESS_IT_BANNED_IP:
            return {"status": False, "message": "Your IP has been permanently ban"}
        currentTimeStamp = round(time.time())
        global EXPRESS_IT_IP_DICT
        if firstIp in EXPRESS_IT_IP_DICT:
            prevTimeStamp = EXPRESS_IT_IP_DICT[firstIp]
            if currentTimeStamp - prevTimeStamp < 10*5:
                return {"status": False, "message": "You are posting too fast. Please wait for 5 minutes."}
        EXPRESS_IT_IP_DICT[firstIp] = currentTimeStamp

        publicKey = "BC1YLhTfx2Yh27VuKVF4nfzUwDKQ4i8Jc76wxYvVojwSwq88z4f4XGN"

        for i in range(3):
            postStatus = postOnExpressIt(
                content, EXPRESS_IT_SEEDHEX, publicKey)
            if postStatus.status_code == 200:
                return {"status": True, "data": postStatus.json(), "message": "Post sucessfully Made!"}

    except Exception as e:
        print(e)
        return {"status": False, "message": "Something went wrong. Please try again..."}
