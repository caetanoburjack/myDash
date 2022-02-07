import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
interface ProfileProps {
    showProfileData?: boolean;
}
export function Profile({ showProfileData = true }: ProfileProps) {
    return (
        <Flex align='center' ml='auto'>
            {showProfileData && (
                <Box mr='4' textAlign='right'>
                    <Text>Caetano Burjack</Text>
                    <Text color='gray.300' fontSize='small'>caetano.burjack@gmail.com</Text>
                </Box>
            )}
            <Avatar size='md' name='Caetano Burjack' src='https://github.com/caetanoburjack.png' />
        </Flex>
    )
}