import Web3 from 'web3'
import axios from 'axios'
import vueConfig from '../../vue.config'

const BASE_URL = vueConfig.devServer.proxy['/blocket'].target + "/api"
const WALLET_URL = BASE_URL + "/wallet"

import {
  BLOCKCHAIN_URL,
  // BLOCKCHAIN_WEBSOCKET_URL,
} from '../config'

// Web3 Object 생성
export function createWeb3() {
  const web3 = new Web3(new Web3.providers.HttpProvider(BLOCKCHAIN_URL))
  return web3
}

// 관리자 계정에서 사용자 계정으로 0.1 이더씩 보내기
export function sendEther() {
  console.log("0.1 이더를 사용자 계정에 전송합니다. ")
  const web3 = createWeb3()

  const send_account = "0xf255FC9eF3778E688950649547D398B027D8b999"
  const receive_account = "0x41278A913Ae5D0F68CF2D06A4007d76AF696B255"
  const privateKey = Buffer.from("b35023e44ad462879d110e4f68c8e794e0097c475d4639d4b9dbf463dcb1ef09", 'hex') // 개인키 맨 앞의 0x를 빼야한다. 

  // nonce : EOA가 생성하여 블록체인에 기록된 트랜잭션의 개수. nonce는 트랜잭션의 중복 전송을 방지하는데 사용된다. 
  web3.eth.getTransactionCount(send_account, (err, txCount) => {

    const txObject = {
      nonce: web3.utils.toHex(txCount),
      gasLimit: web3.utils.toHex(100000), // 0.1ether
      gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
      from: send_account,
      to: receive_account,
      value: '0x2386f26fc10000' // 0.01 이더
    }

    const ethereumTx = require('ethereumjs-tx').Transaction
    
    const tx = new ethereumTx(txObject, {'chain': 'ropsten'})
    tx.sign(privateKey) // 객체를 담은 후 개인키를 이용한 sign이 들어간다. 이더리움 테스트넷과 메인넷에서는 필수로 sign객체가 필요하다. 

    const serializedTx = tx.serialize()
    const raw = '0x' + serializedTx.toString('hex')
    
    web3.eth.sendSignedTransaction(raw) // hash가 리턴되는데, 트랜잭션을 전송한 hash값이다. 이 hash값을 이용해 etherscan.io에서 조회가 가능하다. 
    .on('transactionHash', console.log)
  })
}

// 사용자가 계정을 생성하면 지갑을 생성한다.
export function createWallet(email) {
  const web3 = createWeb3()
  const myWallet = web3.eth.accounts.wallet.create(1)

  const walletAddress = myWallet[0].address
  const privateKey = myWallet[0].privateKey 
  
  const data = {
    address: walletAddress,
    balance: 0,
    receiving_account: 0,
    email: email,
  }

  axios({
    url: WALLET_URL + "/register",
    method: "POST",
    Headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  })
  return {
    walletAddress,
    privateKey,
  }
}


// 사용자의 진행상태를 트랜잭션으로 전송하기 (신상정보 등록완료 / 검증 진행중 / 검증 완료)
export function saveState() {
  console.log("데이터를 전송해보자.")
  const web3 = createWeb3()

  const send_account = "0xf255FC9eF3778E688950649547D398B027D8b999" // 관리자 계정
  const receive_account = "0xf255FC9eF3778E688950649547D398B027D8b999"

  const privateKey = Buffer.from("b35023e44ad462879d110e4f68c8e794e0097c475d4639d4b9dbf463dcb1ef09", 'hex')

  web3.eth.getTransactionCount(send_account, (err, txCount) => {

    const txObject = {
      nonce: web3.utils.toHex(txCount),
      gasLimit: web3.utils.toHex(100000), // 0.1ether
      gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
      from: send_account,
      to: receive_account,
      data: '0xEAB280ECA69DEC9984EBA38C' // 검증완료라는 string 문구를 Hexadecimal 현태로 변환하여 저장한 것.
    }
    
    const ethereumTx = require('ethereumjs-tx').Transaction
    
    const tx = new ethereumTx(txObject, {'chain': 'ropsten'})
    tx.sign(privateKey) // 객체를 담은 후 개인키를 이용한 sign이 들어간다. 이더리움 테스트넷과 메인넷에서는 필수로 sign객체가 필요하다. 
    
    const serializedTx = tx.serialize()
    const raw = '0x' + serializedTx.toString('hex')
    
    web3.eth.sendSignedTransaction(raw) // hash가 리턴되는데, 트랜잭션을 전송한 hash값이다. 이 hash값을 이용해 etherscan.io에서 조회가 가능하다. 
    .on('transactionHash', console.log)
  })


}

// 한 사용자가 전송한 모든 트랜잭션 조회하기
export function getAllTransactions() {

  
}

// 파일로 privateKey 저장하기
export function saveToFile_Chrome(fileName, content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const objURL = window.URL.createObjectURL(blob);
          
  // 이전에 생성된 메모리 해제
  if (window.__Xr_objURL_forCreatingFile__) {
      window.URL.revokeObjectURL(window.__Xr_objURL_forCreatingFile__);
  }
  window.__Xr_objURL_forCreatingFile__ = objURL;
  var a = document.createElement('a');
  a.download = fileName;
  a.href = objURL;
  a.click();
}

