
// Create an array of product objects
const products = [
    {name: 'bag', imagePath: 'img/bag.jpg'},
    {name: 'banana', imagePath: 'img/banana.jpg'},
    {name: 'bathroom', imagePath: 'img/bathroom.jpg'},
    {name: 'boots', imagePath: 'img/boots.jpg'},
    {name: 'breakfast', imagePath: 'img/breakfast.jpg'},
    {name: 'bubblegum', imagePath: 'img/bubblegum.jpg'},
    {name: 'chair', imagePath: 'img/chair.jpg'},
    {name: 'cthulhu', imagePath: 'img/cthulhu.jpg'},
    {name: 'dog-duck', imagePath: 'img/dog-duck.jpg'},
    {name: 'dragon', imagePath: 'img/dragon.jpg'},
    {name: 'pen', imagePath: 'img/pen.jpg'},
    {name: 'pet-sweep', imagePath: 'img/pet-sweep.jpg'},
    {name: 'scissors', imagePath: 'img/scissors.jpg'},
    {name: 'shark', imagePath: 'img/shark.jpg'},
    {name: 'sweep', imagePath: 'img/sweep.png'},
    {name: 'tauntaun', imagePath: 'img/tauntaun.jpg'},
    {name: 'unicorn', imagePath: 'img/unicorn.jpg'},
    {name: 'water-can', imagePath: 'img/water-can.jpg'},
    {name: 'wine-glass', imagePath: 'img/wine-glass.jpg'}
  ];

  let state = {
    rounds: 20,
    currentRounds: 0,
  }

  function Product(name, imagePath, timesShown = 0, timesClicked = 0) {
    this.name = name;
    this.imagePath = imagePath;
    this.timesShown = timesShown;
    this.timesClicked = timesClicked;
  }
  let storedProducts = localStorage.getItem('products');
  const productObjects = storedProducts ? JSON.parse(storedProducts) : products.map(product => new Product(product.name, product.imagePath));
  
  const imgElements = document.querySelectorAll('.products');
  const displayedProducts = [];
  
  function getRandomProduct() {
      let availableProducts = productObjects.filter(product => !displayedProducts.includes(product));
  
      if (availableProducts.length === 0) {
          displayedProducts.length = 0;
          availableProducts = productObjects.filter(product => !displayedProducts.includes(product));
      }
  
      const randomIndex = Math.floor(Math.random() * availableProducts.length);
      return availableProducts[randomIndex];
  }
  
  function displayRandomProducts() {
      for (let i = 1; i <= 3; i++) {
          const imgElement = document.getElementById(`img_${i}`);
          const product = getRandomProduct();
  
          product.timesShown++;
          displayedProducts.push(product);
  
          imgElement.src = product.imagePath;
          imgElement.alt = product.name;
      }
  }
  
  function handleClick(e) {
      const altText = e.target.alt;
      const clickedProduct = productObjects.find(({ name }) => name === altText);
  
      if (clickedProduct) {
          clickedProduct.timesClicked++;
          e.target.dataset.votes = clickedProduct.timesClicked;   
      }
  
      checkState();
  }
  
  function checkState() {
      if (state.currentRounds >= state.rounds) {
          const viewResultsButton = document.getElementById('showResults');
          const imgContainer = document.getElementById('image-container');
  
          localStorage.setItem('products', JSON.stringify(productObjects));
  
          imgElements.forEach(img => {
              img.removeEventListener('click', handleClick);
              if (!img.classList.contains('hidden')) {
                  img.classList.add('hidden');
              }
          });
  
          viewResultsButton.classList.remove('hidden');
          viewResultsButton.addEventListener('click', (e) => {
              e.preventDefault();
              displayResults(productObjects);
              viewResultsButton.classList.add('hidden');
 
          });
  
      } else {
          displayRandomProducts();
      }
      state.currentRounds++;
  }
  
  function createChart(imagesArr) {
      const voteData = imagesArr.map(img => img.timesClicked);
      const viewData = imagesArr.map(img => img.timesShown);
      const productNames = imagesArr.map(img => img.name);
      const ctx = document.getElementById('resultsChart').getContext('2d');
  
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
  
  function displayResults(imagesArr) {
      const showResults = document.getElementById('resultsDisplay');
      let Votes = imagesArr.slice().sort((a, b) => b.timesClicked - a.timesClicked);
  
      Votes.forEach(sorted => {
          let li = document.createElement('li');
          let subLiVotes = document.createElement('li');
  
          li.textContent = `${sorted.name}`;
          subLiVotes.textContent = `Votes: ${sorted.timesClicked}`;
  
          li.appendChild(subLiVotes);
          showResults.appendChild(li);
      });
  
      createChart(imagesArr);
  }
  
  imgElements.forEach(img => {
      img.addEventListener('click', handleClick);
  });
  
  checkState();

  // Ekow Helped me with the corrrections, we had to revamp the whole code.