# Chef Claude

Chef Claude is a React and Vite recipe generator. Add ingredients you have on hand, then generate a structured recipe with servings, prep time, cook time, ingredients, instructions, and substitution ideas.

## AI API Implementation

This project is implemented with an AI API workflow. The frontend sends the ingredient list to a local `/api/recipe` endpoint, and the Vite server middleware calls the OpenAI Responses API to generate a recipe in a strict JSON format.

OpenAI is used in this project for recipe generation. Configure the server with an `OPENAI_API_KEY` before using the recipe generation feature.

## Tech Stack

- React
- Vite
- OpenAI Responses API
- ESLint

## Setup

Install dependencies:

```bash
npm install
```

Create an environment file:

```bash
cp .env.example .env
```

Add your OpenAI API key:

```bash
OPENAI_API_KEY=your_openai_api_key
```

Optionally override the default model:

```bash
OPENAI_MODEL=gpt-4.1-mini
```

## Development

Start the local development server:

```bash
npm run dev
```

The recipe API is available locally at `/api/recipe` through the Vite middleware.

## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Validation

Run lint checks:

```bash
npm run lint
```

Run a production build:

```bash
npm run build
```

## Notes

- Recipe generation requires at least four ingredients.
- `OPENAI_API_KEY` must remain server-side and should not be committed.
- Static hosts such as GitHub Pages do not provide the `/api/recipe` backend by themselves. Use the Vite preview server or deploy with a backend capable of serving the API endpoint.
