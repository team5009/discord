import 'module-alias/register'
import {
    Client, Events, IntentsBitField, PresenceUpdateStatus, Activity, Collection
} from 'discord.js'
import {loadHandler} from './lib'
import { IClient } from 'types'
import dotenv from 'dotenv'
import axios from 'axios'
import fs from 'fs'
import { join } from 'path'
dotenv.config()

async function main() {
    const bot = new Client({
        intents: [
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.GuildMessageReactions,
            IntentsBitField.Flags.GuildPresences,
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildVoiceStates,
            IntentsBitField.Flags.MessageContent,
        ]
    })

    const config = {
        token: process.env.DISCORD_TOKEN || '',
        applicationId:  '1182968849872736347',
        prefix: process.env.PREFIX || '!',
        owners: [],
        servers: [process.env.TESTING_SERVER || '']
    }

    const client: IClient = {
        commands: new Collection(),
        legacy: new Collection(),
        config,
        bot, 

    }

    const handlerFolder = fs.readdirSync(join(__dirname, 'handler')).filter(file => file.endsWith('.ts') || file.endsWith('.js'))
    for (const handler of handlerFolder) {
        console.log(`Loading ${handler} handler`)
        await loadHandler(handler, client)
        console.log(`Loaded ${handler} handler`)
    }

    client.bot.login(client.config.token)
}

main().catch(console.error)