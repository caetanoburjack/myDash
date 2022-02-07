import { createServer, Factory, Model, Response, ActiveModelSerializer } from 'miragejs'
import faker from 'faker'

type User = {
    name: string;
    email: string;
    created_at: string;
}

export function makeServer() {
    const server = createServer({
        serializers: {
            application: ActiveModelSerializer
        },
        models: {
            user: Model.extend<Partial<User>>({})
        },
        factories: {
            user: Factory.extend({
                name() {
                    return faker.internet.userName()
                },
                email() {
                    return faker.internet.email().toLocaleLowerCase();
                },
                createdAt() {
                    return faker.date.recent(10);
                }
            })
        },
        seeds(server) {
            server.createList('user', 200)//AQUI INFORMO QUANTOS REGISTROS QUERO CRIAR (NESSE CASO, 200)
        },
        routes() {
            this.namespace = 'api'

            this.timing = 750;//PEQUENO DELAY PARA TESTAR ALGUMAS FIRULAS DO FRONTEND (SPINNERS, LOADINGS...)

            this.get('/users', function (schema, request) {
                const { page = 1, per_page = 10 } = request.queryParams

                const total = schema.all('user').length

                const pageStart = (Number(page) - 1) * Number(per_page)

                const pageEnd = pageStart + Number(per_page)

                const users = this.serialize(schema.all('user')).users.slice(pageStart, pageEnd)

                return new Response(
                    200,
                    { 'x-total-count': String(total) },
                    { users }
                )
            })

            this.get('/users/:id');

            this.post('/users');

            this.namespace = ''; //RESETANDO O NAMESPACE PARA N COLIDIR COM A PASTA API DO NEXTJS
            this.passthrough(); //FAZ COM QUE TODA CHAMADA PASSE PELO MIRAGE, E CASO N ENCONTRE NADA, CONTINUE SEU DESTINO KKKK
        }
    })
}