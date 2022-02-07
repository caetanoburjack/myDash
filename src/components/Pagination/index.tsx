import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { PaginationItem } from "./PaginationItem";

interface PaginationProps {
    totalCountOfRegisters: number;
    registersPerPage?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
}


const siblingsAmount = 2


function generatePagesArray(from: number, to: number) {
    return [...new Array(to - from)].map((_, index) => {
        return from + index + 1
    }).filter(page => page > 0)
}

export function Pagination({
    totalCountOfRegisters,
    registersPerPage = 10,
    currentPage = 1,
    onPageChange
}: PaginationProps) {
    const lastPage = Math.ceil(totalCountOfRegisters / registersPerPage)

    const previousPages = currentPage > 1 ? generatePagesArray(currentPage - 1 - siblingsAmount, currentPage - 1) : []

    const nextPages = currentPage < lastPage ? generatePagesArray(currentPage, Math.min(currentPage + siblingsAmount, lastPage)) : []

    return (
        <Stack direction='row' mt='8' justify='space-between' align='center' spacing='6'>
            <Box>
                <b>0</b> - <b>10</b> de <b>100</b>
            </Box>
            <Stack direction='row' spacing='2'>
                {currentPage > (1 + siblingsAmount) && (
                    <>
                        <PaginationItem onPageChange={onPageChange} number={1} />
                        {currentPage > (2 + siblingsAmount) && (
                            <Text color='grey.300' width='6' textAlign='center'>...</Text>
                        )}
                    </>
                )}

                {previousPages.length > 0 && previousPages.map(page => {
                    return <PaginationItem onPageChange={onPageChange} key={page} number={page} />
                })}

                <PaginationItem onPageChange={onPageChange} number={currentPage} isCurrent />

                {nextPages.length > 0 && nextPages.map(page => {
                    return <PaginationItem onPageChange={onPageChange} key={page} number={page} />
                })}

                {(currentPage + siblingsAmount) < lastPage && (
                    <>
                        {(currentPage + 1 + siblingsAmount) < lastPage && (
                            <Text>...</Text>
                        )}
                        <PaginationItem onPageChange={onPageChange} number={lastPage} />
                    </>
                )}
            </Stack>
        </Stack>
    )
}