import { logger } from "./application/logging";
import { web } from "./application/web";

web.listen(process.env.PORT || 7001, () => {
    logger.info(`Listening on port ${process.env.PORT || 7001}`)
})