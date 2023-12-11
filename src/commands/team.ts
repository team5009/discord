import { First, FirstApiKey } from "@lib";
import axios from "axios";
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
        const num = parseInt(focusedOption.value) || undefined
        const list = await getTeamList(num)

        let options = list.map(team => {
            return {
                name: `${team.teamNumber} | ${team.nameShort}`,
                value: team.teamNumber.toString()
            }
        })

        if (options.length > 25) {
            options = options.slice(0, 25)
        }

        return options
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

async function getTeamList(teamNum?: number | undefined) {
    if (teamNum != undefined) {
        try {
            const res = await axios.get('https://ftc-api.firstinspires.org/v2.0/2023/teams', {
                headers: {
                    'Authorization': `Basic ${FirstApiKey}`
                },
                params: {
                    teamNumber: teamNum
                }
            })
        
            return res.data.teams as any[]
        } catch {
            return []
        }
    } else {
        const res = await axios.get('https://ftc-api.firstinspires.org/v2.0/2023/teams', {
            headers: {
                'Authorization': `Basic ${FirstApiKey}`
            }
        })
    
        return res.data.teams as any[]
    }
}