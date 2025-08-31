export const requireAuth = (req, res, next) => {
  if (req.session && req.session.isLoggedIn) {
    return next();
  } else {
    return res.redirect('/auth/login');
  }
};

export const redirectIfLoggedIn = (req, res, next) => {
  if (req.session && req.session.isLoggedIn) {
    return res.redirect('/');
  }
  return next();
};