import Promise from 'bluebird';
import fetch from 'isomorphic-fetch';
import ApiError from './ApiError';

class Resource {
  constructor(apiClient) {
    this._apiClient = apiClient;
  }

  static createEndpoint(spec) {
    return function(payload) {
      let context = {
        spec: spec,
        requestPayload: {payload}
      };
      return this.makeRequest(context);
    };
  }

  makeRequest(context) {
    let requestUrl = this._apiClient.baseUrl + context.spec.path;
    let fetchPayload = {
      method: context.spec.method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    let sessionToken = this._apiClient.getSessionToken();
    if(sessionToken) {
      fetchPayload.headers['Authorization'] = `Bearer ${new Buffer(sessionToken).toString('base64')}`;
    }
    else if(context.spec.authRequired) {
      return Promise.reject(new Error('Authorization required.'));
    }

    if(context.requestPayload) {
      fetchPayload.body = JSON.stringify(context.requestPayload);
    }

    return fetch(requestUrl, fetchPayload).then((response) => {
      return response.json();
    }).then((data) => {
      if(data.error) {
        let rawError = data.error;
        rawError.request_url = requestUrl;
        rawError.request_payload = context.requestPayload;
        throw new ApiError(rawError);
      }
      return data.payload;
    });
  }
}

export default Resource;
