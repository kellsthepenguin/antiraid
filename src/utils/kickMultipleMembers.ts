import { Collection, GuildMember } from 'discord.js'

async function kickMultipleMembers (members: Collection<string, GuildMember>): Promise<Number[]> {
  let kickSuccessedMembers = 0
  let kickFailedMembers = 0

  return new Promise(resolve => {
    members.forEach(member => {
      member.kick()
        .then(() => kickSuccessedMembers++)
        .catch(() => kickFailedMembers++)
        .finally(() => {
          if (kickSuccessedMembers + kickFailedMembers === members.size) resolve([kickSuccessedMembers, kickFailedMembers])
        })
    })
  })
}

export default kickMultipleMembers
