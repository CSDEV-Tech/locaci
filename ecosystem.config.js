module.exports = {
    apps: [
        {
            name: 'locaci-web1',
            script: 'pnpm start:web -p 8889',
            time: true,
            instances: 1,
            autorestart: true,
            max_restarts: 50,
            watch: false,
            max_memory_restart: '1G'
        },
        {
            name: 'locaci-web2',
            script: 'pnpm start:web -p 8890',
            time: true,
            instances: 1,
            autorestart: true,
            max_restarts: 50,
            watch: false,
            max_memory_restart: '1G'
        },
        {
            name: 'locaci-web3',
            script: 'pnpm start:web -p 8891',
            time: true,
            instances: 1,
            autorestart: true,
            max_restarts: 50,
            watch: false,
            max_memory_restart: '1G'
        }
    ]
};
