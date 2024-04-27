// process 1 pushes to the queue

import { createClient } from "redis";


export async function push() {
    const redisClient = await createClient().connect()


    setInterval(async () => {
        await redisClient.lPush('some-name', String(Math.random()))
    }, 5 * 1000)
}
