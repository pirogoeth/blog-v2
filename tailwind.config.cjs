const config = {
  mode: 'jit',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
  ],
  plugins: [require('flowbite/plugin')],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        // flowbite-svelte
        primary: {
          50: '#FFF5F2',
          100: '#FFF1EE',
          200: '#FFE4DE',
          300: '#FFD5CC',
          400: '#FFBCAD',
          500: '#FE795D',
          600: '#EF562F',
          700: '#EB4F27',
          800: '#CC4522',
          900: '#A5371B'
        },
        // Dark palette
        richBlack: '#111827',
        linen: '#F9EBE0',
        tangelo: '#FB5012',
        verdigris: '#17BEBB',
        asperagus: '#749C75',
      }
    }
  }
};

module.exports = config;