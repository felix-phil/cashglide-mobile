import React, { useRef, useState, useEffect, FC } from "react";
import { StyleSheet, View, Animated, Easing } from "react-native";
import colors from "../../constants/colors";

interface LoaderProps {
  size?: number;
  color?: string;
}

const Loader = ({ size = 60, color = '#000' }) => {
  const [rotation] = useState(new Animated.Value(0));
  const smallCircleRef = useRef(null);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, []);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const smallCircleXInterpolate = rotation.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [size / 2, 0, -size / 2, 0, size / 2]
  });

  const smallCircleYInterpolate = rotation.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, -size / 2, 0, size / 2, 0]
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.bigCircle,
          { width: size, height: size, borderColor: colors.default.grayFour }
        ]}
      >
        <Animated.View
          ref={smallCircleRef}
          style={[
            styles.smallCircle,
            {
              width: size / 4,
              height: size / 4,
              backgroundColor: color,
              transform: [
                { translateX: smallCircleXInterpolate },
                { translateY: smallCircleYInterpolate },
                { rotate: rotateInterpolate }
              ]
            }
          ]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  bigCircle: {
    borderRadius: 50,
    borderWidth: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  smallCircle: {
    borderRadius: 50
  }
});

export default Loader;

