import { useState } from 'react'
import IngredientsList from './IngredientsList'

export default function Main() {
    const [ingredients, setIngredients] = useState([])
    const [recipe, setRecipe] = useState(null)
    const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false)
    const [recipeError, setRecipeError] = useState('')

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient").trim()

        if (!newIngredient) {
            return
        }

        setIngredients(prev => [...prev, newIngredient])
    }

    async function getRecipe() {
        if (ingredients.length < 4) {
            setRecipeError('Add at least 4 ingredients before generating a recipe.')
            return
        }

        setIsGeneratingRecipe(true)
        setRecipeError('')
        setRecipe(null)

        try {
            const recipeApiUrl = import.meta.env.VITE_RECIPE_API_URL || '/api/recipe'
            const response = await fetch(recipeApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ingredients }),
            })

            const contentType = response.headers.get('content-type') || ''

            if (!contentType.includes('application/json')) {
                throw new Error(
                    recipeApiUrl === '/api/recipe'
                        ? 'Recipe generation needs a backend API. GitHub Pages only hosts the static app, so /api/recipe is not available there.'
                        : 'Recipe generation failed because the API did not return JSON.'
                )
            }

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Recipe generation failed.')
            }

            setRecipe(data.recipe)
        } catch (error) {
            setRecipeError(error.message || 'Recipe generation failed.')
        } finally {
            setIsGeneratingRecipe(false)
        }
    }

    return (
        <main>
            <form className="add-ingredient-form" action={addIngredient}>
                <div className="ingredient-input-wrapper">
                    <input
                        type="text"
                        placeholder="e.g. oregano"
                        aria-label="Add ingredient"
                        name="ingredient"
                        required
                    />
                </div>
                <button>Add ingredient</button>
            </form>

            <IngredientsList
                ingredients={ingredients}
                getRecipe={getRecipe}
                recipe={recipe}
                isGeneratingRecipe={isGeneratingRecipe}
                recipeError={recipeError}
            />

        </main>
    )
}
