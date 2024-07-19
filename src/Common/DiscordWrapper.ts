import axios from 'axios'
import dayjs from 'dayjs'
import "dayjs/locale/fr"

const colors = {
  error: 13632027,
  warning: 16312092,
  success: 8311585,
}
import { Database } from '../../Types/database.types'
type GroupeParlementaire =
  Database['public']['Tables']['GroupeParlementaire']['Insert']
type Depute = Database['public']['Tables']['Depute']['Insert']

const envFullName =
  process.env.SUPABASE_ENV === 'Production' ? 'Production' : 'Staging'
const githubActionRunUrl = process.env.GITHUB_RUN_URL

const augoraDomain =
  process.env.SUPABASE_ENV === 'Production' ? 'augora.fr' : 'preprod.augora.fr'


export function SendNewDeputeNotification(depute: Depute) {
  return process.env.DISCORD_NOTIFICATION === 'true'
    ? axios
      .post(process.env.DISCORD_WEBHOOK_URL, {
        avatar_url:
          'https://avatars.githubusercontent.com/u/44036562?s=200&v=4',
        username: 'GitHub Actions',
        embeds: [
          {
            title: `Nucleus ${envFullName}`,
            description: `<https://${augoraDomain}/depute/${depute.Slug}|${depute.Nom}>, député ${depute.GroupeParlementaire} a été ajouté en base.`,
            color: colors.warning,
            timestamp: "2024-06-26T09:01:23.134Z",
          },
        ],
      })
      .then((res) => res.data)
    : Promise.resolve()
}

export function SendDeputeChangeGroupNotification(
  previousDepute: Depute,
  depute: Depute
) {
  return process.env.DISCORD_NOTIFICATION === 'true'
    ? axios
      .post(process.env.DISCORD_WEBHOOK_URL, {
        avatar_url:
          'https://avatars.githubusercontent.com/u/44036562?s=200&v=4',
        username: 'GitHub Actions',
        embeds: [
          {
            title: `Nucleus ${envFullName}`,
            description: `<https://${augoraDomain}/depute/${depute.Slug}|${depute.Nom}> a changé de groupe parlementaire :  transition de ${previousDepute.GroupeParlementaire} à ${depute.GroupeParlementaire}.`,
            color: colors.warning,
            timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          },
        ],
      })
      .then((res) => res.data)
    : Promise.resolve()
}

export function SendStopDeputeMandatNotification(depute: Depute) {
  return process.env.DISCORD_NOTIFICATION === 'true'
    ? axios
      .post(process.env.DISCORD_WEBHOOK_URL, {
        avatar_url:
          'https://avatars.githubusercontent.com/u/44036562?s=200&v=4',
        username: 'GitHub Actions',
        embeds: [
          {
            title: `Nucleus ${envFullName}`,
            description: `<https://${augoraDomain}/depute/${depute.Slug}|${depute.Nom}> n'est plus en mandat.`,
            color: colors.warning,
            timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          },
        ],
      })
      .then((res) => res.data)
    : Promise.resolve()
}

export function SendNewGroupeParlementaireNotification(
  groupe: GroupeParlementaire
) {
  return process.env.DISCORD_NOTIFICATION === 'true'
    ? axios
      .post(process.env.DISCORD_WEBHOOK_URL, {
        avatar_url:
          'https://avatars.githubusercontent.com/u/44036562?s=200&v=4',
        username: 'GitHub Actions',
        embeds: [
          {
            title: `Nucleus ${envFullName}`,
            description: `Le groupe ${groupe.NomComplet} a été ajouté en base.`,
            color: colors.warning,
            timestamp: "2024-06-26T09:01:23.134Z",
          },
        ],
      })
      .then((res) => res.data)
    : Promise.resolve()
}

export function SendUpdateGroupeParlementaireNotification(
  groupe: GroupeParlementaire
) {
  return process.env.DISCORD_NOTIFICATION === 'true'
    ? axios
      .post(process.env.DISCORD_WEBHOOK_URL, {
        avatar_url:
          'https://avatars.githubusercontent.com/u/44036562?s=200&v=4',
        username: 'GitHub Actions',
        embeds: [
          {
            title: `Nucleus ${envFullName}`,
            description: `Le groupe ${groupe.NomComplet} est devenu ${groupe.Actif ? 'actif' : 'inactif'}.`,
            color: colors.warning,
            timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          },
        ],
      })
      .then((res) => res.data)
    : Promise.resolve()
}

export function SendWarningNotification(option: string) {
  return process.env.DISCORD_NOTIFICATION === 'true'
    ? axios
      .post(process.env.DISCORD_WEBHOOK_URL, {
        avatar_url:
          'https://avatars.githubusercontent.com/u/44036562?s=200&v=4',
        username: 'GitHub Actions',
        embeds: [
          {
            title: `Nucleus ${envFullName}`,
            description: `:warning: Error while importing ${option}, please refer to [logs](${githubActionRunUrl}).`,
            color: colors.warning,
            timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          },
        ],
      })
      .then((res) => res.data)
    : Promise.resolve()
}
