import {
  Flex,
  Container,
  Stack,
  Box,
} from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import AddCategoryBox from "./components/AddCategoryBox";
import ListCategoryTable from "./components/ListCategoryTable";
import { useState } from "react";
import PriceHistoryTable from "./components/PriceHistoryTable";

export const BASE_URL = 'http://127.0.0.1:5000'

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  return (
    <Stack minH={"100vh"}>
      <Navbar />
      <Container maxW={"1500px"} my={4} mx={4}>
        <Flex alignItems={"center"} gap={5}>
          <Box flex="1" pr={25}>
            <AddCategoryBox setCategories={setCategories} categories={categories}/>
          </Box>
          <Box flex="3">
            <ListCategoryTable categories={categories} setCategories={setCategories} setSelectedCategoryId={setSelectedCategoryId}/>
          </Box>
        </Flex>

      {/* Renderiza PriceHistoryTable solo si se ha seleccionado una categoría */}
      {selectedCategoryId && (
          <PriceHistoryTable categoryId={selectedCategoryId} />
      )}
      </Container>
    </Stack>
  );
}

export default App;
