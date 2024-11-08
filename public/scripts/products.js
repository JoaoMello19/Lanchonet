const products = document.querySelectorAll('#products-container .product-card');;

if (products.length) {
    document.getElementById('search-bar').addEventListener('input', () => {
        const searchTerm = this.value.toLowerCase();

        products.forEach(product => {
            const productName = product.getAttribute('data-name');
            if (productName.includes(searchTerm))
                product.style.display = 'flex';
            else
                product.style.display = 'none';
        });
    });

    products.forEach(product => {
        product.onclick = () => {};
    });
}
