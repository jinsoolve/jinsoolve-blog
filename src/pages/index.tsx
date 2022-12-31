import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";

import MainLayout from "../components/MainLayout";
import PostGrid from "../components/PostGrid";
import Tags from "../components/Tags";
import { ALL_POSTS_TAG_NAME } from "../constants";

export const query = graphql`
  query IndexPage {
    allPosts: allMdx(sort: { frontmatter: { createdAt: DESC } }) {
      nodes {
        frontmatter {
          thumbnail {
            childImageSharp {
              gatsbyImageData
            }
          }
          title
          updatedAt
          createdAt
          description
          slug
          tags
        }
      }
    }
    ogimage: imageSharp(fluid: { originalName: { eq: "og-image.png" } }) {
      gatsbyImageData
    }
  }
`;

interface IndexPageProps {
  data: GatsbyTypes.IndexPageQuery;
}

const IndexPage = ({ data }: IndexPageProps) => {
  return (
    <MainLayout>
      <Tags currentTag={ALL_POSTS_TAG_NAME} />
      <PostGrid posts={data.allPosts.nodes} />
    </MainLayout>
  );
};

export default IndexPage;

export const Head: HeadFC<Queries.IndexPageQuery> = ({ data }) => {
  const ogimage = data.ogimage?.gatsbyImageData!;
  const description = "웹 프론트엔드 개발자 정현수입니다.";
  const title = "정현수 기술 블로그";
  const domain = "https://junghyeonsu-dev.vercel.app";

  return (
    <>
      {/* HTML Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* Facebook Meta Tags */}
      <meta property="og:url" content={domain} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={getSrc(ogimage)} />
      {/*  Twitter Meta Tags  */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="junghyeonsu-dev.vercel.app" />
      <meta property="twitter:url" content={domain} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={getSrc(ogimage)} />
      <meta name="twitter:label1" content="Category" />
      <meta name="twitter:data1" content="개발" />
    </>
  );
};
