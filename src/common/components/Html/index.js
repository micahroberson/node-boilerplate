import React from 'react';
import colors from '../../lib/colors';

const env = process.env.NODE_ENV;
const bundleSrc = (env === 'development' ? 'http://localhost:8080/assets/bundle.js' : '/assets/bundle.js');

class Html extends React.Component {
  static propTypes = {
    state: React.PropTypes.string,
    markup: React.PropTypes.string,
    css: React.PropTypes.object
  };

  render() {
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>Boilerplate App</title>
          <meta name="viewport" content="width=device-width, user-scalable=no" />
          <style type="text/css" dangerouslySetInnerHTML={{__html: NormalizeCSS}}></style>
          <style type="text/css" dangerouslySetInnerHTML={{__html: BaseCSS}}></style>
          <style data-aphrodite dangerouslySetInnerHTML={{__html: this.props.css.content}} />
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
          <script dangerouslySetInnerHTML={{__html: `window.env='${env}';window.cssState=${JSON.stringify(this.props.css.renderedClassNames)};`}} />
          <script dangerouslySetInnerHTML={{__html: this.props.state}} />
          <script src={bundleSrc} defer></script>
        </body>
      </html>
    );
  }
}

export default Html;

const BaseCSS = `
  html {
    background-color: #ffffff;
    box-sizing: border-box;
    font-family: 'BlinkMacSystemFont', -apple-system, 'Helvetica Neue', 'Lucida Grande', Helvetica, Arial, sans-serif;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  html, body, p, a, fieldset {
    margin: 0;
    padding: 0;
  }
  body {
    color: ${colors.blackOlive};
    -webkit-font-smoothing: antialiased;
    font-size: 14px;
    line-height: 1.4;
  }
  h1 {
    font-size: 42px;
    line-height: 1.2;
    margin: 0 0 28px;
  }
  h2 {
    font-size: 30px;
    line-height: 1.1
    margin: 0 0 20px;
  }
  h3 {

  }
  h4 {
    font-size: 14px;
    font-weight: 500;
  }
  input, textarea, button, select, a, label {
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }
  input, textarea, select, fieldset {
    margin: 0;
    -webkit-appearance: none;
  }
  input:active, textarea:active, input:focus, textarea:focus {
    outline: 0;
  }
  input::-webkit-input-placeholder {
    color: ${colors.black15};
  }
  input:-moz-placeholder {
    color: ${colors.black15};
  }
  input::-moz-placeholder {
    color: ${colors.black15};
  }
  input:-ms-input-placeholder {
    color: ${colors.black15};
  }
  input {
    border: 0;
    padding: 0;
    line-height: 34px;
  }
  input:disabled {
    border-color: transparent;
  }
  input:focus {
    border-color: ${colors.black35};
  }
  fieldset {
    border: 0;
    margin-bottom: 15px;
  }
  label {
    display: block;
    font-size: 16px;
    margin-bottom: 0;
    color: ${colors.lightBlackOlive};
  }
  button {
    border-radius: 2px;
    background-color: #ffffff;
    border: 0;
    color: #1c1c1c;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 500;
  }
  button.jellyBean {
    background-color: ${colors.jellyBean};
    color: #ffffff;
    border-color: ${colors.jellyBean};
  }
  button:hover {
    opacity: 0.9;
  }
  button:active {
    outline: none;
  }
  button.blue {
    background-color: ${colors.tuftsBlue};
    color: #ffffff;
    border-color: ${colors.tuftsBlue};
  }
  a {
    color: #1c1c1c;
    text-decoration: none;
    outline: none;
  }
  a:active {
    outline: none;
  }
  img {
    max-width: 100%;
    margin: 0;
  }
  li, p, ol, ul {
    margin: 0;
    padding: 0;
  }
  ol, ul {
    list-style: none;
  }
  .cf::after {
    clear: both;
    content: "";
    display: table;
  }
`.replace(/(\r\n|\n|\r)/gm,'');

const NormalizeCSS = "/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */img,legend{border:0}legend,td,th{padding:0}html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,details,figcaption,figure,footer,header,hgroup,main,menu,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;vertical-align:baseline}audio:not([controls]){display:none;height:0}[hidden],template{display:none}a{background-color:transparent}a:active,a:hover{outline:0}abbr[title]{border-bottom:1px dotted}b,optgroup,strong{font-weight:700}dfn{font-style:italic}h1{font-size:2em;margin:.67em 0}mark{background:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}svg:not(:root){overflow:hidden}figure{margin:1em 40px}hr{-moz-box-sizing:content-box;box-sizing:content-box;height:0}pre,textarea{overflow:auto}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0}button{overflow:visible}button,select{text-transform:none}button,html input[type=button],input[type=reset],input[type=submit]{-webkit-appearance:button;cursor:pointer}button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}input{line-height:normal}input[type=checkbox],input[type=radio]{box-sizing:border-box;padding:0}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{height:auto}input[type=search]{-webkit-appearance:textfield;box-sizing:content-box}input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration{-webkit-appearance:none}fieldset{border:1px solid silver;margin:0 2px;padding:.35em .625em .75em}table{border-collapse:collapse;border-spacing:0}";
