import * as core from '@actions/core'
import github from '@actions/github'
import { sendDiscordNotify } from './src/utils/dswebhook'

async function main () {
  const webhookUrl = core.getInput('webhook_url')
  const title = core.getInput('title')
  const description = core.getInput('description')
  const url = core.getInput('url')
  const color = core.getInput('color')
  const footer = core.getInput('footer')
  const footerIcon = core.getInput('footer_icon')
  const image = core.getInput('image')
  const thumbnail = core.getInput('thumbnail')
  const author = core.getInput('author')
  const authorUrl = core.getInput('author_url')
  const authorIcon = core.getInput('author_icon')

  try {
    await sendDiscordNotify(
      webhookUrl,
      author,
      authorUrl,
      authorIcon,
      title,
      description,
      url,
      color,
      footer,
      footerIcon,
      image,
      thumbnail
    )

    core.info('El webhook se ha enviado con éxito')
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    core.setFailed(error)
    process.exit(1)
  })
