import React, { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
} from "react-native";
import { Audio } from "expo-av";

const { height } = Dimensions.get("window");

// 🔥 FRASES MÁS NARRATIVAS (PROGRESO EMOCIONAL)
const FRASES = [
  "no puedo",
  "escuchame",
  "dejame salir",
  "no aguanto más",
  "GRITÁ",
  "ROMPELO",
];

export default function ScrollEfecto() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<any>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const [grabando, setGrabando] = useState(false);
  const [mostrarRespirar, setMostrarRespirar] = useState(false);
  const [final, setFinal] = useState(false);

  const scrollPos = useRef(0);

  const empezar = async () => {
    const permiso = await Audio.requestPermissionsAsync();
    if (!permiso.granted) return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    await recording.startAsync();
    recordingRef.current = recording;

    setGrabando(true);
    setMostrarRespirar(false);
    setFinal(false);

    let silencioFrames = 0;

    const interval = setInterval(async () => {
      const status = await recording.getStatusAsync();
      if (!status.isRecording) return;

      const volumen = status.metering ?? -160;

      // 🔥 MÁS DRAMÁTICO (acumulación real)
      if (volumen > -25) {
        scrollPos.current += 25; // grito empuja fuerte
        silencioFrames = 0;
      } else {
        scrollPos.current -= 5; // baja lento → tensión
        silencioFrames++;
      }

      // límites
      if (scrollPos.current < 0) scrollPos.current = 0;

      const maxScroll = height * (FRASES.length - 1);

      if (scrollPos.current >= maxScroll) {
        scrollPos.current = maxScroll;

        // 💥 FINAL (ROMPE TODO)
        clearInterval(interval);
        await recording.stopAndUnloadAsync();

        setGrabando(false);
        setFinal(true);
      }

      scrollRef.current?.scrollTo({
        y: scrollPos.current,
        animated: false,
      });

      // 😌 respirar
      if (silencioFrames > 20) {
        setMostrarRespirar(true);
      } else {
        setMostrarRespirar(false);
      }
    }, 60);
  };

  return (
    <View style={styles.container}>
      {/* 🟢 INICIO */}
      {!grabando && !final && (
        <View style={styles.center}>
          <Text style={styles.grita}>GRITÁ</Text>

          <Pressable style={styles.boton} onPress={empezar}>
            <Text style={styles.botonTexto}>EMPEZAR 🎤</Text>
          </Pressable>
        </View>
      )}

      {/* 🔴 DURANTE */}
      {grabando && (
        <>
          <Animated.ScrollView
            ref={scrollRef}
            scrollEnabled={false}
            contentContainerStyle={{
              height: height * FRASES.length,
            }}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
          >
            {FRASES.map((texto, i) => {
              const inputRange = [
                (i - 1) * height,
                i * height,
                (i + 1) * height,
              ];

              const translateY = scrollY.interpolate({
                inputRange,
                outputRange: [100, 0, -100],
                extrapolate: "clamp",
              });

              const opacity = scrollY.interpolate({
                inputRange,
                outputRange: [0, 1, 0],
                extrapolate: "clamp",
              });

              const scale = scrollY.interpolate({
                inputRange,
                outputRange: [0.8, 1.3, 0.8], // más intenso
                extrapolate: "clamp",
              });

              return (
                <View key={i} style={styles.page}>
                  <Animated.Text
                    style={[
                      styles.text,
                      i === FRASES.length - 1 && styles.finalTexto,
                      {
                        opacity,
                        transform: [{ translateY }, { scale }],
                      },
                    ]}
                  >
                    {texto}
                  </Animated.Text>
                </View>
              );
            })}
          </Animated.ScrollView>

          {/* 😌 MENSAJE */}
          {mostrarRespirar && (
            <Text style={styles.respirar}>
              Tranquilo, podés respirar
            </Text>
          )}
        </>
      )}

      {/* 💥 FINAL */}
      {final && (
        <View style={styles.center}>
          <Text style={styles.finalPantalla}>LO DIJISTE</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  page: {
    height,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 30,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  grita: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#fff",
  },
  finalTexto: {
    color: "#ff3333",
    fontSize: 40,
    fontWeight: "bold",
  },
  boton: {
    marginTop: 20,
    backgroundColor: "#ff4d4d",
    padding: 15,
    borderRadius: 10,
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  respirar: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    color: "#00ff88",
    fontSize: 22,
    fontWeight: "bold",
  },
  finalPantalla: {
    fontSize: 45,
    color: "#00ff88",
    fontWeight: "bold",
  },
});