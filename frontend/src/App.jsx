import { Flex, Container, Stack, Box, Text, Spinner } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import AddCategoryBox from "./components/AddCategoryBox";
import React, { useState, Suspense } from "react";

export const BASE_URL =
  import.meta.env.MODE === "development" ? "http://127.0.0.1:5000" : "";
const ListCategoryTable = React.lazy(() =>
  import("./components/ListCategoryTable")
);
const PriceHistoryTable = React.lazy(() =>
  import("./components/PriceHistoryTable")
);

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  return (
    <Stack>
      <Navbar />
      <Container maxW={"1500px"} my={4}>
        <Flex
          gap={5}
          alignItems={"flex-start"}
          direction={{ base: "column", md: "row" }}
        >
          <Box
            flex="1"
            width={{ base: "100%", md: "auto" }}
            pr={{ base: 0, md: 25 }}
          >
            {" "}
            {/* Adjusted flex value to make AddCategoryBox smaller */}
            <AddCategoryBox
              setCategories={setCategories}
              categories={categories}
            />
          </Box>
          <Box flex="3" width={{ base: "100%", md: "auto" }}>
            {" "}
            {/* Larger flex value for ListCategoryTable */}
            <Suspense fallback={<div>Loading...</div>}>
              <ListCategoryTable
                categories={categories}
                setCategories={setCategories}
                setSelectedCategoryId={setSelectedCategoryId}
              />
            </Suspense>
          </Box>
        </Flex>

        {selectedCategoryId && (
          <Suspense
            fallback={
              <Flex justify="center" align="center">
                <Text fontSize="xl">Loading...</Text>
                <Spinner size="xl" />
              </Flex>
            }
          >
            <PriceHistoryTable categoryId={selectedCategoryId} />
          </Suspense>
        )}
      </Container>
    </Stack>
  );
}

export default App;
