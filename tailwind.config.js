/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/**/*.{vue,js,ts,jsx,tsx}",
        "./components/**/*.{vue,js,ts,jsx,tsx}",
        "./layouts/**/*.{vue,js,ts,jsx,tsx}",
        "./pages/**/*.{vue,js,ts,jsx,tsx}",
        "./plugins/**/*.{vue,js,ts,jsx,tsx}",
        "./app.vue",
        "./error.vue"
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}