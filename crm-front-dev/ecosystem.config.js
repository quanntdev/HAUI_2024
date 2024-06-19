module.exports = {
  apps : [{
    name: 'hapo-crm-next',
    append_env_to_name: true,
    script: './node_modules/next/dist/bin/next start -p 3003',
    max_memory_restart: '2G'
  }]
};
