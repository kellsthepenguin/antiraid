import { client, slash } from '..'

/** onReady 핸들러 */
export default function onReady () {
  if (!client.user) return

  console.log('Ready!', client.user.username)
  client.user.setActivity('protecting your server')

  if (process.env.ENVIROMENT_DEV_GUILD) {
    slash.registCachedCommands(client)
  }
}
