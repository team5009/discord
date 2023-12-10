import { join } from "path"
import { Command, IClient } from "types"
import fs from 'fs'
import { Collection, REST, Routes } from "discord.js"
import { CommandOption, botOption } from "types/discord"

const tableCommands: any[] = []
const commandArray: {name: string, description: string, options: CommandOption[] | null | undefined}[] = []

export default async (client: IClient) => {
    const {commands, legacy, config} = client
    const rest = new REST({ version: '9' }).setToken(config.token);

    await readCommands(commands, legacy)


    for (const server of config.servers) {
        await registerCommands(config, commandArray, rest, server)
    }
    console.log(`Successfully registered application commands.`)
    console.table(tableCommands)
}

async function readCommands(commands: Collection<string, Command>, legacy: Collection<string, Command>) {
    return new Promise(async (resolve) => {
        const commandPath = join(__dirname, '..', 'commands')
        const commandFiles = fs.readdirSync(commandPath)
        await storeCommands(commandFiles, commandPath, commands, legacy)
        resolve(commands)
    })
}

async function storeCommands(commandFiles: string[], path: string, commands: Collection<string, Command>, legacy: Collection<string, Command>) {
    return new Promise(async (resolve) => {
        const files = commandFiles.filter(file => ['.js', '.ts'].some(char => file.endsWith(char)))
        await storeCommand(path, files, commands, legacy)
        const folders = commandFiles.filter(file => !['.js', '.ts'].some(char => file.endsWith(char)))
        for (const folder of folders) {
            const folderPath = join(path, folder)
            await storeCommands(fs.readdirSync(folderPath), folderPath, commands, legacy)
        }
        resolve(commands)
    })
}

async function storeCommand(path: string,files: string[], commands: Collection<string, Command>, legacyList: Collection<string, Command>) {
    return new Promise(async (resolve) => {
        for (const file of files) {
            const command = (await import(join(path, file))).default as Command;
            const name = file.split('.')[0].toLowerCase()
            const dev = command.dev || false
            const legacy = command.legacy || false
            tableCommands.push({name, description: command.description, legacy, dev})
            if (command.legacy == "both") {
                commands.set(name, command)
                legacyList.set(name, command)
                commandArray.push({name, description: command.description, options: command.options})
                continue
            } else if (command.legacy == true) {
                legacyList.set(name, command)
                continue
            } else if (command.legacy == false || command.legacy == undefined){
                commands.set(name, {...command, legacy: false})
                commandArray.push({name, description: command.description, options: command.options})
                continue
            } else {
                console.log(`Invalid legacy option for command ${name}`)
                continue
            }
        }
        resolve(commands)
    })
}

async function registerCommands(config: botOption, commands: {name: string, description: string}[], rest: REST, server: string) {
    return new Promise<void>(async (resolve) => {
        await rest.put(
            Routes.applicationGuildCommands(config.applicationId, server),
            { body: commands },
        );
        resolve()
    })
}