import React from "react";
import {
  Box,
  FormControl,
  Input,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";

function AddCategoryBox() {
  return (
    <Box px={4} py={4}
    borderRadius={15}
    bg={useColorModeValue("gray.300", "gray.900")}
    >
      <form>
        <FormControl>
          <Input
            placeholder="Add product"
            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
          />
        </FormControl>

        <Button colorScheme="blue" mt={3} type="submit" >
          Add
        </Button>
      </form>
    </Box>
  );
}

export default AddCategoryBox;
