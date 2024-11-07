const express = require('express');
const session = require('express-session');
const app = express();

const { validateSession } = require('./middlewares');
const { validateEmployee, getEmployeeByUsername } = require('./database/connector');

const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));    // body encoding
app.use(session({
    secret: 'meuSegredo',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 300000 }
}));

app.get('/', (req, res) => {
    if (req.session.employee)
        return res.redirect('/products');

    const error = req.session.error;
    delete req.session.error;
    res.render('index', { error });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (await validateEmployee(username, password)) {
        req.session.employee = await getEmployeeByUsername(username);
        res.redirect('/products');
    } else {
        req.session.error = 'Credenciais inválidas!'
        res.redirect('/');
    }
});

app.get('/products', validateSession, (req, res) => {
    res.render('products');
});

app.get('/addproduct', validateSession, (req, res) => {
    res.render('addproduct');
});

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});