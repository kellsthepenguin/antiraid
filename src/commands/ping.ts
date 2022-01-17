import { client } from '..'
import Command from '../interfaces/Command'
import { I, D } from '../aliases/discord.js'
import { MessageActionRow, MessageButton } from 'discord.js'

/** 핑 명령어 */
export default class PingCommand implements Command {
  /** 실행되는 부분입니다. */
  async run (interaction: I) {
    await interaction.editReply({ content: `Pong! ${client.ws.ping}ms` })
  }

  /** 해당 명령어의 대한 설정입니다. */
  metadata = <D>{
    name: 'ping',
    description: 'Ping!'
  }
}
