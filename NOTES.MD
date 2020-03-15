# STEPS TO RUNNING PROJECT

1. Run with `npm start`


# STEPS TO GENERATING PROJECT

1. Created using *expo-cli* rather than *react-native-cli*.

a) Run `npx expo-cli init blog`
b) Choose *blank* as template.

2. Fix bug for Windows if version of *Node* is 12.11 or higher.

a) In project, move to *node_modules/metro-config/src/defaults/blacklist.js*.
b) Change 

`var sharedBlacklist = [
  /node_modules[/\\]react[/\\]dist[/\\].*/,
  /website\/node_modules\/.*/,
  /heapCapture\/bundle\.js/,
  /.*\/__tests__\/.*/
];`

to 

`var sharedBlacklist = [
  /node_modules[\/\\]react[\/\\]dist[\/\\].*/,
  /website\/node_modules\/.*/,
  /heapCapture\/bundle\.js/,
  /.*\/__tests__\/.*/
];`

3. Move into project and install dependencies:

a) install react-navigation with `npm install react-navigation`
b) install other dependencies with `expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view`
c) Install React Navigation Stack with `npm install react-navigation-stack @react-native-community/masked-view`
d) Start app and clear cache with `npm start -c`

# 01. Basic Navigation Setup

# 02. Adding Context

- This project uses *Global State Management*. Data will be centralized within a Blog Post Provider file, allowing all child components to access the data rather than drilling down props.