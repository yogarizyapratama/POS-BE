"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = require("./application/logging");
const web_1 = require("./application/web");
web_1.web.listen(process.env.PORT || 7001, () => {
    logging_1.logger.info(`Listening on port ${process.env.PORT || 7001}`);
});
