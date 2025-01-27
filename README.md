# SolMage

Simple Phantom SOL Drainer With Telegram Exfiltration. 

## Requirements
You need to have the [NodeJS](https://nodejs.org/en/download) runtime installed as well as [Python3](https://www.python.org/downloads/).

For the JS requirements, You'll need to install [Parcel](https://www.npmjs.com/package/parcel) and [Solana/web3.js](https://www.npmjs.com/package/@solana/web3.js).

```
npm install Parcel
npm install @solana/web3.js
```

For the Python requirements, You'll need to install both [Flask](https://pypi.org/project/Flask/) and [FlaskCors](https://pypi.org/project/Flask-Cors/).

```
pip install flask
pip install flask-cors
```

## Usage Guide
To start SolMage's demo page, Run this:
```
npm start
```
This will be hosted on **localhost:1234** by default.

To start SolMage's server that receives the exfiltration data and is responsible for sending the data to telegram, You need to go into the server directory then run this:

```
python server.py --configuration ../config/server.json --telegram ../config/telegram.json
```
This will be hosted on **localhost:5000** by default. This can be changed in the configuration file of the server by changing the ``port`` value.

## Disclaimer
This is a basic web3 drainer, With not that much security like encryption, Don't expect this to be the most promising when it comes to real phishing engagements.

This was made for people to understand how web3 drainers actually work, and is NOT intended to be used with malicious intent, All the testing was done in the devnet cluster, I'm not accountable for whatever you do with this software.


## Showcase
![SolMage](https://i.imgur.com/nJ1kmqd.png)
