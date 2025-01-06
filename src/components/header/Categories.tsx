import { Box, Text, Tooltip } from "@chakra-ui/react";
import { Link } from "gatsby";

interface CategoriesProps {
  fontSize?: number | string; // fontSize를 숫자(px)나 문자열로 받을 수 있도록 정의
}

const Categories = ({ fontSize = 14 }: CategoriesProps) => {
  return (
    <Link to="/categories">
      <Box pos="relative">
        <Text
          fontSize={fontSize} // 전달된 fontSize를 사용
          fontStyle="italic"
          fontWeight={800}
          padding={1}
          _active={{ bg: "transparent" }}
        >
          Categories
        </Text>
      </Box>
    </Link>
  );
};

export default Categories;