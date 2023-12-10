import {join} from 'path';
import { IClient } from 'types';
import axios from 'axios'

export async function loadHandler(path: string, client: IClient) {
    const filePath = join(__dirname, '..', 'handler', `${path}`)
    
    const file = await import(filePath) 
    await file.default(client)
}

export const TOA = axios.create({
    baseURL: 'https://theorangealliance.org/api',
    headers: {
        'X-TOA-Key': process.env.ORANGE_API_KEY || ''
    }
})
