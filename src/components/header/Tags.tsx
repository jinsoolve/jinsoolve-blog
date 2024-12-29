import { Box, Text, Tooltip } from "@chakra-ui/react";
import { Link } from "gatsby";

const Tags = () => {
    return (
        <Link to="/tags">
            <Box pos="relative">
                <Text
                    fontSize={14}
                    fontStyle="italic"
                    fontWeight={800}
                    padding={1}
                    _active={{ bg: "transparent" }}
                >
                    Tags
                </Text>
            </Box>
        </Link>
    );
};

export default Tags;
