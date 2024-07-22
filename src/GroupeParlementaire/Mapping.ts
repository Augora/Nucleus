import GroupesParlementaires from '../StaticData/GroupesParlementaires/GroupesParlemetaires.json'

export function GetSigleInLocalFile(NomComplet: string) {
  const groupe = GroupesParlementaires.find((d) => d.NomComplet === NomComplet)
  return groupe.Sigle
}
