import React from 'react';
import axios from 'axios';

import {
  TextInput,
  TextArea,
  Button,
  FileUploader,
} from 'carbon-components-react';
import {
  decryptWallet,
  wrapOADocument,
  issueOADocument,
  getWalletData,
} from '../../oa';

function Issue() {
  const NETWORK_ID = 3;
  const sampleData = JSON.stringify(
    {
      firstName: 'Alice',
      lastName: 'Smith',
    },
    null,
    2
  );

  const setStatus = (type, message) => {
    document.getElementById('status').innerHTML = message;
  };

  const startRegisterDNS = async () => {
    try {
      setStatus('', 'Register DNS...');
      const store = document.getElementById('store').value;
      const response = await axios.post(
        '/dns',
        {
          networkId: NETWORK_ID,
          address: store,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const dnsReg = response.data;
      document.getElementById('dns').value = dnsReg.name;
      setStatus(
        '',
        `Record created at ${dnsReg.name} and will stay valid until ${new Date(
          dnsReg.expiryDate
        ).toString()}`
      );
    } catch (err) {
      console.error(err);
      setStatus('', `Failed to register DNS - ${err.message}`);
    }
  };

  const doIssue = async () => {
    try {
      const network = document.getElementById('network').value;
      const walletPassword = document.getElementById('password').value;

      const issuer = document.getElementById('issuer').value;
      const dns = document.getElementById('dns').value;
      const store = document.getElementById('store').value;
      const documentData = document.getElementById('document').value;
      const documentRaw = buildDocument(documentData, {
        issuer,
        dns,
        store,
      });

      setStatus('', 'Decrypting wallet...');
      const walletStr = getWalletData();
      const wallet = await decryptWallet(network, walletStr, walletPassword);

      setStatus('', 'Wrapping document...');
      const { merkleRoot, documentWrapped } = await wrapOADocument(documentRaw);
      downloadFile(JSON.stringify(documentWrapped, null, 2));

      setStatus('', 'Issuing document...');
      await issueOADocument(wallet, store, merkleRoot);

      setStatus('', 'Document issued successfully.');
    } catch (err) {
      console.error(err);
      setStatus('', `Failed to issue - ${err.message}`);
    }
  };

  const buildDocument = (documentData, options) => {
    const documentRaw = JSON.parse(documentData);
    documentRaw['$template'] = {
      name: 'main',
      type: 'EMBEDDED_RENDERER',
      url: 'https://tutorial-renderer.openattestation.com',
    };
    documentRaw.issuers = [
      {
        name: options.issuer,
        documentStore: options.store,
        identityProof: {
          type: 'DNS-TXT',
          location: options.dns,
        },
      },
    ];
    return documentRaw;
  };

  const getDocument = async e => {
    const docStr = await e.target.files[0].text();
    document.getElementById('document').value = docStr;
  };

  const downloadFile = str => {
    const element = document.createElement('a');
    const file = new Blob([str], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'wrappedDocument.json';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div className="bx--grid bx--grid--full-width bx--grid--no-gutter repo-page">
      <div className="bx--row repo-page__r1">
        <div className="bx--col-lg-16">
          <TextInput
            id="issuer"
            defaultValue="Demo Issuer"
            labelText="Issuer Name"
          />
          <TextInput
            id="store"
            defaultValue="0xFdda6f76735BE5860d1d9Bd8C0F79a09826558C5"
            labelText="Document Store"
          />
          <TextInput id="dns" labelText="DNS" />
          <Button kind="secondary" onClick={startRegisterDNS}>
            Register
          </Button>
          <TextArea
            id="document"
            defaultValue={sampleData}
            labelText="Document"
          />
          <FileUploader
            id="document"
            labelDescription="Enter document or click below to select the document file."
            accept={['*.json']}
            buttonKind="tertiary"
            buttonLabel="Select Document"
            multiple={false}
            filenameStatus="edit"
            onChange={getDocument}
          />
          <Button kind="secondary" onClick={doIssue}>
            Issue
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Issue;
