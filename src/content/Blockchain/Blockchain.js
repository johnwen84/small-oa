import React from 'react';

import { Form, FormItem, TextInput, FileUploader } from 'carbon-components-react';
import { setWalletData } from '../../oa';

const Blockchain = () => {
  const getWallet = async e => {
    const walletStr = await e.target.files[0].text();
    setWalletData(walletStr);
  };

  return (
    <div>
      <div className="bx--file__container">
        <Form>
          <FormItem>
            <div style={{marginBottom: '2rem', marginLeft: '3rem', marginTop: '3rem'}}>
              <TextInput
                id="network"
                defaultValue="ropsten"
                readOnly={true}
                labelText="Network"
              />
            </div>
          </FormItem>
          <FormItem>
            <div style={{marginBottom: '2rem', marginLeft: '3rem'}}>
              <FileUploader
                labelDescription="Click to select your JSON wallet."
                buttonKind="tertiary"
                buttonLabel="Select Wallet"
                name="wallet"
                multiple={false}
                filenameStatus="edit"
                accept={['.json']}
                onChange={getWallet}
              />
            </div>
            <div style={{marginBottom: '2rem', marginLeft: '3rem'}}>
            <TextInput
                id="password"
                defaultValue="johnwen"
                labelText="Wallet Password"
                type="password"
              />
            </div>
          </FormItem>
        </Form>
      </div>
    </div>
  );
};

export default Blockchain;
