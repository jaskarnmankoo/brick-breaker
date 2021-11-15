module.exports = {
  pathPrefix: '/brick-breaker',
  plugins: [
    'gatsby-plugin-csp',
    'gatsby-plugin-postcss',
    'gatsby-plugin-preact',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-html-attributes',
      options: {
        lang: 'en'
      }
    }
  ],
  siteMetadata: {
    title: 'Brick Breaker',
    description: 'Single player version of Brick Breaker',
    author: 'Jaskarn Mankoo'
  }
};
