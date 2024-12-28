import { Box, Text, Tooltip } from "@chakra-ui/react";
import { Link } from "gatsby";




// const Introduction = () => {
//   return (
//     <a href="https://hyeonsu-jung.vercel.app/" target="_blank" rel="noreferrer">
//       <Text
//         fontSize={14}
//         fontStyle="italic"
//         fontWeight={800}
//         _hover={{
//           textDecoration: "underline",
//         }}
//         padding={1}
//         _active={{ bg: "transparent" }}
//       >
//         About
//       </Text>
//     </a>
//   );
// };

const Introduction = () => {
    return (
        <Link to="/about">
            <Box pos="relative">
                <Text
                    fontSize={14}
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
