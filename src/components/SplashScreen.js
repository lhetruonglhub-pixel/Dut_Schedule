import React, { useEffect, useRef } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SPIDER_WIDTH = Math.min(width * 0.42, 155);
const SPIDER_HEIGHT = SPIDER_WIDTH * (310 / 140);

export default function SplashScreen({ onFinish }) {
  const spiderY = useRef(
    new Animated.Value(-SPIDER_HEIGHT - 40)
  ).current;

  const webHeight = useRef(
    new Animated.Value(0)
  ).current;

  const textOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const backgroundOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const spiderScale = useRef(
    new Animated.Value(0.94)
  ).current;

  useEffect(() => {
    let finishTimer;

    /*
     * ============================================
     * 1. Trắng → vàng
     * ============================================
     */

    const startTimer = setTimeout(() => {
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();

      /*
       * ============================================
       * 2. Sợi tơ xuất hiện
       * ============================================
       */

      Animated.timing(webHeight, {
        toValue: height * 0.30,
        duration: 850,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();

      /*
       * ============================================
       * 3. Spider-Man rơi xuống
       * ============================================
       */

      Animated.parallel([
        Animated.timing(spiderY, {
          toValue: height * 0.18,
          duration: 1250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(spiderScale, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {

        /*
         * ========================================
         * 4. Hiện chữ
         * ========================================
         */

        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start();

        /*
         * ========================================
         * 5. Treo giữa màn hình
         * ========================================
         */

        finishTimer = setTimeout(() => {

          /*
           * ======================================
           * 6. Chữ biến mất
           * ======================================
           */

          Animated.timing(textOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();

          /*
           * ======================================
           * 7. Spider-Man kéo lên
           * ======================================
           */

          Animated.parallel([
            Animated.timing(spiderY, {
              toValue: -SPIDER_HEIGHT - 80,
              duration: 1050,
              easing: Easing.in(Easing.cubic),
              useNativeDriver: true,
            }),

            Animated.timing(webHeight, {
              toValue: 0,
              duration: 1050,
              easing: Easing.in(Easing.cubic),
              useNativeDriver: false,
            }),
          ]).start(() => {

            /*
             * ==================================
             * 8. Kết thúc splash
             * ==================================
             */

            setTimeout(() => {
              if (onFinish) {
                onFinish();
              }
            }, 100);

          });

        }, 3000);
      });

    }, 900);

    return () => {
      clearTimeout(startTimer);

      if (finishTimer) {
        clearTimeout(finishTimer);
      }
    };
  }, [
    backgroundOpacity,
    spiderScale,
    spiderY,
    textOpacity,
    webHeight,
    onFinish,
  ]);

  return (
    <View style={styles.container}>

      {/* ==========================================
          NỀN VÀNG
          ========================================== */}

      <Animated.View
        style={[
          styles.yellowBackground,
          {
            opacity: backgroundOpacity,
          },
        ]}
      />

      {/* ==========================================
          SỢI TƠ
          ========================================== */}

      <Animated.View
        style={[
          styles.web,
          {
            height: webHeight,
          },
        ]}
      >
        <View style={styles.webLine} />
      </Animated.View>

      {/* ==========================================
          SPIDER-MAN
          ========================================== */}

      <Animated.Image
        source={require('../assets/spiderman_cutout.png')}
        resizeMode="contain"
        style={[
          styles.spider,
          {
            width: SPIDER_WIDTH,
            height: SPIDER_HEIGHT,

            transform: [
              {
                translateY: spiderY,
              },
              {
                scale: spiderScale,
              },
            ],
          },
        ]}
      />

      {/* ==========================================
          TEXT
          ========================================== */}

      <Animated.View
        style={[
          styles.message,
          {
            opacity: textOpacity,
          },
        ]}
      >
<Text style={styles.title}>
  I am DUTer
</Text>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({

  /*
   * ==============================================
   * ROOT
   * ==============================================
   */

  container: {
    position: 'absolute',

    left: 0,
    right: 0,
    top: 0,
    bottom: 0,

    width: width,
    height: height,

    backgroundColor: '#FFFFFF',

    overflow: 'hidden',

    alignItems: 'center',

    justifyContent: 'flex-start',

    zIndex: 999999,
  },


  /*
   * ==============================================
   * YELLOW BACKGROUND
   * ==============================================
   */

  yellowBackground: {
    position: 'absolute',

    left: 0,
    right: 0,
    top: 0,
    bottom: 0,

    backgroundColor: '#EFF45C',
  },


  /*
   * ==============================================
   * WEB CONTAINER
   * ==============================================
   */

  web: {
    position: 'absolute',

    top: 0,

    width: 2,

    alignItems: 'center',

    overflow: 'hidden',

    zIndex: 2,
  },


  /*
   * ==============================================
   * WEB LINE
   * ==============================================
   */

  webLine: {
    width: 1.5,

    height: '100%',

    backgroundColor: 'rgba(255,255,255,0.92)',

    shadowColor: '#FFFFFF',

    shadowOpacity: 0.4,

    shadowRadius: 2,

    shadowOffset: {
      width: 0,
      height: 0,
    },
  },


  /*
   * ==============================================
   * SPIDER
   * ==============================================
   */

  spider: {
    position: 'absolute',

    left: (width - SPIDER_WIDTH) / 2,

    top: 0,

    zIndex: 3,

    opacity: 1,
  },


  /*
   * ==============================================
   * MESSAGE
   * ==============================================
   */

message: {
  position: 'absolute',
  top: height * 0.78,

  left: 0,
  right: 0,

  alignItems: 'center',
  justifyContent: 'center',

  zIndex: 5,
},

title: {
  color: '#FFFFFF',

  fontSize: 18,
  fontWeight: '700',

  textAlign: 'center',

  textShadowColor: 'rgba(0,0,0,0.55)',
  textShadowOffset: {
    width: 0,
    height: 1,
  },
  textShadowRadius: 2,
},


  title: {
    color: '#FFFFFF',

    fontSize: 13,

    fontWeight: '700',

    textAlign: 'center',

    letterSpacing: 0.1,

    textShadowColor: 'rgba(0,0,0,0.55)',

    textShadowOffset: {
      width: 0,
      height: 1,
    },

    textShadowRadius: 2,
  },


  subtitle: {
    marginTop: 2,

    color: '#FFFFFF',

    fontSize: 12,

    fontWeight: '600',

    textAlign: 'center',

    letterSpacing: 0.1,

    textShadowColor: 'rgba(0,0,0,0.55)',

    textShadowOffset: {
      width: 0,
      height: 1,
    },

    textShadowRadius: 2,
  },

});