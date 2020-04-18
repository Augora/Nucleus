import faunadb from 'faunadb'

const client = new faunadb.Client({
  secret: process.env.FAUNADB_TOKEN,
  timeout: 60,
})

export function GetProvidedFaunaDBClient(): faunadb.Client {
  return client
}
