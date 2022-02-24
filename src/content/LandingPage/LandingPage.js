import React from 'react';
import { Tabs, Tab } from 'carbon-components-react';

import Blockchain from '../Blockchain';
import Issue from '../Issue';
import Verify from '../Verify';

const props = {
  tabs: {
    selected: 0,
    triggerhref: '#',
    role: 'navigation',
  },
  tab: {
    href: '#',
    role: 'presentation',
    tabIndex: 0,
  },
};

const LandingPage = () => {
  return (
    <div className="bx--grid bx--grid--full-width landing-page">
      <div className="bx--row landing-page__banner" />
      <div className="bx--row landing-page__r2">
        <div className="bx--col bx--no-gutter">
          <Tabs {...props.tabs} aria-label="Tab navigation">
            <Tab {...props.tab} label="Blockchain">
              <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
                <Blockchain />
              </div>
            </Tab>
            <Tab {...props.tab} label="Issue Document">
              <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
                <div className="bx--row landing-page__tab-content">
                  <div className="bx--col-lg-16">
                    <Issue />
                  </div>
                </div>
              </div>
            </Tab>
            <Tab {...props.tab} label="Verify Document">
              <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
                <div className="bx--row landing-page__tab-content">
                  <div className="bx--col-lg-16">
                    <Verify />
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
      <div className="bx--row landing-page__r3">
        <span id="status" />
      </div>
    </div>
  );
};

export default LandingPage;
