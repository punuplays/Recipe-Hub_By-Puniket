/* ==========================================
   RECIPE HUB BY PUNIKET
   Created by Puniket Gawade
   100+ Professional Recipes
========================================== */

"use strict";

// ==========================================
// 1. CATEGORY DATABASE
// ==========================================

const categories = [
    { id: "pizza", name: "Pizza", icon: "🍕", description: "Italian favourites" },
    { id: "burgers", name: "Burgers", icon: "🍔", description: "Juicy and delicious" },
    { id: "pasta", name: "Pasta", icon: "🍝", description: "Creamy Italian meals" },
    { id: "desserts", name: "Desserts", icon: "🍰", description: "Sweet creations" },
    { id: "healthy", name: "Healthy Food", icon: "🥗", description: "Fresh and nutritious" },
    { id: "indian", name: "Indian Food", icon: "🍛", description: "Traditional flavours" },
    { id: "chicken", name: "Chicken", icon: "🍗", description: "Chicken favourites" },
    { id: "asian", name: "Asian Food", icon: "🍜", description: "Asian inspirations" },
    { id: "snacks", name: "Snacks", icon: "🍟", description: "Quick bites" },
    { id: "drinks", name: "Drinks", icon: "🥤", description: "Refreshing beverages" }
];


// ==========================================
// 2. RECIPE DATABASE
// Detailed recipes are added in the next parts.
// ==========================================

const recipes = [];


// ==========================================
// 3. WEBSITE STATE
// ==========================================

let activeCategory = "all";
let searchTerm = "";
let visibleRecipes = 12;


// ==========================================
// 4. SELECT HTML ELEMENTS
// ==========================================

const categoryGrid = document.getElementById("categoryGrid");
const recipeGrid = document.getElementById("recipeGrid");
const recipeFilters = document.getElementById("recipeFilters");
const recipeCount = document.getElementById("recipeCount");

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

const emptyState = document.getElementById("emptyState");
const loadMoreBtn = document.getElementById("loadMoreBtn");

const recipeModal = document.getElementById("recipeModal");
const recipeDetails = document.getElementById("recipeDetails");

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const backToTop = document.getElementById("backToTop");


// ==========================================
// 5. CATEGORY DISPLAY
// ==========================================

function renderCategories() {

    categoryGrid.innerHTML = categories.map(category => `

        <div class="category-card"
             data-category="${category.id}"
             tabindex="0"
             role="button"
             aria-label="Explore ${category.name} recipes">

            <div class="category-icon">
                ${category.icon}
            </div>

            <h3>${category.name}</h3>

            <p>${category.description}</p>

        </div>

    `).join("");

}


// ==========================================
// 6. CATEGORY FILTER BUTTONS
// ==========================================

function renderCategoryFilters() {

    const allButton = `
        <button class="filter-btn active"
                data-category="all">
            All Recipes
        </button>
    `;

    const categoryButtons = categories.map(category => `

        <button class="filter-btn"
                data-category="${category.id}">
            ${category.icon} ${category.name}
        </button>

    `).join("");

    recipeFilters.innerHTML = allButton + categoryButtons;

}


// ==========================================
// 7. FILTER RECIPES
// ==========================================

function getFilteredRecipes() {

    return recipes.filter(recipe => {

        const matchesCategory =
            activeCategory === "all" ||
            recipe.category === activeCategory;

        const searchableText = `
            ${recipe.name}
            ${recipe.category}
            ${recipe.description}
            ${recipe.ingredients.map(item => item.name).join(" ")}
        `.toLowerCase();

        const matchesSearch =
            searchableText.includes(searchTerm);

        return matchesCategory && matchesSearch;

    });

}


// ==========================================
// 8. RECIPE CARD GENERATOR
// ==========================================

function createRecipeCard(recipe) {

    const category = categories.find(
        item => item.id === recipe.category
    );

    return `

        <article class="recipe-card">

            <div class="recipe-image">

                <img
                    src="${recipe.image}"
                    alt="${recipe.name}"
                    loading="lazy"
                    onerror="this.src='https://placehold.co/600x400/251d2a/ff70ad?text=Recipe+Hub'"
                >

                <span class="recipe-category-badge">
                    ${category ? category.name : "Recipe"}
                </span>
                <button
    class="favorite-btn"
    data-id="${recipe.id}"
    type="button"
    aria-label="Add to favorites">
    ♡
</button>

            </div>

            <div class="recipe-info">

                <h3>${recipe.name}</h3>

                <p>${recipe.description}</p>

                <div class="recipe-meta">

                    <span>⏱ ${recipe.totalTime}</span>

                    <span>👨‍🍳 ${recipe.difficulty}</span>

                    <span>🍽 ${recipe.servings} servings</span>

                </div>

                <div class="recipe-rating" data-id="${recipe.id}">
    <span class="rating-stars">☆☆☆☆☆</span>
    <span class="rating-number">Not rated</span>
    <span class="rating-count">(0)</span>
</div>

                <button
                    class="view-recipe-btn"
                    data-id="${recipe.id}">
                    View Full Recipe →
                </button>

            </div>

        </article>

    `;

}


// ==========================================
// 9. RENDER RECIPES
// ==========================================

function renderRecipes() {

    const filteredRecipes = getFilteredRecipes();

    const displayedRecipes =
        filteredRecipes.slice(0, visibleRecipes);

    recipeGrid.innerHTML = displayedRecipes
        .map(createRecipeCard)
        .join("");

    recipeCount.textContent =
        `${filteredRecipes.length} Recipes`;

    emptyState.hidden = filteredRecipes.length !== 0;

    loadMoreBtn.style.display =
        filteredRecipes.length > visibleRecipes
            ? "block"
            : "none";

}


// ==========================================
// 10. CATEGORY SELECTION
// ==========================================

function selectCategory(categoryId) {

    activeCategory = categoryId;
    visibleRecipes = 12;

    document.querySelectorAll(".category-card")
        .forEach(card => {

            card.classList.toggle(
                "active",
                card.dataset.category === categoryId
            );

        });

    document.querySelectorAll(".filter-btn")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.category === categoryId
            );

        });

    renderRecipes();

}


// ==========================================
// 11. CATEGORY CLICK EVENTS
// ==========================================

categoryGrid.addEventListener("click", event => {

    const card = event.target.closest(".category-card");

    if (!card) return;

    selectCategory(card.dataset.category);

    document.getElementById("recipes")
        .scrollIntoView({ behavior: "smooth" });

});


categoryGrid.addEventListener("keydown", event => {

    if (event.key !== "Enter" && event.key !== " ") return;

    const card = event.target.closest(".category-card");

    if (!card) return;

    event.preventDefault();

    selectCategory(card.dataset.category);

    document.getElementById("recipes")
        .scrollIntoView({ behavior: "smooth" });

});


// ==========================================
// 12. FILTER BUTTON EVENTS
// ==========================================

recipeFilters.addEventListener("click", event => {

    const button = event.target.closest(".filter-btn");

    if (!button) return;

    selectCategory(button.dataset.category);

});


// ==========================================
// 13. LIVE SEARCH
// ==========================================

searchInput.addEventListener("input", () => {

    searchTerm = searchInput.value.trim().toLowerCase();

    visibleRecipes = 12;

    renderRecipes();

});


searchButton.addEventListener("click", () => {

    searchTerm = searchInput.value.trim().toLowerCase();

    visibleRecipes = 12;

    renderRecipes();

    document.getElementById("recipes")
        .scrollIntoView({ behavior: "smooth" });

});


searchInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        searchButton.click();
    }

});


// ==========================================
// 14. LOAD MORE RECIPES
// ==========================================

loadMoreBtn.addEventListener("click", () => {

    visibleRecipes += 12;

    renderRecipes();

});


// ==========================================
// END OF PART 1
// ==========================================

// ==========================================
// PART 2 - PROFESSIONAL PIZZA RECIPES
// RECIPE HUB BY PUNIKET
// ==========================================

const pizzaRecipes = [

{
id: 1,
name: "Classic Margherita Pizza",
category: "pizza",
description: "A traditional Italian pizza topped with rich tomato sauce, mozzarella cheese and fresh basil.",
image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900",
prepTime: "25 minutes",
cookTime: "15 minutes",
totalTime: "40 minutes",
difficulty: "Easy",
servings: 2,
calories: "280 kcal per serving",
ingredients: [
{name:"All-purpose flour",amount:"2 cups"},
{name:"Warm water",amount:"¾ cup"},
{name:"Active dry yeast",amount:"1 teaspoon"},
{name:"Sugar",amount:"1 teaspoon"},
{name:"Salt",amount:"½ teaspoon"},
{name:"Olive oil",amount:"2 tablespoons"},
{name:"Pizza sauce",amount:"½ cup"},
{name:"Mozzarella cheese",amount:"200 g"},
{name:"Fresh basil leaves",amount:"10 leaves"},
{name:"Oregano",amount:"½ teaspoon"}
],
instructions: [
"Combine warm water, yeast and sugar in a bowl. Leave for 5–10 minutes until foamy.",
"Add flour, salt and olive oil. Mix until a soft dough forms.",
"Knead the dough for 8–10 minutes until smooth and elastic.",
"Cover the dough and let it rise for 60–90 minutes until doubled in size.",
"Preheat the oven to 230°C.",
"Roll the dough into a round pizza base approximately 25 cm wide.",
"Spread pizza sauce evenly over the base, leaving a small border.",
"Add grated mozzarella cheese and sprinkle oregano.",
"Bake for 12–15 minutes until the crust is golden and the cheese melts.",
"Add fresh basil leaves, slice and serve hot."
],
tips: [
"Use fresh mozzarella for a softer cheese texture.",
"Do not overload the pizza with sauce.",
"Preheat your oven properly before baking."
],
storage: "Refrigerate leftover slices in an airtight container for up to 2 days."
},

{
id: 2,
name: "Farmhouse Vegetable Pizza",
category: "pizza",
description: "A colourful pizza loaded with crunchy vegetables, mozzarella and delicious Italian seasoning.",
image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900",
prepTime: "25 minutes",
cookTime: "15 minutes",
totalTime: "40 minutes",
difficulty: "Easy",
servings: 2,
calories: "320 kcal per serving",
ingredients: [
{name:"Prepared pizza dough",amount:"1 medium portion"},
{name:"Pizza sauce",amount:"½ cup"},
{name:"Mozzarella cheese",amount:"180 g"},
{name:"Onion",amount:"½ cup, sliced"},
{name:"Capsicum",amount:"½ cup, sliced"},
{name:"Tomato",amount:"½ cup, chopped"},
{name:"Sweet corn",amount:"¼ cup"},
{name:"Black olives",amount:"2 tablespoons"},
{name:"Oregano",amount:"1 teaspoon"},
{name:"Chilli flakes",amount:"½ teaspoon"}
],
instructions: [
"Prepare the pizza dough using the standard yeast dough method.",
"Wash and slice all vegetables into thin pieces.",
"Roll the dough into a 25 cm round pizza base.",
"Spread an even layer of pizza sauce over the base.",
"Add half of the mozzarella cheese.",
"Arrange onion, capsicum, tomato, sweet corn and olives.",
"Cover with the remaining mozzarella cheese.",
"Sprinkle oregano and chilli flakes.",
"Bake at 230°C for 12–15 minutes until the crust is golden.",
"Rest for 2 minutes, slice and serve."
],
tips: [
"Pat vegetables dry before adding them.",
"Use colourful capsicums for a beautiful appearance.",
"Do not add too many watery vegetables."
],
storage: "Refrigerate leftovers in an airtight container for up to 2 days."
},

{
id: 3,
name: "Four Cheese Pizza",
category: "pizza",
description: "A rich and creamy pizza featuring four different cheeses on a crisp golden crust.",
image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=900",
prepTime: "20 minutes",
cookTime: "15 minutes",
totalTime: "35 minutes",
difficulty: "Medium",
servings: 2,
calories: "390 kcal per serving",
ingredients: [
{name:"Pizza dough",amount:"1 medium portion"},
{name:"Mozzarella cheese",amount:"100 g"},
{name:"Cheddar cheese",amount:"50 g"},
{name:"Parmesan cheese",amount:"30 g"},
{name:"Cream cheese",amount:"40 g"},
{name:"Olive oil",amount:"1 tablespoon"},
{name:"Garlic",amount:"2 cloves, minced"},
{name:"Oregano",amount:"½ teaspoon"},
{name:"Black pepper",amount:"¼ teaspoon"}
],
instructions: [
"Prepare the pizza dough and allow it to rise until doubled.",
"Preheat the oven to 230°C.",
"Mix cream cheese with minced garlic and black pepper.",
"Roll the dough into a round pizza base.",
"Spread the cream cheese mixture over the base.",
"Add mozzarella, cheddar and parmesan evenly.",
"Sprinkle oregano and drizzle a little olive oil.",
"Bake for 12–15 minutes until the cheese is bubbling and crust is golden.",
"Allow the pizza to rest briefly before slicing.",
"Serve warm."
],
tips: [
"Use freshly grated cheese for better melting.",
"Balance the stronger parmesan with mozzarella.",
"Serve with a fresh salad."
],
storage: "Refrigerate for up to 2 days."
},

{
id: 4,
name: "Paneer Tikka Pizza",
category: "pizza",
description: "An Indian-inspired fusion pizza featuring spicy paneer tikka, peppers and creamy cheese.",
image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=900",
prepTime: "30 minutes",
cookTime: "18 minutes",
totalTime: "48 minutes",
difficulty: "Medium",
servings: 2,
calories: "350 kcal per serving",
ingredients: [
{name:"Pizza dough",amount:"1 medium portion"},
{name:"Paneer cubes",amount:"150 g"},
{name:"Thick yogurt",amount:"3 tablespoons"},
{name:"Tikka masala",amount:"1 teaspoon"},
{name:"Ginger garlic paste",amount:"1 teaspoon"},
{name:"Lemon juice",amount:"1 teaspoon"},
{name:"Pizza sauce",amount:"½ cup"},
{name:"Mozzarella cheese",amount:"150 g"},
{name:"Onion",amount:"½ cup"},
{name:"Capsicum",amount:"½ cup"},
{name:"Oil",amount:"1 tablespoon"}
],
instructions: [
"Mix yogurt, tikka masala, ginger garlic paste, lemon juice and oil.",
"Add paneer cubes and coat them with the marinade.",
"Rest the paneer for 15 minutes.",
"Lightly cook paneer in a pan for 3–4 minutes.",
"Roll prepared pizza dough into a round base.",
"Spread pizza sauce over the base.",
"Add mozzarella cheese, cooked paneer, onion and capsicum.",
"Sprinkle a little extra tikka seasoning.",
"Bake at 220–230°C for 12–18 minutes until the crust is golden.",
"Slice and serve hot."
],
tips: [
"Use firm paneer so the cubes retain their shape.",
"Do not overcook paneer before baking.",
"Mint chutney can be served on the side."
],
storage: "Refrigerate leftovers for up to 2 days."
},

{
id: 5,
name: "BBQ Chicken Pizza",
category: "pizza",
description: "A smoky barbecue pizza topped with seasoned chicken, onions and melted mozzarella.",
image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900",
prepTime: "25 minutes",
cookTime: "18 minutes",
totalTime: "43 minutes",
difficulty: "Medium",
servings: 2,
calories: "390 kcal per serving",
ingredients: [
{name:"Pizza dough",amount:"1 medium portion"},
{name:"Boneless chicken",amount:"150 g"},
{name:"BBQ sauce",amount:"⅓ cup"},
{name:"Mozzarella cheese",amount:"150 g"},
{name:"Red onion",amount:"½ cup"},
{name:"Garlic powder",amount:"½ teaspoon"},
{name:"Paprika",amount:"½ teaspoon"},
{name:"Olive oil",amount:"1 tablespoon"},
{name:"Black pepper",amount:"¼ teaspoon"},
{name:"Coriander leaves",amount:"2 tablespoons"}
],
instructions: [
"Cut chicken into small bite-sized pieces.",
"Season chicken with garlic powder, paprika, pepper and oil.",
"Cook chicken in a pan until fully cooked, reaching 74°C internally.",
"Mix a portion of BBQ sauce with the cooked chicken.",
"Roll pizza dough into a round base.",
"Spread the remaining BBQ sauce over the base.",
"Add mozzarella cheese and barbecue chicken.",
"Scatter sliced red onion over the pizza.",
"Bake at 220–230°C for 12–15 minutes.",
"Finish with coriander leaves and serve."
],
tips: [
"Always cook chicken thoroughly before serving.",
"Choose a balanced sweet and smoky BBQ sauce.",
"Use red onion for extra flavour."
],
storage: "Refrigerate promptly and consume within 2 days."
},

{
id: 6,
name: "Mushroom Truffle Pizza",
category: "pizza",
description: "An elegant mushroom pizza with garlic, mozzarella and aromatic truffle oil.",
image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900",
prepTime: "20 minutes",
cookTime: "15 minutes",
totalTime: "35 minutes",
difficulty: "Medium",
servings: 2,
calories: "330 kcal per serving",
ingredients: [
{name:"Pizza dough",amount:"1 medium portion"},
{name:"Button mushrooms",amount:"150 g"},
{name:"Mozzarella cheese",amount:"150 g"},
{name:"Garlic",amount:"3 cloves"},
{name:"Butter",amount:"1 tablespoon"},
{name:"Olive oil",amount:"1 tablespoon"},
{name:"Truffle oil",amount:"1 teaspoon"},
{name:"Thyme",amount:"½ teaspoon"},
{name:"Black pepper",amount:"¼ teaspoon"},
{name:"Parmesan cheese",amount:"20 g"}
],
instructions: [
"Clean mushrooms and slice them evenly.",
"Heat butter and olive oil in a pan.",
"Add garlic and mushrooms. Cook for 4–5 minutes.",
"Season with thyme and black pepper.",
"Roll pizza dough into a round base.",
"Spread mozzarella cheese over the base.",
"Arrange the cooked mushrooms evenly.",
"Sprinkle parmesan cheese.",
"Bake at 230°C for 12–15 minutes.",
"Finish with a small drizzle of truffle oil before serving."
],
tips: [
"Cook mushrooms first to remove excess moisture.",
"Use truffle oil sparingly because its aroma is strong.",
"Fresh thyme adds a lovely aroma."
],
storage: "Refrigerate for up to 2 days."
},

{
id: 7,
name: "Spicy Mexican Pizza",
category: "pizza",
description: "A flavour-packed pizza with spicy beans, corn, peppers, jalapeños and melted cheese.",
image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900",
prepTime: "20 minutes",
cookTime: "15 minutes",
totalTime: "35 minutes",
difficulty: "Easy",
servings: 2,
calories: "340 kcal per serving",
ingredients: [
{name:"Pizza dough",amount:"1 medium portion"},
{name:"Pizza sauce",amount:"½ cup"},
{name:"Mozzarella cheese",amount:"150 g"},
{name:"Cooked kidney beans",amount:"½ cup"},
{name:"Sweet corn",amount:"¼ cup"},
{name:"Jalapeños",amount:"2 tablespoons"},
{name:"Capsicum",amount:"½ cup"},
{name:"Red onion",amount:"¼ cup"},
{name:"Chilli powder",amount:"½ teaspoon"},
{name:"Cumin powder",amount:"½ teaspoon"}
],
instructions: [
"Drain cooked kidney beans and lightly mash half of them.",
"Mix beans with cumin and chilli powder.",
"Roll pizza dough into a round base.",
"Spread pizza sauce over the base.",
"Add a layer of mozzarella cheese.",
"Spread the seasoned beans over the cheese.",
"Add corn, jalapeños, capsicum and red onion.",
"Finish with the remaining mozzarella.",
"Bake at 230°C for 12–15 minutes.",
"Rest briefly, slice and serve warm."
],
tips: [
"Adjust jalapeños according to your spice preference.",
"Black beans are a good alternative to kidney beans.",
"Serve with fresh salsa."
],
storage: "Refrigerate leftovers for up to 2 days."
},

{
id: 8,
name: "White Sauce Spinach Pizza",
category: "pizza",
description: "A creamy white sauce pizza with fresh spinach, garlic and mozzarella cheese.",
image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=900",
prepTime: "25 minutes",
cookTime: "15 minutes",
totalTime: "40 minutes",
difficulty: "Medium",
servings: 2,
calories: "360 kcal per serving",
ingredients: [
{name:"Pizza dough",amount:"1 medium portion"},
{name:"Butter",amount:"1 tablespoon"},
{name:"All-purpose flour",amount:"1 tablespoon"},
{name:"Milk",amount:"¾ cup"},
{name:"Garlic",amount:"2 cloves"},
{name:"Spinach",amount:"1 cup"},
{name:"Mozzarella cheese",amount:"150 g"},
{name:"Parmesan cheese",amount:"20 g"},
{name:"Black pepper",amount:"¼ teaspoon"},
{name:"Salt",amount:"To taste"}
],
instructions: [
"Melt butter in a saucepan over low heat.",
"Add minced garlic and cook briefly.",
"Stir in flour and cook for approximately one minute.",
"Gradually add milk while whisking continuously.",
"Cook until the white sauce thickens.",
"Season with salt and black pepper.",
"Wash spinach and lightly sauté it.",
"Roll the pizza dough into a round base.",
"Spread white sauce and add spinach and mozzarella.",
"Sprinkle parmesan and bake at 230°C for 12–15 minutes."
],
tips: [
"Whisk continuously to avoid lumps in the sauce.",
"Keep the sauce thick enough to stay on the pizza.",
"Do not add wet spinach directly."
],
storage: "Refrigerate for up to 2 days."
},

{
id: 9,
name: "Garlic Cheese Burst Pizza",
category: "pizza",
description: "A rich cheese-filled pizza with a soft crust, garlic butter and stretchy mozzarella.",
image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=900",
prepTime: "30 minutes",
cookTime: "18 minutes",
totalTime: "48 minutes",
difficulty: "Medium",
servings: 2,
calories: "420 kcal per serving",
ingredients: [
{name:"Pizza dough",amount:"2 portions"},
{name:"Mozzarella cheese",amount:"200 g"},
{name:"Cream cheese",amount:"60 g"},
{name:"Pizza sauce",amount:"½ cup"},
{name:"Butter",amount:"2 tablespoons"},
{name:"Garlic",amount:"3 cloves"},
{name:"Oregano",amount:"1 teaspoon"},
{name:"Chilli flakes",amount:"½ teaspoon"},
{name:"Corn",amount:"¼ cup"}
],
instructions: [
"Prepare two pizza dough portions and allow them to rise.",
"Mix cream cheese with half the mozzarella.",
"Roll the first dough portion into a thin base.",
"Spread the cheese mixture over the base, leaving the edges clear.",
"Roll the second dough portion and place it over the cheese layer.",
"Seal the edges carefully to keep the filling inside.",
"Spread pizza sauce over the top.",
"Add remaining mozzarella and sweet corn.",
"Melt butter and mix with minced garlic.",
"Brush the crust with garlic butter and sprinkle oregano.",
"Bake at 220°C for 15–18 minutes until golden."
],
tips: [
"Seal the edges carefully to prevent cheese leakage.",
"Do not overfill the centre.",
"Allow the pizza to rest before cutting."
],
storage: "Refrigerate leftovers for up to 2 days."
},

{
id: 10,
name: "Classic Pepperoni Pizza",
category: "pizza",
description: "A classic American-style pizza with tomato sauce, mozzarella and seasoned pepperoni slices.",
image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900",
prepTime: "20 minutes",
cookTime: "15 minutes",
totalTime: "35 minutes",
difficulty: "Easy",
servings: 2,
calories: "390 kcal per serving",
ingredients: [
{name:"Pizza dough",amount:"1 medium portion"},
{name:"Pizza sauce",amount:"½ cup"},
{name:"Mozzarella cheese",amount:"180 g"},
{name:"Pepperoni slices",amount:"80 g"},
{name:"Oregano",amount:"½ teaspoon"},
{name:"Chilli flakes",amount:"¼ teaspoon"},
{name:"Olive oil",amount:"1 tablespoon"}
],
instructions: [
"Preheat the oven to 230°C.",
"Roll the prepared pizza dough into a round base.",
"Spread pizza sauce evenly over the base.",
"Add a generous layer of mozzarella cheese.",
"Arrange pepperoni slices evenly over the cheese.",
"Sprinkle oregano and chilli flakes.",
"Brush the crust lightly with olive oil.",
"Bake for 12–15 minutes until the cheese melts and crust turns golden.",
"Allow the pizza to rest for 2 minutes.",
"Slice and serve hot."
],
tips: [
"Use a hot oven for a crisp crust.",
"Do not overload the pizza with toppings.",
"Pepperoni is traditionally a cured meat topping; use a suitable alternative if preferred."
],
storage: "Refrigerate leftovers promptly for up to 2 days."
}

];

// ==========================================
// END OF PART 2 - PIZZA
// ==========================================
// ==========================================
// PART 3 - PROFESSIONAL BURGER RECIPES
// RECIPE HUB BY PUNIKET
// ==========================================

