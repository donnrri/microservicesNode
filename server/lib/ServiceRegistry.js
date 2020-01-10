class ServiceRegistry {
    constructor(log) {
        this.log = log;
        this.services = {};
        this.timeout = 30;

    }

    register(name, version, ip, port) {
        const key = `${name}${version}${ip}${port}`;
        const timestamp = Math.floor(new Date() / 1000);
        if (!this.services[key]) {
            this.services[key] = { timestamp, ip, port, name };
            return key;
        }
        this.services[key].timestamp = timestamp;
        return key;
    }
}

module.exports = ServiceRegistry;
