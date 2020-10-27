const base = {
  '8': '2rem',
  '12': '3rem',
  '16': '4rem',
  '24': '6rem',
  '32': '8rem',
  '40': '10rem',
  '48': '12rem',
  '56': '14rem',
  '64': '16rem',
  '72': '18rem',
  '80': '20rem',
  '88': '22rem',
  '96': '24rem',
}

const extra = {
  '72': '18rem',
  '80': '20rem',
  '88': '22rem',
  '96': '24rem',
  '104': '26rem',
  '112': '28rem',
  '120': '30rem',
  '128': '32rem',
}

const percent = {
  '1_2': '50%',
  '1_3': '33.33%',
  '2_3': '66.66%',
  '1_4': '25%',
  '3_4': '75%',
  '1_5': '20%',
  '2_5': '40%',
  '3_5': '60%',
  '4_5': '80%',
  'full': '100%',
}

module.exports = {
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'active'],
    borderColor: ['responsive', 'hover', 'focus', 'active'],
  },
  purge: {
    content: [
      './src/**/*.pug'
    ],
    whitelist: ['html'],
    // Include any special characters you're using in this regular expression
    defaultExtractor: content => content.match(/[A-Za-z0-9-_/]+/g) || []
  },
  theme: {
    extend: {
      width: Object.assign({

      }, extra, percent),
    },
  },
  separator: '_',
  corePlugins: {
    container: false,
  }
}