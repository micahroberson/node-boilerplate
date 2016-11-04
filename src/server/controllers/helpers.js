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

