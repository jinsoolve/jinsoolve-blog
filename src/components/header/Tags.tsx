import { Box, Text } from "@chakra-ui/react";
import { Link } from "gatsby";

interface TagsProps {
  fontSize?: number | string; // fontSize를 prop으로 받음
}

const Tags = ({ fontSize = 14 }: TagsProps) => {
  return (
    <Link to="/tags">
      <Box pos="relative">
        <Text
          fontSize={fontSize} // 전달받은 fontSize 사용
          fontStyle="italic"
          fontWeight={800}
          padding={1}
          _active={{ bg: "transparent" }}
          _hover={{
            textDecoration: "underline",
          }}
        >
          Tags
        </Text>
      </Box>
    </Link>
  );
};

export default Tags;