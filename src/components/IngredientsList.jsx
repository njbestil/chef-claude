import { useEffect, useRef } from 'react'
import ClaudeRecipe from './ClaudeRecipe'

export default function IngredientsList(props) {
    const recipeRef = useRef(null)

    const ingredientsListItems = props.ingredients.map((ingredient, index) => (
        <li key={index}>{ingredient}</li>
    ))

    const hasEnoughIngredients = props.ingredients.length >= 4

    useEffect(() => {
        if (props.recipe) {
            recipeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [props.recipe])

    return (
        <>
            {ingredientsListItems.length > 0 &&
                <section>
                    <h1>Ingredients on hand:</h1>
                    <ul className="ingredients-list">
                        {ingredientsListItems}
                    </ul>

                    {hasEnoughIngredients &&
                        <div className="recipe-results">
                            <div>
                                <h1>Ready for a recipe?</h1>
                                <p>
                                    {props.isGeneratingRecipe
                                        ? 'Generating a recipe from your ingredients...'
                                        : 'Generate a recipe from your list of ingredients.'}
                                </p>
                            </div>
                            <button
                                onClick={props.getRecipe}
                                disabled={props.isGeneratingRecipe}
                            >
                                {props.isGeneratingRecipe ? 'Generating...' : 'Get a recipe'}
                            </button>
                        </div>
                    }

                    {!hasEnoughIngredients &&
                        <p className="recipe-helper">Add at least 4 ingredients to generate a recipe.</p>
                    }

                    {props.recipeError &&
                        <p className="recipe-error" role="alert">{props.recipeError}</p>
                    }

                    {props.recipe &&
                        <ClaudeRecipe recipe={props.recipe} recipeRef={recipeRef} />
                    }
                </section>
            }
        </>
    )
}
