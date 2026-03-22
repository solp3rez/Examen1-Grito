import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Vibration, Dimensions, Animated } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur'; // npx expo install expo-blur

const { width, height } = Dimensions.get('window');

// --- ANIMACIONES PERSONALIZADAS DRAMÁTICAS ---
const sutilPulse = {
  0: { scale: 1, opacity: 0.6 },
  0.5: { scale: 1.02, opacity: 0.9 },
  1: { scale: 1, opacity: 0.6 },
};

const shakeImpact = {
  0: { translateX: 0, rotate: '0deg' },
  0.2: { translateX: -10, rotate: '-3deg' },
  0.4: { translateX: 10, rotate: '3deg' },
  0.6: { translateX: -10, rotate: '-3deg' },
  0.8: { translateX: 10, rotate: '3deg' },
  1: { translateX: 0, rotate: '0deg' },
};

Animatable.initializeRegistryWithDefinitions({ sutilPulse, shakeImpact });

export default function GritaAuxilioProScreen() {
  const [clicks, setClicks] = useState(0);
  const maxClicks = 25; // Más clicks para mayor tensión
  
  // Referencias para animaciones manuales
  const personaRef = useRef<any>(null);
  const cracksRef = useRef<any>(null);
  const textRef = useRef<any>(null);
  const finalScreenRef = useRef<any>(null);

  const isBroken = clicks >= maxClicks;

  // Lógica de clicks y efectos sobre la persona y el vidrio
  const handlePress = () => {
    if (isBroken) return;

    const newClicks = clicks + 1;
    setClicks(newClicks);

    // Vibración escalar: simula la resistencia del vidrio
    Vibration.vibrate(25 + (newClicks * 2.5));

    try {
      // La persona se sacude por el impacto del golpe
      personaRef.current?.stopAnimation?.(); 
      personaRef.current?.animate('shakeImpact', 400); 

      // Las grietas y el texto reaccionan
      if (newClicks > 5) cracksRef.current?.pulse(200);
      textRef.current?.stopAnimation?.();
      textRef.current?.animate('bounceIn', 300); 
    } catch (e) {
      console.log("Animación activa...");
    }
  };

  // Efecto cuando se rompe
  useEffect(() => {
    if (isBroken) {
      try {
        // La persona nítida y liberada
        personaRef.current?.stopAnimation?.(); 
        personaRef.current?.animate('fadeIn', 1500); 

        // Aparece la pantalla final con delay
        finalScreenRef.current?.animate('fadeIn', 2000, 800); 
      } catch (e) {
        console.log("Error anim. final");
      }
    }
  }, [isBroken]);

  const getFrase = () => {
    if (isBroken) return "";
    if (clicks === 0) return "Ayudame, por favor...";
    if (clicks < 8) return "nadie me ve...";
    if (clicks < 16) return "¡HAY ALGUIEN AHÍ?";
    if (clicks < maxClicks) return "¡ROMPE EL VIDRIO!";
    return "SÁCAME DE ACÁ";
  };

  return (
    <View style={styles.container}>
      {/* 1. FONDO NOSTÁLGICO (Textura oscura y profunda) */}
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1000' }} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Degradado oscuro (se oculta al romperse para dar luz) */}
      {!isBroken && (
        <LinearGradient colors={['rgba(0,0,0,0.85)', 'rgba(30,0,0,0.7)', 'rgba(0,0,0,0.95)']} style={styles.absolute} />
      )}

      <TouchableOpacity activeOpacity={1} onPress={handlePress} style={styles.touchArea}>
        
        {/* 2. PERSONA ARRODILLADA Y GOLPEANDO (SIEMPRE VISIBLE) */}
        <Animatable.View 
          ref={personaRef}
          animation={isBroken ? undefined : "sutilPulse"}
          iterationCount="infinite"
          duration={5000}
          style={[styles.absolute, styles.center]}
        >
          {/* !!! REEMPLAZA ESTO CON TU IMAGEN PNG LOCAL !!! */}
          {/* source={require('../../assets/persona_arrodillada.png')} */}
          <Image 
            source={{ uri: 'https://i.imgur.com/xT7XN5k.png' }} // PLACEHOLDER: Persona PNG desesperada
            style={[
              styles.personaImage, 
              { 
                // Efecto visual dinámico: de melancólico a tensión, nítido al final
                tintColor: isBroken ? undefined : clicks > 18 ? '#ff6666' : '#aaccff',
                opacity: isBroken ? 1 : 0.4 + (clicks / maxClicks) * 0.5 
              }
            ]}
            resizeMode="contain"
          />
        </Animatable.View>

        {/* 3. CAPA: GRIETAS SOBRE EL VIDRIO (Aparecen progresivamente) */}
        {!isBroken && (
          <Animatable.View 
            ref={cracksRef}
            style={[styles.absolute, { opacity: (clicks / maxClicks) * 0.95 }]}
            pointerEvents="none"
          >
            <Image 
              source={{ uri: 'https://i.imgur.com/WvO5UqE.png' }} // Placeholder grietas blancas
              style={styles.cracksImage}
              resizeMode="cover"
            />
          </Animatable.View>
        )}

        {/* Brillo de superficie (Vidrio) - Se oculta al romperse */}
        {!isBroken && (
          <LinearGradient 
            colors={['rgba(255,255,255,0.2)', 'transparent', 'rgba(0,0,0,0.5)']} 
            style={styles.absolute} 
          />
        )}

        {/* 4. CAPA: TEXTO DINÁMICO ABAJO */}
        {!isBroken && (
          <View style={styles.uiContainer}>
            <Animatable.Text 
              ref={textRef}
              key={clicks}
              style={[styles.frase, { 
                fontSize: 18 + (clicks * 0.5),
                color: clicks > 18 ? '#ff4d4d' : '#fff',
                textShadowColor: clicks > 18 ? 'red' : 'rgba(255,255,255,0.5)',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 12,
              }]}
            >
              {getFrase()}
            </Animatable.Text>
          </View>
        )}

        {/* 5. PANTALLA DE LIBERACIÓN FINAL (Blur y textos nítidos) */}
        {isBroken && (
          <Animatable.View 
            ref={finalScreenRef}
            style={styles.absolute} 
            pointerEvents="none"
          >
            <BlurView intensity={100} tint="light" style={styles.absolute}>
              {/* Dejamos el centro vacío para que se vea la persona atrás */}
              <View style={styles.center} />
            </BlurView>
            
            {/* Texto final Superpuesto (arriba del Blur) */}
            <View style={styles.finalTextContainer}>
              <Animatable.Text animation="zoomIn" delay={1200} style={styles.finalTitle}>LIBERTAD</Animatable.Text>
              <Animatable.Text animation="fadeIn" delay={1800} style={styles.finalSub}>El grito rompió el vidrio.</Animatable.Text>
              
              <Animatable.View animation="bounceIn" delay={2800}>
                <TouchableOpacity onPress={() => setClicks(0)} style={styles.resetBtn} pointerEvents="auto">
                  <Text style={{color: '#fff', letterSpacing: 2, fontWeight: 'bold'}}>VOLVER A EMPEZAR</Text>
                </TouchableOpacity>
              </Animatable.View>
            </View>
          </Animatable.View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  absolute: { ...StyleSheet.absoluteFillObject },
  touchArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  center: { justifyContent: 'center', alignItems: 'center' },
  backgroundImage: { ...StyleSheet.absoluteFillObject, width: width, height: height },
  
  personaImage: { 
    width: width * 0.85, // Grande y central
    height: height * 0.65,
    marginTop: -height * 0.05, // Ajuste sutil hacia arriba
    // Brillo sutil de aura (nostalgia)
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  
  cracksImage: { 
    width: width, 
    height: height,
    tintColor: 'white',
  },
  
  uiContainer: { position: 'absolute', bottom: 100, width: '100%', alignItems: 'center', paddingHorizontal: 40 },
  frase: { textAlign: 'center', fontWeight: '200', textTransform: 'uppercase', letterSpacing: 2, lineHeight: 28 },
  
  // Estilos para la UI final súper Pro
  finalTextContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 10, // Arriba de todo
  },
  finalTitle: { fontSize: 45, fontWeight: '900', color: '#000', letterSpacing: 6, marginBottom: 10 },
  finalSub: { fontSize: 16, color: '#444', marginTop: 15, textAlign: 'center', fontStyle: 'italic', fontWeight: 'bold' },
  resetBtn: { marginTop: 80, padding: 15, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 30, zIndex: 11 }
});