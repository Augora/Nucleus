import axios from 'axios'

export function SendNewDeputeNotification(depute: Types.Canonical.Depute) {
  return axios.post(process.env.SLACK_WEBHOOK_URL, {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<https://augora.fr/depute/${depute.Slug}|${depute.Nom}>, député ${depute.GroupeParlementaire.Sigle} a été ajouté en base.`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'From Nucleus with :heart:',
          },
        ],
      },
    ],
  })
}

export function SendNewGroupeParlementaireNotification(
  groupe: Types.Canonical.GroupeParlementaire
) {
  return axios.post(process.env.SLACK_WEBHOOK_URL, {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Le groupe ${groupe.NomComplet} a été ajouté en base.`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'From Nucleus with :heart:',
          },
        ],
      },
    ],
  })
}
