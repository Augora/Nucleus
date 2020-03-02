import faunadb from "faunadb";

import { manageDeputes } from "./Tools/Deputes";
import "./Types/External/NosDeputesFR/Depute";
import "./Types/Canonical/Activity";
import "./Types/Canonical/Depute";
import "./Types/Canonical/Adresse";

const client = new faunadb.Client({
  secret: process.env.FAUNADB_TOKEN
});

manageDeputes(client).then(() => console.log("The end."));
