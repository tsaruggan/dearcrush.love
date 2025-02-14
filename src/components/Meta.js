// components/Meta.js
import Head from 'next/head';

const Meta = ({ title, description, image }) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://dearcrush.love" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="twitter:card" content="skibidi" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={`/images/${image}`} />
  </Head>
);

export default Meta;
