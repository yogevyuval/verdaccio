import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';

import {asyncComponent} from './utils/asyncComponent';

const DetailPackage = asyncComponent(() => import('./pages/detail'));
const HomePage = asyncComponent(() => import('./pages/home'));

class RouterApp extends Component {
  static propTypes = {
    isUserLoggedIn: PropTypes.bool
  };
  render() {
    const {isUserLoggedIn} = this.props;
    return (
      <Router>
        <div className="container">
          <Switch>
            <Route
              exact
              path="/(search/:keyword)?"
              render={() => <HomePage isUserLoggedIn={isUserLoggedIn} />}
            />
            <Route
              exact
              path="/detail/@:scope/:package"
              render={(props) => (
                <DetailPackage {...props} isUserLoggedIn={isUserLoggedIn} />
              )}
            />
            <Route
              exact
              path="/detail/:package"
              render={(props) => (
                <DetailPackage {...props} isUserLoggedIn={isUserLoggedIn} />
              )}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default RouterApp;
