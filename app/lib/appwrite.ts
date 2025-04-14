import { Account, Client } from 'appwrite';

const client = new Client()

console.log('appwrite key', process.env.APPWRITE_URL)

try {client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL!)}
catch (e){
    console.log("setendpoint err: ", e.message)
}

try {client.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)}
catch (e){
    console.log("setproject err: ", e.message)
}

export const account = new Account(client);

export { ID } from 'appwrite';
