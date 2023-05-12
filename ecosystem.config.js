module.exports = {
    apps : [
      {
        name: 'node-app',
        script: 'node-app.js',
        cwd: '/app.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G'
      },
      {
        name: 'flask-app',
        script: 'Mental_health_portal_depression_detection_api.py',
        cwd: '/Mental_health_portal_depression_detection_api.py',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G'
      }
    ]
  };
  