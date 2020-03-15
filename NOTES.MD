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

- This project uses *Global State Management*. Data will be centralized within a Blog Post Provider file, allowing all child components to access the data rather than drilling down props. This is possible thanks to React Hooks' new *Context* system. Similar functionality can be implemented with Redux, as well.

1) Wrap *React Navigation Stack Navigator* with *Blog Post Provider*. Rather than simply exporting `export default createAppContainer(navigator)`, assign it to a variable. 

2) Export default a custom component that returns the variable from step 1.

`
const App = createAppContainer(navigator)

export default () => {
  return (
    <App />
  )
}
`

3) Create a new *Context* directory and add *BlogContext.js* In that file, create a pipe for the information, as well as the *Provider* that will house the information. Export the *Provider* as a named export. The *Context* will later be exported as a default.

`
import React, { createContext } from 'react'

/* BlogContext pipes the data from the overarching BlogPostProvider to children components */
const BlogContext = createContext()

/* BlogProvider is the component where the data will be stored */
export const BlogProvider = ({ children }) => {
    return (
        <BlogContext.Provider>
            {children}
        </BlogContext.Provider>
    )
}
`

4) Import *BlogProvider* as a named import in *App.js* and wrap the default export <App /> in the <BlogProvider>

- At this point, the overarching BlogPostProvider is wrapping the React Stack Navigator, which includes the App and all of its components, screens, etc. 

5) In *BlogContext.js*, export default BlogContext.

- <BlogContext.Provider> accepts info through a *value* prop. That value is then accessible by children if it is imported.

6) In a child, import *useContext* from React, as well as the *Context* exported in step 5. Inside of the component, use *useContext()* and pass in the Context you just imported. Such as: 

`const value = useContext(BlogContext)`

Now the information included in the *value* prop in the Provider is funneling down to the child component and that information can be used.