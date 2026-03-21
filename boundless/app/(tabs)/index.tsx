import { Text, View, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [touches, setTouches] = useState(0);

  const handlePress = () => {
    setTouches(touches + 1);
  };

  // Mensaje según progreso
  let message = "";
  if (touches < 3) {
    message = "no puedo...";
  } else if (touches < 6) {
    message = "seguí...";
  } else if (touches < 10) {
    message = "ayudame...";
  } else if (touches < 15) {
    message = "ROMPELO";
  } else {
    message = "AL FIN";
  }

  // Emoji cambia con intensidad
  let face = "😔";
  if (touches > 5) face = "😫";
  if (touches > 10) face = "😡";
  if (touches > 15) face = "😱";

  // “Cristal” cambia de color
  let boxStyle = styles.box;
  if (touches > 3) boxStyle = styles.crack1;
  if (touches > 7) boxStyle = styles.crack2;
  if (touches > 12) boxStyle = styles.break;

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      
      <View style={[styles.box, boxStyle]}>
        <Text style={styles.person}>{face}</Text>
      </View>

      <Text style={styles.text}>{message}</Text>

      <Text style={styles.counter}>Toques: {touches}</Text>

    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: 220,
    height: 220,
    backgroundColor: "#6fa8dc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  crack1: {
    backgroundColor: "#4a7fa8",
  },
  crack2: {
    backgroundColor: "#2e5873",
  },
  break: {
    backgroundColor: "transparent",
  },
  person: {
    fontSize: 60,
  },
  text: {
    color: "white",
    fontSize: 24,
    marginTop: 30,
    fontWeight: "bold",
  },
  counter: {
    marginTop: 20,
    color: "#888",
  }
});