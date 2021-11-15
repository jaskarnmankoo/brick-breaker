import * as React from 'react';

import { useStaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';

export default function SearchEngineOptimization({
  lang = 'en',
  gameMode,
  title
}) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  );

  return (
    <Helmet
      bodyAttributes={{ class: 'dark:bg-dark-mode dark:text-white' }}
      htmlAttributes={{
        lang,
        class: `${gameMode ? 'overflow-hidden' : 'overflow-x-hidden'}`
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: 'description',
          content: site.siteMetadata.description
        },
        { property: 'og:title', content: title },
        {
          property: 'og:description',
          content: site.siteMetadata.description
        },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary' },
        {
          name: 'twitter:creator',
          content: site.siteMetadata.author
        },
        { name: 'twitter:title', content: title },
        {
          name: 'twitter:description',
          content: site.siteMetadata.description
        }
      ]}
    />
  );
}
