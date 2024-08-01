import React from "react";
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
  useColorModeValue
} from "@chakra-ui/react";
import { IoMdClose } from "react-icons/io";
import { MdDelete } from "react-icons/md";

function ListCategoryTable({ categories }) {
  return (
    <TableContainer
    maxHeight={"350px"}
            overflowY={"auto"}
            bg={useColorModeValue("gray.300", "gray.900")}
            p={4}
            borderRadius={15}>
      <Table variant="simple">
        <TableCaption>Categories of products</TableCaption>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th width="150px">Untrack</Th>
            <Th width="150px">Delete</Th>
          </Tr>
        </Thead>
        <Tbody>
          {categories.map((category) => (
            <Tr key={category.id}>
              <Td>{category.name}</Td>
              <Td>
              <Button colorScheme="yellow" size="sm">
                  <Icon as={IoMdClose} mr={1} />
                  Untrack
                </Button>
              </Td>
              <Td>
              <Button colorScheme="red" size="sm">
                  <Icon as={MdDelete} mr={1} />
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default ListCategoryTable;
