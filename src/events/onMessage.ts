import { Message } from 'discord.js'

import { compareTwoStrings } from 'string-similarity'

const serverSpams = new Map<string, Map<string, Message[]>>()

export default function onMessage (message: Message) {
  if (!message.guild) return

  const guildId = message.guildId!

  if (serverSpams.has(guildId!)) {
    serverSpams.set(guildId, new Map<string, Message[]>())
  }

  const spams = serverSpams.get(guildId)!

  spams.forEach((msgs, mainMsg) => {
    const similarity = compareTwoStrings(mainMsg, message.content)

    if (similarity >= 0.51) {
      msgs.push(message)
    }

    if (msgs.length >= 5) {
      msgs.forEach(async (msg) => {
        const guild = msg.guild!
        const member = await guild.members.fetch(msg.author)

        member.kick().catch(async () => {
          (await guild.fetchOwner()).send(`${msg.author.tag}(${msg.author.id}) is spamming, but i failed to kick`)
        })
      })
    }
  })
}
