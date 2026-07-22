import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFocusTimer } from '@/hooks/use-focus-timer';
import { calculateCoins } from '@/utils/coins';

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? 'light'].tint;
  const onTintColor = Colors[colorScheme ?? 'light'].background;
  const { status, focusedSeconds, focusedMinutes, start, stop } = useFocusTimer();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleCancel = () => {
    setConfirmVisible(false);
  };

  const handleConfirmStart = () => {
    setConfirmVisible(false);
    start();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.focusBlock}>
        {status === 'running' ? (
          <View style={styles.timerBlock}>
            <ThemedText type="subtitle">FocusTime</ThemedText>
            <ThemedText style={styles.time}>{formatTime(focusedSeconds)}</ThemedText>
            <Pressable style={[styles.button, { backgroundColor: tint }]} onPress={stop}>
              <ThemedText style={[styles.buttonText, { color: onTintColor }]}>Stop</ThemedText>
            </Pressable>
          </View>
        ) : (
          <Pressable style={[styles.button, { backgroundColor: tint }]} onPress={() => setConfirmVisible(true)}>
            <ThemedText style={[styles.buttonText, { color: onTintColor }]}>Focus</ThemedText>
          </Pressable>
        )}

        {status === 'stopped' && (
          <>
            <ThemedText style={styles.result}>Gefocust: {focusedMinutes} min</ThemedText>
            <ThemedText style={styles.result}>Coins verdiend: {calculateCoins(focusedMinutes)}</ThemedText>
          </>
        )}
      </View>

      <Modal
        visible={confirmVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCancel}>
        <View style={styles.sheetWrapper}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleCancel} />
          <ThemedView style={styles.sheet}>
            <ThemedText type="subtitle">Start Focusing?</ThemedText>
            <View style={styles.sheetButtonRow}>
              <Pressable style={[styles.sheetButton, styles.sheetButtonSecondary]} onPress={handleCancel}>
                <ThemedText style={[styles.buttonText, { color: '#fff' }]}>No</ThemedText>
              </Pressable>
              <Pressable style={[styles.sheetButton, { backgroundColor: tint }]} onPress={handleConfirmStart}>
                <ThemedText style={[styles.buttonText, { color: onTintColor }]}>Yes</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  focusBlock: {
    position: 'absolute',
    bottom: '25%',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 8,
  },
  timerBlock: {
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontSize: 48,
    fontVariant: ['tabular-nums'],
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  result: {
    marginTop: 8,
  },
  sheetWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    height: '33%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  sheetButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sheetButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  sheetButtonSecondary: {
    backgroundColor: '#687076',
  },
});
