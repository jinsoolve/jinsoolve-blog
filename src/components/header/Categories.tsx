import { Box, Text, Tooltip } from "@chakra-ui/react";
import { Link } from "gatsby";

const Categories = () => {
    return (
        <Link to="/categories">
            <Box pos="relative">
                <Text
                    fontSize={14}
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
