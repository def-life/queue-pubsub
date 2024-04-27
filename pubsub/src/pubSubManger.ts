import { RedisClientType, createClient } from "redis"

export class PubSubManger {
    private stockUserMapping: Map<string, string[]>
    private redisClient: RedisClientType
    private static instance: PubSubManger

    static getInstance() {
        if (!PubSubManger.instance) {
            PubSubManger.instance = new PubSubManger()
        }

        return PubSubManger.instance
    }


    private constructor() {
        this.stockUserMapping = new Map()
        this.redisClient = createClient()
        this.redisClient.connect().catch((er) => {
            console.log(er)
        })
    }

    private handleMessage(stock: string, message: string) {
        this.stockUserMapping.get(stock)?.forEach((userId) => {
            console.log("message is", message)
            console.log("sending message to ", userId)

        })

    }

    public subscribe(stock: string, userId: string) {
        if (!this.stockUserMapping.get(stock)) {
            this.stockUserMapping.set(stock, [])
        }

        this.stockUserMapping.get(stock)?.push(userId)

        if (this.stockUserMapping.get(stock)?.length === 1) {
            this.redisClient.subscribe(stock, (message) => {
                this.handleMessage(stock, message)
            })
            console.log("client subscribed to", stock, "channel")
        }

    }

    public unsubscribe(stock: string, userId: string) {
        this.stockUserMapping.set(stock, this.stockUserMapping.get(stock)?.filter((u) => userId == u) ?? [])

        if (this.stockUserMapping.get(stock)?.length === 0) {
            this.redisClient.unsubscribe(stock)
            console.log("Client UNSUBScribed from", stock, "channel")
        }

    }

    public async disconnect() {
        await this.redisClient.quit()
    }
}