export const controllerActionHandler = (action) => {
  return (req, res) => {
    return action(req.ctx, Object.assign(req.params, req.payload))
      .then((responsePayload) => {
        res.payload = responsePayload;
        return 'next';
      });
  };
};
