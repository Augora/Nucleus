import { ManageDeputes } from "./Depute/Manager";
import "./Types/External/NosDeputesFR/Deputes";
import "./Types/External/NosDeputesFR/Depute";
import "./Types/Canonical/Activity";
import "./Types/Canonical/Depute";
import "./Types/Canonical/Adresse";
import "./Types/Canonical/AncienMandat";
import "./Types/Canonical/AutreMandat";

ManageDeputes().then(() => console.log("The end."));
