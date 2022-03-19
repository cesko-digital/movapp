module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        xs: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        s: '0px 2px 2px rgba(0, 0, 0, 0.02), 0px 4px 13px rgba(0, 0, 0, 0.03)',
        m: '0px 4px 7px -2px rgba(16, 24, 40, 0.03), 0px 12px 24px -4px rgba(16, 24, 40, 0.03)',
        l: '0px 4px 6px -2px rgba(16, 24, 40, 0.05), 0px 12px 16px -4px rgba(16, 24, 40, 0.1)',
        xl: '0px 8px 8px -4px rgba(16, 24, 40, 0.04), 0px 20px 24px -4px rgba(16, 24, 40, 0.1)',
        xxl: ' 0px 8px 8px -4px rgba(16, 24, 40, 0.04), 0px 24px 48px -12px rgba(16, 24, 40, 0.25)',
        xxxl: '0px 8px 8px -4px rgba(16, 24, 40, 0.04), 0px 24px 48px -12px rgba(16, 24, 40, 0.25)',
        around: '5px 5px 12px rgba(16, 24, 40, 0.25)',
      },
      colors: {
        'primary-blue': '#013ABD',
        'primary-yellow': '#FFD500',
        'primary-red': '#E42D00',
        'primary-grey': '#F5F5F5',
        'primary-black': '#2D2D2D',
      },
      borderWidth: {
        1: '1px',
      },
      backgroundImage: {
        'homepage-hero': "url('/movapp-bg.svg')",
      },
      font: {
        ['sans-pro']: "Source Sans Pro"
      }
    },
  },
  plugins: [],
};
