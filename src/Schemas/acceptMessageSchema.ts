import {z} from 'zod'

export const acceptmessageSchema=z.object({
    acceptingmessage:z.boolean()
})