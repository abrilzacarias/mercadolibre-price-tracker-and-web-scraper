import React, { useState } from "react";
import {
  Box,
  FormControl,
  Input,
  Button,
  useColorModeValue,
  useToast,
  Flex
} from "@chakra-ui/react";
import { BASE_URL } from "../App";

function AddCategoryBox( {setCategories, categories}) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast()

  const handleAddCategory = async (e) =>  {
    e.preventDefault()
    setIsLoading(true)

    if (categories.some((category) => category.name.toLowerCase() === input.toLowerCase())) {
      toast({
        title: 'Category Already Exists',
        description: 'The category you are trying to add already exists.',
        status: 'info',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(BASE_URL + "/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: input })
      })

      const data = await res.json()
      if(!res.ok) {
        throw new Error(data.error)
      } 

      const newCategory = { ...data, tracked: true };
      setCategories((prevCategories) => [...prevCategories, newCategory])

      toast({
        title: 'Scraping Completed.',
        description: "The data has been scraped correctly and is now available.",
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top'
      })
      
      

    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      })
    } finally {
      setInput('')
      setIsLoading(false)
    }
  }

  return (
    <Box
      px={4}
      py={4}
      borderRadius={15}
      bg={useColorModeValue("gray.300", "gray.900")}
    >
      <form onSubmit={handleAddCategory}>
        <FormControl>
          <Input
            placeholder="Add product"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </FormControl>


        <Flex mt={1} justify="center"> {/* Flex para centrar el botón */}
        <Button colorScheme="blue" mt={3} type="submit"
        width="100%"
        isLoading={isLoading}
        >
          Add 
        </Button>
        </Flex>
      </form>
    </Box>
  );
}

export default AddCategoryBox;
