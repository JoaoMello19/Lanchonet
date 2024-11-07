function validateSession(req, res, next) {
    if (req.session && req.session.username)
        return next();
    res.redirect('/');
}