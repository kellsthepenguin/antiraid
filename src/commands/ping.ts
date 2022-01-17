import { client } from '..'
import Command from '../interfaces/Command'
import { I, D } from '../aliases/discord.js'

export default class PingCommand implements Command {
  async run (interaction: I) {
    await interaction.editReply({ content: `Pong! ${client.ws.ping}ms` })
  }

  metadata = <D>{
    name: 'ping',
    description: 'Pong!'
  }
}
