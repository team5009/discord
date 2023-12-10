import { Events, MessageReplyOptions } from "discord.js";
import { IClient } from "types";

export default async (client: IClient) => {
    client.bot.on(Events.MessageCreate, async (message) => {
        if (message.author.bot) return
        if (!message.content.startsWith(client.config.prefix)) return
        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g)
        const command = args.shift()?.toLowerCase()
        if (!command) return
        const cmd = client.legacy.get(command)
        if (!cmd) return

        if (cmd.dev && !client.config.owners.includes(message.author.id)) {
            const reply = await message.reply({ content: "You are not allowed to use this command!"})
            setTimeout(() => {
                message.delete()
                reply.delete()
            }, 3000)
            return 
        }

        const execution = await cmd.execute(client, undefined, message, args) as MessageReplyOptions | undefined;

        if (execution !== undefined) {
            await message.reply(execution)
        }
    })
}
