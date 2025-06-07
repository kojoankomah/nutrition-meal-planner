const SPOONACULAR_API_KEY = '37266296d6a249dc89d6c75d70f8db4c';
const BASE_URL = 'https://api.spoonacular.com/recipes';

async function fetchRecipes(query) {
  try {
    const response = await fetch(`${BASE_URL}/complexSearch?query=${query}&number=10&addRecipeInformation=true&apiKey=${SPOONACULAR_API_KEY}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
    return [];
  }
}

