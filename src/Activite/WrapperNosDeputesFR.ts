import axios from 'axios'

export function GetActiviesBySlugFromNosDeputesFR(
  slug: string
): Promise<Types.External.NosDeputesFR.Activite> {
  return axios
    .get(
      `${process.env.NOSDEPUTES_BASE_URL}/${slug}/graphes/legislature/total?questions=true&format=json`
    )
    .then((response) => {
      const { data } = response
      return data
    })
}
