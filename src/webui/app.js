import React, { Component } from 'react';
import isNil from 'lodash/isNil';
import 'element-theme-default';

import storage from './utils/storage';
import logo from './utils/logo';
import { makeLogin, isTokenExpire } from './utils/login';

import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/Login';

import Route from './router';

import API from './utils/api';

import './styles/main.scss';
import 'normalize.css';

export default class App extends Component {
  constructor() {
    super();
    this.handleLogout = this.handleLogout.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.doLogin = this.doLogin.bind(this);
    this.loadLogo = this.loadLogo.bind(this);
    this.isUserAlreadyLoggedIn = this.isUserAlreadyLoggedIn.bind(this);
    this.setLoading = this.setLoading.bind(this);
    this.state = {
      error: {},
      logoUrl: '',
      user: {},
      scope: (window.VERDACCIO_SCOPE) ? `${window.VERDACCIO_SCOPE}:` : '',
      showLoginModal: false,
      isUserLoggedIn: false,
      packages: [],
      filteredPackages: [],
      search: "",
      isLoading: false
    };
  }

  async componentDidMount() {
    await this.setLoading(true);
    await this.loadLogo();
    await this.isUserAlreadyLoggedIn();
    await this.loadPackages();
    await this.setLoading(false);
  }

  async loadLogo() {
   return (
     new Promise( async resolve => {
      const logoUrl = await logo();
      this.setState({ 
        logoUrl 
      }, () => resolve());
     })
   );
  }

  async isUserAlreadyLoggedIn() {
    // checks for token validity
    const token = storage.getItem('token');
    const username = storage.getItem('username');

   return (
     new Promise(async resolve => {
      if (isTokenExpire(token) || isNil(username)) {
        await this.handleLogout();
        resolve();
      } else {
        this.setState({
          user: { username, token },
          isUserLoggedIn: true
        }, () => resolve());
      }
     })
   );
  }

  async loadPackages() {
    const { search } = this.state;
    return (
      new Promise(async (resolve, reject) => {
        try {
          this.req = await API.request('packages', 'GET');
    
          if (search === '') {
            this.setState({
              packages: this.req
            }, () => resolve());
          }
        } catch (error) {
          this.handleShowAlertDialog({
            title: 'Warning',
            message: `Unable to load package list: ${error.error}`
          });
          reject();
        }
      })
    );
  }

  async setLoading(isLoading) {
    return (
      new Promise((resolve) => {
        this.setState({
          isLoading
        }, () => resolve());
      })
    );
  }

  /**
   * Toggles the login modal
   * Required by: <LoginModal /> <Header />
   */
  toggleLoginModal() {
    this.setState((prevState) => ({
      showLoginModal: !prevState.showLoginModal,
      error: {}
    }));
  }

  /**
   * handles login
   * Required by: <Header />
   */
  async doLogin(usernameValue, passwordValue) {
    const { username, token, error } = await makeLogin(
      usernameValue,
      passwordValue
    );

    if (username && token) {
      this.setState({
        user: {
          username,
          token
        }
      });
      storage.setItem('username', username);
      storage.setItem('token', token);
      // close login modal after successful login
      // set isUserLoggedin to true
      this.setState({
        isUserLoggedIn: true,
        showLoginModal: false
      });
    }

    if (error) {
      this.setState({
        user: {},
        error
      });
    }
  }

  /**
   * Logouts user
   * Required by: <Header />
   */
  async handleLogout() {
   return (
     new Promise(async resolve => {
      await storage.removeItem('username');
      await storage.removeItem('token');
      this.setState({
        user: {},
        isUserLoggedIn: false
      }, () => resolve());
     })
   );
  }

  handleSearch(event) {
    this.setState({
      search: event.target.value
    });
  }

  renderHeader() {
    const { logoUrl, packages, user, scope, search } = this.state;
    return (
      <Header
        logo={logoUrl}
        username={user.username}
        scope={scope}
        toggleLoginModal={this.toggleLoginModal}
        packages={packages}
        search={search}
        onSearch={this.handleSearch}
        onLogout={this.handleLogout}
      />
    );
  }

  renderLoginModal() {
    const { error, showLoginModal } = this.state;
    return (
      <LoginModal
        visibility={showLoginModal}
        error={error}
        onChange={this.setUsernameAndPassword}
        onCancel={this.toggleLoginModal}
        onSubmit={this.doLogin}
      />
    );
  }

  render() {
    const { isUserLoggedIn } = this.state;
    return (
      <div className="page-full-height">
        {this.renderHeader()}
        {this.renderLoginModal()}
        <Route isUserLoggedIn={isUserLoggedIn} />
        <Footer />
      </div>
    );
  }
}
