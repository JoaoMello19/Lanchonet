const { Pool } = require('pg');

const pool = new Pool({
    user: 'joaomello',
    host: 'localhost',
    database: 'lanchonetdb',
    password: 'admin123',
    port: 5432,
});

/** ----- EMPLOYEE ----- */
async function insertEmployee({ name, username, password }) {
    const query = `
        INSERT INTO employee (name, username, password)
        VALUES ($1, $2, $3)
        RETURNING employee_id;
    `;

    const values = [ name, username, password ];
    const res = await pool.query(query, values);
    return res.rows[0].employee_id;
}

async function getEmployeeById(employee_id) {
    const query = `SELECT employee_id, name, username FROM employee WHERE employee_id = $1;`;

    const values = [ employee_id ];
    const res = await pool.query(query, values);
    return res.rows[0];
}

async function getEmployeeByUsername(username) {
    const query = `SELECT employee_id, name, username FROM employee WHERE username = $1;`;

    const values = [ username ];
    const res = await pool.query(query, values);
    return res.rows[0];
}

async function validateEmployee(username, password) {
    const query = `SELECT * FROM employee WHERE username = $1 AND password = $2;`;

    const values = [ username, password ];
    const res = await pool.query(query, values);
    return res.rows?.length > 0;
}

/** ----- PRODUCT ----- */
async function insertProduct({ name, price, description }) {
    const query = `
        INSERT INTO product (name, price, description)
        VALUES ($1, $2, $3)
        RETURNING product_id;
    `;

    const values = [ name, price, description ];
    const res = await pool.query(query, values);
    return res.rows[0].product_id;
}

async function getProduct(product_id) {
    const query = `SELECT * FROM product WHERE product_id = $1;`;

    const values = [ product_id ];
    const res = await pool.query(query, values);
    return res.rows[0];
}

/** ----- ORDER ----- */
async function insertOrder({ employee_id, products }) {
    const query = `
        INSERT INTO order (employee_id)
        VALUES ($1)
        RETURNING order_id;
    `;

    const values = [ employee_id ];
    const res = await pool.query(query, values);
    const order_id = res.rows[0].order_id;

    for (const product of products) {
        const { product_id, quantity } = product;
        const query = `
            INSERT INTO order_product (order_id, product_id, quantity)
            VALUES ($1, $2, $3);
        `;

        const values = [ order_id, product_id, quantity ];
        await pool.query(query, values);
    }

    return order_id;
}



module.exports = {
    validateEmployee,
    getEmployeeById,
    getEmployeeByUsername
}