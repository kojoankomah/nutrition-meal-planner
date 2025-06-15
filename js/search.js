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
  console.log("RAW Spoonacular data:", recipes);

  resultsContainer.innerHTML = '';

  if (recipes.length === 0) {
    resultsContainer.innerHTML = '<p>No recipes found.</p>';
    return;
  }

  recipes.forEach(recipe => {
    const card = document.createElement('div');
    let ingredients = [];
    if (Array.isArray(recipe.extendedIngredients)) {
      ingredients = recipe.extendedIngredients.map(i => i.original);
    }
    card.classList.add('recipe-card', 'card');

    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}" />
      <h3>${recipe.title}</h3>
      <p>Ready in ${recipe.readyInMinutes} mins | ${recipe.servings} servings</p>
      <a href="${recipe.sourceUrl}" target="_blank">View Recipe</a>

      <div class="add-to-plan">
        <select class="day-select">
          <option value="" disabled selected>Choose a day</option>
          ${days.map(day => `<option value="${day}">${day}</option>`).join("")}
        </select>
        <button class="add-btn"
          data-id="${recipe.id}" 
          data-title="${recipe.title}" 
          data-image="${recipe.image}"
          data-ingredients='${JSON.stringify(ingredients)}'
          disabled
        >
          Add to Plan
        </button>
      </div>
    `;

    resultsContainer.appendChild(card);
    
    const select = card.querySelector('.day-select');
    const addBtn = card.querySelector('.add-btn');

    select.addEventListener('change', () => {
      if (select.value) {
        addBtn.disabled = false;
      }
    });

  });
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // prevent default form submission if any
    searchBtn.click();      // simulate clicking the search button
  }
});


resultsContainer.addEventListener('click', async (event) => {
  if (event.target.classList.contains('add-btn')) {
    const button = event.target;
    const id = button.getAttribute('data-id');
    const title = button.getAttribute('data-title');
    const image = button.getAttribute('data-image');
    const ingredients = JSON.parse(button.getAttribute('data-ingredients'));

const daySelect = button.previousElementSibling;
let day = daySelect.value;

if (!day || !days.includes(day)) {
  alert('Please select a valid day from the dropdown.');
  return;
}



day = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase(); // Normalize to "Monday"

if (!days.includes(day)) {
  alert('Invalid day. Please enter a valid day of the week (e.g., Monday).');
  return;
}


    // 🔥 Fetch nutrition info here
    const nutrition = await fetchNutrition(id);

    let mealPlan = JSON.parse(localStorage.getItem('mealPlan')) || [];
    mealPlan = mealPlan.filter(r => r.day !== day);

    mealPlan.push({ id, title, image, day, ingredients, nutrition });

    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));

    button.textContent = 'Added';
    button.disabled = true;

    alert(`Added "${title}" to your ${day} plan!`);
  }
});

