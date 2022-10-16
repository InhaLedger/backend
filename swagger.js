const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        info: {
            title: 'InhaCoin API',
            description: 'InhaCoin API',
            version: '0.1.9'
        },
        servers: [{ url: 'http://52.79.214.156:3000/'}],
    },
    apis: ['./swagger/*']
};

const specs = swaggereJsdoc(options);

module.exports = {
    swaggerUi,
    specs
};