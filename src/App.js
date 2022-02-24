import React, { Component } from 'react';
import './app.scss';
import { Content } from 'carbon-components-react';
import OAHeader from './components/OAHeader';
import { Route, Switch } from 'react-router-dom';
import LandingPage from './content/LandingPage';

class App extends Component {
  render() {
    return (
      <>
        <OAHeader />
        <Content>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/repos" component={LandingPage} />
          </Switch>
        </Content>
      </>
    );
  }
}

export default App;
