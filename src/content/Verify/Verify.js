import React from 'react';

import { FileUploader } from 'carbon-components-react';
import axios from 'axios';

const Verify = () => {
  const doVerify = async e => {
    try {
      setStatus('', 'Verifying Document...');
      const wrappedDocument = await e.target.files[0].text();
      const response = await axios.post(
        '/verify',
        wrappedDocument,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const result = response.data;
      setStatus('', result);
      // const verified = await verifyOADocument(wrappedDocument);
      // if (verified) {
      //   setStatus('', 'Document is verified.');
      // } else {
      //   setStatus('', 'Document is not verified.');
      // }
    } catch (err) {
      console.error(err);
      setStatus('', `Failed to verify document - ${err.message}`);
    }
  };

  const setStatus = (type, message) => {
    document.getElementById('status').innerHTML = message;
  };

  return (
    <div className="bx--grid bx--grid--full-width bx--grid--no-gutter repo-page">
      <div className="bx--row repo-page__r1">
        <div className="bx--col-lg-16">
          <FileUploader
            labelDescription="Click to select document to verify."
            accept={['*.json']}
            buttonKind="tertiary"
            buttonLabel="Select Document"
            name="wallet"
            multiple={false}
            filenameStatus="edit"
            onChange={doVerify}
          />
        </div>
      </div>
    </div>
  );
};

export default Verify;
