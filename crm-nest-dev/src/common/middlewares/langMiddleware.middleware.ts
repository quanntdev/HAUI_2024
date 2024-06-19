export const LangMiddleware = () => (req, res, next) => {
  const lang = req.headers['lang'] || 'en'
    if(req.body !== undefined) {
      req.body['lang'] = lang
    }
    next();
};
