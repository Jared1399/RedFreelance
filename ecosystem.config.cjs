module.exports = {
  apps: [
    {
      name: "expire-transactions-cron",
      script: "ts-node ./src/scripts/expireTransactions.ts",
      interpreter: "ts-node",
      interpreter_args: "-r tsconfig-paths/register",
      instances: 1,
      autorestart: false,
      cron_restart: "1 * * * *",
      env: { NODE_ENV: "production" },
      error_file: "./logs/cron-err.log",
      out_file: "./logs/cron-out.log",
      time: true,
    },
  ],
};