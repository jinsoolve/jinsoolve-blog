import { Box } from "@chakra-ui/react";

import Footer from "./Footer";
import Header from "./header/Header";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        maxWidth={1100}
        margin="auto"
        overflowX="hidden" // 가로 스크롤 방지
        width="100%" // Box가 부모 요소를 완전히 채우도록 설정
      >
        {children}
      </Box>
      <Footer />
    </>
  );
};

export default MainLayout;