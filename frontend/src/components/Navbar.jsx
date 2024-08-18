import {
  Container,
  Box,
  Flex,
  Text,
  Button,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import React from "react";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";

function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Container maxWidth={"full"} px={0}>
      <Box
        px={4}
        bg={useColorModeValue("gray.300", "gray.900")}
      >
        <Flex h='16' alignItems={"center"} justifyContent={"space-between"}>
					{/* Left side */}
					<Flex
						alignItems={"center"}
						justifyContent={"center"}
						gap={3}
						display={{ base: "none", sm: "flex" }}
					>
						<Text fontSize={"lg"} fontWeight={600}>
            MercadoLibre Product Price Tracker and Web Scraper
						</Text>
					</Flex>
					{/* Right side */}
					<Flex gap={3} alignItems={"center"}>
						

						<Button onClick={toggleColorMode}>
							{colorMode === "light" ? <IoMoon /> : <LuSun size={20} />}
						</Button>

					</Flex>
				</Flex>
      </Box>
    </Container>
  );
}

export default Navbar;
