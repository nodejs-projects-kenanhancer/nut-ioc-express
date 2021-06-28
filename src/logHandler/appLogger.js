module.exports.Service = async ({ dependencyProvider, appEnv: { APP_LOGGER = 'consoleLogger' } }) => {

    const logger = await dependencyProvider(APP_LOGGER);

    return {
        debug: logger.debug,
        warn: logger.warn,
        error: logger.error,
        info: logger.info
    };
}
