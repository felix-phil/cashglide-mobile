import React, {
  useState,
  useEffect,
  FC,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { Asset } from "expo-asset";
import { Animated, View, StyleSheet, ImageURISource } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { customFonts } from "../../constants/fonts";
import Constants from "expo-constants";

SplashScreen.preventAutoHideAsync().catch((e) => {
  console.log("error apploader");
});

const AnimatedAppLoader: FC<{
  children: ReactNode | ReactNode[];
  image: ImageURISource;
}> = ({ children, image }) => {
  const [isSplashReady, setSplashReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      // await Asset.fromURI(image.uri!).downloadAsync();
      setSplashReady(true);
    }

    prepare();
  }, []);

  if (!isSplashReady) {
    return null;
  }

  return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>;
};

const AnimatedSplashScreen: FC<{
  children: ReactNode | ReactNode[];
  image: ImageURISource;
}> = ({ children, image }) => {
  const animation = useMemo(() => new Animated.Value(1), []);
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true));
    }
  }, [isAppReady]);

  const onImageLoaded = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
      await Promise.all([Font.loadAsync(customFonts)]);
    } catch (e) {
      console.warn(e);
    } finally {
      setAppReady(true);
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: Constants.manifest?.splash?.backgroundColor,
              opacity: animation,
            },
          ]}
        >
          <Animated.Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: Constants.manifest?.splash?.resizeMode || "contain",
              transform: [
                {
                  scale: animation,
                },
              ],
            }}
            source={image}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </View>
  );
};
export default AnimatedAppLoader;
