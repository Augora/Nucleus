import axios from 'axios'

export function SendNewDeputeNotification(
  depute: Types.Canonical.Depute,
  sigle: string
) {
  return axios.post(
    'https://hooks.slack.com/services/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',
    {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `<https://augora.fr/depute/${depute.Slug}|${depute.Nom}>, député ${sigle} a été ajouté en base.`,
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
    }
  )
}

export function SendNewGroupeParlementaireNotification(
  groupe: Types.Canonical.GroupeParlementaire
) {
  return axios.post(
    'https://hooks.slack.com/services/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',
    {
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
    }
  )
}
