import Command from '../interfaces/Command'
import { I, D } from '../aliases/discord.js'
import { MessageActionRow, MessageButton } from 'discord.js'

import { check } from 'recheck'
import generateId from '../utils/generateId'
import kickMultipleMembers from '../utils/kickMultipleMembers'

export default class KickCommand implements Command {
  async run (interaction: I) {
    const regexString = (interaction.options.data[0].value as string).slice(1, -1)
    const type = interaction.options.data[1].value as string

    const result = await check(regexString, '', {
      timeout: 1000
    })

    if (result.status === 'vulnerable') {
      return await interaction.editReply('regex is vulnerable.')
    } else if (result.status === 'unknown') {
      if (result.error.kind === 'timeout') await interaction.editReply('regex is too complex.')
      if (result.error.kind === 'invalid') await interaction.editReply('regex is invaild.')
      else await interaction.editReply('regex check failed. reason unknown')
      return
    }

    const regex = new RegExp(regexString)

    const guild = interaction.guild!
    const members = await guild.members.fetch()
    const membersToBeKicked = members.filter(member =>
      regex.test(
        type === 'nickname' ?
        (member.nickname ? member.nickname : member.displayName)
        : member.displayName
      )
    )

    const sureId = generateId()
    const noId = generateId()   
    const sureBtn = new MessageButton({ customId: sureId, label: 'Sure!', style: 'SUCCESS' })
    const noBtn = new MessageButton({ customId: noId, label: 'No!', style: 'DANGER' })

    const actionRow = new MessageActionRow({ components: [sureBtn, noBtn] })

    await interaction.editReply({
      content: `${membersToBeKicked.size} members will be kicked. Are you sure?`,
      components: [actionRow]
    })

    const i = await interaction.channel?.awaitMessageComponent({
      filter: i => i.customId === sureId && i.user.id === interaction.user.id,
      componentType: 'BUTTON'
    })

    if (!i) return
    await i.deferReply()

    if (i.customId === noId) return await i.editReply('Ok.')
    if (membersToBeKicked.size === 0) return await i.editReply('No members kicked.')

    const [successedMembers, failedMembers] = await kickMultipleMembers(membersToBeKicked)

    await i.editReply(`${successedMembers} members kicked, ${failedMembers} failed to kick.`)
    await interaction.editReply({ components: [] })
  }

  metadata = <D>{
    name: 'kickbyregex',
    description: 'Kicks anyone with a nickname that matches the regex',
    options: [
      {
        name: 'regexp',
        description: 'regex to kick (you need wrap regex as backtick) ex. `[abc]`',
        type: 'STRING',
        required: true
      },

      {
        name: 'nick',
        description: 'filter server nickname or username',
        type: 'STRING',
        required: true,
        choices: [
          {
            name: 'nickname',
            value: 'nickname'
          },
          {
            name: 'username',
            value: 'username'
          }
        ]
      }
    ]
  }
}
