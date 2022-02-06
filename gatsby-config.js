/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const path = require('path');
// Get paths of Gatsby's required rules, which as of writing is located at:
// https://github.com/gatsbyjs/gatsby/tree/fbfe3f63dec23d279a27b54b4057dd611dce74bb/packages/
// gatsby/src/utils/eslint-rules
const gatsbyRequiredRules = path.join(
  process.cwd(),
  'node_modules',
  'gatsby',
  'dist',
  'utils',
  'eslint-rules'
);

module.exports = {
  pathPrefix: '/brick-breaker',
  plugins: [
    'gatsby-plugin-csp', //IF ANALYTICS DOESN'T WORK LOOK HERE
    'gatsby-plugin-postcss',
    'gatsby-plugin-preact',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-eslint',
      options: {
        rulePaths: [gatsbyRequiredRules],
        stages: ['develop'],
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        exclude: ['node_modules', 'bower_components', '.cache', 'public']
      }
    },
    { resolve: 'gatsby-plugin-html-attributes', options: { lang: 'en' } }
  ],
  siteMetadata: {
    title: 'Brick Breaker',
    description: 'Brick Breaker canvas based game',
    author: 'Jaskarn Mankoo',
    contact: '416-887-0730'
  }
};
