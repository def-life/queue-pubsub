import { PubSubManger } from "./pubSubManger"
import { createClient } from "redis"



async function publisherClient() {
    const redisClient = createClient()
    await redisClient.connect()
    return redisClient
}

function start() {
    const stock = "GoogleStocks"
    setInterval(() => {
        PubSubManger.getInstance().subscribe(stock, String(`User-${Math.random()}`))
    }, 5 * 1000)

    setInterval(async () => {
        (await publisherClient()).publish(stock, String(Math.floor(Math.random() * 1000) + 1))
    }, 5 * 1000)
}



start()