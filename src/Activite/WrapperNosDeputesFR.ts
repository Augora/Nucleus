import axios from 'axios'

export function GetActiviesBySlugFromNosDeputesFR(
  slug: string
): Promise<Types.External.NosDeputesFR.Activite> {
  return axios
    .get(
      `https://www.nosdeputes.fr/${slug}/graphes/lastyear/total?questions=true&format=json`
    )
    .then((response) => {
      const { data } = response
      return data
    })
}
