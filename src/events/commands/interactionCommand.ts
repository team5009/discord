import { Events, InteractionReplyOptions } from "discord.js";
import { IClient } from "types";

export default (client: IClient) => {
    client.bot.on(Events.InteractionCreate, async (interaction) => {
        if (interaction.isAutocomplete()) {
            const cmd = client.commands.get(interaction.commandName)
            if (!cmd) return

            if (cmd.dev && !client.config.owners.includes(interaction.user.id)) {
                return 
            }

            try {
                const map = await cmd.autocomplete!(client, interaction)
                await interaction.respond(map)
            } catch(e) {
                console.error(e)
            }
        }
        if (interaction.isButton()) {}
        if (interaction.isChatInputCommand()) {
            const cmd = client.commands.get(interaction.commandName)
            if (!cmd) return
    
            if (cmd.dev && !client.config.owners.includes(interaction.user.id)) {
                await interaction.reply({ content: "You are not allowed to use this command!", ephemeral: true })
                return 
            }
    
            const execution = await cmd.execute(client, interaction) as InteractionReplyOptions | undefined;
    
            if (execution !== undefined) {
                await interaction.reply(execution)
            }
        }
    })
}