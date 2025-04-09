import { Account, Client } from 'appwrite';

const client = new Client()

console.log('appwrite key', process.env.APPWRITE_URL)

client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL!)
client.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)

export const account = new Account(client);

export { ID } from 'appwrite';
