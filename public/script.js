function showProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; 

    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            
products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.className = 'product-card'; 

    
    const productImage = document.createElement('img');
    productImage.src = product.image;
    productImage.alt = product.name;
    productImage.className = 'product-image'; 

    const productName = document.createElement('h3');
    productName.textContent = product.name;
    productName.className = 'product-name'; 

    const productDescription = document.createElement('p');
    productDescription.textContent = product.description;
    productDescription.className = 'product-description'; // Apply the description style

    // Create and style the product link
    const productLink = document.createElement('a');
    productLink.href = product.link;
    productLink.target = '_blank';
    productLink.textContent = 'Product Link';
    productLink.className = 'product-link'; // Apply the link style

    // Create and style the delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button'; // Apply the delete button style
    deleteButton.onclick = () => deleteProduct(product.id);

    // Append all elements to the product card container
    productDiv.appendChild(productImage);
    productDiv.appendChild(productName);
    productDiv.appendChild(productDescription);
    productDiv.appendChild(productLink);
    productDiv.appendChild(deleteButton);

    productList.appendChild(productDiv);
});
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Define a function to add a new product
function addProduct() {
    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productLink = document.getElementById('productLink').value;
    const productImage = document.getElementById('productImage').value;

    if (!productName || !productDescription || !productLink || !productImage) {
        alert('Please fill in all fields');
        return;
    }

    const newProduct = {
        name: productName,
        description: productDescription,
        link: productLink,
        image: productImage,
    };

    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
    })
    .then(response => response.json())
    .then(() => {
        showProducts(); // Refresh the product list after adding
        clearAddForm();
    })
    .catch(error => console.error('Error adding product:', error));
}

// Define a function to clear the add product form
function clearAddForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productLink').value = '';
    document.getElementById('productImage').value = '';
}

// Define a function to show the add product form
function showAddForm() {
    const addForm = document.getElementById('add-form');
    addForm.style.display = 'block';
}

// Define a function to delete a product
function deleteProduct(productId) {
    fetch(`/api/products/${productId}`, {
        method: 'DELETE',
    })
    .then(() => showProducts()) // Refresh the product list after deletion
    .catch(error => console.error('Error deleting product:', error));
}

// Call the showProducts function when the page loads
showProducts();
