import { useState } from 'react';
import { Image, ImageSourcePropType, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFocusTimer } from '@/hooks/use-focus-timer';
import { calculateCoins } from '@/utils/coins';

type FocusMode = 'stopwatch' | 'timer';

const MODE_LABELS: Record<FocusMode, string> = {
  stopwatch: 'Stopwatch',
  timer: 'Timer',
};

type AllowedApp = {
  id: string;
  name: string;
  icon: ImageSourcePropType;
};

const MOCK_ALLOWED_APPS: AllowedApp[] = [
  { id: '1', name: 'Spotify', icon: require('@/assets/images/icon.png') },
  { id: '2', name: 'WhatsApp', icon: require('@/assets/images/react-logo.png') },
  { id: '3', name: 'Slack', icon: require('@/assets/images/favicon.png') },
  { id: '4', name: 'Mail', icon: require('@/assets/images/splash-icon.png') },
  { id: '5', name: 'Notes', icon: require('@/assets/images/partial-react-logo.png') },
  { id: '6', name: 'Calendar', icon: require('@/assets/images/android-icon-foreground.png') },
];
const VISIBLE_ALLOWED_APPS = MOCK_ALLOWED_APPS.slice(0, 3);
const HIDDEN_ALLOWED_APPS_COUNT = MOCK_ALLOWED_APPS.length - VISIBLE_ALLOWED_APPS.length;

const DURATION_PRESETS = [15, 25, 45, 60];

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? 'light'].tint;
  const onTintColor = Colors[colorScheme ?? 'light'].background;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const mutedColor = Colors[colorScheme ?? 'light'].icon;
  const surfaceColor = colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
  const sheetBackground = Colors[colorScheme ?? 'light'].background;

  const { status, focusedSeconds, focusedMinutes, start, stop } = useFocusTimer();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [focusText, setFocusText] = useState('');
  const [mode, setMode] = useState<FocusMode>('stopwatch');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [modePickerVisible, setModePickerVisible] = useState(false);

  const handleCancel = () => {
    setConfirmVisible(false);
  };

  const handleCancelModePicker = () => {
    setModePickerVisible(false);
  };

  const handleSelectStopwatch = () => {
    setMode('stopwatch');
    setModePickerVisible(false);
  };

  const handleSelectDuration = (minutes: number) => {
    setDurationMinutes(minutes);
    setModePickerVisible(false);
  };

  const handleStartSession = () => {
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
          <ThemedView style={[styles.sheet, { backgroundColor: sheetBackground }]}>
            <View style={styles.dragHandle} />

            <ThemedText type="subtitle" style={styles.sheetTitle}>
              What&apos;s your focus?
            </ThemedText>

            <TextInput
              style={[styles.input, { backgroundColor: surfaceColor, color: textColor }]}
              placeholder="Studying for #maths exam"
              placeholderTextColor={mutedColor}
              value={focusText}
              onChangeText={setFocusText}
            />

            <View style={styles.cardRow}>
              <Pressable
                style={[styles.card, { backgroundColor: surfaceColor }]}
                onPress={() => setModePickerVisible(true)}>
                <View style={styles.cardHeaderRow}>
                  <IconSymbol name="timer" size={18} color={textColor} />
                  <ThemedText style={styles.cardHeaderText}>
                    {mode === 'timer' ? `${MODE_LABELS.timer} · ${durationMinutes}m` : MODE_LABELS.stopwatch}
                  </ThemedText>
                </View>
                <ThemedText style={[styles.cardLabel, { color: mutedColor }]}>MODE</ThemedText>
              </Pressable>

              <Pressable
                style={[styles.card, { backgroundColor: surfaceColor }]}
                onPress={() => console.log('Open app picker', MOCK_ALLOWED_APPS)}>
                <View style={styles.appStack}>
                  {VISIBLE_ALLOWED_APPS.map((app, index) => (
                    <Image
                      key={app.id}
                      source={app.icon}
                      style={[
                        styles.appIcon,
                        { borderColor: surfaceColor, marginLeft: index === 0 ? 0 : -12 },
                      ]}
                    />
                  ))}
                  {HIDDEN_ALLOWED_APPS_COUNT > 0 && (
                    <View style={styles.appCountBadge}>
                      <ThemedText style={styles.appCountBadgeText}>+{HIDDEN_ALLOWED_APPS_COUNT}</ThemedText>
                    </View>
                  )}
                </View>
                <ThemedText style={[styles.cardLabel, { color: mutedColor }]}>ALLOWED APPS</ThemedText>
              </Pressable>
            </View>

            <Pressable style={styles.startButton} onPress={handleStartSession}>
              <ThemedText style={styles.startButtonText}>Start session</ThemedText>
            </Pressable>

            <ThemedText
              style={[styles.editSettingsLink, { color: mutedColor }]}
              onPress={() => console.log('Edit settings')}>
              Edit settings
            </ThemedText>
          </ThemedView>
        </View>
      </Modal>

      <Modal
        visible={modePickerVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCancelModePicker}>
        <View style={styles.sheetWrapper}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleCancelModePicker} />
          <ThemedView style={[styles.sheet, { backgroundColor: sheetBackground }]}>
            <View style={styles.dragHandle} />

            <ThemedText type="subtitle" style={styles.sheetTitle}>
              Mode
            </ThemedText>

            <Pressable
              style={[styles.modeRow, { backgroundColor: surfaceColor }]}
              onPress={handleSelectStopwatch}>
              <ThemedText style={styles.cardHeaderText}>Stopwatch</ThemedText>
              {mode === 'stopwatch' && <IconSymbol name="checkmark" size={18} color={tint} />}
            </Pressable>

            <Pressable style={[styles.modeRow, { backgroundColor: surfaceColor }]} onPress={() => setMode('timer')}>
              <ThemedText style={styles.cardHeaderText}>Timer</ThemedText>
              {mode === 'timer' && <IconSymbol name="checkmark" size={18} color={tint} />}
            </Pressable>

            {mode === 'timer' && (
              <View style={styles.durationRow}>
                {DURATION_PRESETS.map((minutes) => (
                  <Pressable
                    key={minutes}
                    style={[
                      styles.durationPreset,
                      { backgroundColor: minutes === durationMinutes ? tint : surfaceColor },
                    ]}
                    onPress={() => handleSelectDuration(minutes)}>
                    <ThemedText
                      style={[
                        styles.durationPresetText,
                        { color: minutes === durationMinutes ? onTintColor : textColor },
                      ]}>
                      {minutes}m
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            )}
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 16,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(128, 128, 128, 0.4)',
    alignSelf: 'center',
  },
  sheetTitle: {
    textAlign: 'center',
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
    gap: 8,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardHeaderText: {
    fontSize: 15,
    fontWeight: '600',
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  appStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
  },
  appCountBadge: {
    marginLeft: -8,
    marginTop: -12,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  appCountBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  startButton: {
    backgroundColor: '#22C55E',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  editSettingsLink: {
    textAlign: 'center',
    fontSize: 14,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  durationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  durationPreset: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  durationPresetText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
