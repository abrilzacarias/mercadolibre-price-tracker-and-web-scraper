import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useColorModeValue,
  Flex,
  Spinner,
  Text
} from "@chakra-ui/react";
import { BASE_URL } from "../App";
import ModalDetails from "./ModalDetails";

const PriceChange = ({ priceChange }) => {
  // Redondear el cambio de precio a dos decimales
  const roundedPriceChange = priceChange.toFixed(2);

  // Determinar el color basado en si el cambio es positivo o negativo
  let formattedChange;
  let color;

  if (priceChange > 0) {
    formattedChange = `+${roundedPriceChange}`;
    color = 'green.500';
  } else if (priceChange < 0) {
    formattedChange = roundedPriceChange;
    color = 'red.500';
  } else {
    formattedChange = roundedPriceChange;
  }

  return (
    <Text fontWeight="bold" color={color}>
      {formattedChange}
    </Text>
  );
};

function PriceHistoryTable({ categoryId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(BASE_URL + "/pricehistory/" + categoryId);
        const data = await res.json();
        //console.log(data)
        if (!res.ok) {
          throw new Error(data.error);
        }

        setProducts(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (categoryId) {
      getProducts(); 
    }
  }, [categoryId]);

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  return (
    <>
      <TableContainer
        mt={10}
        p={4}
        pt={5}
        borderRadius={15}
        bg={useColorModeValue("gray.300", "gray.900")}
        maxWidth={"1450px"}
      >
        <Table>
          <TableCaption
            placement={"top"}
            my={0}
            py={0}
            fontSize={"l"}
            fontWeight={"bold"}
          >
            Price History
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Updated at</Th>
              <Th>Name</Th>
              <Th>Actual price</Th>
              <Th>Price change</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product) => (
              <Tr
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                _hover={{
                  background: "gray.600",
                  color: "blue.100",
                  cursor: "pointer",
                }}
              >
                <Td>{product.date}</Td>
                <Td>{product.product_name}</Td> 
                <Td>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(product.actual_price)}</Td>
                <Td><PriceChange priceChange={product.price_change} /></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {isLoading && (
        <Flex justifyContent={"center"}>
          <Spinner size={"l"} />
        </Flex>
      )}

      <ModalDetails
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={selectedProductId}
      />
    </>
  );
}
export default PriceHistoryTable;
