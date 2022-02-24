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

  const waitCursor = (w)=>{
    if(w) {
      document.body.style.cursor = 'wait';
    }
    else {
      document.body.style.cursor = 'default';
    }
  }

  const setStatus = (type, message) => {
    document.getElementById('status').innerHTML = message;
  };

  const startRegisterDNS = async () => {
    try {
      setStatus('', 'Register DNS...');
      waitCursor(true);
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
    finally {
      waitCursor(false);
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

      if(!dns) {
        setStatus("", "Please enter your DNS, or click the Register button to register a temporary one in the OA sandbox.");
        return;
      }

      if(!store) {
        setStatus("", "Please enter your document store address.");
        return;
      }

      waitCursor(true);
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
      waitCursor(false);
      setStatus('', `Failed to issue - ${err.message}`);
    }
    finally {
      document.body.style.cursor = 'default';
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
    <div className="bx--grid bx--grid--full-width bx--grid--no-gutter">
      <div className="bx--row">
        <div className="bx--col">
          <div style={{marginBottom: '2rem'}}>
            <TextInput
              id="issuer"
              defaultValue="Demo Issuer"
              labelText="Issuer Name"
            />
          </div>
          <div style={{marginBottom: '2rem'}}>
            <TextInput
              id="store"
              defaultValue="0xFdda6f76735BE5860d1d9Bd8C0F79a09826558C5"
              labelText="Document Store"
            />
          </div>
          <div style={{marginBottom: '2rem'}}>
            <TextInput id="dns" labelText="DNS" />
          </div>
          <div style={{marginBottom: '2rem'}}>
            <Button kind="secondary" onClick={startRegisterDNS}>
              Register
            </Button>
          </div>
        </div>
        <div className="bx--col">
          <div style={{marginBottom: '2rem'}}>
            <TextArea
              id="document"
              defaultValue={sampleData}
              labelText="Document"
            />
          </div>
          <div style={{marginBottom: '2rem'}}>
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
          </div>
          <div style={{marginBottom: '2rem'}}>
            <Button kind="secondary" onClick={doIssue}>
              Issue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Issue;
