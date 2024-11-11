const express = require('express');
const session = require('express-session');
const app = express();

const { validateSession } = require('./middlewares');
const { validateEmployee, getEmployeeByUsername, insertProduct, updateProduct, getProduct, getAllProducts } = require('./database/connector');

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

app.get('/', async (req, res) => {
    if (req.session.employee)
        return res.redirect('/products');

    const { error, username } = req.session;
    delete req.session.error;
    delete req.session.username;
    res.render('index', { error, username });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Credenciais:', { username, password });

    if (await validateEmployee(username, password)) {
        req.session.employee = await getEmployeeByUsername(username);
        res.redirect('/products');
    } else {
        req.session.error = 'Credenciais inválidas!';
        req.session.username = username;
        res.redirect('/');
    }
});

/** ========================= ROTAS RELACIONADAS A PRODUTOS ========================= */
app.get('/products', validateSession, async (req, res) => {
    const products = await getAllProducts();
    console.log('Products:', JSON.stringify(products));
    res.render('products', { products });
});

app.get('/addproduct', validateSession, (req, res) => {
    res.render('addproduct');
});

app.post('/addproduct', validateSession, async (req, res) => {
    const { name, price, description } = req.body;
    console.log('Novo produto:', { name, price, description });

    const newProduct = {
        name: name.trim().replace(/\s+/g, ' '),
        price: parseFloat(price),
        description: description.trim().replace(/[ \t]+/g, ' ')
    };
    console.log('Novo produto formatado:', newProduct);

    const productId = await insertProduct(newProduct);

    res.redirect('/addproduct');
});

app.get('/editproduct/:id', validateSession, async (req, res) => {
    const { id } = req.params;
    const product = await getProduct(id);
    console.log('Produto:', product);
    res.render('editproduct', { ...product });
});

app.post('/updateproduct', validateSession, async (req, res) => {
    const { id, name, price, description } = req.body;
    console.log('Atualizando produto:', { id, name, price, description });

    const updatedProduct = {
        name: name.trim().replace(/\s+/g, ' '),
        price: parseFloat(price),
        description: description.trim()
    };
    console.log('Atualizando produto formatado:', updatedProduct);

    await updateProduct(id, updatedProduct);

    res.redirect('/products');
});

/** ========================= ROTAS RELACIONADAS A PEDIDOS ========================= */
app.get('/orders', validateSession, async (req, res) => {
    // Implementar aqui a lógica para listar pedidos
    console.log('Pedidos:', []);
    res.render('orders');
});

app.get('/addorder', validateSession, async (req, res) => {
    const products = await getAllProducts();
    res.render('addorder', { products });
})

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});