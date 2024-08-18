import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Text,
  Spinner,
  Link,
  Image,
  Box
} from "@chakra-ui/react";
import PriceHistoryChart from "./PriceHistoryChart";
import { BASE_URL } from "../App";

function ModalDetails({ isOpen, onClose, productId }) {
  const [product, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(BASE_URL + "/product/" + productId);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error);
        }
        console.log(data);
        setProduct(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      getProductDetails();
    }
  }, [productId]);

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent maxW="50vw">
        <ModalHeader>Product Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <Flex justifyContent={"center"}>
              <Spinner size={"l"} />
            </Flex>
          ) : product ? (
            <>
              <Flex alignItems="center">
                {/* Imagen a la izquierda */}
                <Box flex="1" mr={[4, 4, 4]} >
                  <Image       
                  objectFit="contain" 
                  boxSize="150px" src={product.img} alt="Product image" />
                </Box>

                {/* Detalles a la derecha */}
                <Box fontSize="lg" flex="2" >
                  <Text >
                    <Text as="span" fontWeight="bold">
                      Name:
                    </Text>{" "}
                    {product.name}
                  </Text>

                  <Text>
                    <Text as="span" fontWeight="bold">
                      Price:
                    </Text>{" "}
                    {new Intl.NumberFormat('es-AR', {
                      style: 'currency',
                      currency: 'ARS'
                    }).format(Number(product.price))}
                  </Text>

                  <Text>
                    <Text as="span" fontWeight="bold">
                      Source:
                    </Text>{" "}
                    {product.source}
                  </Text>

                  <Text>
                    <Text as="span" fontWeight="bold">
                      URL:{" "}
                    </Text>
                    <Link
                      isExternal
                      _hover={{
                        color: "blue.500",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      href={product.url}
                    >
                      View product
                    </Link>
                  </Text>
                </Box>
              </Flex>

              <Box mt={4}
              width='auto' // Adjust width for different screen sizes
              pt={4}
              margin="auto"
              >
                <PriceHistoryChart productId={productId} />
              </Box>
            
            </>
          ) : (
            <Text>No product details found.</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ModalDetails;
