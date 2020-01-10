const express = require('express');
const ServiceRegistry = require('./lib/ServiceRegistry');

const service = express();


module.exports = (config) => {
    const log = config.log();
    // Add a request logging middleware in development mode
    const serviceRegistry = new ServiceRegistry(log);
    if (service.get('env') === 'development') {
        service.use((req, res, next) => {
            log.debug(`${req.method}: ${req.url}`);
            return next();
        });
    }

    // Add api to discovery and use the service registry

    service.get('find/:servicename/serviceversion', (req, res) => {
        const {servicename, serviceversion, serviceport } = req.params;
        // on some systems remote ip is in IPv6 notation
        // code below handles that eventuality
        const serviceip = req.connection.remoteAddress.includes('::') ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;
        const result = serviceRegistry.register(servicename, serviceversion, serviceip, serviceport);
        return res.json({ result });

    });

    service.put('resgister/:servicename/serviceversion/:serviceport', (req, res, next) => next('Not Implemented'));

    service.delete('resgister/:servicename/serviceversion/:serviceport', (req, res, next) => next('Not Implemented'));


    // eslint-disable-next-line no-unused-vars
    service.use((error, req, res, next) => {
        res.status(error.status || 500);
        // Log out the error to the console
        log.error(error);
        return res.json({
            error: {
                message: error.message,
            },
        });
    });
    return service;
};
