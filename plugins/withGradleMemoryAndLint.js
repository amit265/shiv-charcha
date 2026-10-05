const { withGradleProperties, withAppBuildGradle } = require('expo/config-plugins');

/**
 * Expo Config Plugin to:
 * 1. Set org.gradle.jvmargs=-Xmx8192m -XX:MaxMetaspaceSize=4096m -XX:+UseG1GC in android/gradle.properties
 * 2. Disable lintVital/checkReleaseBuilds in android/app/build.gradle to prevent R8 memory exhaustion
 */
function withGradleMemoryAndLint(config) {
  // 1. Force High Memory & Production Architectures in android/gradle.properties
  config = withGradleProperties(config, (config) => {
    config.modResults = config.modResults.filter(
      (item) => item.key !== 'org.gradle.jvmargs' && item.key !== 'reactNativeArchitectures'
    );
    config.modResults.push({
      type: 'property',
      key: 'org.gradle.jvmargs',
      value: '-Xmx8192m -XX:MaxMetaspaceSize=4096m -XX:+UseG1GC',
    });
    config.modResults.push({
      type: 'property',
      key: 'reactNativeArchitectures',
      value: 'arm64-v8a,armeabi-v7a',
    });
    return config;
  });

  // 2. Disable release linting in app/build.gradle
  config = withAppBuildGradle(config, (config) => {
    if (!config.modResults.contents.includes('checkReleaseBuilds false')) {
      config.modResults.contents += `\nandroid {\n  lintOptions {\n    checkReleaseBuilds false\n    abortOnError false\n  }\n}\n`;
    }
    return config;
  });

  return config;
}

module.exports = withGradleMemoryAndLint;
