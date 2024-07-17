import Departements from '../StaticData/Deputes/departments.json'
import Regions from '../StaticData/Deputes/regions.json'

export function processNumeroDepartement(NomDepartement: string, slug: string) {
  if (!NomDepartement) return undefined
  if (NomDepartement === 'Français établis hors de France') {
    return '999'
  } else {
    {
      const departement = Departements.find((d) => d.name === NomDepartement)
      if (departement) {
        return departement.code
      } else {
        throw new Error(
          `${slug}: Département ${NomDepartement} introuvable dans nos données.`,
        )
      }
    }
  }
}

export function processNumeroRegion(numeroDepartement: string, slug: string) {
  if (!numeroDepartement) return undefined
  if (numeroDepartement === '999') {
    return '00'
  } else {
    const departement = Departements.find((d) => d.code === numeroDepartement)
    const region = Regions.find((r) => r.code === departement.region_code)
    if (departement && region) {
      return region.code
    } else {
      throw new Error(
        `${slug}: Département ${numeroDepartement} introuvable dans nos données.`,
      )
    }
  }
}

export function processNomRegion(numeroDepartement: string, slug: string) {
  if (!numeroDepartement) return undefined
  if (numeroDepartement === '999') {
    return 'Établis Hors de France'
  } else {
    const departement = Departements.find((d) => d.code === numeroDepartement)
    const region = Regions.find((r) => r.code === departement.region_code)
    if (departement && region) {
      return region.name
    } else {
      throw new Error(
        `${slug}: Département ${numeroDepartement} introuvable dans nos données.`,
      )
    }
  }
}