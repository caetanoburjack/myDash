import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import Link from "next/link";
import { useMutation } from 'react-query'
import { api } from "../../services/api";
import { queryClient } from "../../services/queryClient";
import router from "next/router";

type CreateUserFormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

const createUserFormSchema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório!'),
    email: yup.string().required('E-mail é obrigatório!').email('Digite um e-mail válido!'),
    password: yup.string().required('Senha é obrigatória!').min(6, 'Senha de no mínimo 6 caracteres!'),
    password_confirmation: yup.string().oneOf([null, yup.ref('password')], 'As senhas devem ser iguais!')
})

export default function CreateUser() {
    const createUser = useMutation(async (user: CreateUserFormData) => {
        const response = await api.post('users', {
            user: {
                ...user,
                created_at: new Date()
            }
        })
        return response.data.user;
    }, {
        onSuccess: () => {//TODA VEZ QUE UM USUÁRIO FOR CADASTRADO, É IMPORTANTE INVALIDAR AS QUERIES, 
            //PARA QUE SE ATUALIZE O CACHE E SE ADICIONE O NOVO REGISTRO A LISTA
            queryClient.invalidateQueries('users')
        }
    })

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(createUserFormSchema)
    })

    const handleCreateUser: SubmitHandler<CreateUserFormData> = async (values) => {
        await createUser.mutateAsync(values)

        router.push('/users')
        //console.log(values);
    }

    return (
        <Box>
            <Header />
            <Flex w='100%' my='6' maxWidth={1480} mx='auto' px='6'>
                <Sidebar />
                <Box as='form' onSubmit={handleSubmit(handleCreateUser)} flex='1' borderRadius={8} bg='gray.800' p={['4', '4', '6']}>
                    <Heading size='lg' fontWeight='normal'>Criar Usuário</Heading>
                    <Divider my='6' borderColor='gray.700' />

                    <VStack spacing={['4', '4', '6']}>
                        <SimpleGrid minChildWidth='240px' spacing={['4', '4', '6']} w='100%'>
                            <Input name='name' label='Nome Completo'  {...register('name')} error={errors.name} />
                            <Input name='email' type='email' label='E-mail' {...register('email')} error={errors.email} />
                        </SimpleGrid>

                        <SimpleGrid minChildWidth='240px' spacing={['4', '4', '6']} w='100%'>
                            <Input name='password' type='password' label='Senha'  {...register('password')} error={errors.password} />
                            <Input name='password_confirmation' type='password' label='Confirmação de Senha'  {...register('password_confirmation')} error={errors.password_confirmation} />
                        </SimpleGrid>
                    </VStack>
                    <Flex mt={['4', '4', '6']} justify='flex-end'>
                        <HStack spacing='4'>
                            <Link href='/users' passHref>
                                <Button as='a' colorScheme='whiteAlpha'>Cancelar</Button>
                            </Link>
                            <Button isLoading={isSubmitting} type='submit' colorScheme='pink'>Salvar</Button>
                        </HStack>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    )
}