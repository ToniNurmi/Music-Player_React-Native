import React, { useEffect, useState }from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons"
import MusicPlayer from './screens/MusicPlayer';
import SongList from './screens/SongList';


const App = (props) => {

  const [musicPlayerVisibility, setMusicPlayerVisibility]=useState(true);
  const [songListVisibility, setSongListVisibility]=useState(false);

  const hideMusicPlayer=()=>{
    setMusicPlayerVisibility(false);
    setSongListVisibility(true);
  }

  return ( 
    <View style={styles.container}>
        <MusicPlayer visibility={musicPlayerVisibility}/> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#353535",
  },  
  backButton: {
    margin: 10,
  },
})

export default App;
