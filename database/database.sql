-- Tabela Funcionario
CREATE TABLE employee (
    employee_id SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    username    VARCHAR(50) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL  -- Salve as senhas com hash e sal
);

-- Tabela Pedido
CREATE TABLE orders (
    order_id   SERIAL PRIMARY KEY,
    customer   VARCHAR(100) NOT NULL,
    address    TEXT NOT NULL,
    total      DECIMAL(10, 2) NOT NULL,
    pay_method VARCHAR(50),
    status     VARCHAR(20) NOT NULL
);

-- Tabela Produto
CREATE TABLE product (
    product_id  SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    price       DECIMAL(10, 2) NOT NULL,
    description TEXT
);

-- Tabela Produto_Pedido (tabela de junção para o relacionamento muitos-para-muitos)
CREATE TABLE product_order (
    product_id INT REFERENCES product (product_id) ON DELETE CASCADE,
    order_id   INT REFERENCES orders (order_id) ON DELETE CASCADE,
    amount     INT NOT NULL,
    notes      TEXT,
    subtotal   DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (product_id, order_id)
);
