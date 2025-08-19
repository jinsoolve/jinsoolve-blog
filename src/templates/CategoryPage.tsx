import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";

import MainLayout from "../components/MainLayout";
import Pagenation from "../components/Pagenation";
import PostGrid from "../components/PostGrid";
import Profile from "../components/Profile";
import Categories from "../components/Categories";
import { DOMAIN } from "../constants";

export const query = graphql`
  query CategoryPageTemplate($category: String!, $limit: Int, $skip: Int) {
    allMdx(
      sort: { frontmatter: { createdAt: DESC } }
      filter: { frontmatter: { categories: { in: [$category] }, published: { ne: false }, locale: { eq: null } } }
      limit: $limit
      skip: $skip
    ) {
      totalCount
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
          categories
        }
        excerpt(pruneLength: 100)
      }

      pageInfo {
        currentPage
        pageCount
      }
    }
    ogimage: imageSharp(fluid: { originalName: { eq: "og-image.png" } }) {
      gatsbyImageData
    }

    profileImage: imageSharp(fluid: { originalName: { eq: "profile.jpg" } }) {
      gatsbyImageData
    }
  }
`;

interface CategoriesProps {
  pageContext: {
    category: string;
  };
  data: GatsbyTypes.CategoryPageTemplateQuery;
}

export default function CategoriesTemplate({ pageContext, data }: CategoriesProps) {
  const currentPage = data.allMdx.pageInfo.currentPage;
  const pageCount = data.allMdx.pageInfo.pageCount;
  const baseUrl = `/categories/${pageContext.category}`;

  return (
    <MainLayout>
      <Categories currentCategory={pageContext.category} />
      <PostGrid posts={data.allMdx.nodes} />
      {pageCount > 1 && <Pagenation currentPage={currentPage} pageCount={pageCount} baseUrl={baseUrl} />}
      <Profile />
    </MainLayout>
  );
}

export const Head: HeadFC<Queries.CategoryPageTemplateQuery, CategoriesProps["pageContext"]> = ({
  data,
  pageContext,
}) => {
  const ogimage = data.ogimage?.gatsbyImageData!;
  const description = "머신러닝과 알고리즘을 공부하는 김진수입니다.";
  const title = "Jinsoolve 블로그";
  const category = pageContext.category;

  return (
    <>
      {/* HTML Meta categories */}
      <title>
        {title} - {category}
      </title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* Facebook Meta categories */}
      <meta property="og:url" content={DOMAIN} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={getSrc(ogimage)} />
      {/*  Twitter Meta categories  */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="jinsoolve.netlify.app" />
      <meta property="twitter:url" content={DOMAIN} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={getSrc(ogimage)} />
      <meta name="twitter:label1" content="Category" />
      <meta name="twitter:data1" content="개발" />
    </>
  );
};
