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
  Button,
  Icon,
  useColorModeValue,
  Flex,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { IoMdClose } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { BASE_URL } from "../App";

function ListCategoryTable({ categories, setCategories, setSelectedCategoryId }) {
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch(BASE_URL + "/category");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }

        setCategories(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getCategories();
  }, [setCategories]);

  const handleDeleteCategory = async (category) => {
    try {
      const res = await fetch(BASE_URL + "/category/" + category.id, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      setCategories((prevCategories) =>
        prevCategories.filter((c) => c.id !== category.id)
      );
      toast({
        title: "Category deleted successfully.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "An error occurred",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const captionText =
    categories.length === 0 ? "No categories found." : "Product Categories";

    const handleCategoryClick = (categoryId) => {
      setSelectedCategoryId(categoryId);
    };

    const handleUpdateTracked = async (category) => {
      try {
        const res = await fetch(BASE_URL + `/tracked-category/${category.id}`, {
          method: "PUT",  // Usamos PUT para actualizar
        });
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.error);
        }
  
        // Actualiza la categoría en el estado local
        setCategories((prevCategories) =>
          prevCategories.map((c) =>
            c.id === category.id ? { ...c, tracked: !c.tracked } : c
          )
        );
  
        toast({
          title: `Category ${category.tracked ? "untracked" : "tracked"} successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } catch (error) {
        toast({
          title: "An error occurred",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    };

  return (
    <>
      <TableContainer
        maxHeight={"350px"}
        overflowY={"auto"}
        bg={useColorModeValue("gray.300", "gray.900")}
        p={4}
        borderRadius={15}
      >
        <Table variant="simple">
          <TableCaption
            placement={"top"}
            my={0}
            py={0}
            fontSize={"l"}
            fontWeight={"bold"}
          >
              <Text fontSize={"xl"} fontWeight={"bold"}>
                {captionText}
              </Text>
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th width="250px">Track/Untrack</Th>
              <Th width="250px">Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories.map((category) => (
              <Tr key={category.id}>
                <Td
                _hover={{
                  background: "gray.600",
                  color: "blue.100",
                  cursor: "pointer"
                }}
                onClick={() => handleCategoryClick(category.id)}>
                {category.name}
                </Td>
                <Td>
                <Button
                    colorScheme={category.tracked ? "yellow" : "blue"}
                    size="sm"
                    onClick={() => handleUpdateTracked(category)}
                  >
                    <Icon as={IoMdClose} mr={1} />
                    {category.tracked ? "Untrack" : "Track"}
                  </Button>
                </Td>
                <Td>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <Icon as={MdDelete} mr={1} />
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
            {isLoading && (
            <Tr>
              <Td colSpan="3" textAlign="center">
                <Spinner size={"lg"} />
              </Td>
            </Tr>
          )}
          </Tbody>
        </Table>
      </TableContainer>

      
    </>
  );
}

export default ListCategoryTable;
