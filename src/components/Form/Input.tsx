import { forwardRef, ForwardRefRenderFunction } from "react";
import { FormControl, FormErrorMessage, FormLabel, Input as ChakraInput, InputProps as ChakraInputProps } from "@chakra-ui/react";
import { FieldError } from "react-hook-form";


interface InputProps extends ChakraInputProps {
    name: string;
    label?: string;
    error?: FieldError;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
    { name, label, error, ...rest },
    ref) => {
    return (
        <FormControl isInvalid={!!error}>
            {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
            <ChakraInput ref={ref} name={name} id={name} type="text" focusBorderColor='pink.500' bgColor='gray.900' variant='filled' size="lg" _hover={{ bgColor: 'gray.900' }} {...rest} />
            {!!error && (
                <FormErrorMessage>
                    {error.message}
                </FormErrorMessage>
            )}
        </FormControl>
    )
}

export const Input = forwardRef(InputBase)