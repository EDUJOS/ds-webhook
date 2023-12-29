// const { EmbedBuilder, WebhookClient } = require('discord.js')
const core = require('@actions/core')
const github = require('@actions/github')

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
    // eslint-disable-next-line no-unused-vars
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`)
  } catch (error) {
    core.setFailed(error.message)
    core.ExitCode(1)
  }
}

async function sendDiscordNotify (
  webhookUrl,
  author,
  authorUrl = 'https://github.com/ERR-Z3R0',
  authorIcon = 'https://avatars.githubusercontent.com/u/126917905?s=400&u=201c605c76afbdcf6e81d2cd8258d7a1cf42c2da&v=4',
  title,
  description,
  url,
  color = '#fff',
  footer,
  footerIcon = 'https://avatars.githubusercontent.com/u/126917905?s=400&u=201c605c76afbdcf6e81d2cd8258d7a1cf42c2da&v=4',
  image,
  thumbnail
) {
  let newDescription = ''
  if (!webhookUrl | !title | !description) {
    core.warning('Recuerdda proporcionar los parámetros requeridos, si no sabes cuales son visita https://github.com/edujos/ds-webhook/#discord-webhook-github-action')
    // core.ExitCode(1)
  } else {
    const sizeDescription = description.length

    if (sizeDescription > 4000) {
      newDescription = `${description.substring(0, sizeDescription)}...`
      core.warning(`¡Vaya parece que has excedido el límite de caracteres permitidos por discord!\nPor ello hemos recortado la descripción de \n${sizeDescription} a ${newDescription.length}`)
    } else {
      const webhookBody = {
        content: null,
        embeds: [
          {
            title,
            description: newDescription,
            url: url | null,
            color,
            author: {
              name: author | 'Discord Notify Webhook',
              url: authorUrl,
              icon_url: authorIcon
            },
            footer: {
              text: footer,
              icon_url: footerIcon
            },
            timestamp: Date.now().toLocaleString(),
            image: {
              url: image | null
            },
            thumbnail: {
              url: thumbnail | null
            }
          }
        ]
      }
      try {
        await fetch(`${webhookUrl}?wait=true`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(webhookBody)
        })
          .then((res) => {
            if (!res.ok) {
              core.ExitCode(1)
              throw new Error('Error HTTP: ' + res.status + res)
            }

            return res.json()
          })
          .then((data) => {
            core.info('El webhook se ha enviado con éxito')
            console.log(data)
          })
          .catch((error) => console.log(error))
      } catch (e) {
        core.info('estoy pasando por aquí[Estoy en el catch]')
        core.error(`Ups! Ha ocurrido un error inesperado:\nError: ${e.message}`)
        core.info(e)
        // core.ExitCode(1)
      }
      // core.ExitCode(0)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    core.setFailed(error)
    process.exit(1)
  })
