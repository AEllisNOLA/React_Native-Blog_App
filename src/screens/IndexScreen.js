import React, { useContext, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Context } from '../context/BlogContext'
import { Feather } from '@expo/vector-icons'

const IndexScreen = ({ navigation }) => {
    const { state, deleteBlogPost, getBlogPosts } = useContext(Context)

    useEffect(() => {
        // Get blog posts on load
        getBlogPosts()

        // Get blog posts any time the Index Screen is front-and-center
        const listener = navigation.addListener('didFocus', () => {
            getBlogPosts()
        })
        // Clean up listener to prevent memory leak
        return () => {
            listener.remove()
        }
    }, [])

    return (
        <View>
            <FlatList
                data={state}
                keyExtractor={blogPost => blogPost.id}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity onPress={() => navigation.navigate('Show', { id: item.id })}>
                            <View style={styles.row}>
                                <Text style={styles.title}>{item.title}</Text>
                                <TouchableOpacity onPress={() => deleteBlogPost(item.id)}>
                                    <Feather name="trash" style={styles.trashIcon} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>

                    )
                }}
            />
        </View>
    )
}

// Customize items displayed in header
IndexScreen.navigationOptions = ({ navigation }) => {
    return {
        headerRight: () => <TouchableOpacity onPress={() => navigation.navigate('Create')}>
            <Feather name='plus' style={styles.plusIcon} />
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    row: {
        // Everything on same line
        flexDirection: 'row',
        // Seperate title and trash icon
        justifyContent: 'space-between',
        // Vertical breathing room between posts
        paddingVertical: 20,
        // Horizontal breathing room from screen edge
        paddingHorizontal: 10,
        // Post seperating border
        borderBottomWidth: 1,
        borderColor: 'gray'
    },
    title: {
        fontSize: 18
    },
    trashIcon: {
        fontSize: 24
    },
    plusIcon: {
        paddingHorizontal: 20,
        fontSize: 30
    }
})

export default IndexScreen