const burgerRecipes = [

{
id: 11,
name: "Classic American Cheeseburger",
category: "burgers",
description: "A classic cheeseburger featuring a juicy beef-style patty, cheddar cheese, fresh lettuce and signature burger sauce.",
image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900",
prepTime: "25 minutes",
cookTime: "15 minutes",
totalTime: "40 minutes",
difficulty: "Medium",
servings: 2,
ingredients: [
{name:"Burger buns",amount:"2"},
{name:"Vegetarian burger patties",amount:"2"},
{name:"Cheddar cheese",amount:"2 slices"},
{name:"Lettuce",amount:"2 leaves"},
{name:"Tomato",amount:"1 medium"},
{name:"Onion",amount:"½"},
{name:"Mayonnaise",amount:"2 tablespoons"},
{name:"Tomato ketchup",amount:"1 tablespoon"},
{name:"Mustard sauce",amount:"1 teaspoon"},
{name:"Butter",amount:"1 tablespoon"}
],
instructions: [
"Prepare or purchase two burger buns and slice them horizontally.",
"Mix mayonnaise, ketchup and mustard sauce in a small bowl to make burger sauce.",
"Wash lettuce and vegetables thoroughly.",
"Slice tomato and onion into even rounds.",
"Prepare vegetarian patties according to their package instructions, or cook homemade patties until thoroughly heated.",
"Place cheddar cheese on each hot patty and allow it to melt.",
"Spread butter on the cut sides of the burger buns.",
"Toast the buns in a pan until lightly golden.",
"Spread burger sauce on the bottom bun.",
"Add lettuce, patty with melted cheese, tomato and onion.",
"Cover with the top bun and serve immediately."
],
tips: [
"Toasting buns helps prevent them from becoming soggy.",
"Use fresh lettuce for a crisp texture.",
"Keep the sauce refrigerated until serving."
],
storage: "Assemble immediately before serving. Store leftover components separately in the refrigerator."
},

{
id: 12,
name: "Crispy Veggie Burger",
category: "burgers",
description: "A crunchy vegetable patty burger with creamy mayonnaise, fresh lettuce and a golden toasted bun.",
image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=900",
prepTime: "30 minutes",
cookTime: "20 minutes",
totalTime: "50 minutes",
difficulty: "Medium",
servings: 2,
ingredients: [
{name:"Burger buns",amount:"2"},
{name:"Boiled potatoes",amount:"2 medium"},
{name:"Boiled peas",amount:"¼ cup"},
{name:"Grated carrot",amount:"¼ cup"},
{name:"Breadcrumbs",amount:"½ cup"},
{name:"Cornflour",amount:"2 tablespoons"},
{name:"Ginger paste",amount:"1 teaspoon"},
{name:"Garam masala",amount:"½ teaspoon"},
{name:"Chilli powder",amount:"½ teaspoon"},
{name:"Mayonnaise",amount:"2 tablespoons"},
{name:"Lettuce",amount:"2 leaves"},
{name:"Cheese slices",amount:"2"}
],
instructions: [
"Mash boiled potatoes in a large mixing bowl.",
"Add peas, grated carrot, ginger paste, garam masala and chilli powder.",
"Mix thoroughly and divide into two equal portions.",
"Shape each portion into a thick round patty.",
"Prepare a slurry using cornflour and water.",
"Dip each patty in the slurry and coat with breadcrumbs.",
"Cook in a pan with a little oil until golden and crisp on both sides, ensuring the centre is hot.",
"Toast the burger buns with a little butter.",
"Spread mayonnaise over the bottom buns.",
"Add lettuce, crispy vegetable patties and cheese slices.",
"Finish with the top buns and serve hot."
],
tips: [
"Chill shaped patties for 15 minutes before coating.",
"Use fine breadcrumbs for an even coating.",
"Do not make the patties too thick."
],
storage: "Refrigerate uncooked patties separately for up to 24 hours."
},

{
id: 13,
name: "Spicy Paneer Burger",
category: "burgers",
description: "An Indian fusion burger with a spicy paneer filling, mint mayonnaise and crunchy vegetables.",
image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=900",
prepTime: "25 minutes",
cookTime: "15 minutes",
totalTime: "40 minutes",
difficulty: "Easy",
servings: 2,
ingredients: [
{name:"Burger buns",amount:"2"},
{name:"Paneer slices",amount:"200 g"},
{name:"Thick yogurt",amount:"2 tablespoons"},
{name:"Red chilli powder",amount:"½ teaspoon"},
{name:"Garam masala",amount:"½ teaspoon"},
{name:"Ginger garlic paste",amount:"1 teaspoon"},
{name:"Lemon juice",amount:"1 teaspoon"},
{name:"Mint mayonnaise",amount:"3 tablespoons"},
{name:"Onion",amount:"½"},
{name:"Tomato",amount:"1"},
{name:"Lettuce",amount:"2 leaves"}
],
instructions: [
"Mix yogurt, chilli powder, garam masala, ginger garlic paste and lemon juice.",
"Coat paneer slices with the marinade.",
"Rest for 15 minutes.",
"Heat a pan with a little oil.",
"Cook paneer slices on both sides until golden and thoroughly heated.",
"Slice the burger buns and toast them lightly.",
"Spread mint mayonnaise over the bottom buns.",
"Add lettuce, cooked paneer, onion and tomato.",
"Spread a little extra mint mayonnaise on the top bun.",
"Close the burgers and serve immediately."
],
tips: [
"Use thick yogurt for a better marinade.",
"Do not break the paneer while turning.",
"Add cucumber for extra crunch."
],
storage: "Refrigerate leftover paneer separately for up to 2 days."
},

{
id: 14,
name: "Crispy Chicken Burger",
category: "burgers",
description: "A crispy chicken-style burger with crunchy coating, creamy sauce and fresh lettuce.",
image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=900",
prepTime: "30 minutes",
cookTime: "20 minutes",
totalTime: "50 minutes",
difficulty: "Medium",
servings: 2,
ingredients: [
{name:"Burger buns",amount:"2"},
{name:"Chicken breast portions",amount:"2"},
{name:"Buttermilk",amount:"½ cup"},
{name:"All-purpose flour",amount:"½ cup"},
{name:"Breadcrumbs",amount:"½ cup"},
{name:"Paprika",amount:"½ teaspoon"},
{name:"Garlic powder",amount:"½ teaspoon"},
{name:"Black pepper",amount:"¼ teaspoon"},
{name:"Lettuce",amount:"2 leaves"},
{name:"Mayonnaise",amount:"3 tablespoons"},
{name:"Cheese slices",amount:"2"}
],
instructions: [
"Place chicken portions in buttermilk with garlic powder and pepper. Refrigerate while preparing the coating.",
"Combine flour, paprika and breadcrumbs in a separate bowl.",
"Remove chicken from the marinade and coat evenly in the flour mixture.",
"Cook using a suitable oven, air fryer or pan method until the chicken reaches an internal temperature of 74°C.",
"Allow excess oil to drain if pan-fried.",
"Toast the burger buns lightly.",
"Spread mayonnaise over the bottom buns.",
"Add fresh lettuce and fully cooked chicken.",
"Place cheese on top while the chicken is hot.",
"Close the burgers and serve immediately."
],
tips: [
"Use a food thermometer to check chicken doneness.",
"Do not reuse raw chicken marinade.",
"Keep raw chicken preparation separate from fresh vegetables."
],
storage: "Refrigerate cooked chicken separately and consume within 2 days."
},

{
id: 15,
name: "Double Cheese Burger",
category: "burgers",
description: "A satisfying double-layer burger with two patties, melted cheese and a creamy signature sauce.",
image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=900",
prepTime: "20 minutes",
cookTime: "20 minutes",
totalTime: "40 minutes",
difficulty: "Medium",
servings: 2,
ingredients: [
{name:"Large burger buns",amount:"2"},
{name:"Vegetarian burger patties",amount:"4"},
{name:"Cheddar cheese",amount:"4 slices"},
{name:"Lettuce",amount:"4 leaves"},
{name:"Onion",amount:"1"},
{name:"Tomato",amount:"1"},
{name:"Mayonnaise",amount:"3 tablespoons"},
{name:"Ketchup",amount:"2 tablespoons"},
{name:"Mustard",amount:"1 teaspoon"},
{name:"Butter",amount:"1 tablespoon"}
],
instructions: [
"Mix mayonnaise, ketchup and mustard to create the signature sauce.",
"Prepare the four vegetarian patties according to their cooking instructions.",
"Ensure each patty is thoroughly heated.",
"Place cheese slices over the hot patties.",
"Toast the burger buns with butter.",
"Spread signature sauce on the bottom buns.",
"Add lettuce and the first cheesy patty.",
"Place another patty on top.",
"Add onion and tomato slices.",
"Close the burgers and serve while warm."
],
tips: [
"Use sturdy buns to support the double layers.",
"Allow cheese to melt over hot patties.",
"Serve with fresh potato wedges."
],
storage: "Assemble just before serving for the best texture."
},

{
id: 16,
name: "BBQ Paneer Burger",
category: "burgers",
description: "A smoky paneer burger with barbecue sauce, caramelized onions and creamy mayonnaise.",
image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=900",
prepTime: "20 minutes",
cookTime: "15 minutes",
totalTime: "35 minutes",
difficulty: "Easy",
servings: 2,
ingredients: [
{name:"Burger buns",amount:"2"},
{name:"Paneer",amount:"180 g"},
{name:"BBQ sauce",amount:"3 tablespoons"},
{name:"Onion",amount:"1 medium"},
{name:"Butter",amount:"1 tablespoon"},
{name:"Mayonnaise",amount:"2 tablespoons"},
{name:"Lettuce",amount:"2 leaves"},
{name:"Black pepper",amount:"¼ teaspoon"},
{name:"Cheese slices",amount:"2"}
],
instructions: [
"Slice paneer into two thick burger-sized pieces.",
"Heat butter in a pan.",
"Cook paneer on both sides until lightly golden and heated through.",
"Brush barbecue sauce over the paneer.",
"Slice onions and cook in a pan until soft and lightly caramelized.",
"Toast the burger buns.",
"Spread mayonnaise over the bottom buns.",
"Add lettuce and barbecue paneer.",
"Top with caramelized onions and cheese.",
"Close the burger and serve warm."
],
tips: [
"Use smoky barbecue sauce for a deeper flavour.",
"Cook onions slowly for a sweeter taste.",
"Add sliced pickles if desired."
],
storage: "Refrigerate leftover paneer separately for up to 2 days."
},

{
id: 17,
name: "Mushroom Swiss Burger",
category: "burgers",
description: "A gourmet mushroom burger with sautéed mushrooms, Swiss-style cheese and creamy garlic sauce.",
image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900",
prepTime: "20 minutes",
cookTime: "15 minutes",
totalTime: "35 minutes",
difficulty: "Medium",
servings: 2,
ingredients: [
{name:"Burger buns",amount:"2"},
{name:"Vegetarian burger patties",amount:"2"},
{name:"Button mushrooms",amount:"150 g"},
{name:"Swiss-style cheese",amount:"2 slices"},
{name:"Butter",amount:"1 tablespoon"},
{name:"Garlic",amount:"2 cloves"},
{name:"Mayonnaise",amount:"2 tablespoons"},
{name:"Black pepper",amount:"¼ teaspoon"},
{name:"Lettuce",amount:"2 leaves"}
],
instructions: [
"Clean and slice the mushrooms.",
"Heat butter in a pan.",
"Add garlic and mushrooms.",
"Cook until the mushrooms soften and release excess moisture.",
"Season with black pepper.",
"Prepare vegetarian patties according to their package instructions.",
"Place cheese over the hot patties.",
"Toast the burger buns.",
"Spread mayonnaise over the buns.",
"Add lettuce, cheesy patties and cooked mushrooms.",
"Close the burger and serve warm."
],
tips: [
"Cook mushrooms until most excess moisture evaporates.",
"Fresh garlic improves the aroma.",
"Use a soft brioche-style bun for a gourmet finish."
],
storage: "Refrigerate the mushroom filling separately for up to 2 days."
},

{
id: 18,
name: "Mexican Bean Burger",
category: "burgers",
description: "A hearty vegetarian burger featuring seasoned kidney beans, corn, fresh salsa and creamy dressing.",
image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=900",
prepTime: "30 minutes",
cookTime: "20 minutes",
totalTime: "50 minutes",
difficulty: "Medium",
servings: 2,
ingredients: [
{name:"Burger buns",amount:"2"},
{name:"Cooked kidney beans",amount:"1 cup"},
{name:"Sweet corn",amount:"¼ cup"},
{name:"Breadcrumbs",amount:"½ cup"},
{name:"Chilli powder",amount:"½ teaspoon"},
{name:"Cumin powder",amount:"½ teaspoon"},
{name:"Onion",amount:"½"},
{name:"Tomato",amount:"1"},
{name:"Lime juice",amount:"1 teaspoon"},
{name:"Mayonnaise",amount:"2 tablespoons"}
],
instructions: [
"Drain the kidney beans and mash them in a bowl.",
"Add sweet corn, breadcrumbs, chilli powder and cumin.",
"Mix until the mixture holds its shape.",
"Form two burger patties.",
"Cook patties in a lightly oiled pan until golden and hot throughout.",
"Prepare salsa using chopped tomato, onion and lime juice.",
"Toast the burger buns.",
"Spread mayonnaise over the bottom buns.",
"Add the bean patties and fresh salsa.",
"Close the burgers and serve immediately."
],
tips: [
"Drain beans thoroughly before mashing.",
"Add extra breadcrumbs if the mixture feels too wet.",
"Serve with avocado if available."
],
storage: "Refrigerate uncooked patties separately for up to 24 hours."
},

{
id: 19,
name: "Aloo Tikki Burger",
category: "burgers",
description: "An Indian street-food favourite with a spiced potato patty, tangy chutneys and crunchy vegetables.",
image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=900",
prepTime: "25 minutes",
cookTime: "20 minutes",
totalTime: "45 minutes",
difficulty: "Easy",
servings: 2,
ingredients: [
{name:"Burger buns",amount:"2"},
{name:"Boiled potatoes",amount:"2 medium"},
{name:"Green peas",amount:"¼ cup"},
{name:"Breadcrumbs",amount:"½ cup"},
{name:"Garam masala",amount:"½ teaspoon"},
{name:"Chaat masala",amount:"½ teaspoon"},
{name:"Cornflour",amount:"2 tablespoons"},
{name:"Green chutney",amount:"2 tablespoons"},
{name:"Tamarind chutney",amount:"2 tablespoons"},
{name:"Onion",amount:"½"},
{name:"Tomato",amount:"1"}
],
instructions: [
"Mash boiled potatoes and cooked peas together.",
"Add garam masala and chaat masala.",
"Shape the mixture into two round patties.",
"Prepare cornflour slurry with water.",
"Coat patties in slurry and breadcrumbs.",
"Cook in a lightly oiled pan until golden and heated through.",
"Toast burger buns.",
"Spread green chutney on the bottom buns.",
"Add the potato patties, onion and tomato.",
"Drizzle tamarind chutney over the filling.",
"Close the burgers and serve hot."
],
tips: [
"Use cooled mashed potatoes for easier shaping.",
"Adjust chutneys to your preferred taste.",
"Add lettuce for a fresh crunch."
],
storage: "Refrigerate uncooked patties separately for up to 24 hours."
},

{
id: 20,
name: "Classic Grilled Chicken Burger",
category: "burgers",
description: "A lighter grilled chicken burger with seasoned chicken, fresh vegetables and creamy herb dressing.",
image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=900",
prepTime: "25 minutes",
cookTime: "20 minutes",
totalTime: "45 minutes",
difficulty: "Medium",
servings: 2,
ingredients: [
{name:"Burger buns",amount:"2"},
{name:"Chicken breast",amount:"2 portions"},
{name:"Yogurt",amount:"2 tablespoons"},
{name:"Lemon juice",amount:"1 tablespoon"},
{name:"Garlic",amount:"2 cloves"},
{name:"Black pepper",amount:"½ teaspoon"},
{name:"Paprika",amount:"½ teaspoon"},
{name:"Lettuce",amount:"2 leaves"},
{name:"Tomato",amount:"1"},
{name:"Mayonnaise",amount:"2 tablespoons"},
{name:"Olive oil",amount:"1 tablespoon"}
],
instructions: [
"Mix yogurt, lemon juice, minced garlic, paprika and black pepper.",
"Coat chicken portions in the marinade and refrigerate.",
"Heat a grill pan with olive oil.",
"Cook chicken thoroughly, turning as needed, until the internal temperature reaches 74°C.",
"Allow chicken to rest briefly on a clean plate.",
"Toast burger buns lightly.",
"Spread mayonnaise over the bottom buns.",
"Add lettuce and tomato slices.",
"Place the fully cooked grilled chicken on top.",
"Cover with the top bun and serve warm."
],
tips: [
"Use evenly sized chicken portions for consistent cooking.",
"Check chicken temperature with a food thermometer.",
"Fresh herbs can be added to the mayonnaise."
],
storage: "Refrigerate cooked chicken promptly and consume within 2 days."
}

];

