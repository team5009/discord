import { join } from "path"
import fs from 'fs'
import { IClient, EventType } from "types"
import { Client, Collection } from "discord.js"

export default async (client: IClient) => {
    await readEvents(client)
}

async function readEvents(client: IClient) {
    return new Promise<void>(async (resolve) => {
        const eventPath = join(__dirname, '..', 'events')
        const eventFiles = fs.readdirSync(eventPath)
        await runEvents(eventFiles, eventPath, client)
        resolve()
    })
}

async function runEvents(eventFiles: string[], path: string, client: IClient) {
    return new Promise<void>(async (resolve) => {
        const files = eventFiles.filter(file => ['.js', '.ts'].some(char => file.endsWith(char)))
        await runEvent(path, files, client)
        const folders = eventFiles.filter(file => !['.js', '.ts'].some(char => file.endsWith(char)))
        for (const folder of folders) {
            const folderPath = join(path, folder)
            await runEvents(fs.readdirSync(folderPath), folderPath, client)
        }
        resolve()
    })
}

async function runEvent(path: string, files: string[], client: IClient) {
    return new Promise<void>(async (resolve) => {
        for (const file of files) {
            const event = (await import(join(path, file))).default;
            await event(client)
        }
        resolve()
    })
}