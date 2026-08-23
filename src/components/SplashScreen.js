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

  // ==========================================
  // ANIMATION VALUES
  // ==========================================

  const spiderY = useRef(
    new Animated.Value(-SPIDER_HEIGHT - 40)
  ).current;

  const spiderScale = useRef(
    new Animated.Value(0.94)
  ).current;

  // Rotation only — the pivot point is moved to the
  // TOP of the image (see the transform trick below),
  // so the head/shoulders stay anchored to the web and
  // only the lower body arcs out. No more translateX
  // sway, which was making the whole cutout slide
  // sideways as one rigid block.
  const spiderRotate = useRef(
    new Animated.Value(0)
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

  const swingAnimation = useRef(null);


  // ==========================================
  // MAIN SPLASH ANIMATION
  // ==========================================

  useEffect(() => {

    let startTimer;
    let finishTimer;

    // ========================================
    // BACKGROUND
    // ========================================

    startTimer = setTimeout(() => {

      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();


      // ======================================
      // WEB DROPS DOWN
      // ======================================

      Animated.timing(webHeight, {
        toValue: height * 0.30,
        duration: 850,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();


      // ======================================
      // SPIDER FALLS DOWN
      // ======================================

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

        // ====================================
        // START SWINGING (damped pendulum,
        // pivoting from the head/web point)
        // Big fast swings first, then settles
        // into a slow gentle idle sway.
        // ====================================

        const swingTo = (toValue, duration) =>
          Animated.timing(spiderRotate, {
            toValue,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          });

        const idleSway = () =>
          Animated.loop(
            Animated.sequence([
              swingTo(0.3, 1100),
              swingTo(-0.3, 2200),
              swingTo(0, 1100),
            ])
          );

        swingAnimation.current = Animated.sequence([
          // big opening kick, slightly overshooting
          swingTo(-1, 550),
          swingTo(1.15, 900),
          swingTo(-0.8, 850),
          swingTo(0.5, 750),
          swingTo(-0.28, 650),
          // settle into a gentle continuous sway
          idleSway(),
        ]);

        swingAnimation.current.start();


        // ====================================
        // SHOW TEXT
        // ====================================

        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start();


        // ====================================
        // WAIT
        // ====================================

        finishTimer = setTimeout(() => {

          // ================================
          // STOP SWING
          // ================================

          if (swingAnimation.current) {
            swingAnimation.current.stop();
          }


          // ================================
          // HIDE TEXT
          // ================================

          Animated.timing(textOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();


          // ================================
          // SPIDER GOES UP
          // ================================

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

            Animated.timing(spiderRotate, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }),

          ]).start(() => {

            // ==============================
            // FINISH
            // ==============================

            setTimeout(() => {

              if (onFinish) {
                onFinish();
              }

            }, 100);

          });

        }, 3000);

      });

    }, 900);


    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {

      clearTimeout(startTimer);
      clearTimeout(finishTimer);

      if (swingAnimation.current) {
        swingAnimation.current.stop();
      }

    };

  }, []);


  // ==========================================
  // ROTATION
  // ==========================================

  const rotate = spiderRotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-11deg', '0deg', '11deg'],
  });


  // ==========================================
  // UI
  // ==========================================

  return (
    <View style={styles.container}>

      {/* ======================================
          YELLOW BACKGROUND
          ====================================== */}

      <Animated.View
        style={[
          styles.yellowBackground,
          {
            opacity: backgroundOpacity,
          },
        ]}
      />


      {/* ======================================
          WEB — stays straight, it's anchored
          to a fixed point above, only the
          spider swings from the bottom of it
          ====================================== */}

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


      {/* ======================================
          SPIDER-MAN
          The outer Animated.View handles fall +
          scale + the pivot-at-top rotation trick:
          translateY(-H/2) -> rotate -> translateY(H/2)
          moves the rotation anchor from the image's
          center up to its top edge (where the web
          attaches), so the head barely moves and the
          body/legs are what visibly arc out — a much
          more natural "hanging from a thread" swing.
          ====================================== */}

      <Animated.View
        style={[
          styles.spiderPivot,
          {
            width: SPIDER_WIDTH,
            height: SPIDER_HEIGHT,

            transform: [
              { translateY: spiderY },
              { scale: spiderScale },
              { translateY: -SPIDER_HEIGHT / 2 },
              { rotate },
              { translateY: SPIDER_HEIGHT / 2 },
            ],
          },
        ]}
      >

        <Animated.Image
          source={require('../assets/spiderman_cutout.png')}
          resizeMode="contain"
          // resizeMethod="resize" hints Android to
          // re-sample on decode instead of just
          // stretching the bitmap — helps sharpness
          // when the source PNG is scaled down.
          resizeMethod="resize"
          style={styles.spiderImage}
        />

      </Animated.View>


      {/* ======================================
          TEXT
          ====================================== */}

      <Animated.View
        style={[
          styles.message,
          {
            opacity: textOpacity,
          },
        ]}
      >

        <Text style={styles.title}>
          I am <Text style={styles.redText}>DUTer</Text>
        </Text>

      </Animated.View>

    </View>
  );
}


// ==============================================
// STYLES
// ==============================================

const styles = StyleSheet.create({

  // ============================================
  // CONTAINER
  // ============================================

  container: {
    position: 'absolute',

    left: 0,
    right: 0,
    top: 0,
    bottom: 0,

    width,
    height,

    backgroundColor: '#FFFFFF',

    overflow: 'hidden',

    alignItems: 'center',

    justifyContent: 'flex-start',

    zIndex: 999999,
  },


  // ============================================
  // YELLOW
  // ============================================

  yellowBackground: {
    position: 'absolute',

    left: 0,
    right: 0,
    top: 0,
    bottom: 0,

    backgroundColor: '#EFF45C',
  },


  // ============================================
  // WEB
  // ============================================

  web: {
    position: 'absolute',

    top: 0,

    width: 2,

    alignItems: 'center',

    overflow: 'hidden',

    zIndex: 2,
  },


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


  // ============================================
  // SPIDER PIVOT WRAPPER
  // ============================================

  spiderPivot: {
    position: 'absolute',

    left: (width - SPIDER_WIDTH) / 2,

    top: 0,

    zIndex: 3,
  },


  // ============================================
  // SPIDER IMAGE
  // ============================================

  spiderImage: {
    width: '100%',
    height: '100%',
  },


  // ============================================
  // TEXT CONTAINER
  // ============================================

  message: {
    position: 'absolute',

    top: height * 0.78,

    left: 0,
    right: 0,

    alignItems: 'center',

    justifyContent: 'center',

    zIndex: 5,
  },


  // ============================================
  // TITLE
  // ============================================

  title: {
    color: '#111111',

    fontSize: 22,

    fontWeight: '800',

    textAlign: 'center',

    letterSpacing: 0.3,

    textShadowColor: 'rgba(255,255,255,0.45)',

    textShadowOffset: {
      width: 0,
      height: 1,
    },

    textShadowRadius: 2,
  },


  // ============================================
  // DUTER
  // ============================================

  redText: {
    color: '#C62828',

    fontWeight: '900',
  },

});