import axios from 'axios'

const envFullName =
  process.env.FAUNADB_ENV === 'production' ? 'Production' : 'Staging'

const messageContext = {
  type: 'context',
  elements: [
    {
      type: 'mrkdwn',
      text: `:point_right: ${envFullName}`,
    },
  ],
}

const augoraDomain =
  process.env.FAUNADB_ENV === 'production' ? 'augora.fr' : 'preprod.augora.fr'

export function SendNewDeputeNotification(depute: Types.Canonical.Depute) {
  return axios.post(process.env.SLACK_WEBHOOK_URL, {
    username: 'Nucleus',
    icon_emoji: ':rocket:',
    attachments: [
      {
        color: '#ffc107',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `<https://${augoraDomain}/depute/${depute.Slug}|${depute.Nom}>, député ${depute.GroupeParlementaire.Sigle} a été ajouté en base.`,
            },
          },
          messageContext,
        ],
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
    attachments: [
      {
        color: '#ffc107',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Le groupe ${groupe.NomComplet} a été ajouté en base.`,
            },
          },
          messageContext,
        ],
      },
    ],
  })
}

export function SendUpdateGroupeParlementaireNotification(
  groupe: Types.Canonical.GroupeParlementaire
) {
  return axios.post(process.env.SLACK_WEBHOOK_URL, {
    username: 'Nucleus',
    icon_emoji: ':rocket:',
    attachments: [
      {
        color: '#ffc107',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Le groupe ${groupe.NomComplet} est devenu ${
                groupe.Actif ? 'actif' : 'inactif'
              }.`,
            },
          },
          messageContext,
        ],
      },
    ],
  })
}
