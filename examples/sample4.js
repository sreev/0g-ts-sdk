import { getFlowContract, TESTNET_FLOW_ADDRESS } from 'zerog-da-sdk';
import { ethers } from 'ethers';

import { NHFile } from 'zerog-da-sdk';

const file = await NHFile.fromFilePath('tests/example.md');
const [tree, err] = await file.merkleTree();
if (err === null) {
  console.log("File Root Hash: ", tree.rootHash());
}

var tagBytes = tree.rootHash();

import { NHProvider } from 'zerog-da-sdk';

const nhRpc = 'https://rpc-storage-testnet.0g.ai/';
const nhProvider = new NHProvider(nhRpc);

tagBytes = '0xf31a89f1c5f333bcf3f69d997010869cb670b1d5f43f9c2ae3677975e00c91b5';

try {
    let dl = await nhProvider.getFileInfo(tagBytes);
    console.log(dl);
}
catch (er) {
    console.log('download error: ', er);
}

import { writeFileSync } from 'fs';

try {
//    const [segment] = await nhProvider.downloadSegment(tagBytes,294912,1);
    const seg = await nhProvider.downloadSegmentWithProof(tagBytes,0);
    console.log(seg);

    writeFileSync('newFile', seg.data, 'utf8');
}
catch (e) {
    console.log('download segment error: ', e);
}

await file.close();

