const nameInput = document.getElementById('nameInput');
const goalInput = document.getElementById('goalInput');
const profileForm = document.getElementById('profileForm');
const profileGreeting = document.getElementById('profileGreeting');
const content = document.getElementById('profileContent');
const clearBtn = document.getElementById('clearPlan');

const mealPlan = JSON.parse(localStorage.getItem('mealPlan')) || [];
const userData = JSON.parse(localStorage.getItem('userProfile')) || {};

if (userData.name) nameInput.value = userData.name;
if (userData.goal) goalInput.value = userData.goal;

// Save name + goal
profileForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const goal = parseInt(goalInput.value.trim());

  if (!name || isNaN(goal)) return alert("Please fill in both fields correctly.");

  localStorage.setItem('userProfile', JSON.stringify({ name, goal }));
  location.reload();
});

// Show greeting and stats
if (userData.name && userData.goal) {
  profileGreeting.innerHTML = `
    <h3>Hello, ${userData.name}! 👋</h3>
    <p>Your daily calorie goal is <strong>${userData.goal} kcal</strong>.</p>
  `;
}

if (mealPlan.length === 0) {
  content.innerHTML = '<p>You have no meals in your plan yet.</p>';
} else {
  let totalCalories = 0;
  let nutritionHtml = '';

mealPlan.forEach((meal, index) => {
  const { title, day, nutrition } = meal;
  nutritionHtml += `
    <div class="profile-card">
      <div class="profile-meal-header">
        <input type="text" class="edit-title" value="${title}" data-index="${index}" />
        <select class="edit-day" data-index="${index}">
          ${['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => 
            `<option value="${d}" ${d === day ? 'selected' : ''}>${d}</option>`
          ).join('')}
        </select>
        <button class="delete-meal" data-index="${index}">❌</button>
      </div>
      <p>🍽 Calories: ${nutrition?.calories || 'N/A'}</p>
      <p>💪 Protein: ${nutrition?.protein || 'N/A'}</p>
      <p>🥦 Carbs: ${nutrition?.carbs || 'N/A'}</p>
      <p>🧈 Fat: ${nutrition?.fat || 'N/A'}</p>
    </div>
  `;

  const cal = parseInt(nutrition?.calories);
  if (!isNaN(cal)) totalCalories += cal;
});

  const overOrUnder = userData.goal
    ? `<p><strong>${totalCalories > userData.goal ? "⚠️ Over" : "✅ Under"} goal</strong> by ${Math.abs(totalCalories - userData.goal)} kcal.</p>`
    : '';

content.innerHTML = `
  <h3>Total Meals: ${mealPlan.length}</h3>
  <h4>Total Calories: ${totalCalories} kcal</h4>
  ${overOrUnder}
  ${nutritionHtml}
`;

document.querySelectorAll('.delete-meal').forEach(button => {
  button.addEventListener('click', (e) => {
    const index = parseInt(e.target.getAttribute('data-index'));
    if (!isNaN(index)) {
      const confirmDelete = confirm("Are you sure you want to delete this meal?");
      if (confirmDelete) {
        mealPlan.splice(index, 1);
        localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
        location.reload();
      }
    }
  });
});


  document.querySelectorAll('.edit-title').forEach(input => {
  input.addEventListener('change', (e) => {
    const i = e.target.getAttribute('data-index');
    mealPlan[i].title = e.target.value.trim();
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
  });
});

document.querySelectorAll('.edit-day').forEach(select => {
  select.addEventListener('change', (e) => {
    const i = e.target.getAttribute('data-index');
    mealPlan[i].day = e.target.value;
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
    location.reload(); // refresh to re-group if grouped by day
  });
});

}

clearBtn.addEventListener('click', () => {
  if (confirm("Clear your entire meal plan?")) {
    localStorage.removeItem('mealPlan');
    location.reload();
  }
});
