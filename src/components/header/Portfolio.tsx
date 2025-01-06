import { Box, Text, Tooltip } from "@chakra-ui/react";
import { Link } from "gatsby";

interface PortfolioProps {
  fontSize?: number | string; // fontSize를 prop으로 받음
  dateText?: string; // 날짜 텍스트를 prop으로 받음
}

const Portfolio = ({ fontSize = 14, dateText }: PortfolioProps) => {
  const currentMonth = new Date().getMonth() + 1; // 현재 월
  const defaultDateText = `${currentMonth}월 안에는 꼭...`; // 기본 날짜 텍스트

  return (
    <Link to="/portfolio">
      <Box pos="relative">
        <Text
          pos="absolute"
          fontStyle="italic"
          whiteSpace="nowrap"
          top="-10px"
          left="-10px"
          fontSize={10}
          fontWeight={800}
        >
          {dateText || defaultDateText} {/* prop이 없으면 기본값 사용 */}
        </Text>
        <Tooltip label="Coming Soon!">
          <Text
            as="del"
            fontSize={fontSize} // 전달받은 fontSize 사용
            fontStyle="italic"
            fontWeight={800}
            padding={1}
            _active={{ bg: "transparent" }}
          >
            Portfolio
          </Text>
        </Tooltip>
      </Box>
    </Link>
  );
};

export default Portfolio;