import { Box, Text } from "@chakra-ui/react";
import { Link } from "gatsby";

interface IntroductionProps {
  fontSize?: number | string; // fontSize를 prop으로 받음
}

const Introduction = ({ fontSize = 14 }: IntroductionProps) => {
  return (
    <Link to="/about">
      <Box pos="relative">
        <Text
          fontSize={fontSize} // 전달받은 fontSize 사용
          fontStyle="italic"
          fontWeight={800}
          padding={1}
          _active={{ bg: "transparent" }}
        >
          About
        </Text>
      </Box>
    </Link>
  );
};

export default Introduction;