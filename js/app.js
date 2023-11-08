'use strict';

// Define your product constructor function
function Product(name, imagePath) {
    this.name = name;
    this.imagePath = imagePath;
    this.timesShown = 0;
    this.timesClicked = 0;
}


// Create an array of product objects
const products = [
    new Product('Product 1', 'img/bag.jpg'),
    new Product('Product 2', 'img/banana.jpg'),
    new Product('Product 3', 'img/bathroom.jpg'),
    new Product('Product 4', 'img/boots.jpg'),
    new Product('Product 5', 'img/breakfast.jpg'),
    new Product('Product 6', 'img/bubblegum.jpg'),
    new Product('Product 7', 'img/chair.jpg'),
    new Product('Product 8', 'img/cthulhu.jpg'),
    new Product('Product 9', 'img/dog-duck.jpg'),
    new Product('Product 10', 'img/dragon.jpg'),
    new Product('Product 11', 'img/pen.jpg'),
    new Product('Product 12', 'img/pet-sweep.jpg'),
    new Product('Product 13', 'img/scissors.jpg'),
    new Product('Product 14', 'img/shark.jpg'),
    new Product('Product 15', 'img/sweep.png'),
    new Product('Product 16', 'img/tauntaun.jpg'),
    new Product('Product 17', 'img/unicorn.jpg'),
    new Product('Product 18', 'img/water-can.jpg'),
    new Product('Product 19', 'img/wine-glass.jpg')
];

localStorage.setItem('products', JSON.stringify(products));

// Retrieve the JSON string from local storage
const storedProducts = localStorage.getItem('products');

// Parse the JSON string back to an array
const parsedProducts = JSON.parse(storedProducts);

// Voting Configuration
let rounds = 25; // Number of voting rounds
let currentRound = 0;

// DOM Elements
const productContainer = document.querySelector('.image-container');
const viewResultsButton = document.getElementById('showResults');
const resultsDisplay = document.getElementById('resultsDisplay');

// Array to track displayed products
let displayedProducts = [];
// Function to create and display the bar chart
function createBarChart() {
    if (areVotingRoundsCompleted()) {
        const voteData = parsedProducts.map(product => product.timesClicked);
        const viewData = parsedProducts.map(product => product.timesShown);
        const productNames = parsedProducts.map(product => product.name);

        const ctx = document.getElementById('resultsChart').getContext('2d');
        console.log(ctx);
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: productNames,
                datasets: [
                    {
                        label: 'Votes',
                        data: voteData,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Views',
                        data: viewData,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

}
// Display Unique Products
function displayProducts() {
    if (currentRound >= rounds) {
        productContainer.removeEventListener('click', e => handleProductClick(e));
        viewResultsButton.style.display = 'block';
        return;
    }

    if (displayedProducts.length === parsedProducts.length) {
        displayedProducts = [];
    }

    const uniqueProducts = getUniqueProducts(3);

    productContainer.innerHTML = '';

    for (const product of uniqueProducts) {
        const productImage = document.createElement('img');
        productImage.src = product.imagePath;
        productImage.alt = product.name;
        productContainer.appendChild(productImage);
        product.timesShown++;
        displayedProducts.push(product);
    }

    currentRound++;
}

// Get Three Random Unique Products
function getUniqueProducts(count) {
    const uniqueProducts = [];
    const availableProducts = parsedProducts.slice(); // Create a copy of the products array to work with

    while (uniqueProducts.length < count && availableProducts.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableProducts.length);
        const randomProduct = availableProducts.splice(randomIndex, 1)[0];

        if (!displayedProducts.includes(randomProduct)) {
            uniqueProducts.push(randomProduct);
        }
    }

    return uniqueProducts;
}
// Handle Product Click
function handleProductClick(event) {
    event.preventDefault();
    if (event.target.tagName === 'IMG') {
        const productName = event.target.alt;
        const product = parsedProducts.find(p => p.name === productName);
        if (product) {
            product.timesClicked++;
            displayProducts();
        }
        if (currentRound >= rounds) {
            viewResultsButton.style.display = 'block';
        }
    }
}

// Event Listener for Product Click
productContainer.addEventListener('click', e => handleProductClick(e));

// Check if all rounds have been completed
function areVotingRoundsCompleted() {
    return currentRound >= rounds;
}

// Event Listener for Viewing Results
viewResultsButton.addEventListener('click', (e) => {
    e.preventDefault();
    createBarChart();
    const resultList = document.createElement('ul');
    resultList.className = 'results-list';

    for (const product of parsedProducts) {
        const listItem = document.createElement('li');
        listItem.textContent = `${product.name} had ${product.timesClicked} votes and was seen ${product.timesShown} times.`;
        resultList.appendChild(listItem);
    }

    resultsDisplay.appendChild(resultList);
    viewResultsButton.style.display = 'none';
});


// Initial Display of Products
displayProducts();