import axios from 'axios'

export function GetDeputesInOrganisme(
  organismeSlug: string
): Promise<Types.External.NosDeputesFR.SimpleDepute[]> {
  return axios
    .get<Types.External.NosDeputesFR.DeputesWrapper>(
      `${process.env.NOSDEPUTES_BASE_URL}/organisme/${organismeSlug}/json`
    )
    .then((res) => {
      if (res.data && res.data.deputes) {
        return res.data.deputes.map((d) => d.depute)
      } else {
        return []
      }
    })
}
