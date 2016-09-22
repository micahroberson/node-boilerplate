function navigateAction(context, payload) {
  context.dispatch('CHANGE_ROUTE', payload);
  return null;
}

export default navigateAction