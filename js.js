function loadProductsByCategory() {
    fetch('https://fakestoreapi.com/products/categories')
        .then(response => response.json())
        .then(categories => {
            const categoriesContainer = document.getElementById('categories-container');
            categoriesContainer.innerHTML = '';

            categories.forEach(category => {
                const categoryDiv = document.createElement('div');
                categoryDiv.classList.add('category');
                categoryDiv.innerHTML = `<h2>${category}</h2><div class="products" id="${category}-products"></div>`;
                categoriesContainer.appendChild(categoryDiv);

                fetch(`https://fakestoreapi.com/products/category/${category}`)
                    .then(response => response.json())
                    .then(products => {
                        const productsContainer = document.getElementById(`${category}-products`);

                        products.forEach(product => {
                            const productCard = document.createElement('div');
                            productCard.classList.add('product');

                            productCard.innerHTML = `
                                <img src="${product.image}" alt="${product.title}">
                                <h2>${product.title}</h2>
                                <p>${product.description.substring(0, 100)}...</p>
                                <div class="price">$${product.price}</div>
                                <div class="actions">
                                    <button class="edit" onclick="editProduct(${product.id})">Edit</button>
                                    <button class="delete" onclick="deleteProduct(${product.id})">Delete</button>
                                </div>
                            `;

                            productsContainer.appendChild(productCard);
                        });
                    })
                    .catch(error => console.error(`Error fetching products for category ${category}:`, error));
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
}

function addProduct() {
    const title = document.getElementById('product-title').value;
    const price = document.getElementById('product-price').value;
    const description = document.getElementById('product-description').value;
    const image = document.getElementById('product-image').value;
    const category = document.getElementById('product-category').value;

    const newProduct = {
        title: title,
        price: parseFloat(price),
        description: description,
        image: image,
        category: category
    };

    fetch('https://fakestoreapi.com/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Producto añadido:', data);
            alert('Producto añadido exitosamente!');
            loadProductsByCategory();
        })
        .catch(error => console.error('Error adding product:', error));
}

function deleteProduct(productId) {
    fetch(`https://fakestoreapi.com/products/${productId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            console.log('Producto eliminado:', data);
            alert('Producto eliminado exitosamente!');
            loadProductsByCategory();
        })
        .catch(error => console.error('Error al eliminar producto:', error));
}

function editProduct(productId) {
    const title = prompt('Nuevo title:');
    const price = prompt('Nuevo price:');
    const description = prompt('Nueva descripcion:');
    const image = prompt('Nueva imagen URL:');
    const category = prompt('Nueva categoria:');

    if (title && price && description && image && category) {
        const updatedProduct = {
            title: title,
            price: parseFloat(price),
            description: description,
            image: image,
            category: category
        };

        fetch(`https://fakestoreapi.com/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Producto Actualizado:', data);
                alert('Product updated successfully!');
                loadProductsByCategory();
            })
            .catch(error => console.error('Error updating product:', error));
    }
}

loadProductsByCategory();