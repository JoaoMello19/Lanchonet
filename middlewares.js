function validateSession(req, res, next) {
    if (req.session?.employee)
        return next();
    res.redirect('/');
}

module.exports = {
    validateSession
}