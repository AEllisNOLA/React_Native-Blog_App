import React, { useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Context } from '../context/BlogContext'
import { Feather } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'

const ShowScreen = ({ navigation }) => {
    const { state } = useContext(Context)

    // Move through array of blogs. The first item to be true is returned.
    const blogPost = state.find(blogPost => blogPost.id === navigation.getParam('id'))

    return (
        <View>
            <Text>{blogPost.title}</Text>
            <Text>{blogPost.content}</Text>
        </View>
    )
}

ShowScreen.navigationOptions = ({ navigation }) => {
    return {
        headerRight: () =>
            <TouchableOpacity
                onPress={() => navigation.navigate('Edit', { id: navigation.getParam('id') })}>
                <Feather name="edit-2" style={styles.editIcon} />
            </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    editIcon: {
        fontSize: 30,
        paddingHorizontal: 20,
    },
})

export default ShowScreen