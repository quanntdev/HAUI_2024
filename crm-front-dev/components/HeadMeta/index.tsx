import Head from "next/head";

const HeadMeta = (props: any) => {
  const { title, param } = props;
  return (
    <>
      <Head>
        {!param ? (
          <title>
            {title.concat(" | ", "HapoCRM")}
          </title>
        ) : (
          <title>
            {title.concat(" - ", param)}
          </title>
        )}
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name={title} content={param}></meta>
      </Head>
    </>
  );
};

export default HeadMeta;
