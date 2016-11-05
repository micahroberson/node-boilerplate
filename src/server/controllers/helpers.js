import _ from 'lodash';

export function beginTransaction(entity) {
  return this.providerClients.postgresProviderClient
    .transaction()
    .return(entity);
}

export function commitTransaction(entity) {
  return this.providerClients.postgresProviderClient
    .commit()
    .return(entity);
}

export function rollbackTransaction(error) {
  return this.providerClients.postgresProviderClient
    .rollback()
    .then(() => {
      throw error;
    });
}

export function toUnixTimestamp(date) {
  if(!date) {return null;}
  return ~~((date.getTime() + date.getTimezoneOffset()*60*1000)/1000);
}

export function formatCurrency(valueInCents, options={}) {
  let defaultOptions = {
    withoutTrailingZeros : false, // if true, trailing zeros are stripped. '$10.00' becomes '$10'
    allowCentsSymbol     : false, // if true, values between $0 and $1 will be displayed like '25¢'
    displayZeroAs        : undefined, // if set to a string, a value of $0 will display as this string (i.e. 'Free')
    asRawNumber          : false // if true, return a float representing dollars and cents (i.e 10.00)
  };
  if(typeof options === 'boolean') {options = {withoutTrailingZeros: options};} // backward compatibility
  _.defaults(options, defaultOptions);

  if(options.displayZeroAs && valueInCents === 0) {
    return options.displayZeroAs;
  }

  if(options.asRawNumber) {
    return (valueInCents/100).toFixed(2);
  }

  let valueString;
  if(options.allowCentsSymbol && valueInCents > 0 && valueInCents < 100) {
    valueString = `${valueInCents}¢`;
  }
  else {
    let value = Math.abs(valueInCents) / 100;
    valueString = `$${value.toFixed(2)}`;
  }

  if(options.withoutTrailingZeros) {
    valueString = valueString.replace(/\.0+$/, '');
  }
  if(valueInCents < 0) {
    valueString = `(${valueString})`;
  }
  return valueString;
}
