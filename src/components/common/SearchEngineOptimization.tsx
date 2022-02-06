import * as React from 'react';

import { useStaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';

interface Props {
  difficulty?: string;
  lang?: string;
  title: string;
}

/** Creates Search Engine Optimization when specified on a page */
export default function SearchEngineOptimization({
  difficulty,
  lang = 'en',
  title
}: Props): JSX.Element {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            contact
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
        class: `${difficulty ? 'overflow-hidden' : 'overflow-x-hidden'}`
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
    >
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: site.siteMetadata.title,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: site.siteMetadata.contact,
            contactType: 'Customer service'
          }
        })}
      </script>
    </Helmet>
  );
}
