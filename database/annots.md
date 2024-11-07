# Tabelas

## Funcionario
- ID
- nome
- usuario
- senha

## Pedido
- ID
- cliente
- endereco
- total
- forma_pgto
- status

## Produto
- ID
- nome
- preco
- descricao

## Produto_Pedido
- ID_produto
- ID_pedido
- quantidade
- observacao
- subtotal

# Instalar e Configurar

## Instalar
sudo apt update
sudo apt install postgresql postgresql-contrib

# Iniciar
sudo service postgresql start

# Executar
sudo -u postgres psql

CREATE DATABASE seu_banco;
CREATE USER seu_usuario WITH ENCRYPTED PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE seu_banco TO seu_usuario;

\q
