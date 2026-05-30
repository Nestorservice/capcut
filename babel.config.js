module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json', '.png', '.jpg', '.jpeg', '.svg'],
        alias: {
          '@app': './src/app',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@components': './src/components',
          '@hooks': './src/hooks',
          '@store': './src/store',
          '@services': './src/services',
          '@types': './src/types',
          '@constants': './src/constants',
          '@utils': './src/utils',
          '@assets': './src/assets',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
