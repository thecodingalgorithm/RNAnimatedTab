import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  findNodeHandle,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Image,
  Animated,
  TouchableOpacity
} from 'react-native';

const { width, height } = Dimensions.get('screen')

const images = {
  islanders:
    'https://images.pexels.com/photos/3375116/pexels-photo-3375116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  dream:
    'https://images.pexels.com/photos/3617500/pexels-photo-3617500.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  ocean:
    'https://images.pexels.com/photos/3331094/pexels-photo-3331094.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  nightingale:
    'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  woods:
    'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
};
const data = Object.keys(images).map((i) => ({
  key: i,
  title: i,
  image: images[i],
  ref: React.createRef()
}));

const Tab = React.forwardRef(({ item, onItemPress }, ref) => {
  return (
    <TouchableOpacity onPress={onItemPress}>
      <View
        ref={ref}
      >
        <Text style={{
          color: 'white',
          fontSize: 84 / data.length,
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  )
})

const Indicator = ({ measures, scrollX }) => {

  const inputRange = data.map((_, i) => i * width);

  const indicatorWidth = scrollX.interpolate({
    inputRange,
    outputRange: measures.map((measure) => measure.width)
  })

  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: measures.map((measure) => measure.x)
  })

  return <Animated.View style={{
    position: 'absolute',
    height: 4,
    width: indicatorWidth,
    left: 0,
    backgroundColor: 'white',
    bottom: -10,
    transform: [{
      translateX
    }]
  }} />
}

const Tabs = ({ data, onItemPress, scrollX }) => {

  const [measures, setMeasures] = React.useState([])
  const containerRef = React.useRef()

  React.useEffect(() => {
    let m = []
    data.forEach(item => {
      item.ref.current.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
          m.push({
            x, y,
            width,
            height
          })

          if (m.length === data.length) {
            setMeasures(m)
          }
        })
    })
  }, [])


  return <View style={{
    position: 'absolute',
    top: 30,
    width
  }}>
    <View
      ref={containerRef}
      style={{
        justifyContent: 'space-evenly',
        flex: 1,
        flexDirection: 'row'
      }}>
      {data.map((item, index) => {
        return <Tab key={item.key} item={item} ref={item.ref} onItemPress={() => onItemPress(index)} />
      })}
    </View>
    {measures.length > 0 && <Indicator measures={measures} scrollX={scrollX} />}
  </View>
}




export default function App() {

  const scrollX = React.useRef(new Animated.Value(0)).current
  const ref = React.useRef()
  const onItemPress = React.useCallback(itemIndex => {
    ref?.current?.scrollToOffset({
      offset: itemIndex * width
    })
  })

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <Animated.FlatList
        ref={ref}
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false })}
        bounces={false}
        keyExtractor={item => item.key}
        renderItem={({ item }) => {
          return <View style={{
            width, height
          }}>
            <Image
              source={{ uri: item.image }}
              style={{
                flex: 1,
                resizeMode: 'cover'
              }}
            />
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
          </View>
        }}
      />

      <Tabs scrollX={scrollX} onItemPress={onItemPress} data={data} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});