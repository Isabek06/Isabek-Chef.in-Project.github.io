document.addEventListener('DOMContentLoaded', function () {
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', function () {
            window.location.href = 'index.html';
        });
    }

    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', async function () {
        const searchTerm = document.getElementById('search-input').value;
        const recipes = await fetchRecipes(searchTerm);
        displayRecipeDetails(recipes);
    });

    
    const recipeDetailsContainer = document.getElementById('recipe-details');
    recipeDetailsContainer.addEventListener('click', function(event) {
        if (event.target.id === 'prev-recipe') {
            switchRecipe(-1);
        } else if (event.target.id === 'next-recipe') {
            switchRecipe(1);
        }
    });

    function displayRecipeDetails(recipes) {
        currentRecipeIndex = 0;
        currentRecipes = recipes;
        showRecipe();
        showRecipeNavigation();
    }

    function showRecipeNavigation() {
        const prevRecipeButton = document.getElementById('prev-recipe');
        const nextRecipeButton = document.getElementById('next-recipe');
        prevRecipeButton.style.display = 'block'; 
        nextRecipeButton.style.display = 'block'; 
    }

    searchButton.addEventListener('click', async function () {
        const searchTerm = document.getElementById('search-input').value;
        const recipes = await fetchRecipes(searchTerm);
        displayRecipeDetails(recipes);
        showRecipeNavigation(); 
    });
});

let currentRecipeIndex = 0;
let currentRecipes = [];

async function fetchRecipes(searchTerm) {
    try {
        const response = await fetch(`https://api.edamam.com/search?q=${searchTerm}&app_id=7c2087a1&app_key=
        3d096719db3b8d963b665a91142c7800`);
        const data = await response.json();
        currentRecipes = data.hits.map(hit => hit.recipe);
        return currentRecipes;
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        return [];
    }
}

function displayRecipeDetails(recipes) {
    currentRecipeIndex = 0;
    currentRecipes = recipes;
    showRecipe();
}

function switchRecipe(step) {
    currentRecipeIndex += step;
    if (currentRecipeIndex < 0) {
        currentRecipeIndex = 0;
    } else if (currentRecipeIndex >= currentRecipes.length) {
        currentRecipeIndex = currentRecipes.length - 1;
    }
    showRecipe();
}

function showRecipe() {
    const recipeDetailsContainer = document.getElementById('recipe-details');
    recipeDetailsContainer.innerHTML = '';

    const recipesPerPage = 6;
    const startIndex = currentRecipeIndex;
    const endIndex = Math.min(startIndex + recipesPerPage, currentRecipes.length);

    for (let i = startIndex; i < endIndex; i++) {
        const recipe = currentRecipes[i];

        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');

        const recipeTitle = document.createElement('h2');
        recipeTitle.textContent = recipe.label;

        const recipeImage = document.createElement('img');
        recipeImage.src = recipe.image;
        recipeImage.alt = recipe.label;

        const recipeSource = document.createElement('p');
        recipeSource.textContent = `Источник: ${recipe.source}`;

        const ingredientsList = document.createElement('ul');
        recipe.ingredientLines.forEach(ingredient => {
            const ingredientItem = document.createElement('li');
            ingredientItem.textContent = ingredient;
            ingredientsList.appendChild(ingredientItem);
        });

        recipeDiv.appendChild(recipeTitle);
        recipeDiv.appendChild(recipeImage);
        recipeDiv.appendChild(recipeSource);
        recipeDiv.appendChild(document.createElement('h3').appendChild(document.createTextNode('Ингредиенты:')));
        recipeDiv.appendChild(ingredientsList);

        recipeDetailsContainer.appendChild(recipeDiv);
    }
}

function showRecipeNavigation() {
    const prevRecipeButton = document.getElementById('prev-recipe');
    const nextRecipeButton = document.getElementById('next-recipe');
    prevRecipeButton.style.display = 'block'; 
    nextRecipeButton.style.display = 'block'; 
}
