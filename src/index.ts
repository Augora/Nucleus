import faunadb from "faunadb";

import { manageDeputes } from "./Tools/Deputes";
import "./Types/External/NosDeputesFR/Depute";
import "./Types/Canonical/Activity";
import "./Types/Canonical/Depute";
import "./Types/Canonical/Adresse";
import "./Types/Canonical/AncienMandat";

const client = new faunadb.Client({
  secret: process.env.FAUNADB_TOKEN,
  timeout: 60
});

manageDeputes(client).then(() => console.log("The end."));
