import axios from 'axios'

export function SendNewDeputeNotification(depute: Types.Canonical.Depute) {
  return axios.post(process.env.SLACK_WEBHOOK_URL, {
    username: 'Nucleus',
    icon_emoji: ':rocket:',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<https://augora.fr/depute/${depute.Slug}|${depute.Nom}>, député ${depute.GroupeParlementaire.Sigle} a été ajouté en base.`,
        },
      },
    ],
  })
}

export function SendNewGroupeParlementaireNotification(
  groupe: Types.Canonical.GroupeParlementaire
) {
  return axios.post(process.env.SLACK_WEBHOOK_URL, {
    username: 'Nucleus',
    icon_emoji: ':rocket:',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Le groupe ${groupe.NomComplet} a été ajouté en base.`,
        },
      },
    ],
  })
}
