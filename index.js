const nutIoc = require('nut-ioc');

const nutIocContainer_ = nutIoc();

module.exports = (nutIocContainer) =>
    async () => {

        nutIocContainer_.use({
            dependencyPath: `${__dirname}/src`,
            ignoredDependencies: ['*.DS_Store']
        });

        nutIocContainer_.useNutIocContainer(nutIocContainer);

        const { expressServer } = await nutIocContainer_.build();

        nutIocContainer.useDependency({
            ServiceName: "expressServer",
            Service: { ...expressServer }
        });
    };