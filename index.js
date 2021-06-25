const nutIoc = require('nut-ioc');

const nutIocContainerExpress = nutIoc();

module.exports = (nutIocContainer) =>
    async () => {

        nutIocContainerExpress.use({
            dependencyPath: `${__dirname}/src`,
            ignoredDependencies: ['*.DS_Store']
        });

        nutIocContainerExpress.useNutIocContainer(nutIocContainer);

        const { expressServer } = await nutIocContainerExpress.build();

        nutIocContainer.useDependency({
            ServiceName: "expressServer",
            Service: { ...expressServer }
        });
    };
