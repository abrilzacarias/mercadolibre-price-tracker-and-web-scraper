import {
  Flex,
  Container,
  Stack,
  Box,
} from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import AddCategoryBox from "./components/AddCategoryBox";
import React, { useState, Suspense } from "react";


export const BASE_URL = import.meta.env.MODE === "development" ? "http://127.0.0.1:5000/api" : "/api";
const ListCategoryTable = React.lazy(() => import("./components/ListCategoryTable"));
const PriceHistoryTable = React.lazy(() => import("./components/PriceHistoryTable"));

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  return (
    <Stack minH={"100vh"}>
      <Navbar />
      <Container maxW={"1500px"} my={4} mx={4}>
      <Flex alignItems={"center"} gap={5}>
          <Box flex="1" pr={25}> {/* Adjusted flex value to make AddCategoryBox smaller */}
            <AddCategoryBox setCategories={setCategories} categories={categories}/>
          </Box>
          <Box flex="3"> {/* Larger flex value for ListCategoryTable */}
            <Suspense fallback={<div>Loading...</div>}>
              <ListCategoryTable categories={categories} setCategories={setCategories} setSelectedCategoryId={setSelectedCategoryId}/>
            </Suspense>
          </Box>
        </Flex>

      {/* Renderiza PriceHistoryTable solo si se ha seleccionado una categoría */}
      {selectedCategoryId && (
          <Suspense fallback={<div>Loading...</div>}>
          <PriceHistoryTable categoryId={selectedCategoryId} />
        </Suspense>
      )}
      </Container>
    </Stack>
  );
}

export default App;
