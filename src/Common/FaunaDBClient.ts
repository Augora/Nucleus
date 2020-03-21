import faunadb from "faunadb";

const client = new faunadb.Client({
  secret:
    process.env.FAUNADB_TOKEN || "fnADnUGjaLACC37ZGjw9dwMr7cY2AFZn312KFOdW",
  timeout: 60
});

export function GetProvidedFaunaDBClient(): faunadb.Client {
  return client;
}
