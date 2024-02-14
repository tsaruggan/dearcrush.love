// components/Meta.js
import Head from 'next/head';

const Meta = ({ title, description, image }) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />

    {/* Open Graph meta tags */}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://dearcrush.love" />
  </Head>
);

export default Meta;
