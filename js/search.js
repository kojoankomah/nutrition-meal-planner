document.getElementById('searchBtn').addEventListener('click', async () => {
  const query = document.getElementById('searchInput').value.trim();
  const resultsContainer = document.getElementById('results');
resultsContainer.innerHTML = '<div class="loader"></div>';

  if (!query) {
    resultsContainer.innerHTML = '<p>Please enter a search term.</p>';
    return;
  }

  const recipes = await fetchRecipes(query);
  resultsContainer.innerHTML = '';

  if (recipes.length === 0) {
    resultsContainer.innerHTML = '<p>No recipes found.</p>';
    return;
  }

recipes.forEach(recipe => {
  const card = document.createElement('div');
  card.classList.add('recipe-card', 'card');  // added 'card' class for styling
  card.innerHTML = `
    <img src="${recipe.image}" alt="${recipe.title}" />
    <h3>${recipe.title}</h3>
    <p>Ready in ${recipe.readyInMinutes} mins | ${recipe.servings} servings</p>
    <a href="${recipe.sourceUrl}" target="_blank">View Recipe</a>
    <button class="add-btn" data-id="${recipe.id}" data-title="${recipe.title}" data-image="${recipe.image}">Add to Plan</button>
  `;
  resultsContainer.appendChild(card);
});
});

resultsContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('add-btn')) {
    const button = event.target;
    const id = button.getAttribute('data-id');
    const title = button.getAttribute('data-title');
    const image = button.getAttribute('data-image');

    addToMealPlan({ id, title, image });

    // Disable the button and update text after adding
    button.textContent = 'Added';
    button.disabled = true;

  }
});

function addToMealPlan(recipe) {
  let mealPlan = JSON.parse(localStorage.getItem('mealPlan')) || [];

  if (mealPlan.some(r => r.id === recipe.id)) {
    alert('Recipe already in your meal plan!');
    return;
  }

  mealPlan.push(recipe);
  localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
  alert(`Added "${recipe.title}" to your meal plan!`);
}
