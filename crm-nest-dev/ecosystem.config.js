module.exports = {
    apps: [
        {
            name: 'qi-crm-nestjs-dev',
            script: './dist/main.js',
            watch: false,
            env: {
                NODE_ENV: "production",
                PORT: 3002
            }
        },
    ],
}
