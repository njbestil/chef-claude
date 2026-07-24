import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const recipeSchema = {
    type: 'object',
    additionalProperties: false,
    required: [
        'title',
        'description',
        'servings',
        'preparationTime',
        'cookingTime',
        'ingredients',
        'instructions',
        'substitutions',
    ],
    properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        servings: { type: 'string' },
        preparationTime: { type: 'string' },
        cookingTime: { type: 'string' },
        ingredients: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                required: ['name', 'quantity'],
                properties: {
                    name: { type: 'string' },
                    quantity: { type: 'string' },
                },
            },
        },
        instructions: {
            type: 'array',
            items: { type: 'string' },
        },
        substitutions: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                required: ['ingredient', 'suggestion'],
                properties: {
                    ingredient: { type: 'string' },
                    suggestion: { type: 'string' },
                },
            },
        },
    },
}

function sendJson(res, statusCode, body) {
    res.statusCode = statusCode
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(body))
}

function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = ''

        req.on('data', chunk => {
            body += chunk
        })

        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {})
            } catch {
                reject(new Error('Invalid JSON body.'))
            }
        })

        req.on('error', reject)
    })
}

function getResponseText(openAiResponse) {
    if (openAiResponse.output_text) {
        return openAiResponse.output_text
    }

    return openAiResponse.output
        ?.flatMap(output => output.content ?? [])
        .map(content => content.text)
        .filter(Boolean)
        .join('')
}

function recipeApiPlugin(mode) {
    const env = loadEnv(mode, process.cwd(), '')
    const apiKey = env.OPENAI_API_KEY
    const model = env.OPENAI_MODEL || 'gpt-4.1-mini'

    async function handleRecipeRequest(req, res) {
        if (req.method !== 'POST') {
            sendJson(res, 405, { error: 'Method not allowed.' })
            return
        }

        if (!apiKey) {
            sendJson(res, 500, { error: 'OPENAI_API_KEY is not configured on the server.' })
            return
        }

        try {
            const { ingredients } = await readJsonBody(req)

            if (!Array.isArray(ingredients) || ingredients.length < 4) {
                sendJson(res, 400, { error: 'Add at least 4 ingredients before generating a recipe.' })
                return
            }

            const cleanIngredients = ingredients
                .map(ingredient => String(ingredient).trim())
                .filter(Boolean)

            if (cleanIngredients.length < 4) {
                sendJson(res, 400, { error: 'Add at least 4 ingredients before generating a recipe.' })
                return
            }

            const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model,
                    input: [
                        {
                            role: 'system',
                            content: 'You are a practical home cook. Create one clear, appealing recipe from the provided ingredients. You may assume common pantry staples such as salt, pepper, water, and oil.',
                        },
                        {
                            role: 'user',
                            content: `Create a recipe using these ingredients: ${cleanIngredients.join(', ')}`,
                        },
                    ],
                    text: {
                        format: {
                            type: 'json_schema',
                            name: 'generated_recipe',
                            strict: true,
                            schema: recipeSchema,
                        },
                    },
                }),
            })

            const responseBody = await openAiResponse.json()

            if (!openAiResponse.ok) {
                sendJson(res, openAiResponse.status, {
                    error: responseBody.error?.message || 'Recipe generation failed.',
                })
                return
            }

            const recipeText = getResponseText(responseBody)
            const recipe = JSON.parse(recipeText)

            sendJson(res, 200, { recipe })
        } catch (error) {
            sendJson(res, 500, {
                error: error.message || 'Recipe generation failed.',
            })
        }
    }

    return {
        name: 'chef-claude-recipe-api',
        configureServer(server) {
            server.middlewares.use('/api/recipe', handleRecipeRequest)
        },
        configurePreviewServer(server) {
            server.middlewares.use('/api/recipe', handleRecipeRequest)
        },
    }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
    base: mode === 'production' ? '/chef-claude/' : '/',
    plugins: [react(), recipeApiPlugin(mode)],
}))
