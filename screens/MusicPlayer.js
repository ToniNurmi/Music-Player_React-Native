import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, FlatList, Dimensions, Animated, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import TrackPlayer, { Capability, Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents } from 'react-native-track-player';
import Slider from "@react-native-community/slider";
import Ionicons from "react-native-vector-icons/Ionicons"
import TextTicker from 'react-native-text-ticker'
import songs from "../src/Data";
import SongList from './SongList';

const {width} = Dimensions.get("window"); // ruudun leveys

const setUpPlayer = async () => {
    try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.add(songs);
    } catch(e) {
        console.log(e)
    }
}

const togglePlay = async playBackState => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack != null) {
        if (playBackState == State.Paused) {
            await TrackPlayer.pause(); //En tiedä miksi tää toimii vaa tällee
            await TrackPlayer.play();
        } else {
            await TrackPlayer.play();
            await TrackPlayer.pause();
        }
    }
};

const MusicPlayer = (props) => {
    const playBackState = usePlaybackState();
    const progress = useProgress();

    const [songIndex, setSongIndex] = useState(0);
    const [trackTitle, setTrackTitle] = useState();
    const [trackArtist, setTrackArtist] = useState();
    const [trackArtwork, setTrackArtwork] = useState();
    const [repeatMode, setRepeatMode] = useState("repeat"); 
    const [songListVisibility, setSongListVisibility]=useState(false);
    const [showIndex, setShowIndex] = useState();


    const scrollX = useRef(new Animated.Value(0)).current;
    const songSlider = useRef(null); //Flatlistin liikuttamiseen

    useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
        if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            const {title, artwork, artist} = track;
            setTrackTitle(title);
            setTrackArtist(artist);
            setTrackArtwork(artwork);
        }
    });

    const changeRepeatMode = () => {
      if (repeatMode == "repeat") {
        TrackPlayer.setRepeatMode(RepeatMode.Track);
        setRepeatMode("track")
        console.log("Looping")
      } else {
        TrackPlayer.setRepeatMode(RepeatMode.Queue);
        setRepeatMode("repeat")
        console.log("Repeating all")
      }
    }

    useEffect(() => {
        setUpPlayer();
        scrollX.addListener(({value}) => { // Ottaa scrollauksen positionin talteen
            const index = Math.round(value / width); // Kuvan sijainti jaettuna ruudun leveydellä = index
            skipTo(index)
            setSongIndex(index)
        })
    }, [])

    const skipTo = async trackId => {
      await TrackPlayer.skip(trackId);
      await TrackPlayer.play();
  };

    const renderSongs = ({item, index}) => {
        return (
            <Animated.View style = {styles.imageWrap}>
                <View style = {styles.imagestyle}>
                    <Image source = {trackArtwork} style = {styles.albumcover} />
                </View>
            </Animated.View>
        );
    }

    const selectSong=(id)=>{
      setSongListVisibility(false);
      if (id-1 < songIndex) {
        songSlider.current.scrollToOffset({
          offset : (id - 1) * width, // Siirtää listaa ruutujen verran taaksepäin
      })
      } else if (id-1 > songIndex) {
        songSlider.current.scrollToOffset({
          offset : (id - 1) * width, // Siirtää listaa ruutujen verran eteenpäin
      })
      } else {
      }
      TrackPlayer.play();
    }

     const skipButtons=(id)=>{
      setSongListVisibility(false);
      if (id-1 < songIndex) {
        songSlider.current.scrollToOffset({
          offset : (id) * width, // Siirtää listaa ruudun verran taaksepäin
      })
      } else {
        songSlider.current.scrollToOffset({
          offset : (id) * width, // Siirtää listaa ruudun verran eteenpäin
      })
      }
      TrackPlayer.play();
    }


    const hideMusicPlayer=()=>{
      setSongListVisibility(true);
    }

  return ( 
    <Modal visible={props.visibility}>
      <SafeAreaView style = {styles.container}>
      <SongList visibility={songListVisibility} selectSong={selectSong} />
        <TouchableOpacity onPress={()=>hideMusicPlayer()} style = {styles.backButton}>
          <Ionicons name="arrow-back-outline" size={40} color="#D9D9D9"/>
        </TouchableOpacity>
        <View style = {styles.maincontainer}>
         
        {/* KUVA */}
        <Animated.FlatList 
          ref = {songSlider}
          renderItem = {renderSongs}
          data = {songs}
          keyExtractor = {item => item.id}
          horizontal // Lista vaakatasoon
          pagingEnabled // Pysähtyy aina itemien kohdalla
          showsHorizontalScrollIndicator = {false} // Ei haluta nähdä scroll indikaattoria
          scrollEventThrottle = {16} // Kuinka usein (ms) tarkistetaan scrollin sijainti, pienempi on tarkempi
          onScroll = {Animated.event(
              [
                  {
                      nativeEvent : {
                          contentOffset : {x : scrollX} ,
                      }
                  }
              ],
              {useNativeDriver : true},
          )}
        />

        {/* NIMET */}
        <View style = {styles.namestyle}>
          <TextTicker duration={10000} repeatSpacer={100} scroll={false} marqueeDelay={1000} loop animationType="auto" style = {styles.songtitle}>
            {trackTitle}
          </TextTicker>
          <TextTicker duration={10000} repeatSpacer={100} scroll={false} marqueeDelay={1000} loop animationType="auto" style = {styles.artisttitle}>
            {trackArtist}
          </TextTicker>
        </View>

        {/* NAPIT */}
        <View style = {styles.controlstyle}>
          <TouchableOpacity onPress={()=>skipButtons(songIndex-1)}>
            <Ionicons name="play-skip-back-circle" size={50} color="#D9D9D9"/>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => togglePlay(playBackState)}>
            <Ionicons name={
              playBackState === State.Playing 
                ? "ios-pause-circle" 
                : "ios-play-circle"
              }size={100} color="#D9D9D9" />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>skipButtons(songIndex+1)}>
            <Ionicons name="play-skip-forward-circle" size={50} color="#D9D9D9"/>
          </TouchableOpacity>
        </View>

        {/* KESTO */}
        <View>
          <View style = {styles.timestyle}>
            <Text style = {styles.timetext}>
                {new Date(progress.position * 1000).toLocaleTimeString().substring(2).split("AM")}
            </Text>
            <Text style = {styles.timetext}>
                {new Date(progress.duration * 1000).toLocaleTimeString().substring(2).split("AM")}
            </Text>
          </View>
          <Slider
            style = {styles.sliderstyle}
            value = {progress.position}
            minimumValue = {0}
            maximumValue = {progress.duration}
            thumbTintColor="#d9d9d9"
            minimumTrackTintColor = "#d9d9d9"
            maximumTrackTintColor = "#939393"
            onSlidingComplete = {async value => {
              await TrackPlayer.seekTo(value)
            }}
          />
        </View>

        {/* YLIM HÖLYNPÖLY */}
        <View style = {styles.bottomContainer}>
          <View style = {styles.bottomIconWrapper}>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="heart-outline" size={30} color="#888888"/>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => changeRepeatMode()}>
              <Ionicons name={
                  repeatMode == "track"
                    ? "repeat" 
                    : "return-up-forward"
              } size={30} color="#888888"/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#353535",
  },
  maincontainer : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    margin: 10,
  },
  imageWrap: {
    width: width, //ruudun leveys
    justifyContent: "center",
    alignItems: "center",
  },
  imagestyle: {
    width: width*0.75,
    height: width*0.75,
    marginBottom: 25,
  },
  albumcover: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  namestyle: {
    alignItems: 'center',
    margin: 5,
  },
  songtitle: {
    fontSize: 30,
    fontWeight: '600',
    color: '#D9D9D9',
  },
  artisttitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#D9D9D9',
  },
  controlstyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 10,
  },
  timestyle: {
    width: 350,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timetext: {
    color: "#d9d9d9",
    fontSize: 14,
    fontWeight: '500',
  },
  sliderstyle: {
    width: 350,
    height: 40,
    flexDirection: "row",
    marginBottom: 30,
  },
  bottomContainer: {
    width: width, //ruudun leveys
    alignItems: "center",
    paddingVertical: 15,
    borderTopColor: '#393E46',
    borderWidth: 1,
  },
  bottomIconWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
});


export default MusicPlayer;