import { Pressable, StyleSheet } from 'react-native';

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

export default function TimerScreen() {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? 'light'].tint;
  const { status, focusedSeconds, focusedMinutes, start, stop } = useFocusTimer();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Timer</ThemedText>
      <ThemedText style={styles.time}>{formatTime(focusedSeconds)}</ThemedText>

      {status === 'running' ? (
        <Pressable style={[styles.button, { backgroundColor: tint }]} onPress={stop}>
          <ThemedText style={styles.buttonText}>Stop</ThemedText>
        </Pressable>
      ) : (
        <Pressable style={[styles.button, { backgroundColor: tint }]} onPress={start}>
          <ThemedText style={styles.buttonText}>Start</ThemedText>
        </Pressable>
      )}

      {status === 'stopped' && (
        <>
          <ThemedText style={styles.result}>Gefocust: {focusedMinutes} min</ThemedText>
          <ThemedText style={styles.result}>Coins verdiend: {calculateCoins(focusedMinutes)}</ThemedText>
        </>
      )}
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
});
