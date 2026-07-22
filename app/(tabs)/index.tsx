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
  const { status, focusedSeconds, focusedMinutes, start, stop } = useFocusTimer();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleConfirmStart = () => {
    setConfirmVisible(false);
    start();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Home</ThemedText>

      {status === 'running' ? (
        <View style={styles.timerBlock}>
          <ThemedText type="subtitle">FocusTime</ThemedText>
          <ThemedText style={styles.time}>{formatTime(focusedSeconds)}</ThemedText>
          <Pressable style={[styles.button, { backgroundColor: tint }]} onPress={stop}>
            <ThemedText style={styles.buttonText}>Stop</ThemedText>
          </Pressable>
        </View>
      ) : (
        <Pressable style={[styles.button, { backgroundColor: tint }]} onPress={() => setConfirmVisible(true)}>
          <ThemedText style={styles.buttonText}>Focus</ThemedText>
        </Pressable>
      )}

      {status === 'stopped' && (
        <>
          <ThemedText style={styles.result}>Gefocust: {focusedMinutes} min</ThemedText>
          <ThemedText style={styles.result}>Coins verdiend: {calculateCoins(focusedMinutes)}</ThemedText>
        </>
      )}

      <Modal
        visible={confirmVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setConfirmVisible(false)}>
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalCard}>
            <ThemedText type="subtitle">Start Focusing?</ThemedText>
            <View style={styles.modalButtonRow}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setConfirmVisible(false)}>
                <ThemedText style={styles.buttonText}>No</ThemedText>
              </Pressable>
              <Pressable style={[styles.modalButton, { backgroundColor: tint }]} onPress={handleConfirmStart}>
                <ThemedText style={styles.buttonText}>Yes</ThemedText>
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
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
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  result: {
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalCard: {
    width: '80%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonSecondary: {
    backgroundColor: '#687076',
  },
});
