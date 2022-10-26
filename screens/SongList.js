import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import songs from "../src/Data";
import Ionicons from "react-native-vector-icons/Ionicons"

const SongList=(props)=>{
    const [songList, setSongList]=useState([]);
    
    return (
        <Modal visible={props.visibility}>
            <View style = {styles.container}>
                <View style={styles.listTextContainer}>
                    <Text style={styles.listTextStyle}>Songs</Text>
                </View>
                <View style = {styles.listStyle}>
                    <ScrollView>
                        {songs.map((item, index) => (
                            <TouchableOpacity key={index} onPress={()=>props.selectSong(item.id)}>
                                <View style = {styles.itemStyle}>
                                    <View style = {styles.imagestyle}>
                                        <Image source = {item.artwork} style = {styles.albumcover} />
                                    </View>
                                    <View>
                                        <Text numberOfLines={1} style={styles.listTitleStyle}>
                                            {item.title}
                                        </Text>
                                        <Text numberOfLines={1} style={styles.listArtistStyle}>
                                            {item.artist}
                                        </Text>
                                    </View>     
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
  }

  const styles=StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#353535",
    },
    listTextContainer: {
        borderBottomWidth: 2,
        borderColor: "#d9d9d9",
    },
    listStyle: {
        alignSelf:"center",
        width: "85%",
        marginTop: 10,
        paddingBottom: 75,
    },
    listTextStyle: {
        color: "#d9d9d9",
        marginBottom: 10,
        paddingLeft: 20,
        paddingTop: 20,
        fontSize: 20,
    },
    itemStyle: {
        flexDirection:"row",
        borderColor: "#d9d9d9",
        borderWidth: 2,
        borderRadius: 5,
        padding: 3,
        marginBottom: 3,
    },
    imagestyle: {
        width: 50,
        height: 50,
    },
    albumcover: {
        width: "100%",
        height: "100%",
    },
    listTitleStyle: { 
        color: "#d9d9d9",
        marginHorizontal: 5,
        paddingTop: 5,
        fontWeight: "700",
    },
    listArtistStyle: { 
        color: "#d9d9d9",
        marginHorizontal: 5,
    }
});

export default SongList;