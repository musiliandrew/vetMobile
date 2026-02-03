import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.delay(2000),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (onFinish) onFinish();
        });
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <Image
                    source={require('../../assets/splash_logo.png')}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1faf5', // Matching the background color from the image
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        width: width,
        height: height,
    },
});
