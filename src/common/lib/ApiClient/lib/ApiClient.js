import CookieDough from 'cookie-dough';

const DEFAULT_BASE_URL = 'http://localhost:4000/api';
const OneDay = 86400; // s
const OneYear = OneDay * 365;


let env = (typeof window !== 'undefined' ? window.ENV : process.env.NODE_ENV);
// TODO: Set expires
let cookieOptions = {
  path: '/',
  secure: env === 'staging' || env === 'production',
  maxAge: OneYear
};

class DelectoryApi {
  constructor(opts={}) {
    this.baseUrl = DEFAULT_BASE_URL;
    this._req = opts.req; // accessible server-side only

    this._prepResources();
    this.setSessionToken(opts.sessionToken || null);
  }

  getSessionToken() {
    return this._session_token;
  }

  setSessionToken(sessionToken) {
    this._session_token = sessionToken;
    if(sessionToken) {
      let cookie = CookieDough(this._req);
      cookie.set('st', sessionToken, cookieOptions);
    }
  }

  _prepResources() {
    let resources = {
      Users : require('./resources/Users').default,
      Teams : require('./resources/Teams').default
    };
    for(let resourceName in resources) {
      this[resourceName[0].toLowerCase() + resourceName.substring(1)] = new resources[resourceName](this);
    }
  }
}

export default DelectoryApi;
