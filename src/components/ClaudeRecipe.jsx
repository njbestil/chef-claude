export default function ClaudeRecipe({ recipe, recipeRef }) {
    return (
        <article className="generated-recipe" ref={recipeRef}>
            <h1>{recipe.title}</h1>
            <p>{recipe.description}</p>

            <dl className="recipe-meta">
                <div>
                    <dt>Servings</dt>
                    <dd>{recipe.servings}</dd>
                </div>
                <div>
                    <dt>Prep</dt>
                    <dd>{recipe.preparationTime}</dd>
                </div>
                <div>
                    <dt>Cook</dt>
                    <dd>{recipe.cookingTime}</dd>
                </div>
            </dl>

            <h2>Ingredients</h2>
            <ul>
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={`${ingredient.name}-${index}`}>
                        <span>{ingredient.quantity}</span> {ingredient.name}
                    </li>
                ))}
            </ul>

            <h2>Instructions</h2>
            <ol>
                {recipe.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                ))}
            </ol>

            {recipe.substitutions.length > 0 &&
                <>
                    <h2>Substitutions</h2>
                    <ul>
                        {recipe.substitutions.map((substitution, index) => (
                            <li key={`${substitution.ingredient}-${index}`}>
                                <span>{substitution.ingredient}:</span> {substitution.suggestion}
                            </li>
                        ))}
                    </ul>
                </>
            }
        </article>
    )
}
