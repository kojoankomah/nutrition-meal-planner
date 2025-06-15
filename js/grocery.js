const listEl = document.getElementById('groceryList');
let mealPlan = JSON.parse(localStorage.getItem('mealPlan')) || [];

let allIngredients = [];

// ✅ Gather ingredients from each recipe
mealPlan.forEach(meal => {
  if (meal.ingredients && Array.isArray(meal.ingredients)) {
    allIngredients.push(...meal.ingredients);
  }
});

// Optional: remove duplicates
allIngredients = [...new Set(allIngredients)];

function renderList() {
  listEl.innerHTML = '';
  if (allIngredients.length === 0) {
    listEl.innerHTML = '<li>No grocery items found. Add meals to your planner first!</li>';
    return;
  }

  allIngredients.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <label>
        <input type="checkbox" />
        ${item}
      </label>
      <button class="remove-item" data-index="${index}">Remove</button>
    `;
    listEl.appendChild(li);
  });
}

// 🗑️ Remove items when user clicks "Remove"
listEl.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-item')) {
    const index = e.target.getAttribute('data-index');
    allIngredients.splice(index, 1);
    renderList();
  }
});

renderList();
