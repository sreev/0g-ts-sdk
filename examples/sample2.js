import { getFlowContract, TESTNET_FLOW_ADDRESS } from 'zerog-da-sdk';
import { ethers } from 'ethers';

import { NHFile } from 'zerog-da-sdk';

const file = await NHFile.fromFilePath('tests/example.md');
const [tree, err] = await file.merkleTree();
if (err === null) {
  console.log("File Root Hash: ", tree.rootHash());
}
// await file.close();

// create ethers signer from private key and rpc endpoint
//const evmRpc = 'https://evmtestnet.confluxrpc.com';
const evmRpc = 'https://rpc-testnet.0g.ai/';
const provider = new ethers.JsonRpcProvider(evmRpc);
const privateKey = 'c3d53573b46161673b61a0e01531388487bb611bb4176fb9c729f0031dff5f89'; // with balance to pay for gas
const signer = new ethers.Wallet(privateKey, provider);

// get flow contract instance
// const flowContract = getFlowContract(TESTNET_FLOW_ADDRESS, signer);
const flowContract = getFlowContract('0xb8F03061969da6Ad38f0a4a9f8a86bE71dA3c8E7', signer);

//const tagBytes = '0x95034699d3a494d05642ba74ab7f07fc318070df588c8adc42a81168880cad9a';
const tagBytes = tree.rootHash();

import { NHProvider } from 'zerog-da-sdk';

//const nhRpc = 'http://54.193.124.127:5678';
//const nhRpc = 'https://rpc-testnet.0g.ai';
const nhRpc = 'https://rpc-storage-testnet.0g.ai/';
const nhProvider = new NHProvider(nhRpc);

await nhProvider.uploadFile(file);

const [submission, err2] = await file.createSubmission(tagBytes); // check previous example for file
console.log('file.createSubmission Response: \n', submission);
if (err2 != null) {
    console.log('create submission error: ', err);
    
    exit;
}
let tx = await flowContract.submit(submission);
await tx.wait();
console.log('flowContract.submit Response: \n', tx);
console.log('hash', tx.hash);
//console.log('index: ', tx.submissionIndex);
//console.log('epoch: ', tx.epoch);
await file.close();


//async function download() {
//  rootHash = '0x55a5c07da68124b81c9cec5522e6580d65c6555160e59f2d4e82e7471147ef3d';
  // startIndex = 
  // endIndex =
//  nhRpc = 'https://rpc-storage-testnet.0g.ai/';
//  const nhProvider = new NHProvider(nhRpc);
//  try {
//    let x = await nhProvider.getFileInfo(rootHash);
//    console.log(x.tx);
//  } catch (error) {
//    console.error('Error:', error);
//  }
//}

try {
    let dl = await nhProvider.getFileInfo(tagBytes);
    console.log(dl);
}
catch (er) {
    console.log('download error: ', er);
}

