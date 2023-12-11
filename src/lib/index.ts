import {join} from 'path';
import { IClient } from 'types';
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

async function loadHandler(path: string, client: IClient) {
    const filePath = join(__dirname, '..', 'handler', `${path}`)
    
    const file = await import(filePath) 
    await file.default(client)
}

const First = axios.create({
    baseURL: 'https://ftc-api.firstinspires.org/',
    headers: {
        'Authorization': `Basic ${Buffer.from(`nubbdev:${process.env.FIRST_API_KEY}`).toString('base64')}`
    }
})

export const FirstApiKey = Buffer.from(`nubbdev:${process.env.FIRST_API_KEY}`).toString('base64')

// const test = axios.create({})

// const TOA = axios.create({
//     baseURL: 'https://theorangealliance.org/api',
//     headers: {
//         'X-TOA-Key': process.env.ORANGE_API_KEY || ''
//     }
// })

export {
    First,
    // TOA,
    // test,
    loadHandler
}
