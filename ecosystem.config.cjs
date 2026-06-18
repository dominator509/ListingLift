// PM2 Ecosystem Configuration — Q18 Phase 4 (Future Hardening)
// Enables Node.js cluster mode for multi-core throughput.
// Start: pm2 start ecosystem.config.cjs
// Reload: pm2 reload ecosystem.config.cjs --update-env
// List: pm2 list

module.exports = {
  apps: [
    {
      name: 'listinglift',
      script: 'node_modules/.bin/next',
      args: 'start',
      instances: 'max',           // one per CPU core
      exec_mode: 'cluster',
      max_memory_restart: '512M', // restart worker on memory pressure
      kill_timeout: 10000,        // 10s grace for in-flight requests on reload
      listen_timeout: 15000,      // wait for port binding
      wait_ready: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/listinglift/err.log',
      out_file: '/var/log/listinglift/out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Zero-downtime reload: PM2 sends SIGINT, new workers take over
      // while old workers drain connections during kill_timeout window.
    },
  ],
};
