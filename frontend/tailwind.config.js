export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'medical-blue': '#00A8E8',
        'dark-bg': '#0a0a0a',
        'card-bg': '#1a1a1a',
        'accent-blue': '#0099CC',
      },
      fontSize: {
        'hero': '5rem',
        'section': '2.8rem',
      },
      fontFamily: {
        'heading': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  },
  plugins: []
}
