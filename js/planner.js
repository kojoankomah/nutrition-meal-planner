const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const plannerGrid = document.getElementById('plannerGrid');

// Get meals from localStorage
let mealPlan = JSON.parse(localStorage.getItem('mealPlan')) || [];

function renderPlanner() {
  plannerGrid.innerHTML = '';
  days.forEach(day => {
    const dayColumn = document.createElement('div');
    dayColumn.classList.add('day');

    const heading = document.createElement('h3');
    heading.textContent = day;

    const meal = mealPlan.find(m => m.day === day);

    const mealContainer = document.createElement('div');
    mealContainer.classList.add('meal');

    if (meal) {
      mealContainer.innerHTML = `
        <img src="${meal.image}" alt="${meal.title}" />
        <p>${meal.title}</p>
        <button class="remove-btn" data-day="${day}">Remove</button>
      `;
    } else {
      mealContainer.innerHTML = `<p>No meal planned</p>`;
    }

    dayColumn.appendChild(heading);
    dayColumn.appendChild(mealContainer);
    plannerGrid.appendChild(dayColumn);
  });
}

plannerGrid.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-btn')) {
    const day = e.target.getAttribute('data-day');
    mealPlan = mealPlan.filter(m => m.day !== day);
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
    renderPlanner();
  }
});

// Initial load
renderPlanner();
