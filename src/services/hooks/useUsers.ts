import { useQuery, UseQueryResult } from "react-query"
import { api } from "../api"

type User = {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

type GetUsersResponse = {
    totalCount: number;
    users: User[];
}

export async function getUsers(page: number): Promise<GetUsersResponse> {
    {
        //ABORDAGEM UTILIZADO FETCH
        // const response = await fetch('http://localhost:3000/api/users')
        // const data = await response.json()
        //ABORDAGEM USANDO AXIOS
        const { data, headers } = await api.get('users', {
            params: {
                page,
            }
        })

        const totalCount = Number(headers['x-total-count'])

        const users = data.users.map((user) => {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                })
            }
        })
        return { users, totalCount }
    }
}

export function useUsers(page: number) {
    return useQuery(['users', page], () => getUsers(page), {
        // staleTime: 1000 * 5,//TEMPO QUE O REACT QUERY VAI CONSIDERAR UM DADO COMO FRESCO... DEPOIS DESSE TEMPO ELE JÁ O CONSIDERA ANTIGO (STALE)
        staleTime: 1000 * 60 + 10 // 1000 (um segundo), 60 (60 segundos), 10 (10 minutos)
    })
}