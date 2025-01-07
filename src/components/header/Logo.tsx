import { Text } from "@chakra-ui/react";
import { Link } from "gatsby";
import React from "react";

const Logo = ({
                isOpen,
                onClose,
              }: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (isOpen) {
      e.preventDefault(); // 페이지 이동 방지
      onClose(); // 메뉴 닫기
    }
  };

  return (
    <Link to="/" onClick={handleClick}>
      <Text
        fontSize={24}
        fontWeight="700"
        letterSpacing="-0.3px"
        fontStyle="italic"
        _hover={{
          textDecoration: "underline",
        }}
        padding={1}
        _active={{ bg: "transparent" }}
      >
        Jinsoolve.
      </Text>
    </Link>
  );
};

export default Logo;