// ==========================================
// END OF PART 3 - BURGERS
// ==========================================.
const pastaRecipes = [
  {
    id: 21,
    name: "Classic Creamy Alfredo Pasta",
    category: "pasta",
    description: "A rich Italian-style pasta coated in a smooth garlic parmesan cream sauce.",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=900",
    prepTime: "10 min",
    cookTime: "20 min",
    totalTime: "30 min",
    difficulty: "Easy",
    servings: 2,
    calories: 520,
    ingredients: [
      { name: "Fettuccine pasta", amount: "200 g" },
      { name: "Butter", amount: "2 tbsp" },
      { name: "Garlic, minced", amount: "4 cloves" },
      { name: "Fresh cream", amount: "1 cup" },
      { name: "Milk", amount: "1/4 cup" },
      { name: "Parmesan cheese", amount: "1/2 cup" },
      { name: "Black pepper", amount: "1/2 tsp" },
      { name: "Salt", amount: "To taste" },
      { name: "Fresh parsley", amount: "1 tbsp" }
    ],
    instructions: [
      "Bring a large pot of salted water to a boil.",
      "Add the fettuccine and cook according to the package instructions until al dente.",
      "Reserve half a cup of pasta water, then drain the pasta.",
      "Melt butter in a large pan over medium-low heat.",
      "Add minced garlic and sauté for 30 seconds until fragrant.",
      "Pour in fresh cream and milk. Stir gently.",
      "Add parmesan cheese, black pepper and salt.",
      "Cook on low heat until the sauce becomes smooth and creamy.",
      "Add the cooked pasta and toss until every strand is coated.",
      "Add a little reserved pasta water if the sauce is too thick.",
      "Garnish with parsley and extra parmesan before serving."
    ],
    tips: [
      "Keep the heat low after adding cheese to prevent the sauce from separating.",
      "Freshly grated parmesan gives the best texture.",
      "Serve immediately while the sauce is creamy."
    ],
    storage: "Refrigerate in an airtight container for up to 2 days. Reheat gently with a splash of milk."
  },
  {
    id: 22,
    name: "Spicy Arrabbiata Pasta",
    category: "pasta",
    description: "A bold Italian tomato pasta with garlic, chilli flakes and fresh herbs.",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900",
    prepTime: "10 min",
    cookTime: "20 min",
    totalTime: "30 min",
    difficulty: "Easy",
    servings: 2,
    calories: 410,
    ingredients: [
      { name: "Penne pasta", amount: "200 g" },
      { name: "Olive oil", amount: "2 tbsp" },
      { name: "Garlic, sliced", amount: "5 cloves" },
      { name: "Tomato puree", amount: "1 1/2 cups" },
      { name: "Red chilli flakes", amount: "1 tsp" },
      { name: "Chopped onion", amount: "1 small" },
      { name: "Dried oregano", amount: "1 tsp" },
      { name: "Fresh basil", amount: "8 leaves" },
      { name: "Salt", amount: "To taste" },
      { name: "Black pepper", amount: "1/4 tsp" }
    ],
    instructions: [
      "Boil salted water in a large pot.",
      "Cook penne pasta until al dente and reserve some pasta water.",
      "Heat olive oil in a pan over medium heat.",
      "Add chopped onion and cook until soft.",
      "Add sliced garlic and chilli flakes. Sauté briefly.",
      "Pour in tomato puree and stir well.",
      "Add oregano, salt and black pepper.",
      "Simmer the sauce for 10 minutes until slightly thickened.",
      "Add cooked penne and a splash of pasta water.",
      "Toss until the sauce coats the pasta evenly.",
      "Finish with fresh basil leaves and serve hot."
    ],
    tips: [
      "Adjust chilli flakes according to your spice preference.",
      "Simmering the tomato sauce improves its flavour.",
      "Add a little pasta water to help the sauce cling to the penne."
    ],
    storage: "Store refrigerated for up to 3 days in an airtight container."
  },
  {
    id: 23,
    name: "Creamy Mushroom Pasta",
    category: "pasta",
    description: "A comforting pasta with golden sautéed mushrooms and a silky garlic cream sauce.",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900",
    prepTime: "10 min",
    cookTime: "20 min",
    totalTime: "30 min",
    difficulty: "Easy",
    servings: 2,
    calories: 480,
    ingredients: [
      { name: "Penne pasta", amount: "200 g" },
      { name: "Button mushrooms, sliced", amount: "200 g" },
      { name: "Butter", amount: "2 tbsp" },
      { name: "Garlic, minced", amount: "4 cloves" },
      { name: "Fresh cream", amount: "3/4 cup" },
      { name: "Milk", amount: "1/4 cup" },
      { name: "Parmesan cheese", amount: "1/3 cup" },
      { name: "Dried thyme", amount: "1/2 tsp" },
      { name: "Black pepper", amount: "1/2 tsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Cook penne pasta in salted boiling water until al dente.",
      "Reserve some pasta water and drain the pasta.",
      "Clean and slice the mushrooms.",
      "Heat butter in a wide pan.",
      "Add mushrooms in a single layer and cook until golden.",
      "Add minced garlic and thyme. Cook for 30 seconds.",
      "Pour in cream and milk.",
      "Add parmesan, salt and black pepper.",
      "Stir over low heat until the sauce becomes creamy.",
      "Add cooked pasta and toss gently.",
      "Adjust the consistency with reserved pasta water.",
      "Serve warm with extra parmesan."
    ],
    tips: [
      "Avoid overcrowding the mushrooms so they brown properly.",
      "Do not wash mushrooms for too long; wipe them clean.",
      "A little pasta water helps create a smooth sauce."
    ],
    storage: "Refrigerate for up to 2 days. Reheat gently with a little milk."
  },
  {
    id: 24,
    name: "Baked Cheese Macaroni",
    category: "pasta",
    description: "Tender macaroni baked under a golden layer of melted cheese and crunchy breadcrumbs.",
    image: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=900",
    prepTime: "15 min",
    cookTime: "25 min",
    totalTime: "40 min",
    difficulty: "Medium",
    servings: 3,
    calories: 560,
    ingredients: [
      { name: "Macaroni", amount: "250 g" },
      { name: "Butter", amount: "2 tbsp" },
      { name: "All-purpose flour", amount: "2 tbsp" },
      { name: "Milk", amount: "2 cups" },
      { name: "Cheddar cheese, grated", amount: "1 cup" },
      { name: "Mozzarella cheese", amount: "1/2 cup" },
      { name: "Mustard powder", amount: "1/4 tsp" },
      { name: "Breadcrumbs", amount: "1/3 cup" },
      { name: "Black pepper", amount: "1/2 tsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Preheat the oven to 180°C.",
      "Boil macaroni in salted water until just tender.",
      "Drain the macaroni and keep it aside.",
      "Melt butter in a saucepan over medium-low heat.",
      "Add flour and whisk continuously for one minute.",
      "Gradually pour in milk while whisking to prevent lumps.",
      "Cook until the sauce thickens slightly.",
      "Add cheddar, mustard powder, pepper and salt.",
      "Stir until the cheese melts into a smooth sauce.",
      "Add macaroni and mix until evenly coated.",
      "Transfer the mixture into a greased baking dish.",
      "Sprinkle mozzarella and breadcrumbs on top.",
      "Bake for 15–20 minutes until golden and bubbling.",
      "Allow it to rest briefly before serving."
    ],
    tips: [
      "Cook macaroni slightly less than fully tender before baking.",
      "Use a mixture of cheddar and mozzarella for flavour and stretch.",
      "Check that the centre is piping hot before serving."
    ],
    storage: "Refrigerate leftovers for up to 3 days. Reheat until piping hot."
  },
  {
    id: 25,
    name: "Pesto Basil Pasta",
    category: "pasta",
    description: "Fresh basil pesto tossed with pasta, parmesan and crunchy toasted nuts.",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900",
    prepTime: "10 min",
    cookTime: "15 min",
    totalTime: "25 min",
    difficulty: "Easy",
    servings: 2,
    calories: 450,
    ingredients: [
      { name: "Fusilli pasta", amount: "200 g" },
      { name: "Fresh basil leaves", amount: "2 cups" },
      { name: "Olive oil", amount: "1/3 cup" },
      { name: "Garlic", amount: "2 cloves" },
      { name: "Pine nuts or walnuts", amount: "3 tbsp" },
      { name: "Parmesan cheese", amount: "1/3 cup" },
      { name: "Lemon juice", amount: "1 tsp" },
      { name: "Salt", amount: "To taste" },
      { name: "Black pepper", amount: "1/4 tsp" }
    ],
    instructions: [
      "Boil fusilli in salted water until al dente.",
      "Reserve half a cup of pasta water and drain.",
      "Place basil leaves, garlic and nuts in a food processor.",
      "Add parmesan and lemon juice.",
      "Pulse until the mixture is finely chopped.",
      "Gradually add olive oil while blending to form a thick pesto.",
      "Season with salt and black pepper.",
      "Transfer the pesto into a large bowl.",
      "Add the warm pasta and toss thoroughly.",
      "Add a splash of pasta water to loosen the sauce.",
      "Finish with parmesan and fresh basil."
    ],
    tips: [
      "Toast the nuts lightly for a deeper flavour.",
      "Do not heat pesto for too long; it tastes best when freshly mixed.",
      "Add olive oil gradually to control the consistency."
    ],
    storage: "Refrigerate pesto separately for up to 3 days. Store pasta in an airtight container."
  },
  {
    id: 26,
    name: "Indian Masala Pasta",
    category: "pasta",
    description: "A delicious fusion pasta cooked with Indian spices, vegetables and tangy tomato masala.",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=900",
    prepTime: "15 min",
    cookTime: "20 min",
    totalTime: "35 min",
    difficulty: "Easy",
    servings: 3,
    calories: 430,
    ingredients: [
      { name: "Penne pasta", amount: "250 g" },
      { name: "Oil", amount: "2 tbsp" },
      { name: "Chopped onion", amount: "1 medium" },
      { name: "Chopped tomato", amount: "2 medium" },
      { name: "Capsicum, diced", amount: "1/2 cup" },
      { name: "Carrot, diced", amount: "1/4 cup" },
      { name: "Ginger-garlic paste", amount: "1 tsp" },
      { name: "Red chilli powder", amount: "1/2 tsp" },
      { name: "Turmeric powder", amount: "1/4 tsp" },
      { name: "Garam masala", amount: "1/2 tsp" },
      { name: "Tomato ketchup", amount: "2 tbsp" },
      { name: "Salt", amount: "To taste" },
      { name: "Fresh coriander", amount: "2 tbsp" }
    ],
    instructions: [
      "Boil penne pasta in salted water until al dente.",
      "Drain the pasta and reserve a little cooking water.",
      "Heat oil in a large pan.",
      "Add chopped onion and sauté until translucent.",
      "Add ginger-garlic paste and cook until fragrant.",
      "Add tomatoes and cook until soft.",
      "Mix in turmeric, chilli powder, garam masala and salt.",
      "Add carrot and capsicum. Cook until slightly tender.",
      "Stir in tomato ketchup and cook for one minute.",
      "Add cooked pasta and mix well.",
      "Add a splash of pasta water if the masala is too thick.",
      "Garnish with fresh coriander and serve hot."
    ],
    tips: [
      "Add sweet corn or peas for extra texture.",
      "Adjust the chilli powder to your taste.",
      "Avoid overcooking the vegetables so they remain slightly crunchy."
    ],
    storage: "Refrigerate for up to 2 days in an airtight container."
  },
  {
    id: 27,
    name: "Garlic Butter Spaghetti",
    category: "pasta",
    description: "Simple spaghetti tossed in aromatic garlic butter, herbs and parmesan.",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=900",
    prepTime: "5 min",
    cookTime: "15 min",
    totalTime: "20 min",
    difficulty: "Easy",
    servings: 2,
    calories: 390,
    ingredients: [
      { name: "Spaghetti", amount: "200 g" },
      { name: "Butter", amount: "3 tbsp" },
      { name: "Olive oil", amount: "1 tbsp" },
      { name: "Garlic, thinly sliced", amount: "6 cloves" },
      { name: "Red chilli flakes", amount: "1/2 tsp" },
      { name: "Dried parsley", amount: "1 tsp" },
      { name: "Parmesan cheese", amount: "1/4 cup" },
      { name: "Salt", amount: "To taste" },
      { name: "Black pepper", amount: "1/4 tsp" }
    ],
    instructions: [
      "Bring salted water to a boil in a large pot.",
      "Add spaghetti and cook until al dente.",
      "Reserve half a cup of pasta water before draining.",
      "Heat olive oil and butter in a pan over low heat.",
      "Add sliced garlic and cook gently until fragrant.",
      "Do not allow the garlic to burn.",
      "Add chilli flakes and dried parsley.",
      "Add cooked spaghetti and toss thoroughly.",
      "Pour in a little pasta water to create a light coating.",
      "Season with black pepper and adjust salt.",
      "Finish with grated parmesan and serve immediately."
    ],
    tips: [
      "Keep the garlic on low heat to avoid bitterness.",
      "Use pasta water to help the butter coat the spaghetti.",
      "Fresh parsley can replace dried parsley."
    ],
    storage: "Best eaten fresh. Refrigerate leftovers for up to 2 days."
  },
  {
    id: 28,
    name: "Spinach and Corn Pasta",
    category: "pasta",
    description: "A creamy vegetarian pasta combining sweet corn, fresh spinach and mild spices.",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=900",
    prepTime: "10 min",
    cookTime: "20 min",
    totalTime: "30 min",
    difficulty: "Easy",
    servings: 2,
    calories: 440,
    ingredients: [
      { name: "Penne pasta", amount: "200 g" },
      { name: "Sweet corn kernels", amount: "1/2 cup" },
      { name: "Fresh spinach", amount: "2 cups" },
      { name: "Butter", amount: "2 tbsp" },
      { name: "Garlic, minced", amount: "3 cloves" },
      { name: "All-purpose flour", amount: "1 tbsp" },
      { name: "Milk", amount: "1 1/2 cups" },
      { name: "Mozzarella cheese", amount: "1/3 cup" },
      { name: "Black pepper", amount: "1/2 tsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Cook penne pasta in salted boiling water until al dente.",
      "Reserve some pasta water and drain.",
      "Blanch spinach briefly, drain and chop.",
      "Melt butter in a saucepan.",
      "Add garlic and sauté until fragrant.",
      "Add flour and stir for one minute.",
      "Gradually add milk while stirring continuously.",
      "Cook until the sauce thickens.",
      "Add spinach, sweet corn, cheese, salt and pepper.",
      "Stir until the cheese melts.",
      "Add cooked pasta and mix gently.",
      "Adjust the sauce with reserved pasta water.",
      "Serve warm with a little extra cheese."
    ],
    tips: [
      "Fresh or frozen sweet corn both work well.",
      "Do not overcook spinach; it should retain its colour.",
      "Add a pinch of chilli flakes for extra flavour."
    ],
    storage: "Refrigerate for up to 2 days. Reheat gently with a little milk."
  },
  {
    id: 29,
    name: "Lemon Herb Pasta",
    category: "pasta",
    description: "A refreshing light pasta with lemon, olive oil, garlic and aromatic herbs.",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900",
    prepTime: "10 min",
    cookTime: "15 min",
    totalTime: "25 min",
    difficulty: "Easy",
    servings: 2,
    calories: 370,
    ingredients: [
      { name: "Spaghetti", amount: "200 g" },
      { name: "Olive oil", amount: "3 tbsp" },
      { name: "Garlic, minced", amount: "3 cloves" },
      { name: "Lemon zest", amount: "1 tsp" },
      { name: "Fresh lemon juice", amount: "2 tbsp" },
      { name: "Dried oregano", amount: "1/2 tsp" },
      { name: "Fresh parsley", amount: "2 tbsp" },
      { name: "Parmesan cheese", amount: "1/4 cup" },
      { name: "Black pepper", amount: "1/4 tsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Cook spaghetti in salted boiling water until al dente.",
      "Reserve half a cup of pasta water and drain.",
      "Heat olive oil in a large pan over low heat.",
      "Add garlic and cook until fragrant.",
      "Add lemon zest and oregano.",
      "Turn the heat low and add lemon juice.",
      "Add cooked spaghetti and toss.",
      "Pour in a little pasta water to create a light sauce.",
      "Season with salt and black pepper.",
      "Add chopped parsley and parmesan.",
      "Toss again and serve immediately."
    ],
    tips: [
      "Add lemon juice gradually and taste as you go.",
      "Use fresh lemon zest for a stronger citrus aroma.",
      "Keep the sauce light instead of making it too oily."
    ],
    storage: "Refrigerate for up to 2 days. Add a little olive oil when reheating."
  },
  {
    id: 30,
    name: "Creamy Tomato Vodka-Style Pasta",
    category: "pasta",
    description: "A rich tomato and cream pasta with garlic, parmesan and a smooth restaurant-style sauce.",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=900",
    prepTime: "10 min",
    cookTime: "20 min",
    totalTime: "30 min",
    difficulty: "Easy",
    servings: 2,
    calories: 490,
    ingredients: [
      { name: "Rigatoni pasta", amount: "200 g" },
      { name: "Olive oil", amount: "1 tbsp" },
      { name: "Butter", amount: "1 tbsp" },
      { name: "Chopped onion", amount: "1 small" },
      { name: "Garlic, minced", amount: "3 cloves" },
      { name: "Tomato puree", amount: "1 cup" },
      { name: "Tomato paste", amount: "1 tbsp" },
      { name: "Fresh cream", amount: "1/2 cup" },
      { name: "Parmesan cheese", amount: "1/3 cup" },
      { name: "Chilli flakes", amount: "1/2 tsp" },
      { name: "Salt", amount: "To taste" },
      { name: "Black pepper", amount: "1/4 tsp" }
    ],
    instructions: [
      "Cook rigatoni in salted boiling water until al dente.",
      "Reserve half a cup of pasta water and drain.",
      "Heat olive oil and butter in a pan.",
      "Add chopped onion and cook until soft.",
      "Add garlic and chilli flakes.",
      "Stir in tomato paste and cook for one minute.",
      "Add tomato puree and simmer for 8 minutes.",
      "Reduce the heat and stir in fresh cream.",
      "Add parmesan, salt and black pepper.",
      "Mix until the sauce becomes smooth and creamy.",
      "Add cooked rigatoni and toss until coated.",
      "Adjust consistency with reserved pasta water.",
      "Serve with extra parmesan."
    ],
    tips: [
      "This version uses no alcohol and keeps the creamy tomato flavour.",
      "Add cream over low heat to keep the sauce smooth.",
      "Rigatoni holds the sauce beautifully inside its tubes."
    ],
    storage: "Refrigerate for up to 2 days in an airtight container."
  }
];

// END OF PART 4 - PASTA
const dessertRecipes = [
  {
    id: 31,
    name: "Classic Chocolate Brownies",
    category: "desserts",
    description: "Rich, fudgy chocolate brownies with a soft centre and delicate crackly top.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900",
    prepTime: "15 min",
    cookTime: "25 min",
    totalTime: "40 min",
    difficulty: "Easy",
    servings: 9,
    calories: 280,
    ingredients: [
      { name: "Dark chocolate", amount: "150 g" },
      { name: "Unsalted butter", amount: "100 g" },
      { name: "Caster sugar", amount: "3/4 cup" },
      { name: "Eggs", amount: "2 large" },
      { name: "All-purpose flour", amount: "1/2 cup" },
      { name: "Cocoa powder", amount: "1/4 cup" },
      { name: "Vanilla extract", amount: "1 tsp" },
      { name: "Salt", amount: "1/4 tsp" },
      { name: "Chocolate chips", amount: "1/4 cup" }
    ],
    instructions: [
      "Preheat the oven to 175°C.",
      "Line an 8-inch square baking pan with parchment paper.",
      "Melt dark chocolate and butter together using a double boiler or microwave in short intervals.",
      "Allow the melted chocolate mixture to cool slightly.",
      "Whisk sugar and eggs in a separate bowl until combined.",
      "Add vanilla extract and mix.",
      "Pour in the melted chocolate mixture and stir gently.",
      "Sift flour, cocoa powder and salt into the bowl.",
      "Fold the dry ingredients until just combined.",
      "Add chocolate chips and fold gently.",
      "Pour the batter into the prepared pan and spread evenly.",
      "Bake for 22–27 minutes until the centre is just set.",
      "Cool completely before cutting into squares."
    ],
    tips: [
      "Do not overmix after adding flour.",
      "For fudgier brownies, avoid overbaking.",
      "Allow the brownies to cool before slicing for cleaner pieces."
    ],
    storage: "Store in an airtight container for up to 3 days at room temperature."
  },
  {
    id: 32,
    name: "Classic New York Cheesecake",
    category: "desserts",
    description: "A smooth, creamy baked cheesecake on a buttery biscuit crust.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=900",
    prepTime: "25 min",
    cookTime: "60 min",
    totalTime: "5 hours",
    difficulty: "Medium",
    servings: 10,
    calories: 390,
    ingredients: [
      { name: "Digestive biscuits", amount: "200 g" },
      { name: "Melted butter", amount: "90 g" },
      { name: "Cream cheese", amount: "500 g" },
      { name: "Caster sugar", amount: "3/4 cup" },
      { name: "Eggs", amount: "3 large" },
      { name: "Sour cream", amount: "1/2 cup" },
      { name: "Vanilla extract", amount: "2 tsp" },
      { name: "All-purpose flour", amount: "2 tbsp" },
      { name: "Lemon juice", amount: "1 tbsp" }
    ],
    instructions: [
      "Preheat the oven to 160°C.",
      "Crush the digestive biscuits into fine crumbs.",
      "Mix the crumbs with melted butter.",
      "Press the mixture firmly into the base of a springform cake pan.",
      "Bake the crust for 10 minutes, then allow it to cool.",
      "Beat cream cheese and sugar until smooth.",
      "Add eggs one at a time, mixing gently after each addition.",
      "Add sour cream, vanilla, flour and lemon juice.",
      "Mix until the filling is smooth without overbeating.",
      "Pour the filling over the cooled biscuit crust.",
      "Place the pan in a larger baking tray with hot water around it.",
      "Bake for approximately 55–65 minutes until the edges are set and the centre still has a slight wobble.",
      "Turn off the oven and leave the cheesecake inside with the door slightly open for 30 minutes.",
      "Cool completely, then refrigerate for at least 4 hours before serving."
    ],
    tips: [
      "Use room-temperature cream cheese to avoid lumps.",
      "Avoid overmixing to reduce cracks.",
      "Chilling overnight gives the best texture."
    ],
    storage: "Refrigerate covered for up to 4 days."
  },
  {
    id: 33,
    name: "Chocolate Lava Cake",
    category: "desserts",
    description: "A warm individual chocolate cake with a soft molten chocolate centre.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900",
    prepTime: "12 min",
    cookTime: "12 min",
    totalTime: "24 min",
    difficulty: "Medium",
    servings: 4,
    calories: 340,
    ingredients: [
      { name: "Dark chocolate", amount: "120 g" },
      { name: "Unsalted butter", amount: "100 g" },
      { name: "Eggs", amount: "2 large" },
      { name: "Egg yolks", amount: "2" },
      { name: "Caster sugar", amount: "1/4 cup" },
      { name: "All-purpose flour", amount: "1/4 cup" },
      { name: "Vanilla extract", amount: "1 tsp" },
      { name: "Cocoa powder", amount: "For dusting" }
    ],
    instructions: [
      "Preheat the oven to 200°C.",
      "Grease four small oven-safe ramekins with butter.",
      "Dust the ramekins lightly with cocoa powder.",
      "Melt chocolate and butter together until smooth.",
      "In another bowl, whisk eggs, egg yolks and sugar.",
      "Add vanilla extract and whisk until slightly thick.",
      "Fold the melted chocolate mixture into the eggs.",
      "Sift in flour and fold gently.",
      "Divide the batter evenly between the ramekins.",
      "Bake for approximately 10–12 minutes until the edges are set.",
      "Let the cakes rest for one minute.",
      "Carefully invert each ramekin onto a serving plate.",
      "Serve warm with vanilla ice cream or fresh berries."
    ],
    tips: [
      "Oven temperatures vary, so check the cakes near the end of baking.",
      "Grease the ramekins thoroughly for easier removal.",
      "Serve immediately for the soft centre."
    ],
    storage: "Best served fresh. Unbaked batter can be refrigerated briefly in covered ramekins."
  },
  {
    id: 34,
    name: "Classic Tiramisu",
    category: "desserts",
    description: "An elegant Italian dessert layered with coffee-soaked biscuits and creamy mascarpone filling.",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=900",
    prepTime: "30 min",
    cookTime: "0 min",
    totalTime: "6 hours",
    difficulty: "Medium",
    servings: 8,
    calories: 360,
    ingredients: [
      { name: "Ladyfinger biscuits", amount: "200 g" },
      { name: "Mascarpone cheese", amount: "250 g" },
      { name: "Heavy cream", amount: "1 cup" },
      { name: "Caster sugar", amount: "1/3 cup" },
      { name: "Strong brewed coffee, cooled", amount: "1 cup" },
      { name: "Vanilla extract", amount: "1 tsp" },
      { name: "Unsweetened cocoa powder", amount: "2 tbsp" }
    ],
    instructions: [
      "Prepare strong coffee and allow it to cool completely.",
      "Place mascarpone cheese in a mixing bowl.",
      "Add sugar and vanilla extract.",
      "Mix gently until smooth.",
      "In another bowl, whip the cream until soft peaks form.",
      "Fold the whipped cream into the mascarpone mixture.",
      "Dip each ladyfinger briefly into the cooled coffee.",
      "Arrange a layer of soaked biscuits in a rectangular serving dish.",
      "Spread half of the mascarpone cream over the biscuits.",
      "Add another layer of coffee-soaked biscuits.",
      "Spread the remaining cream evenly on top.",
      "Cover and refrigerate for at least 6 hours.",
      "Dust generously with cocoa powder just before serving."
    ],
    tips: [
      "Dip biscuits quickly so they do not become soggy.",
      "Keep the dessert refrigerated throughout preparation.",
      "Use pasteurized dairy products and avoid raw eggs."
    ],
    storage: "Keep covered in the refrigerator and consume within 2 days."
  },
  {
    id: 35,
    name: "Classic Chocolate Mousse",
    category: "desserts",
    description: "A light and airy chocolate dessert with a rich cocoa flavour.",
    image: "https://images.unsplash.com/photo-1511715112108-9accd0b5c6b4?w=900",
    prepTime: "20 min",
    cookTime: "5 min",
    totalTime: "3 hours",
    difficulty: "Easy",
    servings: 4,
    calories: 320,
    ingredients: [
      { name: "Dark chocolate", amount: "150 g" },
      { name: "Heavy cream", amount: "1 1/2 cups" },
      { name: "Caster sugar", amount: "2 tbsp" },
      { name: "Vanilla extract", amount: "1 tsp" },
      { name: "Cocoa powder", amount: "For garnish" },
      { name: "Chocolate shavings", amount: "For garnish" }
    ],
    instructions: [
      "Chop the dark chocolate into small pieces.",
      "Heat half a cup of cream in a saucepan until steaming but not boiling.",
      "Pour the hot cream over the chopped chocolate.",
      "Let it sit for one minute, then stir until smooth.",
      "Allow the chocolate mixture to cool to room temperature.",
      "Whip the remaining cream with sugar and vanilla.",
      "Whip until soft peaks form.",
      "Fold one-third of the whipped cream into the chocolate mixture.",
      "Gently fold in the remaining whipped cream.",
      "Divide the mousse into individual serving glasses.",
      "Cover and refrigerate for at least 3 hours.",
      "Garnish with cocoa powder and chocolate shavings."
    ],
    tips: [
      "Make sure the chocolate mixture is cool before folding in cream.",
      "Use gentle folding to preserve the airy texture.",
      "Chill the serving glasses before filling for a special presentation."
    ],
    storage: "Refrigerate covered and consume within 2 days."
  },
  {
    id: 36,
    name: "Classic Vanilla Cupcakes",
    category: "desserts",
    description: "Soft vanilla cupcakes topped with smooth homemade buttercream frosting.",
    image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=900",
    prepTime: "15 min",
    cookTime: "20 min",
    totalTime: "35 min",
    difficulty: "Easy",
    servings: 12,
    calories: 250,
    ingredients: [
      { name: "All-purpose flour", amount: "1 1/2 cups" },
      { name: "Caster sugar", amount: "3/4 cup" },
      { name: "Unsalted butter, softened", amount: "100 g" },
      { name: "Eggs", amount: "2 large" },
      { name: "Milk", amount: "1/2 cup" },
      { name: "Baking powder", amount: "1 1/2 tsp" },
      { name: "Vanilla extract", amount: "2 tsp" },
      { name: "Salt", amount: "1/4 tsp" },
      { name: "Powdered sugar", amount: "1 1/2 cups" },
      { name: "Butter for frosting", amount: "75 g" }
    ],
    instructions: [
      "Preheat the oven to 180°C.",
      "Line a 12-cup muffin tray with paper cupcake liners.",
      "Whisk flour, baking powder and salt in a bowl.",
      "Beat softened butter and caster sugar until light and fluffy.",
      "Add eggs one at a time and mix well.",
      "Add vanilla extract.",
      "Add the dry ingredients in batches, alternating with milk.",
      "Mix only until the batter is smooth.",
      "Divide the batter evenly between the cupcake liners.",
      "Bake for 18–22 minutes until a toothpick inserted in the centre comes out clean.",
      "Cool completely on a wire rack.",
      "For frosting, beat softened butter until creamy.",
      "Gradually add powdered sugar and beat until fluffy.",
      "Pipe or spread the frosting over the cooled cupcakes."
    ],
    tips: [
      "Do not fill cupcake liners more than two-thirds full.",
      "Make sure cupcakes are completely cool before frosting.",
      "Use room-temperature ingredients for an even batter."
    ],
    storage: "Store in an airtight container for up to 2 days. Refrigerate if the room is warm."
  },
  {
    id: 37,
    name: "No-Bake Biscuit Chocolate Cake",
    category: "desserts",
    description: "A simple refrigerator cake made with crunchy biscuits and smooth chocolate ganache.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900",
    prepTime: "20 min",
    cookTime: "5 min",
    totalTime: "4 hours",
    difficulty: "Easy",
    servings: 8,
    calories: 310,
    ingredients: [
      { name: "Plain tea biscuits", amount: "250 g" },
      { name: "Dark chocolate", amount: "150 g" },
      { name: "Fresh cream", amount: "3/4 cup" },
      { name: "Butter", amount: "2 tbsp" },
      { name: "Milk", amount: "1/4 cup" },
      { name: "Chopped walnuts", amount: "1/4 cup" },
      { name: "Vanilla extract", amount: "1 tsp" }
    ],
    instructions: [
      "Break the biscuits into medium-sized pieces.",
      "Place the biscuit pieces in a large mixing bowl.",
      "Add chopped walnuts and mix.",
      "Heat cream in a saucepan until steaming.",
      "Pour the warm cream over chopped dark chocolate.",
      "Wait one minute, then stir until smooth.",
      "Add butter and vanilla extract.",
      "Pour the chocolate mixture over the biscuits.",
      "Mix until all biscuit pieces are coated.",
      "Transfer the mixture into a lined loaf pan.",
      "Press gently to remove large air gaps.",
      "Cover and refrigerate for at least 4 hours until firm.",
      "Remove from the pan and slice before serving."
    ],
    tips: [
      "Use different biscuit varieties for extra texture.",
      "Do not crush all the biscuits into powder.",
      "Chill thoroughly before slicing."
    ],
    storage: "Keep refrigerated in an airtight container for up to 5 days."
  },
  {
    id: 38,
    name: "Strawberry Panna Cotta",
    category: "desserts",
    description: "A silky Italian cream dessert served with a fresh strawberry topping.",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900",
    prepTime: "15 min",
    cookTime: "5 min",
    totalTime: "5 hours",
    difficulty: "Medium",
    servings: 4,
    calories: 290,
    ingredients: [
      { name: "Fresh cream", amount: "2 cups" },
      { name: "Milk", amount: "1/2 cup" },
      { name: "Sugar", amount: "1/3 cup" },
      { name: "Unflavoured gelatin", amount: "2 1/4 tsp" },
      { name: "Cold water", amount: "3 tbsp" },
      { name: "Vanilla extract", amount: "1 tsp" },
      { name: "Fresh strawberries", amount: "1 cup" },
      { name: "Lemon juice", amount: "1 tsp" }
    ],
    instructions: [
      "Sprinkle gelatin over cold water in a small bowl.",
      "Allow it to bloom for about 5 minutes.",
      "Combine cream, milk and sugar in a saucepan.",
      "Heat gently until the sugar dissolves and the mixture is steaming.",
      "Do not allow the mixture to boil.",
      "Remove from heat and stir in the bloomed gelatin until dissolved.",
      "Add vanilla extract.",
      "Pour into individual serving glasses or moulds.",
      "Allow the mixture to cool slightly.",
      "Refrigerate for at least 4 hours until set.",
      "Chop strawberries and mix with lemon juice.",
      "Spoon the strawberry topping over the chilled panna cotta."
    ],
    tips: [
      "Follow the gelatin package instructions for the correct setting strength.",
      "Heat gently to preserve the smooth texture.",
      "Prepare the dessert a day ahead for easy serving."
    ],
    storage: "Keep refrigerated and consume within 3 days."
  },
  {
    id: 39,
    name: "Classic Caramel Custard",
    category: "desserts",
    description: "A smooth baked custard topped with a glossy golden caramel sauce.",
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=900",
    prepTime: "15 min",
    cookTime: "40 min",
    totalTime: "5 hours",
    difficulty: "Medium",
    servings: 6,
    calories: 230,
    ingredients: [
      { name: "Milk", amount: "2 cups" },
      { name: "Eggs", amount: "3 large" },
      { name: "Sugar for custard", amount: "1/4 cup" },
      { name: "Vanilla extract", amount: "1 tsp" },
      { name: "Sugar for caramel", amount: "1/2 cup" },
      { name: "Water", amount: "2 tbsp" }
    ],
    instructions: [
      "Preheat the oven to 160°C.",
      "Place sugar and water for caramel in a small saucepan.",
      "Heat without stirring until the sugar turns amber.",
      "Carefully pour the hot caramel into six heatproof ramekins.",
      "Warm milk gently in another saucepan.",
      "Whisk eggs, sugar and vanilla in a bowl.",
      "Slowly pour warm milk into the egg mixture while whisking.",
      "Strain the custard mixture for a smoother texture.",
      "Pour the custard into the caramel-lined ramekins.",
      "Place ramekins in a deep baking tray.",
      "Pour hot water into the tray until it reaches halfway up the ramekins.",
      "Bake for approximately 35–40 minutes until the custard is set around the edges.",
      "Cool completely and refrigerate for at least 4 hours.",
      "Run a thin knife around each edge and invert onto a serving plate."
    ],
    tips: [
      "Watch the caramel carefully because it can burn quickly.",
      "Straining the custard removes unwanted lumps.",
      "Use a water bath for gentle, even cooking."
    ],
    storage: "Keep covered in the refrigerator for up to 3 days."
  },
  {
    id: 40,
    name: "Chocolate Chip Cookies",
    category: "desserts",
    description: "Golden cookies with crisp edges, soft centres and generous chocolate chips.",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=900",
    prepTime: "15 min",
    cookTime: "12 min",
    totalTime: "27 min",
    difficulty: "Easy",
    servings: 12,
    calories: 190,
    ingredients: [
      { name: "All-purpose flour", amount: "1 1/2 cups" },
      { name: "Unsalted butter, softened", amount: "115 g" },
      { name: "Brown sugar", amount: "1/2 cup" },
      { name: "White sugar", amount: "1/4 cup" },
      { name: "Egg", amount: "1 large" },
      { name: "Vanilla extract", amount: "1 tsp" },
      { name: "Baking soda", amount: "1/2 tsp" },
      { name: "Salt", amount: "1/4 tsp" },
      { name: "Chocolate chips", amount: "3/4 cup" }
    ],
    instructions: [
      "Preheat the oven to 180°C.",
      "Line a baking tray with parchment paper.",
      "Whisk flour, baking soda and salt in a bowl.",
      "Beat softened butter with brown sugar and white sugar until creamy.",
      "Add egg and vanilla extract.",
      "Mix until combined.",
      "Gradually add the dry ingredients.",
      "Fold in chocolate chips.",
      "Scoop dough into evenly sized balls.",
      "Place them on the tray with enough space between each cookie.",
      "Bake for 10–12 minutes until the edges are lightly golden.",
      "The centres may look slightly soft when removed.",
      "Allow cookies to cool on the tray for 5 minutes before transferring to a rack."
    ],
    tips: [
      "Chill the dough for 20–30 minutes for thicker cookies.",
      "Do not overbake if you prefer soft centres.",
      "Use a mixture of milk and dark chocolate chips for extra flavour."
    ],
    storage: "Store completely cooled cookies in an airtight container for up to 5 days."
  }
];

// END OF PART 5 - DESSERTS
const healthyRecipes = [
  {
    id: 41,
    name: "Classic Mediterranean Buddha Bowl",
    category: "healthy",
    description: "A colourful nutritious bowl packed with grains, vegetables, chickpeas and a creamy dressing.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900",
    prepTime: "15 min",
    cookTime: "20 min",
    totalTime: "35 min",
    difficulty: "Easy",
    servings: 2,
    calories: 430,
    ingredients: [
      { name: "Cooked quinoa", amount: "1 cup" },
      { name: "Boiled chickpeas", amount: "1 cup" },
      { name: "Cucumber, diced", amount: "1/2 cup" },
      { name: "Cherry tomatoes, halved", amount: "1/2 cup" },
      { name: "Carrot, grated", amount: "1/2 cup" },
      { name: "Baby spinach", amount: "1 cup" },
      { name: "Olive oil", amount: "1 tbsp" },
      { name: "Lemon juice", amount: "1 tbsp" },
      { name: "Tahini", amount: "2 tbsp" },
      { name: "Salt and black pepper", amount: "To taste" }
    ],
    instructions: [
      "Rinse quinoa thoroughly under running water.",
      "Cook quinoa according to the package instructions and allow it to cool slightly.",
      "Drain and rinse the boiled chickpeas.",
      "Season chickpeas with olive oil, salt and black pepper.",
      "Arrange cooked quinoa at the base of two serving bowls.",
      "Add chickpeas, cucumber, tomatoes, carrot and spinach in separate sections.",
      "Mix tahini, lemon juice and a little water in a small bowl.",
      "Whisk until the dressing becomes smooth and pourable.",
      "Drizzle the dressing over the bowls.",
      "Finish with freshly ground black pepper and serve."
    ],
    tips: [
      "Use brown rice instead of quinoa if preferred.",
      "Add avocado for a creamy texture.",
      "Prepare the vegetables in advance for quick assembly."
    ],
    storage: "Store components separately in airtight containers in the refrigerator for up to 3 days."
  },
  {
    id: 42,
    name: "Grilled Paneer Protein Bowl",
    category: "healthy",
    description: "A satisfying vegetarian bowl with grilled paneer, fresh vegetables and mint yogurt dressing.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=900",
    prepTime: "15 min",
    cookTime: "15 min",
    totalTime: "30 min",
    difficulty: "Easy",
    servings: 2,
    calories: 460,
    ingredients: [
      { name: "Paneer, cubed", amount: "200 g" },
      { name: "Cooked brown rice", amount: "1 cup" },
      { name: "Capsicum, diced", amount: "1/2 cup" },
      { name: "Cucumber, diced", amount: "1/2 cup" },
      { name: "Cherry tomatoes", amount: "1/2 cup" },
      { name: "Hung curd", amount: "1/2 cup" },
      { name: "Mint leaves", amount: "2 tbsp" },
      { name: "Lemon juice", amount: "1 tbsp" },
      { name: "Cumin powder", amount: "1/2 tsp" },
      { name: "Black pepper", amount: "1/4 tsp" },
      { name: "Olive oil", amount: "1 tbsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Cut paneer into medium-sized cubes.",
      "Mix paneer with cumin powder, lemon juice, salt and black pepper.",
      "Heat olive oil in a non-stick pan.",
      "Grill the paneer cubes until lightly golden on all sides.",
      "Keep the grilled paneer aside.",
      "Mix hung curd with finely chopped mint and a little lemon juice.",
      "Season the yogurt dressing with salt and pepper.",
      "Divide cooked brown rice between two bowls.",
      "Arrange cucumber, tomatoes and capsicum around the rice.",
      "Add the grilled paneer cubes.",
      "Drizzle the mint yogurt dressing over the bowl.",
      "Serve immediately."
    ],
    tips: [
      "Use firm paneer so the cubes hold their shape while grilling.",
      "Add lettuce or spinach for extra vegetables.",
      "Avoid cooking paneer for too long because it can become chewy."
    ],
    storage: "Refrigerate paneer, rice and vegetables separately for up to 2 days."
  },
  {
    id: 43,
    name: "Fresh Greek Salad",
    category: "healthy",
    description: "A refreshing Mediterranean salad with cucumber, tomatoes, olives, feta and oregano dressing.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900",
    prepTime: "15 min",
    cookTime: "0 min",
    totalTime: "15 min",
    difficulty: "Easy",
    servings: 2,
    calories: 280,
    ingredients: [
      { name: "Cucumber, chopped", amount: "1 large" },
      { name: "Tomatoes, chopped", amount: "2 medium" },
      { name: "Red onion, sliced", amount: "1/2 small" },
      { name: "Kalamata olives", amount: "1/3 cup" },
      { name: "Feta cheese, crumbled", amount: "100 g" },
      { name: "Olive oil", amount: "2 tbsp" },
      { name: "Lemon juice", amount: "1 tbsp" },
      { name: "Dried oregano", amount: "1 tsp" },
      { name: "Black pepper", amount: "1/4 tsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Wash all vegetables thoroughly under running water.",
      "Cut cucumber and tomatoes into bite-sized pieces.",
      "Thinly slice the red onion.",
      "Place cucumber, tomatoes and onion in a large salad bowl.",
      "Add Kalamata olives.",
      "Mix olive oil, lemon juice, oregano and black pepper in a small bowl.",
      "Pour the dressing over the vegetables.",
      "Toss gently until everything is coated.",
      "Add crumbled feta cheese on top.",
      "Taste and adjust salt carefully because feta and olives are already salty.",
      "Serve immediately."
    ],
    tips: [
      "Use ripe but firm tomatoes for the best texture.",
      "Chill the vegetables before assembling.",
      "Add chickpeas for extra protein and fibre."
    ],
    storage: "Best served fresh. Store undressed vegetables in the refrigerator for up to 1 day."
  },
  {
    id: 44,
    name: "Overnight Berry Oats",
    category: "healthy",
    description: "A creamy make-ahead breakfast with oats, milk, yogurt, chia seeds and fresh berries.",
    image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=900",
    prepTime: "10 min",
    cookTime: "0 min",
    totalTime: "6 hours",
    difficulty: "Easy",
    servings: 2,
    calories: 350,
    ingredients: [
      { name: "Rolled oats", amount: "1 cup" },
      { name: "Milk", amount: "1 cup" },
      { name: "Plain yogurt", amount: "1/2 cup" },
      { name: "Chia seeds", amount: "2 tbsp" },
      { name: "Honey", amount: "1 tbsp" },
      { name: "Strawberries, chopped", amount: "1/2 cup" },
      { name: "Blueberries", amount: "1/4 cup" },
      { name: "Banana, sliced", amount: "1 small" },
      { name: "Almonds, chopped", amount: "2 tbsp" }
    ],
    instructions: [
      "Take two clean jars or airtight containers.",
      "Divide rolled oats and chia seeds between the jars.",
      "Add milk and plain yogurt.",
      "Add honey and stir until combined.",
      "Cover the containers and refrigerate overnight or for at least 6 hours.",
      "The next morning, stir the oats to check their consistency.",
      "Add a little milk if the mixture is too thick.",
      "Top with strawberries, blueberries and banana.",
      "Sprinkle chopped almonds over the top.",
      "Serve chilled."
    ],
    tips: [
      "Use rolled oats for a creamy texture.",
      "Add fruit just before serving for better freshness.",
      "Try apple, mango or chopped nuts as alternative toppings."
    ],
    storage: "Keep refrigerated in sealed containers and consume within 2 days."
  },
  {
    id: 45,
    name: "Avocado Chickpea Salad",
    category: "healthy",
    description: "A filling plant-based salad with creamy avocado, chickpeas, vegetables and lemon dressing.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900",
    prepTime: "15 min",
    cookTime: "0 min",
    totalTime: "15 min",
    difficulty: "Easy",
    servings: 2,
    calories: 390,
    ingredients: [
      { name: "Boiled chickpeas", amount: "1 cup" },
      { name: "Ripe avocado", amount: "1 large" },
      { name: "Cucumber, diced", amount: "1/2 cup" },
      { name: "Cherry tomatoes", amount: "1/2 cup" },
      { name: "Red onion, chopped", amount: "2 tbsp" },
      { name: "Fresh coriander", amount: "2 tbsp" },
      { name: "Olive oil", amount: "1 tbsp" },
      { name: "Lemon juice", amount: "1 1/2 tbsp" },
      { name: "Black pepper", amount: "1/4 tsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Drain and rinse the boiled chickpeas.",
      "Wash and chop cucumber and cherry tomatoes.",
      "Finely chop the red onion and coriander.",
      "Cut the avocado in half, remove the seed and scoop out the flesh.",
      "Cut the avocado into bite-sized cubes.",
      "Add chickpeas, cucumber, tomatoes and onion to a mixing bowl.",
      "Add the avocado and coriander.",
      "Mix olive oil, lemon juice, salt and black pepper separately.",
      "Pour the dressing over the salad.",
      "Toss gently to avoid mashing the avocado.",
      "Serve immediately."
    ],
    tips: [
      "Use ripe but firm avocado.",
      "Add lemon juice quickly after cutting avocado to slow browning.",
      "Serve with whole-grain toast for a more filling meal."
    ],
    storage: "Best eaten fresh. Refrigerate leftovers in an airtight container and consume within 1 day."
  },
  {
    id: 46,
    name: "Grilled Chicken Salad Bowl",
    category: "healthy",
    description: "A fresh salad bowl with seasoned grilled chicken, crisp vegetables and lemon dressing.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900",
    prepTime: "15 min",
    cookTime: "20 min",
    totalTime: "35 min",
    difficulty: "Medium",
    servings: 2,
    calories: 420,
    ingredients: [
      { name: "Boneless chicken breast", amount: "250 g" },
      { name: "Olive oil", amount: "1 tbsp" },
      { name: "Lemon juice", amount: "1 tbsp" },
      { name: "Garlic, minced", amount: "2 cloves" },
      { name: "Paprika", amount: "1/2 tsp" },
      { name: "Black pepper", amount: "1/4 tsp" },
      { name: "Mixed lettuce", amount: "2 cups" },
      { name: "Cucumber, sliced", amount: "1/2 cup" },
      { name: "Cherry tomatoes", amount: "1/2 cup" },
      { name: "Sweet corn", amount: "1/3 cup" },
      { name: "Plain yogurt", amount: "1/4 cup" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Mix olive oil, lemon juice, garlic, paprika, pepper and salt.",
      "Coat the chicken breast evenly with the marinade.",
      "Keep refrigerated while preparing the vegetables.",
      "Wash and dry the lettuce thoroughly.",
      "Slice cucumber and halve the cherry tomatoes.",
      "Heat a grill pan over medium heat.",
      "Cook the chicken, turning as needed, until the thickest part reaches an internal temperature of 74°C.",
      "Transfer the chicken to a clean plate and rest briefly.",
      "Cut the cooked chicken into slices using a clean knife and board.",
      "Arrange lettuce, cucumber, tomatoes and corn in two bowls.",
      "Add the sliced chicken.",
      "Serve with plain yogurt seasoned with lemon juice, salt and pepper."
    ],
    tips: [
      "Use a food thermometer to confirm the chicken is fully cooked.",
      "Never reuse the plate or utensils that held raw chicken without washing them.",
      "Add avocado or cooked quinoa for variety."
    ],
    storage: "Refrigerate cooked chicken and salad separately. Consume cooked chicken within 3 days."
  },
  {
    id: 47,
    name: "Vegetable Quinoa Salad",
    category: "healthy",
    description: "A light and colourful quinoa salad with crunchy vegetables and a citrus dressing.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900",
    prepTime: "15 min",
    cookTime: "15 min",
    totalTime: "30 min",
    difficulty: "Easy",
    servings: 3,
    calories: 330,
    ingredients: [
      { name: "Quinoa", amount: "1 cup" },
      { name: "Water", amount: "2 cups" },
      { name: "Cucumber, diced", amount: "1/2 cup" },
      { name: "Red bell pepper, diced", amount: "1/2 cup" },
      { name: "Cherry tomatoes", amount: "1/2 cup" },
      { name: "Sweet corn", amount: "1/3 cup" },
      { name: "Fresh parsley", amount: "2 tbsp" },
      { name: "Olive oil", amount: "1 tbsp" },
      { name: "Lemon juice", amount: "2 tbsp" },
      { name: "Salt", amount: "To taste" },
      { name: "Black pepper", amount: "1/4 tsp" }
    ],
    instructions: [
      "Rinse quinoa thoroughly under cold running water.",
      "Combine quinoa and water in a saucepan.",
      "Bring to a boil, then reduce the heat.",
      "Cover and simmer for approximately 15 minutes until the liquid is absorbed.",
      "Remove from heat and let it rest covered for 5 minutes.",
      "Fluff the quinoa with a fork and allow it to cool.",
      "Chop cucumber and bell pepper into small pieces.",
      "Halve the cherry tomatoes.",
      "Combine the cooled quinoa and vegetables in a large bowl.",
      "Add sweet corn and chopped parsley.",
      "Whisk olive oil, lemon juice, salt and pepper.",
      "Pour the dressing over the salad and toss gently.",
      "Serve chilled or at room temperature."
    ],
    tips: [
      "Rinsing quinoa removes its naturally bitter coating.",
      "Allow quinoa to cool before adding fresh vegetables.",
      "Add feta or chickpeas for extra flavour and protein."
    ],
    storage: "Store in an airtight container in the refrigerator for up to 3 days."
  },
  {
    id: 48,
    name: "Whole Wheat Vegetable Wrap",
    category: "healthy",
    description: "A wholesome whole-wheat wrap filled with crunchy vegetables and creamy yogurt spread.",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=900",
    prepTime: "15 min",
    cookTime: "10 min",
    totalTime: "25 min",
    difficulty: "Easy",
    servings: 2,
    calories: 360,
    ingredients: [
      { name: "Whole wheat tortillas", amount: "2 large" },
      { name: "Hung curd", amount: "1/2 cup" },
      { name: "Cucumber, julienned", amount: "1/2 cup" },
      { name: "Carrot, grated", amount: "1/2 cup" },
      { name: "Capsicum, sliced", amount: "1/2 cup" },
      { name: "Lettuce leaves", amount: "4" },
      { name: "Sweet corn", amount: "1/4 cup" },
      { name: "Lemon juice", amount: "1 tsp" },
      { name: "Black pepper", amount: "1/4 tsp" },
      { name: "Roasted cumin powder", amount: "1/4 tsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Wash and prepare all vegetables.",
      "Mix hung curd with lemon juice, cumin powder, pepper and salt.",
      "Warm the whole wheat tortillas briefly in a pan.",
      "Spread the yogurt mixture over each tortilla.",
      "Place lettuce leaves in the centre.",
      "Add cucumber, carrot, capsicum and sweet corn.",
      "Arrange the vegetables evenly without overfilling.",
      "Fold the sides of each tortilla inward.",
      "Roll tightly from the bottom to form a wrap.",
      "Place the wraps seam-side down in a warm pan.",
      "Toast lightly on both sides.",
      "Cut diagonally and serve."
    ],
    tips: [
      "Do not add too much dressing or the wrap may become soggy.",
      "Add grilled paneer for extra protein.",
      "Warm tortillas before rolling to prevent tearing."
    ],
    storage: "Best served fresh. Keep the filling and tortillas separate if preparing ahead."
  },
  {
    id: 49,
    name: "Healthy Banana Oat Pancakes",
    category: "healthy",
    description: "Soft breakfast pancakes made with oats, banana, milk and a touch of cinnamon.",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=900",
    prepTime: "10 min",
    cookTime: "15 min",
    totalTime: "25 min",
    difficulty: "Easy",
    servings: 2,
    calories: 340,
    ingredients: [
      { name: "Rolled oats", amount: "1 cup" },
      { name: "Ripe banana", amount: "1 large" },
      { name: "Egg", amount: "1 large" },
      { name: "Milk", amount: "1/2 cup" },
      { name: "Baking powder", amount: "1/2 tsp" },
      { name: "Cinnamon powder", amount: "1/4 tsp" },
      { name: "Vanilla extract", amount: "1/2 tsp" },
      { name: "Butter or oil", amount: "For cooking" },
      { name: "Fresh fruit", amount: "For topping" },
      { name: "Honey", amount: "For serving" }
    ],
    instructions: [
      "Place oats in a blender and blend into a fine flour.",
      "Add banana, egg, milk, baking powder, cinnamon and vanilla.",
      "Blend until a smooth batter forms.",
      "Let the batter rest for 5 minutes to thicken.",
      "Heat a non-stick pan over medium-low heat.",
      "Lightly grease the pan with butter or oil.",
      "Pour a small amount of batter into the pan.",
      "Cook until bubbles appear on the surface and the edges look set.",
      "Flip carefully and cook the other side until golden.",
      "Repeat with the remaining batter.",
      "Arrange pancakes on a serving plate.",
      "Top with fresh fruit and a little honey."
    ],
    tips: [
      "Use a ripe banana for natural sweetness.",
      "Keep the heat medium-low so the pancakes cook through.",
      "Add a little milk if the batter becomes too thick."
    ],
    storage: "Refrigerate cooked pancakes for up to 2 days. Reheat in a pan or microwave."
  },
  {
    id: 50,
    name: "Homemade Vegetable Hummus Plate",
    category: "healthy",
    description: "Creamy homemade chickpea hummus served with fresh vegetables and whole-grain pita.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=900",
    prepTime: "15 min",
    cookTime: "0 min",
    totalTime: "15 min",
    difficulty: "Easy",
    servings: 3,
    calories: 310,
    ingredients: [
      { name: "Boiled chickpeas", amount: "1 1/2 cups" },
      { name: "Tahini", amount: "2 tbsp" },
      { name: "Lemon juice", amount: "2 tbsp" },
      { name: "Garlic", amount: "1 clove" },
      { name: "Olive oil", amount: "2 tbsp" },
      { name: "Cold water", amount: "2–4 tbsp" },
      { name: "Ground cumin", amount: "1/2 tsp" },
      { name: "Salt", amount: "To taste" },
      { name: "Carrot sticks", amount: "1 cup" },
      { name: "Cucumber sticks", amount: "1 cup" },
      { name: "Whole-grain pita bread", amount: "2 pieces" }
    ],
    instructions: [
      "Drain and rinse the boiled chickpeas.",
      "Add chickpeas, tahini, lemon juice and garlic to a food processor.",
      "Add olive oil, cumin and salt.",
      "Blend until the mixture becomes thick and smooth.",
      "Add cold water gradually while blending.",
      "Continue blending until the hummus reaches a creamy consistency.",
      "Taste and adjust lemon juice or salt.",
      "Transfer hummus into a serving bowl.",
      "Drizzle a little olive oil over the top.",
      "Wash and cut carrots and cucumber into sticks.",
      "Warm pita bread and cut into triangles.",
      "Arrange hummus, vegetables and pita on a serving plate."
    ],
    tips: [
      "Blend longer for a smoother hummus texture.",
      "Add cold water gradually to control thickness.",
      "Sprinkle paprika or sesame seeds over the hummus before serving."
    ],
    storage: "Refrigerate hummus in an airtight container for up to 4 days."
  }
];

// END OF PART 6 - HEALTHY FOOD
const indianRecipes = [
  {
    id: 51,
    name: "Paneer Butter Masala",
    category: "indian",
    description: "Soft paneer cubes simmered in a rich, creamy tomato, butter and cashew gravy.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=900",
    prepTime: "15 min",
    cookTime: "30 min",
    totalTime: "45 min",
    difficulty: "Medium",
    servings: 3,
    calories: 420,
    ingredients: [
      { name: "Paneer, cubed", amount: "250 g" },
      { name: "Tomatoes, chopped", amount: "4 medium" },
      { name: "Onion, chopped", amount: "1 medium" },
      { name: "Cashews", amount: "12" },
      { name: "Butter", amount: "3 tbsp" },
      { name: "Fresh cream", amount: "1/4 cup" },
      { name: "Ginger-garlic paste", amount: "1 tbsp" },
      { name: "Kashmiri chilli powder", amount: "1 tsp" },
      { name: "Garam masala", amount: "1/2 tsp" },
      { name: "Kasuri methi", amount: "1 tsp" },
      { name: "Sugar", amount: "1/2 tsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Soak cashews in warm water for 15 minutes.",
      "Heat one tablespoon of butter in a pan.",
      "Add chopped onion and cook until translucent.",
      "Add ginger-garlic paste and sauté briefly.",
      "Add chopped tomatoes, cashews and Kashmiri chilli powder.",
      "Cook until the tomatoes become soft and pulpy.",
      "Allow the mixture to cool completely.",
      "Blend into a smooth gravy and strain if desired.",
      "Heat the remaining butter in the same pan.",
      "Pour in the prepared gravy and simmer for 8–10 minutes.",
      "Add salt, sugar and garam masala.",
      "Add paneer cubes and simmer gently for 3–4 minutes.",
      "Stir in fresh cream.",
      "Crush kasuri methi between your palms and add it to the gravy.",
      "Serve hot with naan, roti or jeera rice."
    ],
    tips: [
      "Use ripe red tomatoes for a naturally rich colour.",
      "Avoid boiling paneer for too long.",
      "Add cream at the end for a restaurant-style finish."
    ],
    storage: "Refrigerate in an airtight container for up to 2 days."
  },
  {
    id: 52,
    name: "Punjabi Chole Masala",
    category: "indian",
    description: "Traditional Punjabi chickpea curry cooked in a spicy, aromatic onion-tomato gravy.",
    image: "https://images.unsplash.com/photo-1582576163090-09d3b6c5b1f4?w=900",
    prepTime: "15 min",
    cookTime: "40 min",
    totalTime: "55 min",
    difficulty: "Medium",
    servings: 4,
    calories: 350,
    ingredients: [
      { name: "Dried chickpeas, soaked overnight", amount: "1 cup" },
      { name: "Onions, finely chopped", amount: "2 medium" },
      { name: "Tomatoes, pureed", amount: "3 medium" },
      { name: "Ginger-garlic paste", amount: "1 tbsp" },
      { name: "Oil", amount: "3 tbsp" },
      { name: "Chole masala", amount: "2 tbsp" },
      { name: "Cumin seeds", amount: "1 tsp" },
      { name: "Turmeric powder", amount: "1/4 tsp" },
      { name: "Red chilli powder", amount: "1/2 tsp" },
      { name: "Amchur powder", amount: "1/2 tsp" },
      { name: "Tea bag", amount: "1 optional" },
      { name: "Fresh coriander", amount: "2 tbsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Drain the soaked chickpeas and rinse them thoroughly.",
      "Place chickpeas in a pressure cooker with fresh water and salt.",
      "Add an optional tea bag for a deeper traditional colour.",
      "Pressure-cook until the chickpeas are completely tender.",
      "Remove and discard the tea bag.",
      "Heat oil in a heavy-bottomed pan.",
      "Add cumin seeds and allow them to crackle.",
      "Add chopped onions and cook until golden.",
      "Stir in ginger-garlic paste.",
      "Add tomato puree and cook until the oil begins to separate.",
      "Add chole masala, turmeric and red chilli powder.",
      "Cook the spices for 2 minutes.",
      "Add boiled chickpeas along with some cooking liquid.",
      "Simmer for 15–20 minutes, stirring occasionally.",
      "Mash a few chickpeas to thicken the gravy.",
      "Add amchur powder and adjust salt.",
      "Garnish with fresh coriander and serve with bhature or rice."
    ],
    tips: [
      "Soak chickpeas for 8–12 hours before cooking.",
      "Cook until completely tender before adding them to the gravy.",
      "Simmering improves the flavour of the masala."
    ],
    storage: "Refrigerate for up to 3 days. Reheat thoroughly before serving."
  },
  {
    id: 53,
    name: "Restaurant Style Dal Tadka",
    category: "indian",
    description: "Comforting yellow lentils finished with a fragrant cumin, garlic and chilli tempering.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=900",
    prepTime: "10 min",
    cookTime: "30 min",
    totalTime: "40 min",
    difficulty: "Easy",
    servings: 4,
    calories: 280,
    ingredients: [
      { name: "Toor dal", amount: "1/2 cup" },
      { name: "Moong dal", amount: "1/4 cup" },
      { name: "Water", amount: "3 cups" },
      { name: "Tomato, chopped", amount: "1 medium" },
      { name: "Onion, chopped", amount: "1 small" },
      { name: "Turmeric powder", amount: "1/2 tsp" },
      { name: "Ghee", amount: "2 tbsp" },
      { name: "Cumin seeds", amount: "1 tsp" },
      { name: "Garlic, sliced", amount: "5 cloves" },
      { name: "Dried red chillies", amount: "2" },
      { name: "Red chilli powder", amount: "1/2 tsp" },
      { name: "Hing", amount: "1 pinch" },
      { name: "Fresh coriander", amount: "2 tbsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Wash both dals thoroughly under running water.",
      "Add the dals, water, turmeric and salt to a pressure cooker.",
      "Cook until the lentils become completely soft.",
      "Mash the cooked dal lightly with a ladle.",
      "Add water to adjust the consistency.",
      "In a separate pan, heat one tablespoon of ghee.",
      "Add chopped onion and sauté until golden.",
      "Add chopped tomato and cook until soft.",
      "Mix this onion-tomato mixture into the dal.",
      "Simmer the dal for 5 minutes.",
      "For the tadka, heat the remaining ghee in a small pan.",
      "Add cumin seeds and hing.",
      "Add sliced garlic and dried red chillies.",
      "Cook until the garlic turns lightly golden.",
      "Switch off the heat and add red chilli powder.",
      "Pour the tempering over the hot dal.",
      "Garnish with fresh coriander and serve with rice or roti."
    ],
    tips: [
      "Mixing two types of lentils gives a balanced texture.",
      "Adjust water according to your preferred thickness.",
      "Pour the tadka over the dal just before serving."
    ],
    storage: "Refrigerate for up to 3 days in an airtight container."
  },
  {
    id: 54,
    name: "Vegetable Dum Biryani",
    category: "indian",
    description: "Fragrant basmati rice layered with spiced vegetables, herbs, saffron and crispy onions.",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=900",
    prepTime: "25 min",
    cookTime: "40 min",
    totalTime: "65 min",
    difficulty: "Hard",
    servings: 4,
    calories: 480,
    ingredients: [
      { name: "Basmati rice", amount: "2 cups" },
      { name: "Mixed vegetables", amount: "2 cups" },
      { name: "Thick yogurt", amount: "1/2 cup" },
      { name: "Onions, thinly sliced", amount: "2 large" },
      { name: "Ginger-garlic paste", amount: "1 tbsp" },
      { name: "Biryani masala", amount: "2 tbsp" },
      { name: "Mint leaves", amount: "1/2 cup" },
      { name: "Fresh coriander", amount: "1/2 cup" },
      { name: "Green chillies", amount: "2" },
      { name: "Ghee", amount: "2 tbsp" },
      { name: "Saffron strands", amount: "A pinch" },
      { name: "Warm milk", amount: "2 tbsp" },
      { name: "Whole spices", amount: "Cinnamon, cloves and cardamom" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Wash basmati rice until the water runs mostly clear.",
      "Soak the rice for 20–30 minutes.",
      "Soak saffron strands in warm milk.",
      "Heat oil in a pan and fry sliced onions until golden.",
      "Remove the fried onions and keep aside.",
      "In the same pan, add whole spices.",
      "Add ginger-garlic paste and green chillies.",
      "Add mixed vegetables and sauté for a few minutes.",
      "Mix yogurt with biryani masala and salt.",
      "Add the yogurt mixture to the vegetables.",
      "Cook until the vegetables are partially tender and the gravy thickens.",
      "In another pot, boil water with whole spices and salt.",
      "Add soaked rice and cook until approximately 70% done.",
      "Drain the rice carefully.",
      "Layer half of the rice over the vegetable gravy.",
      "Add mint, coriander and fried onions.",
      "Add the remaining rice and repeat the garnish.",
      "Pour saffron milk and melted ghee over the top.",
      "Cover tightly and cook on very low heat for 15–20 minutes.",
      "Allow it to rest for 10 minutes before opening.",
      "Gently fluff and serve with raita."
    ],
    tips: [
      "Do not fully cook the rice before layering.",
      "Use a heavy-bottomed pot to prevent burning.",
      "Keep the dum heat low and steady."
    ],
    storage: "Refrigerate promptly and consume within 2 days. Reheat until piping hot."
  },
  {
    id: 55,
    name: "Palak Paneer",
    category: "indian",
    description: "Soft paneer cubes in a vibrant spinach gravy flavoured with garlic and Indian spices.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=900",
    prepTime: "15 min",
    cookTime: "25 min",
    totalTime: "40 min",
    difficulty: "Medium",
    servings: 3,
    calories: 340,
    ingredients: [
      { name: "Fresh spinach", amount: "400 g" },
      { name: "Paneer, cubed", amount: "200 g" },
      { name: "Onion, chopped", amount: "1 medium" },
      { name: "Tomato, chopped", amount: "1 medium" },
      { name: "Garlic", amount: "5 cloves" },
      { name: "Ginger", amount: "1 inch piece" },
      { name: "Green chilli", amount: "1" },
      { name: "Cumin seeds", amount: "1 tsp" },
      { name: "Butter", amount: "1 tbsp" },
      { name: "Fresh cream", amount: "2 tbsp" },
      { name: "Garam masala", amount: "1/2 tsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Wash spinach thoroughly to remove dirt.",
      "Bring water to a boil and blanch spinach briefly.",
      "Transfer spinach into cold water to preserve its green colour.",
      "Drain and blend spinach with green chilli into a smooth puree.",
      "Heat butter in a pan.",
      "Add cumin seeds and allow them to crackle.",
      "Add chopped onion and cook until translucent.",
      "Add ginger and garlic and sauté briefly.",
      "Add chopped tomato and cook until soft.",
      "Pour in the spinach puree.",
      "Add salt and garam masala.",
      "Simmer gently for 5–7 minutes.",
      "Add paneer cubes and cook for 3 minutes.",
      "Stir in fresh cream.",
      "Serve hot with roti, naan or jeera rice."
    ],
    tips: [
      "Do not overcook spinach after blending.",
      "Use fresh spinach for a vibrant green colour.",
      "Add cream just before serving."
    ],
    storage: "Refrigerate for up to 2 days."
  },
  {
    id: 56,
    name: "Aloo Gobi Masala",
    category: "indian",
    description: "A classic North Indian dry curry with tender potatoes, cauliflower and aromatic spices.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=900",
    prepTime: "15 min",
    cookTime: "25 min",
    totalTime: "40 min",
    difficulty: "Easy",
    servings: 3,
    calories: 260,
    ingredients: [
      { name: "Cauliflower florets", amount: "2 cups" },
      { name: "Potatoes, cubed", amount: "2 medium" },
      { name: "Onion, chopped", amount: "1 medium" },
      { name: "Tomato, chopped", amount: "1 medium" },
      { name: "Oil", amount: "2 tbsp" },
      { name: "Cumin seeds", amount: "1 tsp" },
      { name: "Ginger, grated", amount: "1 tsp" },
      { name: "Turmeric powder", amount: "1/2 tsp" },
      { name: "Coriander powder", amount: "1 tsp" },
      { name: "Red chilli powder", amount: "1/2 tsp" },
      { name: "Garam masala", amount: "1/2 tsp" },
      { name: "Fresh coriander", amount: "2 tbsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Wash cauliflower and potatoes thoroughly.",
      "Cut cauliflower into medium florets and potatoes into cubes.",
      "Heat oil in a wide pan.",
      "Add cumin seeds and allow them to crackle.",
      "Add chopped onion and cook until lightly golden.",
      "Add grated ginger and sauté briefly.",
      "Add tomato and cook until soft.",
      "Mix in turmeric, coriander powder and chilli powder.",
      "Add potatoes and cauliflower florets.",
      "Stir until the vegetables are coated with the spices.",
      "Cover and cook on low heat, stirring occasionally.",
      "Add a splash of water if the vegetables begin sticking.",
      "Cook until the potatoes and cauliflower are tender.",
      "Add garam masala and adjust salt.",
      "Garnish with fresh coriander and serve."
    ],
    tips: [
      "Cut vegetables into similar sizes for even cooking.",
      "Avoid adding too much water because this is a mostly dry curry.",
      "Cook covered on low heat to develop flavour."
    ],
    storage: "Refrigerate for up to 2 days."
  },
  {
    id: 57,
    name: "Restaurant Style Veg Pulao",
    category: "indian",
    description: "Aromatic basmati rice cooked with mixed vegetables, whole spices and fresh herbs.",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=900",
    prepTime: "15 min",
    cookTime: "25 min",
    totalTime: "40 min",
    difficulty: "Easy",
    servings: 3,
    calories: 390,
    ingredients: [
      { name: "Basmati rice", amount: "1 1/2 cups" },
      { name: "Mixed vegetables", amount: "1 1/2 cups" },
      { name: "Onion, sliced", amount: "1 medium" },
      { name: "Green peas", amount: "1/2 cup" },
      { name: "Ghee", amount: "2 tbsp" },
      { name: "Cumin seeds", amount: "1 tsp" },
      { name: "Bay leaf", amount: "1" },
      { name: "Cinnamon stick", amount: "1 small" },
      { name: "Cloves", amount: "3" },
      { name: "Cardamom", amount: "2" },
      { name: "Ginger-garlic paste", amount: "1 tsp" },
      { name: "Water", amount: "2 1/4 cups" },
      { name: "Fresh coriander", amount: "2 tbsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Wash basmati rice until the water becomes mostly clear.",
      "Soak rice for 20 minutes and drain.",
      "Heat ghee in a heavy-bottomed pot.",
      "Add cumin, bay leaf, cinnamon, cloves and cardamom.",
      "Add sliced onion and sauté until lightly golden.",
      "Add ginger-garlic paste and cook briefly.",
      "Add mixed vegetables and green peas.",
      "Sauté for 3–4 minutes.",
      "Add drained rice and stir gently.",
      "Pour in water and add salt.",
      "Bring to a gentle boil.",
      "Cover and cook on low heat until the rice absorbs the water.",
      "Turn off the heat and let the rice rest for 10 minutes.",
      "Fluff gently with a fork.",
      "Garnish with fresh coriander and serve with raita."
    ],
    tips: [
      "Use good-quality aged basmati rice for separate grains.",
      "Avoid stirring repeatedly after adding water.",
      "Let the pulao rest before fluffing."
    ],
    storage: "Refrigerate promptly and consume within 2 days. Reheat until piping hot."
  },
  {
    id: 58,
    name: "Malai Kofta Curry",
    category: "indian",
    description: "Soft paneer and potato dumplings served in a luxurious creamy cashew tomato gravy.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=900",
    prepTime: "25 min",
    cookTime: "30 min",
    totalTime: "55 min",
    difficulty: "Hard",
    servings: 4,
    calories: 470,
    ingredients: [
      { name: "Paneer, grated", amount: "150 g" },
      { name: "Boiled potatoes", amount: "2 medium" },
      { name: "Cornflour", amount: "3 tbsp" },
      { name: "Cashews", amount: "15" },
      { name: "Tomatoes, chopped", amount: "3 medium" },
      { name: "Onion, chopped", amount: "1 medium" },
      { name: "Ginger-garlic paste", amount: "1 tbsp" },
      { name: "Butter", amount: "2 tbsp" },
      { name: "Fresh cream", amount: "1/4 cup" },
      { name: "Garam masala", amount: "1/2 tsp" },
      { name: "Kashmiri chilli powder", amount: "1 tsp" },
      { name: "Oil", amount: "For frying" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Mash boiled potatoes until smooth.",
      "Add grated paneer, cornflour and a little salt.",
      "Mix into a soft dough-like mixture.",
      "Divide into equal portions and shape into small balls.",
      "Heat oil in a deep pan.",
      "Fry the koftas in batches until evenly golden.",
      "Remove and drain on a plate.",
      "Soak cashews in warm water for 15 minutes.",
      "Heat butter in a separate pan.",
      "Add chopped onion and cook until soft.",
      "Add ginger-garlic paste and sauté briefly.",
      "Add tomatoes, cashews and chilli powder.",
      "Cook until the tomatoes soften completely.",
      "Cool the mixture and blend into a smooth gravy.",
      "Return the gravy to the pan and simmer gently.",
      "Add salt and garam masala.",
      "Stir in fresh cream.",
      "Place koftas in the serving dish.",
      "Pour hot gravy over the koftas just before serving.",
      "Serve with naan or pulao."
    ],
    tips: [
      "Keep the kofta mixture firm enough to hold its shape.",
      "Fry one test kofta first to check the mixture.",
      "Add koftas to the gravy just before serving so they remain intact."
    ],
    storage: "Store gravy and koftas separately in the refrigerator for up to 2 days."
  },
  {
    id: 59,
    name: "Mumbai Style Pav Bhaji",
    category: "indian",
    description: "A buttery mashed vegetable curry served with toasted pav and fresh lemon.",
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=900",
    prepTime: "20 min",
    cookTime: "30 min",
    totalTime: "50 min",
    difficulty: "Medium",
    servings: 4,
    calories: 430,
    ingredients: [
      { name: "Potatoes", amount: "3 medium" },
      { name: "Cauliflower florets", amount: "1 cup" },
      { name: "Green peas", amount: "1/2 cup" },
      { name: "Carrot, chopped", amount: "1 medium" },
      { name: "Capsicum, chopped", amount: "1 medium" },
      { name: "Onions, chopped", amount: "2 medium" },
      { name: "Tomatoes, chopped", amount: "3 medium" },
      { name: "Ginger-garlic paste", amount: "1 tbsp" },
      { name: "Pav bhaji masala", amount: "2 tbsp" },
      { name: "Kashmiri chilli powder", amount: "1 tsp" },
      { name: "Butter", amount: "3 tbsp" },
      { name: "Pav bread", amount: "8 pieces" },
      { name: "Lemon", amount: "1" },
      { name: "Fresh coriander", amount: "2 tbsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Wash and chop all vegetables.",
      "Pressure-cook potatoes, cauliflower, carrots and peas until soft.",
      "Drain excess water and reserve some cooking liquid.",
      "Mash the cooked vegetables thoroughly.",
      "Heat butter in a large flat pan.",
      "Add chopped onions and cook until translucent.",
      "Add ginger-garlic paste and sauté briefly.",
      "Add tomatoes and cook until soft.",
      "Add capsicum and cook for a few minutes.",
      "Mix in pav bhaji masala and Kashmiri chilli powder.",
      "Add the mashed vegetables.",
      "Pour in some reserved cooking liquid.",
      "Mash and stir repeatedly until the bhaji becomes thick and smooth.",
      "Add salt and a little more butter.",
      "Simmer for 5–8 minutes.",
      "Slice pav horizontally.",
      "Heat butter on a tawa and toast pav on both sides.",
      "Serve bhaji with toasted pav, chopped onion, coriander and lemon."
    ],
    tips: [
      "Mash the vegetables well for the traditional smooth texture.",
      "Adjust pav bhaji masala according to your taste.",
      "A little butter added at the end gives a rich finish."
    ],
    storage: "Refrigerate the bhaji for up to 2 days. Toast fresh pav when serving."
  },
  {
    id: 60,
    name: "Gujarati Khaman Dhokla",
    category: "indian",
    description: "Soft, fluffy and savoury steamed gram flour cakes finished with a sweet and tangy tempering.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=900",
    prepTime: "15 min",
    cookTime: "20 min",
    totalTime: "35 min",
    difficulty: "Medium",
    servings: 4,
    calories: 210,
    ingredients: [
      { name: "Besan", amount: "1 cup" },
      { name: "Semolina", amount: "1 tbsp" },
      { name: "Plain yogurt", amount: "1/4 cup" },
      { name: "Water", amount: "1/2 cup approximately" },
      { name: "Ginger-green chilli paste", amount: "1 tsp" },
      { name: "Sugar", amount: "1 tbsp" },
      { name: "Lemon juice", amount: "1 tbsp" },
      { name: "Eno fruit salt", amount: "1 tsp" },
      { name: "Salt", amount: "To taste" },
      { name: "Oil", amount: "1 tbsp" },
      { name: "Mustard seeds", amount: "1 tsp" },
      { name: "Sesame seeds", amount: "1 tsp" },
      { name: "Green chillies, slit", amount: "2" },
      { name: "Curry leaves", amount: "8" },
      { name: "Fresh coriander", amount: "2 tbsp" }
    ],
    instructions: [
      "Grease a round steaming tray with a little oil.",
      "Sift besan into a mixing bowl.",
      "Add semolina, yogurt, ginger-chilli paste, sugar and salt.",
      "Gradually add water while whisking to form a smooth batter.",
      "Add lemon juice and mix.",
      "Prepare a steamer with water and bring it to a boil.",
      "Just before steaming, add Eno fruit salt to the batter.",
      "Add a tablespoon of water over the Eno and mix gently in one direction.",
      "Immediately pour the batter into the greased tray.",
      "Place the tray in the steamer.",
      "Steam for approximately 15–20 minutes until a toothpick comes out clean.",
      "Allow it to cool slightly before cutting into squares.",
      "For the tempering, heat oil in a small pan.",
      "Add mustard seeds and allow them to crackle.",
      "Add sesame seeds, green chillies and curry leaves.",
      "Carefully add a little water, sugar and lemon juice.",
      "Pour the tempering evenly over the dhokla.",
      "Garnish with fresh coriander and serve."
    ],
    tips: [
      "Add Eno immediately before steaming.",
      "Do not overmix the batter after adding Eno.",
      "Make sure the steamer is already hot before placing the tray inside."
    ],
    storage: "Refrigerate in an airtight container for up to 2 days. Steam briefly to refresh before serving."
  }
];

// END OF PART 7 - INDIAN FOOD
const chickenRecipes = [
  {
    id: 61,
    name: "Classic Butter Chicken",
    category: "chicken",
    description: "Tender chicken pieces simmered in a rich, creamy tomato and butter gravy with aromatic Indian spices.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=900",
    prepTime: "25 mins",
    cookTime: "35 mins",
    totalTime: "60 mins",
    difficulty: "Medium",
    servings: 4,
    calories: "420 kcal",
    ingredients: [
      { name: "Boneless chicken", amount: "500 g" },
      { name: "Thick yogurt", amount: "½ cup" },
      { name: "Ginger-garlic paste", amount: "2 tbsp" },
      { name: "Kashmiri chilli powder", amount: "1 tsp" },
      { name: "Butter", amount: "3 tbsp" },
      { name: "Oil", amount: "1 tbsp" },
      { name: "Tomato puree", amount: "2 cups" },
      { name: "Fresh cream", amount: "½ cup" },
      { name: "Cashews", amount: "12 pieces" },
      { name: "Garam masala", amount: "1 tsp" },
      { name: "Kasuri methi", amount: "1 tsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Cut the chicken into medium-sized pieces.",
      "Mix yogurt, ginger-garlic paste, chilli powder and salt. Add chicken and marinate in the refrigerator for 20 minutes.",
      "Heat oil in a pan and cook the marinated chicken until browned on the outside and fully cooked inside. Set aside.",
      "Soak cashews in warm water and blend into a smooth paste.",
      "In the same pan, melt butter and add tomato puree. Cook until the mixture thickens.",
      "Add cashew paste, garam masala and salt. Simmer for 5 minutes.",
      "Add cooked chicken and stir gently.",
      "Pour in fresh cream and crush kasuri methi between your palms before adding.",
      "Simmer for another 5 minutes and serve hot."
    ],
    tips: [
      "Use Kashmiri chilli powder for a bright colour without excessive heat.",
      "Add cream gradually for a smooth gravy.",
      "Serve with naan, roti or steamed rice.",
      "Cook chicken to an internal temperature of 74°C."
    ],
    storage: "Refrigerate in an airtight container for up to 2 days. Reheat thoroughly before serving."
  },
  {
    id: 62,
    name: "Crispy Homemade Chicken Burger",
    category: "chicken",
    description: "A crunchy golden chicken fillet layered with fresh lettuce, cheese and creamy burger sauce.",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=900",
    prepTime: "25 mins",
    cookTime: "20 mins",
    totalTime: "45 mins",
    difficulty: "Medium",
    servings: 2,
    calories: "560 kcal",
    ingredients: [
      { name: "Boneless chicken breast", amount: "2 pieces" },
      { name: "Burger buns", amount: "2" },
      { name: "Buttermilk", amount: "½ cup" },
      { name: "All-purpose flour", amount: "½ cup" },
      { name: "Cornflour", amount: "¼ cup" },
      { name: "Paprika", amount: "1 tsp" },
      { name: "Garlic powder", amount: "½ tsp" },
      { name: "Black pepper", amount: "½ tsp" },
      { name: "Lettuce leaves", amount: "4" },
      { name: "Cheese slices", amount: "2" },
      { name: "Mayonnaise", amount: "3 tbsp" },
      { name: "Oil", amount: "For cooking" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Place chicken breast pieces between food-safe sheets and gently flatten to an even thickness.",
      "Season buttermilk with salt, pepper and half the paprika.",
      "Add chicken and refrigerate for 20 minutes.",
      "Mix flour, cornflour, garlic powder and remaining paprika in a bowl.",
      "Remove chicken from the marinade and coat thoroughly in the flour mixture.",
      "Cook in a suitable amount of hot oil until golden and fully cooked. Check that the centre reaches 74°C.",
      "Toast the burger buns lightly.",
      "Spread mayonnaise on both bun halves.",
      "Layer lettuce, cooked chicken and cheese on the bottom bun.",
      "Close with the top bun and serve immediately."
    ],
    tips: [
      "Cornflour helps create a crisp coating.",
      "Do not overcrowd the pan while cooking.",
      "Add sliced tomato or onion for extra freshness.",
      "Never reuse raw-chicken marinade as a sauce."
    ],
    storage: "Store cooked chicken separately in the refrigerator for up to 2 days. Assemble the burger just before serving."
  },
  {
    id: 63,
    name: "Chicken Tikka Masala",
    category: "chicken",
    description: "Juicy spiced chicken tikka pieces served in a creamy, mildly smoky tomato-based curry.",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=900",
    prepTime: "25 mins",
    cookTime: "35 mins",
    totalTime: "60 mins",
    difficulty: "Medium",
    servings: 4,
    calories: "390 kcal",
    ingredients: [
      { name: "Boneless chicken", amount: "500 g" },
      { name: "Yogurt", amount: "½ cup" },
      { name: "Ginger-garlic paste", amount: "1 tbsp" },
      { name: "Tikka masala", amount: "2 tbsp" },
      { name: "Lemon juice", amount: "1 tbsp" },
      { name: "Onion", amount: "2 medium" },
      { name: "Tomato puree", amount: "1½ cups" },
      { name: "Fresh cream", amount: "¼ cup" },
      { name: "Butter", amount: "2 tbsp" },
      { name: "Cumin powder", amount: "½ tsp" },
      { name: "Coriander powder", amount: "1 tsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Cut chicken into bite-sized cubes.",
      "Combine yogurt, ginger-garlic paste, tikka masala, lemon juice and salt.",
      "Add chicken and refrigerate for 20 minutes.",
      "Cook chicken in a pan until browned and fully cooked to 74°C internally.",
      "Heat butter in another pan and sauté finely chopped onions until golden.",
      "Add tomato puree, cumin powder and coriander powder.",
      "Cook until the gravy thickens and the raw tomato smell disappears.",
      "Add the cooked chicken and mix well.",
      "Pour in cream and simmer gently for 5 minutes.",
      "Garnish with fresh coriander and serve."
    ],
    tips: [
      "Cut chicken into evenly sized pieces for consistent cooking.",
      "Adjust chilli according to your preference.",
      "A little butter at the end adds richness.",
      "Serve with jeera rice or butter naan."
    ],
    storage: "Refrigerate in a sealed container for up to 2 days."
  },
  {
    id: 64,
    name: "Chicken Fried Rice",
    category: "chicken",
    description: "A quick Indo-Chinese style rice dish with tender chicken, vegetables, garlic and savoury sauces.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=900",
    prepTime: "15 mins",
    cookTime: "15 mins",
    totalTime: "30 mins",
    difficulty: "Easy",
    servings: 3,
    calories: "380 kcal",
    ingredients: [
      { name: "Cooked rice", amount: "3 cups, chilled" },
      { name: "Boneless chicken", amount: "200 g" },
      { name: "Carrot", amount: "½ cup, diced" },
      { name: "Capsicum", amount: "½ cup, diced" },
      { name: "Spring onions", amount: "3 tbsp" },
      { name: "Garlic", amount: "4 cloves, chopped" },
      { name: "Soy sauce", amount: "1 tbsp" },
      { name: "Vinegar", amount: "1 tsp" },
      { name: "Black pepper", amount: "½ tsp" },
      { name: "Oil", amount: "2 tbsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Cut chicken into small, even pieces.",
      "Heat oil in a wok or large pan.",
      "Add chicken and cook thoroughly until the centre reaches 74°C.",
      "Remove the cooked chicken and set aside.",
      "Add garlic, carrots and capsicum to the same pan.",
      "Stir-fry vegetables for 2–3 minutes.",
      "Add chilled cooked rice and separate any large clumps gently.",
      "Add soy sauce, vinegar, pepper and salt.",
      "Return the cooked chicken to the pan.",
      "Toss everything together over medium-high heat.",
      "Finish with spring onions and serve hot."
    ],
    tips: [
      "Chilled rice helps keep the grains separate.",
      "Use freshly cooked rice that has been cooled and refrigerated safely.",
      "Avoid adding too much soy sauce.",
      "Keep raw chicken and cooked rice utensils separate."
    ],
    storage: "Refrigerate promptly and consume within 1 day. Reheat until steaming hot."
  },
  {
    id: 65,
    name: "Creamy Garlic Chicken",
    category: "chicken",
    description: "Pan-cooked chicken in a smooth garlic cream sauce with herbs and a gentle buttery flavour.",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=900",
    prepTime: "15 mins",
    cookTime: "25 mins",
    totalTime: "40 mins",
    difficulty: "Easy",
    servings: 3,
    calories: "410 kcal",
    ingredients: [
      { name: "Boneless chicken breast", amount: "400 g" },
      { name: "Butter", amount: "2 tbsp" },
      { name: "Olive oil", amount: "1 tbsp" },
      { name: "Garlic", amount: "6 cloves, minced" },
      { name: "Fresh cream", amount: "¾ cup" },
      { name: "Milk", amount: "¼ cup" },
      { name: "Mixed herbs", amount: "1 tsp" },
      { name: "Black pepper", amount: "½ tsp" },
      { name: "Grated parmesan", amount: "¼ cup" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Pat chicken dry and season with salt and black pepper.",
      "Heat olive oil and half the butter in a pan.",
      "Cook chicken on both sides until golden and fully cooked to 74°C internally.",
      "Transfer chicken to a clean plate.",
      "Add remaining butter and minced garlic to the pan.",
      "Cook garlic gently for about 30 seconds without burning it.",
      "Pour in cream and milk, stirring continuously.",
      "Add mixed herbs and parmesan.",
      "Simmer until the sauce becomes slightly thick.",
      "Return chicken to the pan and coat with sauce.",
      "Serve warm with pasta, rice or toasted bread."
    ],
    tips: [
      "Keep garlic on medium-low heat to prevent bitterness.",
      "Add a splash of milk if the sauce becomes too thick.",
      "Fresh parsley makes a good garnish.",
      "Use a food thermometer to check chicken doneness."
    ],
    storage: "Refrigerate for up to 2 days in an airtight container."
  },
  {
    id: 66,
    name: "Chicken Seekh Kebabs",
    category: "chicken",
    description: "Juicy Indian-style minced chicken kebabs seasoned with fresh herbs, ginger, garlic and warm spices.",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=900",
    prepTime: "20 mins",
    cookTime: "20 mins",
    totalTime: "40 mins",
    difficulty: "Medium",
    servings: 4,
    calories: "260 kcal",
    ingredients: [
      { name: "Minced chicken", amount: "500 g" },
      { name: "Onion", amount: "1 small, finely chopped" },
      { name: "Ginger-garlic paste", amount: "1 tbsp" },
      { name: "Green chilli", amount: "1, chopped" },
      { name: "Fresh coriander", amount: "¼ cup, chopped" },
      { name: "Mint leaves", amount: "2 tbsp, chopped" },
      { name: "Garam masala", amount: "1 tsp" },
      { name: "Cumin powder", amount: "½ tsp" },
      { name: "Breadcrumbs", amount: "¼ cup" },
      { name: "Lemon juice", amount: "1 tbsp" },
      { name: "Oil", amount: "1 tbsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Place minced chicken in a large mixing bowl.",
      "Add onion, ginger-garlic paste, green chilli, coriander and mint.",
      "Add garam masala, cumin powder, lemon juice and salt.",
      "Mix in breadcrumbs until the mixture holds its shape.",
      "Refrigerate for 15 minutes.",
      "Divide the mixture into equal portions.",
      "Shape each portion into an elongated kebab using clean hands.",
      "Place on a lightly greased baking tray or cook in a covered pan.",
      "Turn occasionally and cook until the centre reaches 74°C.",
      "Serve with mint chutney and sliced onions."
    ],
    tips: [
      "Avoid adding excess moisture to the minced chicken mixture.",
      "Chilling helps the kebabs hold their shape.",
      "Use an oven or stovetop pan as preferred.",
      "Never taste the mixture before it is cooked."
    ],
    storage: "Refrigerate cooked kebabs for up to 2 days."
  },
  {
    id: 67,
    name: "Chicken Alfredo Pasta",
    category: "chicken",
    description: "Classic creamy Alfredo pasta combined with seasoned chicken strips and parmesan cheese.",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=900",
    prepTime: "15 mins",
    cookTime: "25 mins",
    totalTime: "40 mins",
    difficulty: "Easy",
    servings: 3,
    calories: "520 kcal",
    ingredients: [
      { name: "Penne or fettuccine pasta", amount: "250 g" },
      { name: "Boneless chicken breast", amount: "250 g" },
      { name: "Butter", amount: "2 tbsp" },
      { name: "Garlic", amount: "4 cloves, minced" },
      { name: "Fresh cream", amount: "1 cup" },
      { name: "Milk", amount: "¼ cup" },
      { name: "Parmesan cheese", amount: "½ cup" },
      { name: "Black pepper", amount: "½ tsp" },
      { name: "Mixed herbs", amount: "1 tsp" },
      { name: "Olive oil", amount: "1 tbsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Boil pasta in salted water according to packet instructions.",
      "Reserve half a cup of pasta water and drain the pasta.",
      "Cut chicken into strips and season with salt and pepper.",
      "Heat olive oil in a pan and cook chicken until fully cooked to 74°C internally.",
      "Remove chicken and melt butter in the same pan.",
      "Add garlic and cook briefly.",
      "Pour in cream and milk, then stir gently.",
      "Add parmesan, mixed herbs and black pepper.",
      "Add cooked pasta and mix until coated.",
      "Return chicken to the pan.",
      "Use reserved pasta water a little at a time to adjust the sauce consistency.",
      "Serve immediately with extra parmesan."
    ],
    tips: [
      "Do not overcook pasta; keep it slightly firm.",
      "Add cheese over low heat for a smoother sauce.",
      "Use freshly grated parmesan for better flavour.",
      "Keep raw-chicken preparation separate from cooked pasta."
    ],
    storage: "Refrigerate for up to 2 days. Add a little milk when reheating."
  },
  {
    id: 68,
    name: "Honey Garlic Chicken",
    category: "chicken",
    description: "Tender chicken pieces coated in a glossy sweet-and-savoury honey garlic sauce.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=900",
    prepTime: "15 mins",
    cookTime: "20 mins",
    totalTime: "35 mins",
    difficulty: "Easy",
    servings: 3,
    calories: "350 kcal",
    ingredients: [
      { name: "Boneless chicken", amount: "400 g" },
      { name: "Cornflour", amount: "2 tbsp" },
      { name: "Honey", amount: "3 tbsp" },
      { name: "Soy sauce", amount: "2 tbsp" },
      { name: "Garlic", amount: "5 cloves, minced" },
      { name: "Vinegar", amount: "1 tbsp" },
      { name: "Black pepper", amount: "½ tsp" },
      { name: "Oil", amount: "2 tbsp" },
      { name: "Water", amount: "¼ cup" },
      { name: "Spring onions", amount: "2 tbsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Cut chicken into bite-sized pieces.",
      "Season lightly with salt and pepper.",
      "Coat chicken pieces with cornflour.",
      "Heat oil in a pan and cook chicken until golden and fully cooked to 74°C internally.",
      "Transfer cooked chicken to a clean plate.",
      "In the same pan, add garlic and cook briefly.",
      "Add honey, soy sauce, vinegar and water.",
      "Stir and simmer until the sauce starts to thicken.",
      "Return chicken to the pan and toss until coated.",
      "Garnish with spring onions and serve with rice."
    ],
    tips: [
      "Adjust honey and vinegar to balance sweetness and tanginess.",
      "Keep the sauce on medium heat so the honey does not burn.",
      "Add sesame seeds for extra texture.",
      "Serve immediately for the best coating."
    ],
    storage: "Refrigerate in an airtight container for up to 2 days."
  },
  {
    id: 69,
    name: "Chicken Biryani",
    category: "chicken",
    description: "Aromatic layered basmati rice and spiced chicken cooked with fried onions, herbs and fragrant whole spices.",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=900",
    prepTime: "30 mins",
    cookTime: "45 mins",
    totalTime: "75 mins",
    difficulty: "Hard",
    servings: 5,
    calories: "490 kcal",
    ingredients: [
      { name: "Chicken pieces", amount: "600 g" },
      { name: "Basmati rice", amount: "2 cups" },
      { name: "Yogurt", amount: "½ cup" },
      { name: "Onions", amount: "3 large, sliced" },
      { name: "Ginger-garlic paste", amount: "2 tbsp" },
      { name: "Biryani masala", amount: "2 tbsp" },
      { name: "Mint leaves", amount: "¼ cup" },
      { name: "Fresh coriander", amount: "¼ cup" },
      { name: "Green chillies", amount: "2" },
      { name: "Whole spices", amount: "1 small cinnamon stick, 3 cloves, 2 cardamoms" },
      { name: "Ghee", amount: "3 tbsp" },
      { name: "Lemon juice", amount: "1 tbsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Wash basmati rice and soak it for 20 minutes.",
      "Mix chicken with yogurt, ginger-garlic paste, biryani masala, lemon juice and salt.",
      "Refrigerate the marinated chicken for 20 minutes.",
      "Heat ghee in a heavy-bottomed pot and cook sliced onions until golden. Remove some for layering.",
      "Add marinated chicken to the pot and cook until the outside changes colour.",
      "Add mint, coriander and green chillies.",
      "In a separate pot, boil water with whole spices and salt.",
      "Add soaked rice and cook until it is about 70% done. Drain carefully.",
      "Layer the partially cooked rice over the chicken.",
      "Add reserved fried onions and a little ghee on top.",
      "Cover tightly and cook on low heat until the rice is tender and chicken reaches 74°C internally.",
      "Rest for 10 minutes before gently mixing and serving."
    ],
    tips: [
      "Use long-grain basmati rice for a fragrant result.",
      "Do not overcook rice before layering.",
      "Keep the pot covered during the final cooking stage.",
      "Check chicken doneness separately with a food thermometer."
    ],
    storage: "Cool promptly, refrigerate in a shallow airtight container and consume within 1 day. Reheat thoroughly."
  },
  {
    id: 70,
    name: "Lemon Herb Grilled Chicken",
    category: "chicken",
    description: "Fresh and flavourful grilled chicken marinated with lemon, garlic, olive oil and aromatic herbs.",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=900",
    prepTime: "20 mins",
    cookTime: "20 mins",
    totalTime: "40 mins",
    difficulty: "Easy",
    servings: 3,
    calories: "290 kcal",
    ingredients: [
      { name: "Boneless chicken breast", amount: "400 g" },
      { name: "Olive oil", amount: "2 tbsp" },
      { name: "Lemon juice", amount: "2 tbsp" },
      { name: "Garlic", amount: "4 cloves, minced" },
      { name: "Dried oregano", amount: "1 tsp" },
      { name: "Dried thyme", amount: "½ tsp" },
      { name: "Paprika", amount: "½ tsp" },
      { name: "Black pepper", amount: "½ tsp" },
      { name: "Fresh parsley", amount: "2 tbsp, chopped" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Place chicken breast between food-safe sheets and gently flatten to an even thickness.",
      "In a bowl, mix olive oil, lemon juice, garlic, oregano, thyme, paprika, pepper and salt.",
      "Coat chicken with the marinade and refrigerate for 15 minutes.",
      "Preheat a grill pan or suitable cooking pan.",
      "Place chicken on the hot pan and cook on one side until lightly browned.",
      "Turn and cook the other side until the thickest part reaches 74°C internally.",
      "Transfer to a clean plate and rest for 5 minutes.",
      "Slice the chicken and sprinkle with fresh parsley.",
      "Serve with roasted vegetables, salad or rice."
    ],
    tips: [
      "Avoid marinating chicken at room temperature.",
      "Use a food thermometer to confirm safe cooking.",
      "Resting helps the chicken remain juicy.",
      "Add extra lemon juice just before serving for freshness."
    ],
    storage: "Refrigerate cooked chicken in an airtight container for up to 2 days."
  }
];

// END OF PART 8 - CHICKEN
const asianRecipes = [
  {
    id: 71,
    name: "Classic Vegetable Hakka Noodles",
    category: "asian",
    description: "Street-style Indo-Chinese noodles tossed with crunchy vegetables, garlic and savoury sauces.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=900",
    prepTime: "15 mins",
    cookTime: "15 mins",
    totalTime: "30 mins",
    difficulty: "Easy",
    servings: 3,
    calories: "340 kcal",
    ingredients: [
      { name: "Hakka noodles", amount: "250 g" },
      { name: "Cabbage", amount: "1 cup, shredded" },
      { name: "Carrot", amount: "1 medium, julienned" },
      { name: "Capsicum", amount: "1 medium, sliced" },
      { name: "Spring onions", amount: "3 tbsp, chopped" },
      { name: "Garlic", amount: "5 cloves, minced" },
      { name: "Soy sauce", amount: "1 tbsp" },
      { name: "Chilli sauce", amount: "1 tbsp" },
      { name: "Vinegar", amount: "1 tsp" },
      { name: "Black pepper", amount: "½ tsp" },
      { name: "Oil", amount: "2 tbsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Boil noodles in plenty of water according to the packet instructions.",
      "Drain the noodles and rinse briefly with cool water.",
      "Toss noodles with a little oil to prevent sticking.",
      "Heat oil in a large wok or pan.",
      "Add garlic and the white parts of spring onions.",
      "Add carrot, cabbage and capsicum.",
      "Stir-fry vegetables over high heat for 2–3 minutes while keeping them slightly crunchy.",
      "Add soy sauce, chilli sauce, vinegar and black pepper.",
      "Add boiled noodles and toss gently until evenly coated.",
      "Taste and adjust salt if required.",
      "Finish with green spring onions and serve hot."
    ],
    tips: [
      "Do not overboil the noodles.",
      "Prepare all vegetables before heating the wok.",
      "Cook in batches if your pan is small.",
      "Add extra chilli sauce for a spicier version."
    ],
    storage: "Refrigerate in an airtight container for up to 2 days."
  },
  {
    id: 72,
    name: "Japanese Vegetable Sushi Rolls",
    category: "asian",
    description: "Fresh homemade sushi rolls filled with cucumber, carrot and avocado, wrapped in seasoned rice and nori.",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900",
    prepTime: "35 mins",
    cookTime: "20 mins",
    totalTime: "55 mins",
    difficulty: "Medium",
    servings: 3,
    calories: "280 kcal",
    ingredients: [
      { name: "Japanese short-grain rice", amount: "1½ cups" },
      { name: "Water", amount: "1¾ cups" },
      { name: "Rice vinegar", amount: "3 tbsp" },
      { name: "Sugar", amount: "1 tbsp" },
      { name: "Salt", amount: "½ tsp" },
      { name: "Nori sheets", amount: "4" },
      { name: "Cucumber", amount: "1 medium, thin strips" },
      { name: "Carrot", amount: "1 medium, thin strips" },
      { name: "Avocado", amount: "1 medium, sliced" },
      { name: "Sesame seeds", amount: "1 tbsp" },
      { name: "Soy sauce", amount: "For serving" }
    ],
    instructions: [
      "Rinse the rice several times until the water becomes mostly clear.",
      "Cook rice with water according to the rice packet instructions.",
      "Mix rice vinegar, sugar and salt until dissolved.",
      "Transfer cooked rice to a wide bowl and gently fold in the vinegar mixture.",
      "Allow rice to cool until comfortable to handle.",
      "Place a nori sheet on a clean bamboo sushi mat with the rough side facing upward.",
      "Spread a thin, even layer of rice over the nori, leaving a small border at the top.",
      "Arrange cucumber, carrot and avocado in a line across the lower third.",
      "Roll tightly using the bamboo mat.",
      "Lightly wet the exposed nori edge to seal the roll.",
      "Cut into bite-sized pieces using a sharp, slightly damp knife.",
      "Sprinkle sesame seeds and serve with soy sauce."
    ],
    tips: [
      "Use short-grain sushi rice for the right texture.",
      "Avoid adding too much filling or the roll may open.",
      "Wipe the knife between cuts for neat slices.",
      "Use clean utensils and refrigerate prepared sushi promptly."
    ],
    storage: "Best eaten fresh. Refrigerate promptly and consume the same day."
  },
  {
    id: 73,
    name: "Thai Vegetable Red Curry",
    category: "asian",
    description: "A fragrant Thai-inspired coconut curry filled with colourful vegetables and aromatic red curry flavours.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=900",
    prepTime: "15 mins",
    cookTime: "25 mins",
    totalTime: "40 mins",
    difficulty: "Medium",
    servings: 4,
    calories: "360 kcal",
    ingredients: [
      { name: "Coconut milk", amount: "400 ml" },
      { name: "Thai red curry paste", amount: "2 tbsp" },
      { name: "Broccoli", amount: "1 cup, florets" },
      { name: "Carrot", amount: "1 medium, sliced" },
      { name: "Red bell pepper", amount: "1 medium, sliced" },
      { name: "Baby corn", amount: "½ cup" },
      { name: "Mushrooms", amount: "½ cup, sliced" },
      { name: "Soy sauce", amount: "1 tbsp" },
      { name: "Brown sugar", amount: "1 tsp" },
      { name: "Lime juice", amount: "1 tbsp" },
      { name: "Fresh basil", amount: "¼ cup" },
      { name: "Oil", amount: "1 tbsp" }
    ],
    instructions: [
      "Wash and prepare all vegetables.",
      "Heat oil in a deep pan over medium heat.",
      "Add Thai red curry paste and stir for about one minute.",
      "Pour in half the coconut milk and mix until smooth.",
      "Add carrots and baby corn, then simmer for 4 minutes.",
      "Add broccoli, mushrooms and bell pepper.",
      "Pour in the remaining coconut milk.",
      "Add soy sauce and brown sugar.",
      "Simmer gently until vegetables are tender but not mushy.",
      "Turn off the heat and add lime juice.",
      "Stir in fresh basil leaves.",
      "Serve hot with steamed jasmine rice."
    ],
    tips: [
      "Check the curry paste ingredients if you want a vegetarian version.",
      "Adjust curry paste according to your spice preference.",
      "Avoid boiling coconut milk too aggressively.",
      "Add tofu for extra protein."
    ],
    storage: "Refrigerate in an airtight container for up to 2 days."
  },
  {
    id: 74,
    name: "Korean Vegetable Fried Rice",
    category: "asian",
    description: "A colourful Korean-inspired rice bowl with vegetables, garlic, sesame oil and a flavourful gochujang sauce.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=900",
    prepTime: "15 mins",
    cookTime: "15 mins",
    totalTime: "30 mins",
    difficulty: "Easy",
    servings: 2,
    calories: "390 kcal",
    ingredients: [
      { name: "Cooked rice", amount: "2½ cups, chilled" },
      { name: "Carrot", amount: "½ cup, diced" },
      { name: "Green peas", amount: "½ cup" },
      { name: "Spring onions", amount: "3 tbsp" },
      { name: "Garlic", amount: "3 cloves, minced" },
      { name: "Gochujang", amount: "1 tbsp" },
      { name: "Soy sauce", amount: "1 tbsp" },
      { name: "Sesame oil", amount: "1 tsp" },
      { name: "Sesame seeds", amount: "1 tsp" },
      { name: "Cooking oil", amount: "1 tbsp" }
    ],
    instructions: [
      "Prepare chilled cooked rice and break apart large clumps.",
      "Heat cooking oil in a wok or large frying pan.",
      "Add garlic and the white parts of spring onions.",
      "Add diced carrots and green peas.",
      "Stir-fry vegetables until just tender.",
      "Mix gochujang with soy sauce in a small bowl.",
      "Add the sauce mixture to the vegetables.",
      "Add cooked rice and toss until evenly coated.",
      "Drizzle sesame oil over the rice.",
      "Cook for another 2 minutes while stirring.",
      "Garnish with sesame seeds and green spring onions.",
      "Serve warm."
    ],
    tips: [
      "Start with a small amount of gochujang and adjust to taste.",
      "Use chilled rice for a better fried-rice texture.",
      "Add mushrooms or tofu for variety.",
      "Gochujang may contain ingredients that vary by brand, so check its label."
    ],
    storage: "Refrigerate promptly and consume within 1 day."
  },
  {
    id: 75,
    name: "Japanese Chicken Teriyaki",
    category: "asian",
    description: "Tender glazed chicken coated in a homemade sweet and savoury teriyaki-style sauce.",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=900",
    prepTime: "15 mins",
    cookTime: "20 mins",
    totalTime: "35 mins",
    difficulty: "Easy",
    servings: 3,
    calories: "370 kcal",
    ingredients: [
      { name: "Boneless chicken thighs", amount: "450 g" },
      { name: "Soy sauce", amount: "¼ cup" },
      { name: "Honey", amount: "2 tbsp" },
      { name: "Brown sugar", amount: "1 tbsp" },
      { name: "Ginger", amount: "1 tsp, grated" },
      { name: "Garlic", amount: "3 cloves, minced" },
      { name: "Rice vinegar", amount: "1 tbsp" },
      { name: "Cornflour", amount: "1 tsp" },
      { name: "Water", amount: "2 tbsp" },
      { name: "Sesame seeds", amount: "1 tsp" },
      { name: "Spring onions", amount: "2 tbsp" },
      { name: "Oil", amount: "1 tbsp" }
    ],
    instructions: [
      "Pat chicken dry and cut into evenly sized pieces.",
      "Mix soy sauce, honey, brown sugar, ginger, garlic and rice vinegar.",
      "Heat oil in a pan over medium heat.",
      "Add chicken and cook until browned on both sides.",
      "Continue cooking until the thickest piece reaches an internal temperature of 74°C.",
      "Mix cornflour with water in a small bowl.",
      "Pour the prepared sauce into the pan.",
      "Add the cornflour mixture and stir gently.",
      "Simmer until the sauce becomes glossy and coats the chicken.",
      "Turn off the heat and garnish with sesame seeds and spring onions.",
      "Serve with steamed rice and vegetables."
    ],
    tips: [
      "Cut chicken into similar-sized pieces for even cooking.",
      "Keep the sauce at a gentle simmer to avoid burning the honey.",
      "Add extra ginger for a stronger flavour.",
      "Never use utensils that touched raw chicken for serving cooked food."
    ],
    storage: "Refrigerate in an airtight container for up to 2 days."
  },
  {
    id: 76,
    name: "Chinese Vegetable Manchurian",
    category: "asian",
    description: "Crispy vegetable balls tossed in a rich Indo-Chinese garlic, soy and spring onion gravy.",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=900",
    prepTime: "25 mins",
    cookTime: "25 mins",
    totalTime: "50 mins",
    difficulty: "Medium",
    servings: 4,
    calories: "320 kcal",
    ingredients: [
      { name: "Cabbage", amount: "1 cup, finely grated" },
      { name: "Carrot", amount: "½ cup, grated" },
      { name: "Capsicum", amount: "¼ cup, finely chopped" },
      { name: "All-purpose flour", amount: "¼ cup" },
      { name: "Cornflour", amount: "¼ cup" },
      { name: "Garlic", amount: "5 cloves, minced" },
      { name: "Ginger", amount: "1 tsp, minced" },
      { name: "Soy sauce", amount: "2 tbsp" },
      { name: "Chilli sauce", amount: "1 tbsp" },
      { name: "Tomato ketchup", amount: "2 tbsp" },
      { name: "Spring onions", amount: "3 tbsp" },
      { name: "Water", amount: "1 cup" },
      { name: "Oil", amount: "For cooking" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Place grated cabbage, carrot and capsicum in a mixing bowl.",
      "Add flour, cornflour and salt.",
      "Mix until the vegetables hold together when shaped. Avoid adding water unless necessary.",
      "Shape into small, even balls.",
      "Cook the balls in a suitable amount of hot oil until golden and cooked through. Alternatively, bake or air-fry with a little oil.",
      "Place cooked balls on a clean plate.",
      "Heat a little oil in another pan.",
      "Add garlic, ginger and the white parts of spring onions.",
      "Add soy sauce, chilli sauce and tomato ketchup.",
      "Pour in water and bring the sauce to a gentle simmer.",
      "Mix a little cornflour with water separately and stir it into the sauce if you want a thicker gravy.",
      "Add the vegetable balls and toss gently.",
      "Garnish with green spring onions and serve."
    ],
    tips: [
      "Squeeze excess moisture from the vegetables if the mixture is too wet.",
      "Make the balls similar in size for even cooking.",
      "Add the balls just before serving to retain some crispness.",
      "For dry Manchurian, use less water in the sauce."
    ],
    storage: "Store the cooked balls and gravy separately in the refrigerator for up to 2 days."
  },
  {
    id: 77,
    name: "Thai Basil Chicken",
    category: "asian",
    description: "A popular Thai-inspired stir-fry featuring chicken, garlic, chilli, savoury sauce and fresh basil.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=900",
    prepTime: "15 mins",
    cookTime: "15 mins",
    totalTime: "30 mins",
    difficulty: "Easy",
    servings: 3,
    calories: "330 kcal",
    ingredients: [
      { name: "Boneless chicken", amount: "400 g, finely chopped" },
      { name: "Garlic", amount: "5 cloves, minced" },
      { name: "Red chilli", amount: "1, finely chopped" },
      { name: "Onion", amount: "1 small, sliced" },
      { name: "Capsicum", amount: "½ cup, sliced" },
      { name: "Soy sauce", amount: "1 tbsp" },
      { name: "Oyster-style vegetarian sauce", amount: "1 tbsp" },
      { name: "Brown sugar", amount: "1 tsp" },
      { name: "Water", amount: "2 tbsp" },
      { name: "Fresh basil leaves", amount: "1 cup" },
      { name: "Oil", amount: "1 tbsp" }
    ],
    instructions: [
      "Cut chicken into small, evenly sized pieces.",
      "Mix soy sauce, vegetarian oyster-style sauce, brown sugar and water.",
      "Heat oil in a wok over medium-high heat.",
      "Add garlic and chilli and stir briefly.",
      "Add chicken and stir-fry until fully cooked to 74°C internally.",
      "Add onion and capsicum.",
      "Pour in the prepared sauce.",
      "Toss everything together until the sauce coats the chicken.",
      "Turn off the heat and add fresh basil leaves.",
      "Stir until the basil begins to wilt.",
      "Serve immediately with steamed rice."
    ],
    tips: [
      "Use Thai holy basil if available; regular basil is a substitute.",
      "Adjust chilli according to your taste.",
      "Prepare the sauce before starting to cook.",
      "Check sauce labels if you need a vegetarian oyster-style alternative."
    ],
    storage: "Refrigerate promptly and consume within 2 days."
  },
  {
    id: 78,
    name: "Japanese Vegetable Ramen",
    category: "asian",
    description: "A comforting bowl of Japanese-inspired noodles in a savoury vegetable broth with mushrooms and greens.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=900",
    prepTime: "20 mins",
    cookTime: "25 mins",
    totalTime: "45 mins",
    difficulty: "Medium",
    servings: 3,
    calories: "350 kcal",
    ingredients: [
      { name: "Ramen noodles", amount: "250 g" },
      { name: "Vegetable stock", amount: "5 cups" },
      { name: "Mushrooms", amount: "1 cup, sliced" },
      { name: "Baby spinach", amount: "1 cup" },
      { name: "Carrot", amount: "1 medium, sliced" },
      { name: "Spring onions", amount: "3 tbsp" },
      { name: "Garlic", amount: "3 cloves, minced" },
      { name: "Ginger", amount: "1 tbsp, grated" },
      { name: "Soy sauce", amount: "2 tbsp" },
      { name: "Sesame oil", amount: "1 tsp" },
      { name: "Tofu", amount: "150 g, cubed" },
      { name: "Sesame seeds", amount: "1 tsp" }
    ],
    instructions: [
      "Cook ramen noodles according to the packet instructions.",
      "Drain the noodles and set aside.",
      "Heat sesame oil in a saucepan.",
      "Add garlic and ginger and cook briefly.",
      "Add mushrooms and carrots.",
      "Pour in vegetable stock and soy sauce.",
      "Bring to a gentle boil and simmer until the carrots are tender.",
      "Add tofu and cook for 3 minutes.",
      "Stir in baby spinach until wilted.",
      "Divide cooked noodles between serving bowls.",
      "Pour hot broth and vegetables over the noodles.",
      "Garnish with spring onions and sesame seeds."
    ],
    tips: [
      "Use a good-quality vegetable stock for a richer broth.",
      "Cook noodles separately to prevent them from becoming too soft.",
      "Add corn, bok choy or edamame for variety.",
      "Check that the ramen noodles do not contain unwanted animal-derived ingredients."
    ],
    storage: "Store broth and noodles separately in the refrigerator for up to 2 days."
  },
  {
    id: 79,
    name: "Crispy Chilli Potato",
    category: "asian",
    description: "Golden potato fingers tossed in a spicy, sweet and tangy Indo-Chinese garlic sauce.",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=900",
    prepTime: "20 mins",
    cookTime: "25 mins",
    totalTime: "45 mins",
    difficulty: "Medium",
    servings: 3,
    calories: "310 kcal",
    ingredients: [
      { name: "Potatoes", amount: "4 medium" },
      { name: "Cornflour", amount: "4 tbsp" },
      { name: "All-purpose flour", amount: "2 tbsp" },
      { name: "Garlic", amount: "5 cloves, minced" },
      { name: "Green chilli", amount: "2, sliced" },
      { name: "Soy sauce", amount: "1 tbsp" },
      { name: "Chilli sauce", amount: "1 tbsp" },
      { name: "Tomato ketchup", amount: "2 tbsp" },
      { name: "Vinegar", amount: "1 tsp" },
      { name: "Sesame seeds", amount: "1 tsp" },
      { name: "Spring onions", amount: "2 tbsp" },
      { name: "Oil", amount: "For cooking" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Peel potatoes and cut them into evenly sized fingers.",
      "Rinse the potato fingers to remove excess surface starch.",
      "Boil them for 3–4 minutes until slightly tender but not falling apart.",
      "Drain and allow them to cool.",
      "Mix cornflour, all-purpose flour and salt in a bowl.",
      "Coat the potato fingers with the flour mixture.",
      "Cook until golden and crisp using a suitable amount of hot oil, or bake or air-fry with a little oil.",
      "Heat a little oil in a separate pan.",
      "Add garlic and green chilli.",
      "Add soy sauce, chilli sauce, ketchup and vinegar.",
      "Add a splash of water and stir until the sauce is smooth.",
      "Add the crispy potatoes and toss quickly.",
      "Finish with sesame seeds and spring onions.",
      "Serve immediately."
    ],
    tips: [
      "Dry potatoes well before coating.",
      "Do not overcrowd the pan while cooking.",
      "Toss with sauce just before serving to maintain crispness.",
      "Adjust chilli sauce for a milder version."
    ],
    storage: "Best served fresh. Store leftover sauce separately in the refrigerator."
  },
  {
    id: 80,
    name: "Japanese Chicken Katsu Curry",
    category: "asian",
    description: "Crispy breaded chicken served with a rich, mildly spiced Japanese-style curry sauce and steamed rice.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=900",
    prepTime: "25 mins",
    cookTime: "35 mins",
    totalTime: "60 mins",
    difficulty: "Medium",
    servings: 3,
    calories: "590 kcal",
    ingredients: [
      { name: "Boneless chicken breast", amount: "3 pieces" },
      { name: "All-purpose flour", amount: "½ cup" },
      { name: "Egg", amount: "1, beaten" },
      { name: "Panko breadcrumbs", amount: "1 cup" },
      { name: "Onion", amount: "1 large, chopped" },
      { name: "Carrot", amount: "1 medium, diced" },
      { name: "Potato", amount: "1 medium, diced" },
      { name: "Japanese curry roux", amount: "3 cubes" },
      { name: "Vegetable stock", amount: "2 cups" },
      { name: "Soy sauce", amount: "1 tsp" },
      { name: "Oil", amount: "For cooking" },
      { name: "Cooked rice", amount: "3 servings" },
      { name: "Salt and pepper", amount: "To taste" }
    ],
    instructions: [
      "Prepare the curry sauce first by heating a little oil in a saucepan.",
      "Add chopped onion and cook until softened.",
      "Add carrot and potato, then stir for 2 minutes.",
      "Pour in vegetable stock and simmer until the vegetables are tender.",
      "Add Japanese curry roux cubes and stir until completely dissolved.",
      "Add soy sauce and simmer until the curry thickens.",
      "Flatten chicken breast pieces to an even thickness.",
      "Season with salt and pepper.",
      "Coat each piece in flour, then beaten egg, then panko breadcrumbs.",
      "Cook chicken in a suitable amount of hot oil until golden and the centre reaches 74°C internally.",
      "Rest the cooked chicken briefly on a clean plate.",
      "Slice the chicken into strips.",
      "Serve over steamed rice with the warm curry sauce alongside.",
      "Enjoy immediately."
    ],
    tips: [
      "Use panko breadcrumbs for a light, crunchy coating.",
      "Stir curry frequently so it does not stick to the pan.",
      "Check curry roux labels for ingredients and allergens.",
      "Keep raw chicken preparation separate from cooked food."
    ],
    storage: "Refrigerate curry and cooked chicken separately for up to 2 days. Reheat thoroughly."
  }
];

// END OF PART 9 - ASIAN FOOD
const snackRecipes = [
  {
    id: 81,
    name: "Classic Crispy French Fries",
    category: "snacks",
    description: "Golden, crunchy homemade potato fries with a soft centre and perfectly seasoned exterior.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900",
    prepTime: "20 mins",
    cookTime: "20 mins",
    totalTime: "40 mins",
    difficulty: "Easy",
    servings: 3,
    calories: "290 kcal",
    ingredients: [
      { name: "Large potatoes", amount: "4" },
      { name: "Cornflour", amount: "2 tbsp" },
      { name: "Salt", amount: "To taste" },
      { name: "Black pepper", amount: "½ tsp" },
      { name: "Paprika", amount: "½ tsp" },
      { name: "Oil", amount: "For cooking" }
    ],
    instructions: [
      "Peel the potatoes and cut them into evenly sized long strips.",
      "Rinse the strips in cold water to remove excess starch.",
      "Soak them in cold water for 15 minutes.",
      "Drain and pat completely dry with a clean kitchen towel.",
      "Lightly coat the potato strips with cornflour.",
      "Cook in a suitable amount of hot oil in small batches until golden and crisp.",
      "Alternatively, toss with oil and bake or air-fry until crisp, turning halfway.",
      "Transfer to a clean plate lined with paper towels if deep-fried.",
      "Season immediately with salt, pepper and paprika.",
      "Serve hot with tomato ketchup or mayonnaise."
    ],
    tips: [
      "Choose starchy potatoes for a crispier texture.",
      "Dry the potatoes properly before cooking.",
      "Avoid overcrowding the pan or air fryer.",
      "Season fries while they are still hot."
    ],
    storage: "Best served fresh. Store leftovers in the refrigerator for up to 1 day and reheat until hot."
  },
  {
    id: 82,
    name: "Paneer Tikka Bites",
    category: "snacks",
    description: "Soft paneer cubes coated in a spiced yogurt marinade and grilled with colourful vegetables.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=900",
    prepTime: "20 mins",
    cookTime: "15 mins",
    totalTime: "35 mins",
    difficulty: "Easy",
    servings: 3,
    calories: "280 kcal",
    ingredients: [
      { name: "Paneer", amount: "300 g, cubed" },
      { name: "Thick yogurt", amount: "½ cup" },
      { name: "Ginger-garlic paste", amount: "1 tbsp" },
      { name: "Kashmiri chilli powder", amount: "1 tsp" },
      { name: "Turmeric powder", amount: "¼ tsp" },
      { name: "Garam masala", amount: "½ tsp" },
      { name: "Gram flour", amount: "1 tbsp" },
      { name: "Lemon juice", amount: "1 tbsp" },
      { name: "Capsicum", amount: "1, cubed" },
      { name: "Onion", amount: "1, cubed" },
      { name: "Oil", amount: "1 tbsp" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Whisk yogurt in a mixing bowl until smooth.",
      "Add ginger-garlic paste, chilli powder, turmeric, garam masala, gram flour, lemon juice and salt.",
      "Mix until a thick marinade forms.",
      "Add paneer cubes, capsicum and onion.",
      "Coat everything gently with the marinade.",
      "Refrigerate for 15 minutes.",
      "Thread paneer and vegetables onto skewers or arrange them on a lined baking tray.",
      "Brush lightly with oil.",
      "Grill in a preheated oven or cook on a grill pan, turning occasionally.",
      "Cook until the vegetables soften slightly and the paneer develops golden spots.",
      "Serve with mint chutney and lemon wedges."
    ],
    tips: [
      "Use firm paneer so the cubes hold their shape.",
      "Do not overcook paneer or it may become rubbery.",
      "Add a little roasted besan for a thicker marinade.",
      "Use wooden skewers only after soaking them in water."
    ],
    storage: "Refrigerate cooked paneer tikka in an airtight container for up to 2 days."
  },
  {
    id: 83,
    name: "Classic Vegetable Samosa",
    category: "snacks",
    description: "Crispy triangular pastry filled with a delicious spiced potato and green pea mixture.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=900",
    prepTime: "35 mins",
    cookTime: "25 mins",
    totalTime: "60 mins",
    difficulty: "Medium",
    servings: 8,
    calories: "210 kcal",
    ingredients: [
      { name: "All-purpose flour", amount: "2 cups" },
      { name: "Oil for dough", amount: "4 tbsp" },
      { name: "Water", amount: "As needed" },
      { name: "Potatoes", amount: "3 medium, boiled" },
      { name: "Green peas", amount: "½ cup" },
      { name: "Green chilli", amount: "1, chopped" },
      { name: "Ginger", amount: "1 tsp, grated" },
      { name: "Cumin seeds", amount: "1 tsp" },
      { name: "Coriander powder", amount: "1 tsp" },
      { name: "Garam masala", amount: "½ tsp" },
      { name: "Amchur powder", amount: "½ tsp" },
      { name: "Fresh coriander", amount: "2 tbsp" },
      { name: "Oil", amount: "For cooking" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Combine flour, salt and 4 tablespoons of oil in a large bowl.",
      "Rub the oil into the flour until the mixture resembles coarse crumbs.",
      "Add water gradually and knead into a firm dough.",
      "Cover and rest the dough for 20 minutes.",
      "Heat a little oil in a pan and add cumin seeds.",
      "Add ginger and green chilli, then sauté briefly.",
      "Add green peas and cook until tender.",
      "Add mashed potatoes, coriander powder, garam masala, amchur and salt.",
      "Mix well and finish with fresh coriander. Allow the filling to cool.",
      "Divide dough into equal balls and roll each into an oval.",
      "Cut each oval in half and form a cone using water to seal the edge.",
      "Fill the cone with potato mixture and seal the top firmly.",
      "Cook the samosas in moderately hot oil until crisp and golden, or bake them with a light oil coating.",
      "Drain and serve with mint or tamarind chutney."
    ],
    tips: [
      "Keep the dough firm for a crisp pastry.",
      "Cool the filling before shaping.",
      "Seal all edges properly to prevent filling from escaping.",
      "Cook over moderate heat for an evenly crisp crust."
    ],
    storage: "Refrigerate cooked samosas for up to 2 days. Reheat in an oven or air fryer."
  },
  {
    id: 84,
    name: "Cheese Garlic Bread",
    category: "snacks",
    description: "Toasted bread loaded with buttery garlic, herbs and melted cheese for a delicious café-style snack.",
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=900",
    prepTime: "10 mins",
    cookTime: "12 mins",
    totalTime: "22 mins",
    difficulty: "Easy",
    servings: 4,
    calories: "260 kcal",
    ingredients: [
      { name: "French bread or baguette", amount: "1 loaf" },
      { name: "Butter", amount: "4 tbsp, softened" },
      { name: "Garlic", amount: "5 cloves, minced" },
      { name: "Mozzarella cheese", amount: "1 cup, grated" },
      { name: "Mixed herbs", amount: "1 tsp" },
      { name: "Chilli flakes", amount: "½ tsp" },
      { name: "Fresh parsley", amount: "1 tbsp, chopped" },
      { name: "Black pepper", amount: "¼ tsp" }
    ],
    instructions: [
      "Preheat the oven to 180°C.",
      "Slice the bread into thick pieces or cut the loaf lengthwise.",
      "Mix softened butter with minced garlic, herbs, chilli flakes and black pepper.",
      "Spread the garlic butter evenly over the bread.",
      "Sprinkle grated mozzarella over the top.",
      "Arrange bread on a baking tray.",
      "Bake for 8–12 minutes until the cheese melts and the edges become lightly golden.",
      "For a more golden top, use the oven grill briefly while watching carefully.",
      "Remove from the oven and garnish with parsley.",
      "Slice if needed and serve warm."
    ],
    tips: [
      "Use softened butter for easy spreading.",
      "Add a little parmesan for extra flavour.",
      "Do not leave bread unattended under the grill.",
      "Serve immediately for the best melted-cheese texture."
    ],
    storage: "Refrigerate leftover prepared bread for up to 1 day and reheat before serving."
  },
  {
    id: 85,
    name: "Crispy Onion Rings",
    category: "snacks",
    description: "Sweet onion rings coated in a seasoned crunchy batter and cooked until beautifully golden.",
    image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=900",
    prepTime: "15 mins",
    cookTime: "15 mins",
    totalTime: "30 mins",
    difficulty: "Easy",
    servings: 3,
    calories: "270 kcal",
    ingredients: [
      { name: "Large onions", amount: "2" },
      { name: "All-purpose flour", amount: "½ cup" },
      { name: "Cornflour", amount: "¼ cup" },
      { name: "Breadcrumbs", amount: "1 cup" },
      { name: "Paprika", amount: "½ tsp" },
      { name: "Garlic powder", amount: "½ tsp" },
      { name: "Milk", amount: "½ cup" },
      { name: "Black pepper", amount: "¼ tsp" },
      { name: "Salt", amount: "To taste" },
      { name: "Oil", amount: "For cooking" }
    ],
    instructions: [
      "Peel onions and cut them into thick round slices.",
      "Separate the slices carefully into individual rings.",
      "Mix flour, cornflour, paprika, garlic powder, pepper and salt in a bowl.",
      "Pour milk into a separate bowl.",
      "Place breadcrumbs in another shallow bowl.",
      "Dip each onion ring into the flour mixture.",
      "Dip it into milk and then coat thoroughly with breadcrumbs.",
      "Arrange coated rings on a clean plate.",
      "Cook in moderately hot oil in small batches until golden and crisp.",
      "Alternatively, brush lightly with oil and bake or air-fry until crisp.",
      "Drain excess oil and serve with mayonnaise or ketchup."
    ],
    tips: [
      "Choose large firm onions for evenly sized rings.",
      "Keep one hand for dry coating and the other for wet coating to reduce mess.",
      "Do not overcrowd the pan.",
      "Add extra paprika for a spicy version."
    ],
    storage: "Best eaten fresh. Reheat leftovers in an oven or air fryer."
  },
  {
    id: 86,
    name: "Masala Cheese Corn",
    category: "snacks",
    description: "Sweet corn kernels tossed with butter, Indian spices, lemon and melted cheese.",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=900",
    prepTime: "5 mins",
    cookTime: "10 mins",
    totalTime: "15 mins",
    difficulty: "Easy",
    servings: 2,
    calories: "230 kcal",
    ingredients: [
      { name: "Sweet corn kernels", amount: "2 cups" },
      { name: "Butter", amount: "2 tbsp" },
      { name: "Grated cheese", amount: "½ cup" },
      { name: "Chaat masala", amount: "½ tsp" },
      { name: "Red chilli powder", amount: "¼ tsp" },
      { name: "Lemon juice", amount: "1 tbsp" },
      { name: "Fresh coriander", amount: "1 tbsp, chopped" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Boil sweet corn kernels in water until tender.",
      "Drain the corn thoroughly.",
      "Heat butter in a pan over low heat.",
      "Add cooked corn and stir for 2 minutes.",
      "Add chaat masala, chilli powder and salt.",
      "Mix until the spices coat the corn evenly.",
      "Turn off the heat and add lemon juice.",
      "Transfer to serving bowls.",
      "Sprinkle grated cheese over the warm corn.",
      "Garnish with fresh coriander and serve."
    ],
    tips: [
      "Use fresh or frozen sweet corn.",
      "Add cheese while the corn is warm so it softens.",
      "Adjust lemon and chilli to taste.",
      "Try a little black pepper for extra flavour."
    ],
    storage: "Refrigerate leftovers for up to 1 day and reheat thoroughly."
  },
  {
    id: 87,
    name: "Aloo Tikki Chaat",
    category: "snacks",
    description: "Crispy potato patties topped with chilled yogurt, sweet tamarind chutney, mint chutney and crunchy sev.",
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=900",
    prepTime: "25 mins",
    cookTime: "20 mins",
    totalTime: "45 mins",
    difficulty: "Medium",
    servings: 4,
    calories: "320 kcal",
    ingredients: [
      { name: "Potatoes", amount: "4 medium, boiled" },
      { name: "Cornflour", amount: "2 tbsp" },
      { name: "Green chilli", amount: "1, chopped" },
      { name: "Ginger", amount: "1 tsp, grated" },
      { name: "Cumin powder", amount: "½ tsp" },
      { name: "Chaat masala", amount: "1 tsp" },
      { name: "Fresh coriander", amount: "2 tbsp" },
      { name: "Yogurt", amount: "1 cup, whisked" },
      { name: "Tamarind chutney", amount: "¼ cup" },
      { name: "Mint chutney", amount: "¼ cup" },
      { name: "Sev", amount: "½ cup" },
      { name: "Oil", amount: "For shallow cooking" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Mash boiled potatoes in a large bowl until smooth.",
      "Add cornflour, green chilli, ginger, cumin powder, chaat masala, coriander and salt.",
      "Mix until a firm mixture forms.",
      "Divide into equal portions and shape into flat patties.",
      "Heat a little oil in a non-stick pan.",
      "Cook patties on medium heat until golden and crisp on both sides.",
      "Transfer the tikkis to serving plates.",
      "Top with whisked yogurt.",
      "Drizzle tamarind chutney and mint chutney over each tikki.",
      "Sprinkle chaat masala and sev.",
      "Garnish with fresh coriander and serve immediately."
    ],
    tips: [
      "Cool boiled potatoes before mashing for a firmer mixture.",
      "Add extra cornflour if the mixture feels too soft.",
      "Keep yogurt chilled until serving.",
      "Add sev at the last moment so it stays crunchy."
    ],
    storage: "Store uncooked patties in the refrigerator for up to 1 day. Assemble chaat just before serving."
  },
  {
    id: 88,
    name: "Crispy Vegetable Spring Rolls",
    category: "snacks",
    description: "Golden crunchy rolls filled with cabbage, carrot, capsicum and savoury garlic seasoning.",
    image: "https://images.unsplash.com/photo-1548507200-8a1a1c5b9a5b?w=900",
    prepTime: "25 mins",
    cookTime: "15 mins",
    totalTime: "40 mins",
    difficulty: "Medium",
    servings: 8,
    calories: "180 kcal",
    ingredients: [
      { name: "Spring roll wrappers", amount: "8" },
      { name: "Cabbage", amount: "1 cup, shredded" },
      { name: "Carrot", amount: "½ cup, julienned" },
      { name: "Capsicum", amount: "½ cup, thinly sliced" },
      { name: "Spring onions", amount: "3 tbsp" },
      { name: "Garlic", amount: "3 cloves, minced" },
      { name: "Soy sauce", amount: "1 tbsp" },
      { name: "Black pepper", amount: "½ tsp" },
      { name: "Cornflour", amount: "1 tbsp" },
      { name: "Water", amount: "2 tbsp" },
      { name: "Oil", amount: "For cooking" },
      { name: "Salt", amount: "To taste" }
    ],
    instructions: [
      "Heat a little oil in a wok or frying pan.",
      "Add garlic and spring onions.",
      "Add cabbage, carrot and capsicum.",
      "Stir-fry vegetables for 2–3 minutes until slightly tender but still crunchy.",
      "Add soy sauce, pepper and salt.",
      "Remove filling from the heat and allow it to cool completely.",
      "Mix cornflour with water to make a sealing paste.",
      "Place one wrapper on a clean surface with a corner facing you.",
      "Add a small amount of cooled filling near the bottom corner.",
      "Fold the bottom corner over the filling, fold in both sides and roll tightly.",
      "Seal the final edge with cornflour paste.",
      "Repeat with remaining wrappers.",
      "Cook rolls in hot oil until golden and crisp, or brush with oil and bake or air-fry.",
      "Serve hot with sweet chilli sauce."
    ],
    tips: [
      "Keep wrappers covered with a damp clean cloth while working.",
      "Do not overfill the rolls.",
      "Cool the filling completely before wrapping.",
      "Make sure all edges are sealed."
    ],
    storage: "Refrigerate uncooked assembled rolls for up to 1 day. Cooked rolls are best eaten fresh."
  },
  {
    id: 89,
    name: "Spicy Masala French Toast",
    category: "snacks",
    description: "A savoury Indian-style bread toast coated with a spiced egg mixture and cooked until golden.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=900",
    prepTime: "10 mins",
    cookTime: "10 mins",
    totalTime: "20 mins",
    difficulty: "Easy",
    servings: 2,
    calories: "260 kcal",
    ingredients: [
      { name: "Bread slices", amount: "4" },
      { name: "Eggs", amount: "2" },
      { name: "Onion", amount: "2 tbsp, finely chopped" },
      { name: "Tomato", amount: "2 tbsp, finely chopped" },
      { name: "Green chilli", amount: "1, finely chopped" },
      { name: "Fresh coriander", amount: "2 tbsp" },
      { name: "Turmeric powder", amount: "¼ tsp" },
      { name: "Red chilli powder", amount: "¼ tsp" },
      { name: "Black pepper", amount: "¼ tsp" },
      { name: "Salt", amount: "To taste" },
      { name: "Butter or oil", amount: "2 tbsp" }
    ],
    instructions: [
      "Crack eggs into a mixing bowl.",
      "Add onion, tomato, green chilli and fresh coriander.",
      "Add turmeric, chilli powder, black pepper and salt.",
      "Whisk until all ingredients are evenly combined.",
      "Heat a non-stick pan and add a little butter or oil.",
      "Dip one bread slice into the egg mixture, coating both sides.",
      "Place it carefully on the hot pan.",
      "Cook until the underside is golden, then flip.",
      "Cook the other side until the egg mixture is fully set.",
      "Repeat with remaining bread slices.",
      "Serve hot with tomato ketchup or mint chutney."
    ],
    tips: [
      "Use slightly thick bread slices for better texture.",
      "Chop vegetables finely so they stick to the bread.",
      "Cook until the egg mixture is completely set.",
      "Add grated cheese for a cheesy variation."
    ],
    storage: "Best eaten fresh. Refrigerate leftovers promptly and consume within 1 day."
  },
  {
    id: 90,
    name: "Chocolate Banana Pancake Bites",
    category: "snacks",
    description: "Soft mini banana pancakes with chocolate chips, perfect for a quick sweet snack or breakfast treat.",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=900",
    prepTime: "10 mins",
    cookTime: "15 mins",
    totalTime: "25 mins",
    difficulty: "Easy",
    servings: 3,
    calories: "280 kcal",
    ingredients: [
      { name: "Ripe banana", amount: "2 medium" },
      { name: "All-purpose flour", amount: "1 cup" },
      { name: "Milk", amount: "¾ cup" },
      { name: "Egg", amount: "1" },
      { name: "Sugar", amount: "1 tbsp" },
      { name: "Baking powder", amount: "1 tsp" },
      { name: "Vanilla extract", amount: "½ tsp" },
      { name: "Chocolate chips", amount: "¼ cup" },
      { name: "Butter", amount: "1 tbsp" },
      { name: "Salt", amount: "A pinch" }
    ],
    instructions: [
      "Peel bananas and mash them in a large bowl.",
      "Add egg, milk, sugar and vanilla extract.",
      "Whisk until the mixture is smooth.",
      "In another bowl, combine flour, baking powder and salt.",
      "Gradually add dry ingredients to the banana mixture.",
      "Mix gently until just combined; do not overmix.",
      "Fold in chocolate chips.",
      "Heat a non-stick pan over medium-low heat and lightly grease with butter.",
      "Spoon small portions of batter onto the pan.",
      "Cook until small bubbles appear on the surface.",
      "Flip carefully and cook the other side until golden and cooked through.",
      "Repeat with remaining batter.",
      "Serve warm with sliced banana or a little honey."
    ],
    tips: [
      "Use ripe bananas for natural sweetness.",
      "Keep the pan at medium-low heat to cook the centre properly.",
      "Avoid pressing down on the pancakes.",
      "Add chopped nuts for extra crunch."
    ],
    storage: "Refrigerate cooked pancakes for up to 2 days and reheat before serving."
  }
];

// END OF PART 10 - SNACKS
const drinkRecipes = [
  {
    id: 91,
    name: "Classic Cold Coffee",
    category: "drinks",
    description: "A rich and creamy café-style iced coffee blended with chilled milk, coffee and a touch of sweetness.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=900",
    prepTime: "5 mins",
    cookTime: "0 mins",
    totalTime: "5 mins",
    difficulty: "Easy",
    servings: 2,
    calories: "190 kcal",
    ingredients: [
      { name: "Chilled milk", amount: "2 cups" },
      { name: "Instant coffee", amount: "2 tsp" },
      { name: "Sugar", amount: "3 tbsp" },
      { name: "Cold water", amount: "2 tbsp" },
      { name: "Vanilla ice cream", amount: "2 scoops" },
      { name: "Ice cubes", amount: "1 cup" },
      { name: "Chocolate syrup", amount: "2 tbsp" }
    ],
    instructions: [
      "Add instant coffee and cold water to a small bowl.",
      "Stir until the coffee dissolves completely.",
      "Pour chilled milk into a blender.",
      "Add the coffee mixture, sugar and ice cubes.",
      "Add one scoop of vanilla ice cream for extra creaminess.",
      "Blend for 30–40 seconds until smooth and frothy.",
      "Drizzle chocolate syrup inside two serving glasses.",
      "Pour the blended coffee into the glasses.",
      "Top with another small scoop of ice cream if desired.",
      "Serve immediately while chilled."
    ],
    tips: [
      "Use chilled milk for a refreshing drink.",
      "Adjust sugar according to your preference.",
      "Add a little cocoa powder for a mocha flavour.",
      "Blend longer for a thicker and frothier texture."
    ],
    storage: "Best served immediately. Keep any leftover drink refrigerated and consume the same day."
  },
  {
    id: 92,
    name: "Chocolate Milkshake",
    category: "drinks",
    description: "A thick and indulgent chocolate milkshake made with milk, cocoa and creamy chocolate ice cream.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=900",
    prepTime: "5 mins",
    cookTime: "0 mins",
    totalTime: "5 mins",
    difficulty: "Easy",
    servings: 2,
    calories: "320 kcal",
    ingredients: [
      { name: "Chilled milk", amount: "2 cups" },
      { name: "Chocolate ice cream", amount: "3 scoops" },
      { name: "Cocoa powder", amount: "2 tbsp" },
      { name: "Sugar", amount: "1 tbsp" },
      { name: "Chocolate syrup", amount: "2 tbsp" },
      { name: "Chocolate chips", amount: "1 tbsp" },
      { name: "Whipped cream", amount: "For topping" }
    ],
    instructions: [
      "Pour chilled milk into a blender jar.",
      "Add chocolate ice cream and cocoa powder.",
      "Add sugar and one tablespoon of chocolate syrup.",
      "Blend until smooth and thick.",
      "Drizzle chocolate syrup inside serving glasses.",
      "Pour the milkshake into the glasses.",
      "Top with whipped cream.",
      "Sprinkle chocolate chips over the top.",
      "Serve immediately with a wide straw."
    ],
    tips: [
      "Use less milk for a thicker milkshake.",
      "Choose good-quality cocoa powder for a deeper chocolate flavour.",
      "Add crushed chocolate biscuits for extra texture.",
      "Taste before adding extra sugar."
    ],
    storage: "Best consumed immediately. Refrigerate leftovers and consume the same day."
  },
  {
    id: 93,
    name: "Fresh Mango Smoothie",
    category: "drinks",
    description: "A naturally sweet and creamy tropical smoothie made with ripe mangoes, chilled yogurt and milk.",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=900",
    prepTime: "10 mins",
    cookTime: "0 mins",
    totalTime: "10 mins",
    difficulty: "Easy",
    servings: 2,
    calories: "210 kcal",
    ingredients: [
      { name: "Ripe mango", amount: "2 medium, peeled and chopped" },
      { name: "Plain yogurt", amount: "½ cup" },
      { name: "Chilled milk", amount: "½ cup" },
      { name: "Honey", amount: "1 tbsp" },
      { name: "Cardamom powder", amount: "A pinch" },
      { name: "Ice cubes", amount: "½ cup" },
      { name: "Chopped pistachios", amount: "1 tbsp" }
    ],
    instructions: [
      "Peel the mangoes and remove the stones.",
      "Cut the mango flesh into small pieces.",
      "Add mango pieces to a blender.",
      "Add yogurt and chilled milk.",
      "Add honey and a pinch of cardamom powder.",
      "Add ice cubes.",
      "Blend until creamy and completely smooth.",
      "Check the sweetness and adjust if needed.",
      "Pour into chilled glasses.",
      "Garnish with chopped pistachios and serve."
    ],
    tips: [
      "Use fully ripe mangoes for natural sweetness.",
      "Chill the mango pieces before blending for a colder smoothie.",
      "Use plant-based yogurt and milk for a dairy-free option.",
      "Add a little extra yogurt for a thicker consistency."
    ],
    storage: "Refrigerate in a covered container and consume within 24 hours."
  },
  {
    id: 94,
    name: "Fresh Strawberry Milkshake",
    category: "drinks",
    description: "A beautiful pink milkshake with fresh strawberries, chilled milk and creamy vanilla ice cream.",
    image: "https://images.unsplash.com/photo-1553787499-6f9133860278?w=900",
    prepTime: "10 mins",
    cookTime: "0 mins",
    totalTime: "10 mins",
    difficulty: "Easy",
    servings: 2,
    calories: "250 kcal",
    ingredients: [
      { name: "Fresh strawberries", amount: "1½ cups" },
      { name: "Chilled milk", amount: "2 cups" },
      { name: "Vanilla ice cream", amount: "2 scoops" },
      { name: "Sugar", amount: "2 tbsp" },
      { name: "Vanilla extract", amount: "¼ tsp" },
      { name: "Whipped cream", amount: "For topping" },
      { name: "Strawberry slices", amount: "For garnish" }
    ],
    instructions: [
      "Wash strawberries thoroughly under clean running water.",
      "Remove the green leafy tops.",
      "Cut strawberries into small pieces.",
      "Add strawberries to a blender jar.",
      "Pour in chilled milk.",
      "Add vanilla ice cream, sugar and vanilla extract.",
      "Blend until smooth and creamy.",
      "Taste and adjust sweetness if necessary.",
      "Pour into two serving glasses.",
      "Top with whipped cream and strawberry slices.",
      "Serve immediately."
    ],
    tips: [
      "Use ripe strawberries for better flavour.",
      "Freeze some strawberry pieces beforehand for a thicker shake.",
      "Add a little strawberry puree as a glass decoration.",
      "Reduce sugar if the strawberries are already sweet."
    ],
    storage: "Best served fresh. Refrigerate leftovers and consume within 24 hours."
  },
  {
    id: 95,
    name: "Classic Lemon Mint Cooler",
    category: "drinks",
    description: "A refreshing summer cooler combining fresh lemon juice, mint leaves, chilled water and a hint of sweetness.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?w=900",
    prepTime: "10 mins",
    cookTime: "0 mins",
    totalTime: "10 mins",
    difficulty: "Easy",
    servings: 3,
    calories: "75 kcal",
    ingredients: [
      { name: "Fresh lemons", amount: "3" },
      { name: "Fresh mint leaves", amount: "½ cup" },
      { name: "Chilled water", amount: "3 cups" },
      { name: "Sugar", amount: "3 tbsp" },
      { name: "Black salt", amount: "¼ tsp" },
      { name: "Roasted cumin powder", amount: "¼ tsp" },
      { name: "Ice cubes", amount: "1 cup" },
      { name: "Lemon slices", amount: "For garnish" }
    ],
    instructions: [
      "Wash the mint leaves and lemons thoroughly.",
      "Squeeze fresh lemon juice into a jug.",
      "Add sugar and stir until dissolved.",
      "Add black salt and roasted cumin powder.",
      "Gently crush some mint leaves to release their aroma.",
      "Add the mint leaves to the jug.",
      "Pour in chilled water and mix well.",
      "Taste and adjust lemon or sugar as preferred.",
      "Fill serving glasses with ice cubes.",
      "Pour the lemon mint mixture into the glasses.",
      "Garnish with lemon slices and fresh mint.",
      "Serve chilled."
    ],
    tips: [
      "Avoid crushing mint too aggressively because it can taste bitter.",
      "Use fresh lemon juice rather than bottled juice.",
      "Add sparkling water for a fizzy variation.",
      "Prepare just before serving for the freshest flavour."
    ],
    storage: "Refrigerate the prepared drink for up to 24 hours. Add ice just before serving."
  },
  {
    id: 96,
    name: "Classic Banana Smoothie",
    category: "drinks",
    description: "A naturally creamy banana smoothie blended with milk, yogurt, oats and a touch of honey.",
    image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=900",
    prepTime: "5 mins",
    cookTime: "0 mins",
    totalTime: "5 mins",
    difficulty: "Easy",
    servings: 2,
    calories: "240 kcal",
    ingredients: [
      { name: "Ripe bananas", amount: "2 medium" },
      { name: "Chilled milk", amount: "1½ cups" },
      { name: "Plain yogurt", amount: "½ cup" },
      { name: "Rolled oats", amount: "¼ cup" },
      { name: "Honey", amount: "1 tbsp" },
      { name: "Cinnamon powder", amount: "¼ tsp" },
      { name: "Ice cubes", amount: "½ cup" },
      { name: "Chopped almonds", amount: "1 tbsp" }
    ],
    instructions: [
      "Peel bananas and cut them into chunks.",
      "Add banana pieces to a blender.",
      "Add chilled milk and plain yogurt.",
      "Add rolled oats and honey.",
      "Sprinkle in cinnamon powder.",
      "Add ice cubes.",
      "Blend until smooth and creamy.",
      "Check the consistency and add a little milk if needed.",
      "Pour into serving glasses.",
      "Garnish with chopped almonds and serve immediately."
    ],
    tips: [
      "Use ripe bananas for a naturally sweet taste.",
      "Freeze banana pieces beforehand for a thicker smoothie.",
      "Soak oats briefly if you prefer a smoother texture.",
      "Add peanut butter for a different flavour."
    ],
    storage: "Best served immediately. Refrigerate leftovers and consume within 24 hours."
  },
  {
    id: 97,
    name: "Watermelon Mint Cooler",
    category: "drinks",
    description: "A light and refreshing summer drink made with juicy watermelon, fresh mint and lemon juice.",
    image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=900",
    prepTime: "10 mins",
    cookTime: "0 mins",
    totalTime: "10 mins",
    difficulty: "Easy",
    servings: 3,
    calories: "85 kcal",
    ingredients: [
      { name: "Seedless watermelon", amount: "4 cups, cubed" },
      { name: "Fresh mint leaves", amount: "¼ cup" },
      { name: "Lemon juice", amount: "2 tbsp" },
      { name: "Honey", amount: "1 tbsp, optional" },
      { name: "Chilled water", amount: "½ cup" },
      { name: "Ice cubes", amount: "1 cup" },
      { name: "Mint sprigs", amount: "For garnish" }
    ],
    instructions: [
      "Remove the rind from the watermelon and cut the flesh into cubes.",
      "Remove any visible seeds.",
      "Place watermelon cubes into a blender.",
      "Add fresh mint leaves and lemon juice.",
      "Add honey if extra sweetness is needed.",
      "Pour in chilled water.",
      "Blend until smooth.",
      "Strain through a fine sieve if you prefer a smoother drink.",
      "Fill glasses with ice cubes.",
      "Pour the watermelon mixture into the glasses.",
      "Garnish with mint sprigs and serve chilled."
    ],
    tips: [
      "Use naturally sweet watermelon.",
      "Chill watermelon before blending for a refreshing result.",
      "Adjust lemon juice according to sweetness.",
      "Do not add too much water because watermelon already contains plenty of liquid."
    ],
    storage: "Refrigerate in a covered jug and consume within 24 hours."
  },
  {
    id: 98,
    name: "Creamy Vanilla Milkshake",
    category: "drinks",
    description: "A smooth and classic vanilla milkshake made with rich vanilla ice cream, chilled milk and fragrant vanilla.",
    image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=900",
    prepTime: "5 mins",
    cookTime: "0 mins",
    totalTime: "5 mins",
    difficulty: "Easy",
    servings: 2,
    calories: "290 kcal",
    ingredients: [
      { name: "Chilled milk", amount: "1½ cups" },
      { name: "Vanilla ice cream", amount: "3 scoops" },
      { name: "Vanilla extract", amount: "½ tsp" },
      { name: "Sugar", amount: "1 tbsp, optional" },
      { name: "Whipped cream", amount: "For topping" },
      { name: "Crushed biscuits", amount: "2 tbsp" }
    ],
    instructions: [
      "Pour chilled milk into a blender jar.",
      "Add vanilla ice cream.",
      "Add vanilla extract and sugar if required.",
      "Blend until smooth and creamy.",
      "Check the thickness and add more milk if needed.",
      "Pour into chilled glasses.",
      "Top with whipped cream.",
      "Sprinkle crushed biscuits over the top.",
      "Serve immediately."
    ],
    tips: [
      "Use good-quality vanilla ice cream.",
      "For a thick shake, reduce the milk slightly.",
      "Add a few drops of vanilla extract for a stronger aroma.",
      "Decorate the glass with a little chocolate or caramel syrup."
    ],
    storage: "Best served immediately. Refrigerate any leftover shake and consume the same day."
  },
  {
    id: 99,
    name: "Virgin Mojito",
    category: "drinks",
    description: "A fizzy alcohol-free mocktail with fresh mint, lime, sugar and sparkling soda water.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?w=900",
    prepTime: "8 mins",
    cookTime: "0 mins",
    totalTime: "8 mins",
    difficulty: "Easy",
    servings: 2,
    calories: "95 kcal",
    ingredients: [
      { name: "Fresh mint leaves", amount: "½ cup" },
      { name: "Lime", amount: "2, cut into wedges" },
      { name: "Sugar", amount: "3 tbsp" },
      { name: "Sparkling soda water", amount: "2 cups" },
      { name: "Ice cubes", amount: "1½ cups" },
      { name: "Lime slices", amount: "For garnish" },
      { name: "Mint sprigs", amount: "For garnish" }
    ],
    instructions: [
      "Wash mint leaves and lime thoroughly.",
      "Place lime wedges and sugar in a sturdy jug.",
      "Gently press the lime wedges to release their juice.",
      "Add mint leaves and gently muddle to release their aroma.",
      "Fill two glasses with ice cubes.",
      "Divide the lime and mint mixture between the glasses.",
      "Pour chilled sparkling soda water into each glass.",
      "Stir gently to combine without losing too much fizz.",
      "Garnish with lime slices and mint sprigs.",
      "Serve immediately."
    ],
    tips: [
      "Use fresh mint for the best aroma.",
      "Do not crush mint too hard because it can become bitter.",
      "Add soda water just before serving to retain the bubbles.",
      "Adjust sugar according to your preference."
    ],
    storage: "Prepare fresh for every serving. Do not store after adding soda water."
  },
  {
    id: 100,
    name: "Blueberry Yogurt Smoothie",
    category: "drinks",
    description: "A vibrant purple smoothie made with blueberries, creamy yogurt, milk and a touch of honey.",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=900",
    prepTime: "5 mins",
    cookTime: "0 mins",
    totalTime: "5 mins",
    difficulty: "Easy",
    servings: 2,
    calories: "180 kcal",
    ingredients: [
      { name: "Fresh or frozen blueberries", amount: "1 cup" },
      { name: "Plain yogurt", amount: "1 cup" },
      { name: "Chilled milk", amount: "½ cup" },
      { name: "Honey", amount: "1 tbsp" },
      { name: "Banana", amount: "½ medium" },
      { name: "Chia seeds", amount: "1 tsp" },
      { name: "Ice cubes", amount: "½ cup" }
    ],
    instructions: [
      "Wash fresh blueberries thoroughly, or measure frozen blueberries directly.",
      "Add blueberries to a blender jar.",
      "Add plain yogurt and chilled milk.",
      "Add half a banana for extra creaminess.",
      "Add honey and chia seeds.",
      "Add ice cubes if using fresh blueberries.",
      "Blend until smooth and evenly coloured.",
      "Taste and adjust sweetness if needed.",
      "Pour into two serving glasses.",
      "Garnish with a few blueberries and serve chilled."
    ],
    tips: [
      "Frozen blueberries make the smoothie naturally thick.",
      "Use plain unsweetened yogurt to control sweetness.",
      "Let chia seeds rest in the smoothie for a few minutes if you prefer a thicker texture.",
      "Add oats for a more filling variation."
    ],
    storage: "Refrigerate in a sealed container and consume within 24 hours."
  }
];

// END OF PART 11 - DRINKS
// ==========================================
// PART 12 - FINAL SETUP
// ==========================================

// 1. CONNECT ALL 100 RECIPES
recipes.push(
  ...pizzaRecipes,
  ...burgerRecipes,
  ...pastaRecipes,
  ...dessertRecipes,
  ...healthyRecipes,
  ...indianRecipes,
  ...chickenRecipes,
  ...asianRecipes,
  ...snackRecipes,
  ...drinkRecipes
);

// 2. INITIAL WEBSITE RENDER
renderCategories();
renderCategoryFilters();
renderRecipes();

console.log("Recipe Hub loaded:", recipes.length, "recipes");

// 3. HTML ESCAPE HELPER
function escapeRecipeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// 4. RECIPE DETAILS MODAL
function openRecipe(recipe) {
  if (!recipe || !recipeDetails || !recipeModal) return;

  const ingredientsHTML = recipe.ingredients.map(item => `
    <li>
      <span>${escapeRecipeText(item.name)}</span>
      <strong>${escapeRecipeText(item.amount)}</strong>
    </li>
  `).join("");

  const instructionsHTML = recipe.instructions.map((step, index) => `
    <li>
      <span class="step-number">${index + 1}</span>
      <p>${escapeRecipeText(step)}</p>
    </li>
  `).join("");

  const tipsHTML = (recipe.tips || []).map(tip => `
    <li>${escapeRecipeText(tip)}</li>
  `).join("");

  recipeDetails.innerHTML = `
    <div class="recipe-detail">

      <img
        class="recipe-detail-image"
        src="${escapeRecipeText(recipe.image)}"
        alt="${escapeRecipeText(recipe.name)}"
      >

      <div class="recipe-detail-content">

        <span class="recipe-detail-category">
          ${escapeRecipeText(recipe.category)}
        </span>

        <h2>${escapeRecipeText(recipe.name)}</h2>

        <p class="recipe-detail-description">
          ${escapeRecipeText(recipe.description)}
        </p>

        <div class="recipe-detail-info">
          <div><strong>${escapeRecipeText(recipe.prepTime)}</strong><span>Prep Time</span></div>
          <div><strong>${escapeRecipeText(recipe.cookTime)}</strong><span>Cook Time</span></div>
          <div><strong>${escapeRecipeText(recipe.totalTime)}</strong><span>Total Time</span></div>
          <div><strong>${escapeRecipeText(recipe.servings)}</strong><span>Servings</span></div>
        </div>

        <h3>Ingredients</h3>
        <ul class="recipe-detail-ingredients">
          ${ingredientsHTML}
        </ul>

        <h3>Step-by-Step Instructions</h3>
        <ol class="recipe-detail-instructions">
          ${instructionsHTML}
        </ol>

        ${tipsHTML ? `
          <h3>Chef's Tips</h3>
          <ul class="recipe-detail-tips">${tipsHTML}</ul>
        ` : ""}

        ${recipe.storage ? `
          <h3>Storage Instructions</h3>
          <p>${escapeRecipeText(recipe.storage)}</p>
        ` : ""}

      </div>
    </div>
  `;

  recipeModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Open recipe when a recipe card is clicked
recipeGrid.addEventListener("click", event => {

  if (event.target.closest(".favorite-btn"))
    return;
  const card = event.target.closest(
    ".recipe-card, [data-recipe-id], [data-id]"
  );

  if (!card) return;

  const recipeId = Number(
    card.dataset.recipeId || card.dataset.id
  );

  const selectedRecipe = recipes.find(
    recipe => recipe.id === recipeId
  );

  if (selectedRecipe) openRecipe(selectedRecipe);
});

// Close recipe modal
function closeRecipeModal() {
  if (!recipeModal) return;

  recipeModal.classList.remove("active");
  document.body.style.overflow = "";
}

document.querySelector("#modalClose")?.addEventListener(
  "click",
  closeRecipeModal
);

document.querySelector("#modalOverlay")?.addEventListener(
  "click",
  closeRecipeModal
);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeRecipeModal();
  }
});

// 5. MOBILE NAVIGATION MENU
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });
}

// 6. BACK TO TOP BUTTON
if (backToTop) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// 7. PAGE LOADER
window.addEventListener("load", () => {
  const loader = document.querySelector("#loader");

  if (loader) {
    loader.classList.add("loaded");

    setTimeout(() => {
      loader.style.display = "none";
    }, 600);
  }
});

// ==========================================
// END OF PART 12 - FINAL SETUP
// ==========================================
// ==========================================
// PART 13A - FAVORITES SYSTEM
// ==========================================

let favoriteRecipes = JSON.parse(
  localStorage.getItem("punuFavoriteRecipes") || "[]"
);

function saveFavorites() {
  localStorage.setItem(
    "punuFavoriteRecipes",
    JSON.stringify(favoriteRecipes)
  );
}

function isFavorite(recipeId) {
  return favoriteRecipes.includes(Number(recipeId));
}

function toggleFavorite(recipeId) {
  recipeId = Number(recipeId);

  if (isFavorite(recipeId)) {
    favoriteRecipes = favoriteRecipes.filter(
      id => id !== recipeId
    );
  } else {
    favoriteRecipes.push(recipeId);
  }

  saveFavorites();
  renderRecipes();
  updateFavoriteButtons();
}

function updateFavoriteButtons() {
  document.querySelectorAll(".favorite-btn").forEach(button => {
    const id = Number(button.dataset.id);
    const active = isFavorite(id);

    button.classList.toggle("is-favorite", active);
    button.innerHTML = active ? "♥" : "♡";
    button.setAttribute(
      "aria-label",
      active ? "Remove from favorites" : "Add to favorites"
    );
  });
}

// FAVORITE BUTTON CLICK
recipeGrid.addEventListener("click", event => {
  const button = event.target.closest(".favorite-btn");

  if (!button) return;

  event.preventDefault();
  event.stopPropagation();

  toggleFavorite(button.dataset.id);
});

console.log("Favorites system ready!");
// ==========================================
// PART 14B - MY FAVORITES DISPLAY
// ==========================================

const favoritesGrid = document.querySelector("#favoritesGrid");
const favoritesCount = document.querySelector("#favoritesCount");
const favoritesEmpty = document.querySelector("#favoritesEmpty");

function renderFavorites() {

    if (!favoritesGrid) return;

    const savedRecipes = recipes.filter(recipe =>
        favoriteRecipes.includes(recipe.id)
    );

    favoritesGrid.innerHTML = savedRecipes.map(recipe => {

        const category = categories.find(
            item => item.id === recipe.category
        );

        return `
            <article class="recipe-card">

                <div class="recipe-image">
                    <img
                        src="${recipe.image}"
                        alt="${recipe.name}"
                        loading="lazy"
                        onerror="this.src='https://placehold.co/600x400/251d2a/ff70ad?text=Recipe+Hub'"
                    >

                    <span class="recipe-category-badge">
                        ${category ? category.name : "Recipe"}
                    </span>

                    <button
                        class="favorite-btn is-favorite"
                        data-id="${recipe.id}"
                        type="button"
                        aria-label="Remove from favorites">
                        ♥
                    </button>
                </div>

                <div class="recipe-info">
                    <h3>${recipe.name}</h3>
                    <p>${recipe.description}</p>

                    <div class="recipe-meta">
                        <span>⏱ ${recipe.totalTime}</span>
                        <span>👨‍🍳 ${recipe.difficulty}</span>
                        <span>🍽 ${recipe.servings} servings</span>
                    </div>

                    <button
                        class="view-recipe-btn"
                        data-id="${recipe.id}">
                        View Full Recipe →
                    </button>
                </div>

            </article>
        `;
    }).join("");

    if (favoritesCount) {
        favoritesCount.textContent = savedRecipes.length;
    }

    if (favoritesEmpty) {
        favoritesEmpty.style.display =
            savedRecipes.length === 0 ? "block" : "none";
    }
}

// Update favorites display
const originalSaveFavorites = saveFavorites;

saveFavorites = function () {
    originalSaveFavorites();
    renderFavorites();
};

// Remove favorite from Favorites section
favoritesGrid.addEventListener("click", event => {

    const button = event.target.closest(".favorite-btn");

    if (!button) return;

    event.preventDefault();
    event.stopPropagation();

    toggleFavorite(button.dataset.id);
});

// Open recipe from Favorites section
favoritesGrid.addEventListener("click", event => {

    if (event.target.closest(".favorite-btn")) return;

    const button = event.target.closest(".view-recipe-btn");

    if (!button) return;

    const recipe = recipes.find(
        item => item.id === Number(button.dataset.id)
    );

    if (recipe) openRecipe(recipe);
});

renderFavorites();

console.log("My Favorites section ready!");
// ==========================================
// PART 15A - RECIPE RATING SYSTEM
// ==========================================

let recipeRatings = JSON.parse(
    localStorage.getItem("punuRecipeRatings") || "{}"
);

// Save ratings
function saveRecipeRatings() {
    localStorage.setItem(
        "punuRecipeRatings",
        JSON.stringify(recipeRatings)
    );
}

// Get average rating
function getAverageRating(recipeId) {
    const ratings = recipeRatings[recipeId] || [];

    if (ratings.length === 0) return 0;

    const total = ratings.reduce(
        (sum, rating) => sum + rating,
        0
    );

    return (total / ratings.length).toFixed(1);
}

// Get total rating count
function getRatingCount(recipeId) {
    return (recipeRatings[recipeId] || []).length;
}

// Add or update rating
function setRecipeRating(recipeId, rating) {
    recipeId = String(recipeId);
    rating = Number(rating);

    if (rating < 1 || rating > 5) return;

    // Store one rating per browser for each recipe
    recipeRatings[recipeId] = [rating];

    saveRecipeRatings();
    renderRecipeRatings();

    console.log("Rating saved:", recipeId, rating);
}

// Render rating display
function renderRecipeRatings() {
    document.querySelectorAll(".recipe-rating").forEach(element => {
        const id = element.dataset.id;
        const average = getAverageRating(id);
        const count = getRatingCount(id);

        element.innerHTML = `
            <span class="rating-stars">
                ${average ? "★".repeat(Math.round(Number(average))) + "☆".repeat(5 - Math.round(Number(average))) : "☆☆☆☆☆"}
            </span>
            <span class="rating-number">
                ${average || "Not rated"}
            </span>
            <span class="rating-count">
                (${count})
            </span>
        `;
    });
}

console.log("Recipe Rating System Ready!");
// ==========================================
// PART 15D - CLICKABLE STAR RATINGS
// ==========================================

function addClickableRatings() {
    document.querySelectorAll(".recipe-rating").forEach(element => {
        const recipeId = element.dataset.id;

        element.innerHTML = `
            <span class="rating-stars">
                ${[1, 2, 3, 4, 5].map(star => `
                    <button
                        type="button"
                        class="rating-star-btn"
                        data-id="${recipeId}"
                        data-rating="${star}"
                        aria-label="Rate ${star} stars">
                        ★
                    </button>
                `).join("")}
            </span>
            <span class="rating-number">
                ${getAverageRating(recipeId) || "Not rated"}
            </span>
            <span class="rating-count">
                (${getRatingCount(recipeId)})
            </span>
        `;

        const currentRating = Number(
            getAverageRating(recipeId)
        );

        element.querySelectorAll(".rating-star-btn").forEach(button => {
            const value = Number(button.dataset.rating);

            button.classList.toggle(
                "selected",
                value <= Math.round(currentRating)
            );
        });
    });
}

// Handle star clicks
document.addEventListener("click", event => {
    const button = event.target.closest(".rating-star-btn");

    if (!button) return;

    setRecipeRating(
        button.dataset.id,
        button.dataset.rating
    );
});

// Refresh ratings after recipes render
const originalRenderRecipes = renderRecipes;

renderRecipes = function () {
    originalRenderRecipes();
    addClickableRatings();
};

addClickableRatings();

console.log("Clickable ratings activated!");