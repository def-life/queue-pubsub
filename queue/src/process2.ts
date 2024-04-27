// process2 pops from queue

import { createClient } from "redis";


export async function pop() {
    const redisClient = await createClient().connect()

    while (true) {
        const message = await redisClient.brPop("some-name", 0)
        console.log(message)

    }
}
