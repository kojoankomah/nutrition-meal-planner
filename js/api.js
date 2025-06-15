const SPOONACULAR_API_KEY = 'b395c0ab105c433ea94707f8b26e3eb9';
const BASE_URL = 'https://api.spoonacular.com/recipes';

async function fetchRecipes(query) {
  try {
    // Step 1: basic search
    const searchRes = await fetch(`${BASE_URL}/complexSearch?query=${query}&number=10&apiKey=${SPOONACULAR_API_KEY}`);
    const searchData = await searchRes.json();

    // Step 2: fetch full info for each recipe
    const fullRecipes = await Promise.all(
      searchData.results.map(async (recipe) => {
        const detailsRes = await fetch(`${BASE_URL}/${recipe.id}/information?includeNutrition=false&apiKey=${SPOONACULAR_API_KEY}`);
        return await detailsRes.json();
      })
    );

    return fullRecipes;
  } catch (error) {
    console.error('Failed to fetch full recipe info:', error);
    return [];
  }
}

async function fetchNutrition(id) {
  const response = await fetch(`https://api.spoonacular.com/recipes/${id}/nutritionWidget.json?apiKey=${SPOONACULAR_API_KEY}`);
  const data = await response.json();
  return {
    calories: data.calories,
    carbs: data.carbs,
    fat: data.fat,
    protein: data.protein
  };
}
