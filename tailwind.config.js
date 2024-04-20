/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,tsx,js,ts}"],
  theme: {
    extend: {
		gridTemplateColumns: {
			// Simple auto column grid
			autofill: 'repeat(auto-fit, minmax(300px, 1fr))',
		},
	},
  },
  plugins: [],
}
