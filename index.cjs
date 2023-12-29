const { EmbedBuilder, WebhookClient } = require('discord.js')
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

    core.info('El webhook se ha enviado con éxito')
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`)
  } catch (error) {
    core.setFailed(error.message)
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
      try {
        core.info(`estoy pasando por aquí[NO se ha enviado el embed]\n${author}, ${url}, ${color}, ${thumbnail}, ${image}, ${footer}`)
        const embedToSend = new EmbedBuilder()
          .setTitle(title)
          .setDescription(newDescription)
          .setColor(color)
          .setTimestamp()

        core.info(`Estoy pasando por aquí[Antes de las condicionales]\n[Embed]: ${embedToSend}`)
        if (author) embedToSend.setAuthor({ name: author, iconURL: authorIcon, url: authorUrl })
        if (url) embedToSend.setURL(url)
        if (color !== '#fff') embedToSend.setColor(color)
        if (thumbnail) embedToSend.setThumbnail(thumbnail)
        if (image) embedToSend.setImage(image)
        if (footer) embedToSend.setFooter({ text: footer, iconURL: footerIcon })
        const webhookClient = new WebhookClient({ url: webhookUrl })

        const data = webhookClient.send({
          embeds: [embedToSend]
        })
        console.log(data)
        core.info(data)
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
