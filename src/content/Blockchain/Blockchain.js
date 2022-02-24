import React from 'react';

import { TextInput, FileUploader } from 'carbon-components-react';
import { setWalletData } from '../../oa';

const Blockchain = () => {
  const getWallet = async e => {
    const walletStr = await e.target.files[0].text();
    setWalletData(walletStr);
  };

  return (
    <div>
      <div className="bx--file__container">
        <TextInput
          id="network"
          defaultValue="ropsten"
          readOnly={true}
          labelText="Network"
        />
        <FileUploader
          labelTitle="Wallet"
          labelDescription="Click to select your JSON wallet."
          buttonKind="tertiary"
          buttonLabel="Select Wallet"
          name="wallet"
          multiple={false}
          filenameStatus="edit"
          accept={['.json']}
          onChange={getWallet}
        />
        <TextInput
          id="password"
          defaultValue="johnwen"
          labelText="Wallet Password"
          type="password"
        />
      </div>
    </div>
  );
};

export default Blockchain;
