const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withRemoveForegroundService(config) {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    const application = androidManifest.manifest.application?.[0];

    if (application) {
      if (!application.service) {
        application.service = [];
      }
      application.service = application.service.filter(
        (s) => s['$']?.['android:name'] !== 'expo.modules.audio.service.AudioControlsService'
      );
      application.service.push({
        $: {
          'android:name': 'expo.modules.audio.service.AudioControlsService',
          'tools:node': 'remove',
        },
      });
    }

    return config;
  });
};
