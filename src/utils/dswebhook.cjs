const { EmbedBuilder, WebhookClient } = require('discord.js')
const core = require('@actions/core')

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
  if (!webhookUrl | !title | !description) {
    core.warning('Recuerdda proporcionar los parámetros requeridos, si no sabes cuales son visita https://github.com/edujos/ds-webhook/#discord-webhook-github-action')
    core.ExitCode(1)
  } else {
    let newDescription = ''
    description.length > 4000
      ? newDescription = `${description.substring(0, 4000)}...`
      : core.warning(`¡Vaya parece que has excedido el límite de caracteres permitidos por discord!\nPor ello hemos omitido el envío de tu webhook\n${description.length}`)

    const embedToSend = new EmbedBuilder()
      .setTitle(title)
      .setDescription(newDescription)
      .setColor(color)
      .setTimestamp()

    if (author) embedToSend.setAuthor({ name: author, iconURL: authorIcon, url: authorUrl })
    if (url) embedToSend.setURL(url)
    if (color !== '#fff') embedToSend.setColor(color)
    if (thumbnail) embedToSend.setThumbnail(thumbnail)
    if (image) embedToSend.setImage(image)
    if (footer) embedToSend.setFooter({ text: footer, iconURL: footerIcon })

    try {
      const webhookClient = new WebhookClient({ url: webhookUrl })

      webhookClient.send({
        embeds: [embedToSend]
      })
    } catch (e) {
      core.error(`Ups! Ha ocurrido un error inesperado:\nError: ${e.message}`)
      core.ExitCode(1)
    }
    core.ExitCode(0)
  }
}

module.exports = sendDiscordNotify
