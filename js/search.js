const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');

searchBtn.addEventListener('click', async () => {
  const query = searchInput.value.trim();
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
    const ingredients = recipe.extendedIngredients?.map(i => i.original) || [];
    card.classList.add('recipe-card', 'card');

    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}" />
      <h3>${recipe.title}</h3>
      <p>Ready in ${recipe.readyInMinutes} mins | ${recipe.servings} servings</p>
      <a href="${recipe.sourceUrl}" target="_blank">View Recipe</a>
      <button class="add-btn" 
        data-id="${recipe.id}" 
        data-title="${recipe.title}" 
        data-image="${recipe.image}"
        data-ingredients='${JSON.stringify(ingredients)}'>
        Add to Plan
      </button>
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

    const day = prompt("Assign this recipe to which day of the week? (e.g. Monday)");
    if (!day || !days.includes(day)) {
      alert('Invalid day. Please type exactly: Monday, Tuesday, etc.');
      return;
    }

    let mealPlan = JSON.parse(localStorage.getItem('mealPlan')) || [];
    mealPlan = mealPlan.filter(r => r.day !== day);

    const ingredients = JSON.parse(button.getAttribute('data-ingredients'));

    mealPlan.push({
      id,
      title,
      image,
      day,
      ingredients   
    });

    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));

    button.textContent = 'Added';
    button.disabled = true;

    alert(`Added "${title}" to your ${day} plan!`);
  }
});
