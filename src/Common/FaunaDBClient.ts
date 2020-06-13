import { Client } from 'faunadb'

const client = new Client({
  secret: process.env.FAUNADB_TOKEN,
  timeout: 60,
})

export function GetProvidedFaunaDBClient(): Client {
  return client
}
