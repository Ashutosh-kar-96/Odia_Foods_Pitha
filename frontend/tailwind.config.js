/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // temple: "#8f1d14",
        // sindoor: "#c73a1d",
        // haldi: "#f4b63f",
        // palm: "#236449",
        // rice: "#fff8ec",
        // clay: "#b76336",
        // ink: "#25130d"
        temple: '#1A3A7A',  // navy blue
        sindoor: '#2DB843',  // bright green  
        haldi: '#5BC8F0',  // sky blue
        rice: '#F0F8FF',  // light blue-white background
        clay: '#4A6FA8',  // mid navy (muted text)
        ink: '#1A2B4A',  // dark navy (body text)
      },
      boxShadow: {
        soft: "0 20px 60px rgba(91, 40, 16, 0.14)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Georgia", "serif"]
      },
      keyframes: {
        floatIn: {
          "0%": { opacity: 0, transform: "translateY(18px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" }
        }
      },
      animation: {
        floatIn: "floatIn .7s ease both",
        shimmer: "shimmer 2s linear infinite"
      }
    }
  },
  plugins: []
};
