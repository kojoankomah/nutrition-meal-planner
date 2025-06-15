const listEl = document.getElementById('groceryList');
const mealPlan = JSON.parse(localStorage.getItem('mealPlan')) || [];

function renderGroupedListByDay() {
  listEl.innerHTML = '';

  if (mealPlan.length === 0) {
    listEl.innerHTML = '<li>No grocery items found. Add meals to your planner first!</li>';
    return;
  }

  // Group meals by day
  const groupedByDay = {};

  mealPlan.forEach(meal => {
    if (!groupedByDay[meal.day]) {
      groupedByDay[meal.day] = [];
    }
    groupedByDay[meal.day].push(meal);
  });

  // Create card for each day
  Object.entries(groupedByDay).forEach(([day, meals]) => {
    const card = document.createElement('div');
    card.classList.add('grocery-card');

    const header = document.createElement('h3');
    header.textContent = `🗓 ${day}`;
    card.appendChild(header);

    meals.forEach((meal, mealIndex) => {
      const mealTitle = document.createElement('p');
      mealTitle.innerHTML = `<strong>🍽 ${meal.title}</strong>`;
      card.appendChild(mealTitle);

      if (meal.nutrition) {
        const nutritionInfo = document.createElement('p');
        nutritionInfo.innerHTML = `
          <em>🧪 ${meal.nutrition.calories}, ${meal.nutrition.protein} protein, ${meal.nutrition.carbs} carbs, ${meal.nutrition.fat} fat</em>
        `;
        nutritionInfo.style.fontSize = "0.85rem";
        nutritionInfo.style.marginBottom = "0.5rem";
        card.appendChild(nutritionInfo);
      }

      if (Array.isArray(meal.ingredients)) {
        meal.ingredients.forEach((ingredient, ingredientIndex) => {
          const item = document.createElement('div');
          item.classList.add('ingredient-item');
          item.innerHTML = `
            <label>
              <input type="checkbox" />
              ${ingredient}
            </label>
            <button class="remove-item" data-meal="${mealPlan.indexOf(meal)}" data-index="${ingredientIndex}">Remove</button>
          `;
          card.appendChild(item);
        });
      }
    });

    listEl.appendChild(card);
  });
}

// Remove item from specific recipe
listEl.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-item')) {
    const mealIndex = e.target.getAttribute('data-meal');
    const itemIndex = e.target.getAttribute('data-index');

    if (
      mealPlan[mealIndex] &&
      Array.isArray(mealPlan[mealIndex].ingredients)
    ) {
      mealPlan[mealIndex].ingredients.splice(itemIndex, 1);
      localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
      renderGroupedListByDay();
    }
  }
});

// Clear all meals (optional)
document.getElementById('clearList').addEventListener('click', () => {
  localStorage.removeItem('mealPlan');
  renderGroupedListByDay();
});

// Mark all as bought
document.getElementById('markAll').addEventListener('click', () => {
  const checkboxes = listEl.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = true);
});

renderGroupedListByDay();
document.getElementById('printList').addEventListener('click', () => {
  window.print();
});
