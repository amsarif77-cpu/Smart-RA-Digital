module.exports = {
  apps: [
    {
      name: "smart-ra-digital",
      script: "tsx",
      args: "server.ts",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
