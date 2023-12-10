import { Client, Collection } from 'discord.js'
import { Command, botOption } from './discord'
import { AxiosInstance } from 'axios'

export {
    Command,
    CommandOption,
    CommandOptionChoice,
    EventType
} from './discord'

export interface IClient {
    commands: Collection<string, Command>
    legacy: Collection<string, Command>
    bot: Client
    config: botOption
}