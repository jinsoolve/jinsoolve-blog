import { Center, Flex } from "@chakra-ui/react";
import { Link } from "gatsby";

interface PagenationProps {
  pageCount: number;
  currentPage: number;
  baseUrl: string; // baseUrl을 추가하여 기본 주소를 받아옵니다
}

const Pagenation = ({ pageCount, currentPage, baseUrl="" }: PagenationProps) => {
  return (
    <Flex gap="10px">
      {Array.from({ length: pageCount }).map((_, i) => {
        const pageNumber = i + 1;
        const pageUrl = pageNumber === 1 ? `${baseUrl}/` : `${baseUrl}/${pageNumber}`; // 1페이지는 baseUrl만, 나머지는 baseUrl/페이지번호로
        return (
          <Link key={i} to={pageUrl}>
            <Center
              width="30px"
              height="30px"
              borderRadius="50%"
              fontWeight="bold"
              border={pageNumber === currentPage ? "2px solid" : "none"}
              _hover={{
                backgroundColor: "gray.50",
                color: "gray.900",
              }}
            >
              {pageNumber}
            </Center>
          </Link>
        );
      })}
    </Flex>
  );
};

export default Pagenation;