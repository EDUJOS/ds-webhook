# Discord Webhook GitHub Action
Estoy creando un GitHub Action porque ninguno me funciona así que ¿Por qué carajos no lo hago yo mismo?

## Use Discord Notify Webhook
```yml
- name: Discord Notify Webhook
  uses: EDUJOS/ds-webhook@v1.0.0
  with:
    webhook_url: ${{ secrets.DISCORD_WEBHOOK_URL }}
    title: Some Title
    description: Some Description
```

> [!IMPORTANT]
> Recuerda que los parámetros `webhook_url, title, description` son requeridos
> Veamos resultados!

Let's Fucking go bitch!
> Developed with love by Ed <3