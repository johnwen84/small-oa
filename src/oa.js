// const oa = require("@govtechsg/open-attestation");
// const docStore = require("@govtechsg/document-store");
// const ethers = require("ethers");
// const axios = require('axios');
// const fs = require("fs");

import {
  wrapDocument,
  validateSchema,
  verifySignature,
  getData
} from '@govtechsg/open-attestation';
import { connect } from '@govtechsg/document-store';
import {
  verificationBuilder, 
  openAttestationVerifiers, 
  isValid 
} from '@govtechsg/oa-verify';
import { getDefaultProvider, Wallet } from 'ethers';
import axios from 'axios';
import fs from 'fs';

try {
  // goVerify();
  // goIssue();
  // registerDNS(3, "0xFdda6f76735BE5860d1d9Bd8C0F79a09826558C5");
  // deployStore();
} catch (err) {
  console.error('Failed - ', err);
}

// async function deployStore() {
//   const ropstenProvider = getDefaultProvider('ropsten');
//   const walletStr = fs.readFileSync('../OA/wallet.json').toString();
//   const wallet = Wallet.fromEncryptedJsonSync(walletStr, 'johnwen').connect(
//     ropstenProvider
//   );

//   const factory = new DocumentStoreFactory(wallet);
//   const documentStore = await factory.deploy("OA_DOCUMENT_STORE");
//   await documentStore.deployTransaction.wait();
//   console.log("documentStore.address=", documentStore.address);
//   return documentStore.address;
// }

export async function goVerify() {
  console.log('reading document...');
  const wrappedDocument = fs
    .readFileSync('../OA/DocStore/wrapped-documents/doc0.json')
    .toString();

  console.log('validating document...');
  validateSchema(wrappedDocument);

  console.log('verifying document...');
  const verified = verifySignature(JSON.parse(wrappedDocument));
  console.log(verified);

  const data = getData(wrappedDocument);
  return data;
}

export async function goIssue() {
  console.log('dycryping wallet...');
  const ropstenProvider = getDefaultProvider('ropsten');
  const walletStr = fs.readFileSync('../OA/wallet.json').toString();
  const wallet = Wallet.fromEncryptedJsonSync(walletStr, 'johnwen').connect(
    ropstenProvider
  );

  const raw = fs
    .readFileSync('../OA/DocStore/raw-documents/doc0.json')
    .toString();
  console.log('wrapping...');
  const wrapped = wrapDocument(JSON.parse(raw));
  fs.writeFileSync(
    '../OA/DocStore/wrapped-documents/doc0.json',
    JSON.stringify(wrapped, null, 2)
  );
  const merkleRoot = '0x' + wrapped.signature.merkleRoot;

  console.log('connecting to document store...');
  const documentStore = await connect(
    '0xFdda6f76735BE5860d1d9Bd8C0F79a09826558C5',
    wallet
  );

  console.log('issuing...');
  const tx = await documentStore.issue(merkleRoot);
  await tx.wait();

  //const isIssued = await instance.isIssued(merkleRoot);
  //console.log(isIssued);

  //const signed = await oa.signDocument(wrapped, oa.SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018, wallet);
  //console.log("signed=", signed);

  console.log('done.');
}

export async function registerDNS(networkId, documentStore) {
  console.log('registering DNS...');
  const baseUrl = 'https://sandbox.openattestation.com';
  try {
    const execution = await axios.post(
      baseUrl,
      {
        networkId: networkId,
        address: documentStore,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // const params = new URLSearchParams();
    // params.append('networkId', networkId);
    // params.append('address', documentStore);
    // const execution = await axios.post(baseUrl, params);

    const executionId = execution.data.executionId;
    console.log('executionId=', executionId);
    const dnsRes = await axios.get(`${baseUrl}/execution/${executionId}`);
    const dns = dnsRes.data;
    console.log(
      `Record created at ${dns.name} and will stay valid until ${new Date(
        dns.expiryDate
      ).toString()}`
    );
    return {
      executionId,
      name: dns.name,
      expiryDate: dns.expiryDate,
    };
  } catch (e) {
    console.error("Failed to register DNS - ", e.message);
  }
}

export async function decryptWallet(network, walletEnc, password) {
  console.log('dycryping wallet...');
  const ropstenProvider = getDefaultProvider(network);
  const walletDec = Wallet.fromEncryptedJsonSync(walletEnc, password).connect(
    ropstenProvider
  );
  return walletDec;
}

export async function wrapOADocument(documentRaw) {
  console.log('wrapping document...');
  const documentWrapped = wrapDocument(documentRaw);
  const merkleRoot = '0x' + documentWrapped.signature.merkleRoot;
  return {
    merkleRoot,
    documentWrapped,
  };
}

export async function issueOADocument(wallet, store, merkleRoot) {
  console.log('connecting to document store...');
  const documentStore = await connect(
    store,
    wallet
  );

  console.log('issuing...');
  const tx = await documentStore.issue(merkleRoot);
  await tx.wait();
}

export async function verifyOADocument(payload) {
  const network = payload.network;
  const wrappedDocument = payload.document;
  console.log(`validating document on network ${network}...`);
  validateSchema(wrappedDocument);

  console.log('verifying document...');
  const verify = verificationBuilder(openAttestationVerifiers, { network: network });
  const fragments = await verify(wrappedDocument);
  console.log("fragments=", fragments);
  const verified = isValid(fragments); 
  let error="";
  if(!verified) {
    for(const fragment of fragments) {
      if(fragment.status=='ERROR' || fragment.status=='INVALID') {
        error = fragment.reason.message;
      }
    }
  }
  return { 
      verified,
      error
  };

  //const verified = verifySignature(JSON.parse(wrappedDocument));
  //return verified;

  // //const data = getData(wrappedDocument);
  // //return data;
}

const defaultWallet =
  '{"address":"ff7da6841cfd993ecb67668add984ae41a766e58","id":"b3a09b2d-6df6-4e7b-8190-65eceba38e48","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"505f691ba0a529eb969f40118b8b7ac7"},"ciphertext":"a1691446a5d2715841fbc7acb17710c79dc485c6f6f05eabaa1c46aa8216e6d4","kdf":"scrypt","kdfparams":{"salt":"8b7b2d47c6469f609ac6da29feea1dfd776feb68c7384277166251977958282a","n":131072,"dklen":32,"p":1,"r":8},"mac":"9669fcaf20762baf7aff27f0aae10a50a9bebc102af85944e0f3de3e4128b6e0"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2021-11-03T15-13-16.0Z--ff7da6841cfd993ecb67668add984ae41a766e58","mnemonicCounter":"f00f990392d70e0b3f2efd5c25919345","mnemonicCiphertext":"e91ed4c14f674e411669855817cb18b2","path":"m/44\'/60\'/0\'/0/0","locale":"en","version":"0.1"}}';
const cache = {
  walletData: defaultWallet,
};

export function getWalletData() {
  return cache.walletData;
}

export function setWalletData(walletData) {
  return (cache.walletData = walletData);
}
