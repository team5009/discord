import { TOA } from "@lib";
import {  } from "axios";
import { Command } from "types";

export default {
    description: 'Get information about a team',
    legacy: 'both',
    dev: true,
    options: [
        {
            name: 'number',
            description: 'The team number',
            type: 4,
            required: true,
            autocomplete: true
        }
    ],
    autocomplete: async (client, interaction) => {
        const focusedOption = interaction.options.getFocused(true)
        if (focusedOption.name !== 'number') return
        

        if (focusedOption.value === '') {
            console.log(await getTeamList())
        }


    },
    execute: async (client, interaction, message, args) => {
        if (interaction != undefined) {
            await interaction.reply({content: 'This command is not yet available in slash commands', ephemeral: true})
            return
        }
        if (message != undefined) {
            await message.reply('This command is not yet available')
            return
        }
    }
} as Command

async function getTeamList() {
    const { data } = await TOA.get('https://theorangealliance.org/api/team/list')
    return data
}