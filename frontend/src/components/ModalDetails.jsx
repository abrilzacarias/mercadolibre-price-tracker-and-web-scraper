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
    <Modal onClose={onClose} isOpen={isOpen} size={['sm', 'md']}>
      <ModalOverlay />
      <ModalContent
        maxW={{ base: '90vw', md: '60vw', lg: '40vw' }} // Adjust the width for different screen sizes
        mx="auto" // Center the modal horizontally
        mt={['20px', '50px']} // Margin-top for different screen sizes
        mb={['20px', '50px']} // Margin-bottom for different screen sizes
      >
        <ModalHeader>Product Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <Flex justifyContent="center">
              <Spinner size="lg" />
            </Flex>
          ) : product ? (
            <>
              <Flex direction={['column', 'row']} alignItems="center">
                {/* Image on top for mobile */}
                <Box flex="1" mb={[4, 0]} mr={[0, 4]}>
                  <Image
                    objectFit="contain"
                    boxSize={['150px', '200px']}
                    src={product.img}
                    alt="Product image"
                  />
                </Box>

                {/* Details on top for mobile */}
                <Box flex="2" fontSize="lg">
                  <Text>
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

              <Box mt={4}>
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