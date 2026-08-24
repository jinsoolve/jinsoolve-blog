import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";

import MainLayout from "../components/MainLayout";
import Pagenation from "../components/Pagenation";
import PostGrid from "../components/PostGrid";
import Profile from "../components/Profile";
import Categories from "../components/Categories";
import { ALL_POSTS_CATEGORY_NAME, DOMAIN } from "../constants";

export const query = graphql`
  fragment AllCategoryMdxContent on Mdx {
    frontmatter {
      thumbnail {
        childImageSharp {
          gatsbyImageData(
            width: 290
            height: 171
            layout: CONSTRAINED
            sizes: "(max-width: 660px) 80vw, 290px"
            outputPixelDensities: [1, 2]
            transformOptions: { fit: COVER }
          )
        }
      }
      title
      updatedAt
      createdAt
      description
      slug
    }
    excerpt(pruneLength: 100)
  }

  query AllCategoryPostPageTemplate($limit: Int, $skip: Int) {
    # locale은 null인것만 가져옴 (ko)
    allMdx(
      filter: {
        frontmatter: {
          title: { nin: ["김진수 포트폴리오", "About Me"] }
          published: { ne: false }
          locale: { eq: null }
        }
      }
      sort: { frontmatter: { createdAt: DESC } }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        ...AllCategoryMdxContent
      }

      pageInfo {
        currentPage
        pageCount
      }
    }

    ogimage: file(relativePath: { eq: "og-image.png" }) {
      publicURL
    }

  }
`;

interface AllPostPageTemplateProps {
  data: Queries.AllCategoryPostPageTemplateQuery;
}

export default function AllPostPageTemplate({ data }: AllPostPageTemplateProps) {
  const currentPage = data.allMdx.pageInfo.currentPage;
  const pageCount = data.allMdx.pageInfo.pageCount;

  return (
    <MainLayout>
      <Categories currentCategory={ALL_POSTS_CATEGORY_NAME} />

      <PostGrid posts={data.allMdx.nodes} />
      {pageCount > 1 && <Pagenation currentPage={currentPage} pageCount={pageCount} baseUrl="/categories" />}
      <Profile />
    </MainLayout>
  );
}

export const Head: HeadFC<Queries.AllCategoryPostPageTemplateQuery> = ({ data }) => {
  const ogimage = data.ogimage?.publicURL ?? undefined;
  const description = "머신러닝과 알고리즘을 공부하는 김진수 입니다.";
  const title = "Jinsoolve 블로그";

  return (
    <>
      {/* HTML Meta categories */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* Facebook Meta categories */}
      <meta property="og:url" content={DOMAIN} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogimage} />
      {/*  Twitter Meta categories  */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="jinsoolve.netlify.app" />
      <meta property="twitter:url" content={DOMAIN} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogimage} />
      <meta name="twitter:label1" content="Category" />
      <meta name="twitter:data1" content="개발" />
    </>
  );
};
