import axios from 'axios'

const colors = {
  error: 13632027,
  warning: 16312092,
  success: 8311585,
}

const envFullName =
  process.env.SUPABASE_ENV === 'Production' ? 'Production' : 'Staging'
const githubActionRunUrl = process.env.GITHUB_RUN_URL

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
              timestamp: '2024-06-26T09:01:23.134Z',
            },
          ],
        })
        .then((res) => res.data)
    : Promise.resolve()
}
