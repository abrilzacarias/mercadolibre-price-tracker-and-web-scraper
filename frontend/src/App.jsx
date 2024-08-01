import { Flex, Container, Stack, Box, useColorModeValue } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import AddCategoryBox from "./components/AddCategoryBox";
import ListCategoryTable from "./components/ListCategoryTable";
import { categories } from "./dummy/categories";

function App() {
  return (
    <Stack minH={"100vh"}>
      <Navbar />
      <Container maxW={"1500px"} my={4} mx={4}>
        <Flex alignItems={"center"} gap={5}>
          <Box flex="1" pr={25}>
            <AddCategoryBox />
          </Box>
          <Box flex="3">
            <ListCategoryTable categories={categories} />
          </Box>
        </Flex>
      </Container>
    </Stack>
  );
}

export default App;
