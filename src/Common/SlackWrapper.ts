import axios from 'axios'

const envFullName =
  process.env.SUPABASE_ENV === 'production' ? 'Production' : 'Staging'

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
  process.env.SUPABASE_ENV === 'production' ? 'augora.fr' : 'preprod.augora.fr'

export function SendNewDeputeNotification(depute: Types.Canonical.Depute) {
  return process.env.SLACK_NOTIFICATION
    ? axios
        .post(process.env.SLACK_WEBHOOK_URL, {
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
                    text: `<https://${augoraDomain}/depute/${depute.Slug}|${depute.Nom}>, député ${depute.GroupeParlementaire} a été ajouté en base.`,
                  },
                },
                messageContext,
              ],
            },
          ],
        })
        .then((res) => res.data)
    : Promise.resolve()
}

export function SendDeputeChangeGroupNotification(
  previousDepute: Types.Canonical.Depute,
  depute: Types.Canonical.Depute
) {
  return process.env.SLACK_NOTIFICATION
    ? axios
        .post(process.env.SLACK_WEBHOOK_URL, {
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
                    text: `<https://${augoraDomain}/depute/${depute.Slug}|${depute.Nom}> a changé de groupe parlementaire :  transition de ${previousDepute.GroupeParlementaire} à ${depute.GroupeParlementaire}.`,
                  },
                },
                messageContext,
              ],
            },
          ],
        })
        .then((res) => res.data)
    : Promise.resolve()
}

export function SendStopDeputeMandatNotification(
  depute: Types.Canonical.Depute
) {
  return process.env.SLACK_NOTIFICATION
    ? axios
        .post(process.env.SLACK_WEBHOOK_URL, {
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
                    text: `<https://${augoraDomain}/depute/${depute.Slug}|${depute.Nom}> n'est plus en mandat.`,
                  },
                },
                messageContext,
              ],
            },
          ],
        })
        .then((res) => res.data)
    : Promise.resolve()
}

export function SendNewGroupeParlementaireNotification(
  groupe: Types.Canonical.GroupeParlementaire
) {
  return process.env.SLACK_NOTIFICATION
    ? axios
        .post(process.env.SLACK_WEBHOOK_URL, {
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
        .then((res) => res.data)
    : Promise.resolve()
}

export function SendUpdateGroupeParlementaireNotification(
  groupe: Types.Canonical.GroupeParlementaire
) {
  return process.env.SLACK_NOTIFICATION
    ? axios
        .post(process.env.SLACK_WEBHOOK_URL, {
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
        .then((res) => res.data)
    : Promise.resolve()
}

export function SendNewOrganismeParlementaireNotification(
  organisme: Types.Canonical.OrganismeParlementaire
) {
  return process.env.SLACK_NOTIFICATION
    ? axios.post(process.env.SLACK_WEBHOOK_URL, {
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
                  text: `L'organisme parlementaire ${organisme.Nom} a été crée.`,
                },
              },
              messageContext,
            ],
          },
        ],
      })
    : Promise.resolve()
}

export function SendWarningNotification(option: string) {
  return process.env.SLACK_NOTIFICATION
    ? axios
        .post(process.env.SLACK_WEBHOOK_URL, {
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
                    text: `Error while importing ${option} in ${envFullName}, please refer to logs.`,
                  },
                },
              ],
            },
          ],
        })
        .then((res) => res.data)
    : Promise.resolve()
}
