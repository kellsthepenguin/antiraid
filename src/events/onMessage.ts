import { Message, User } from 'discord.js'

import { compareTwoStrings } from 'string-similarity'

const serverSpams = new Map<string, Map<string, User[]>>()

export default function onMessage (message: Message) {
  if (!message.guild) return

  const guild = message.guild!

  if (!serverSpams.has(guild.id)) {
    serverSpams.set(guild.id, new Map<string, User[]>())
  }

  const spams = serverSpams.get(guild.id)!

  if (spams.size === 0) {
    spams.set(message.content, [])
    setTimeout(() => {
      if (spams.has(message.content)) {
        spams.delete(message.content)
      }
    }, 150000) // 2.5 minute
  }

  spams.forEach((users, mainMsg) => {
    const similarity = compareTwoStrings(mainMsg, message.content)

    if (similarity >= 0.51) {
      users.push(message.author)
    } else {
      spams.set(message.content, [])
    }

    if (users.length >= 5) {
      users.forEach(async (user) => {
        const member = await guild.members.fetch(user)
        const owner = await guild.fetchOwner()

        if (!member) return

        member.kick()
          .catch(() => owner.send(`${user.tag}(${user.id}) is spamming, but i failed to kick`))
      })
    }
  })
}
