import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing, Platform, TouchableOpacity } from 'react-native';
import { Volume2, VolumeX, Repeat, Play, Pause, Loader } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

// ============================================
// PINYIN DISPLAY - 拼音显示组件
// ============================================

export function PinyinDisplay({
  chinese,
  pinyin,
  size = 'medium', // 'small', 'medium', 'large'
  showToneMarks = true,
  showToneNumbers = false,
  highlightTone,
  style,
}) {
  const { colors } = useTheme();

  const sizes = {
    small: { chinese: 16, pinyin: 10 },
    medium: { chinese: 24, pinyin: 12 },
    large: { chinese: 36, pinyin: 14 },
  };

  const s = sizes[size];

  // Convert tone numbers to tone marks if needed
  const pinyinWithTones = useMemo(() => {
    if (!pinyin) return '';
    if (showToneMarks && !showToneNumbers) {
      return convertToneNumbersToMarks(pinyin);
    }
    return pinyin;
  }, [pinyin, showToneMarks, showToneNumbers]);

  return (
    <View style={[styles.pinyinContainer, style]}>
      <Text style={[
        styles.pinyinText,
        {
          color: highlightTone ? getToneColor(highlightTone) : colors.mutedText,
          fontSize: s.pinyin,
        },
      ]}>
        {pinyinWithTones}
      </Text>
      <Text style={[
        styles.chineseText,
        { color: colors.text, fontSize: s.chinese },
      ]}>
        {chinese}
      </Text>
    </View>
  );
}

// ============================================
// PINYIN TEXT - 行内拼音文本
// ============================================

export function PinyinText({
  chinese,
  pinyin,
  style,
  chineseStyle,
  pinyinStyle,
  onPress,
  showPinyin = true,
}) {
  const { colors } = useTheme();

  const content = (
    <View style={[styles.pinyinTextContainer, style]}>
      {showPinyin && pinyin && (
        <Text style={[
          styles.inlinePinyin,
          { color: colors.mutedText },
          pinyinStyle,
        ]}>
          {pinyin}
        </Text>
      )}
      <Text style={[
        styles.inlineChinese,
        { color: colors.text },
        chineseStyle,
      ]}>
        {chinese}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

// ============================================
// SPEECH BUTTON - 语音播放按钮
// ============================================

export function SpeechButton({
  text,
  language = 'zh-CN', // 'zh-CN' (Mandarin), 'zh-TW' (Taiwanese Mandarin), 'en-US'
  rate = 0.9,
  pitch = 1.0,
  size = 'medium', // 'small', 'medium', 'large'
  variant = 'default', // 'default', 'minimal', 'outline'
  autoPlay = false,
  onSpeakStart,
  onSpeakEnd,
  style,
}) {
  const { colors } = useTheme();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const sizes = {
    small: { button: 32, icon: 14 },
    medium: { button: 44, icon: 18 },
    large: { button: 56, icon: 24 },
  };

  const s = sizes[size];

  useEffect(() => {
    if (autoPlay && text) {
      speak();
    }
  }, [autoPlay, text]);

  const speak = useCallback(async () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      setIsPaused(false);
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

      // Pulse animation while speaking
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 300,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      ).start();

      setIsSpeaking(true);
      onSpeakStart?.();

      Speech.speak(text, {
        language,
        rate,
        pitch,
        onDone: () => {
          setIsSpeaking(false);
          setIsPaused(false);
          scaleAnim.stopAnimation();
          scaleAnim.setValue(1);
          onSpeakEnd?.();
        },
        onError: () => {
          setIsSpeaking(false);
          setIsPaused(false);
          scaleAnim.stopAnimation();
          scaleAnim.setValue(1);
        },
        onStop: () => {
          setIsSpeaking(false);
          setIsPaused(false);
          scaleAnim.stopAnimation();
          scaleAnim.setValue(1);
        },
      });
    } catch (error) {
      setIsSpeaking(false);
    }
  }, [text, language, rate, pitch, isSpeaking]);

  const stop = useCallback(() => {
    Speech.stop();
    setIsSpeaking(false);
    setIsPaused(false);
    scaleAnim.stopAnimation();
    scaleAnim.setValue(1);
  }, []);

  const buttonStyle = useMemo(() => {
    const base = {
      width: s.button,
      height: s.button,
      borderRadius: s.button / 2,
      alignItems: 'center',
      justifyContent: 'center',
    };

    switch (variant) {
      case 'minimal':
        return [base, { backgroundColor: 'transparent' }];
      case 'outline':
        return [base, { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary }];
      default:
        return [base, { backgroundColor: colors.cinnabarGlow }];
    }
  }, [variant, s.button, colors]);

  const iconColor = variant === 'outline' ? colors.primary : colors.primary;

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        style={buttonStyle}
        onPress={speak}
        onLongPress={stop}
        accessibilityLabel={`Play pronunciation: ${text}`}
        accessibilityRole="button"
      >
        {isSpeaking ? (
          <Pause size={s.icon} color={iconColor} strokeWidth={2} />
        ) : (
          <Volume2 size={s.icon} color={iconColor} strokeWidth={2} />
        )}
      </Pressable>
    </Animated.View>
  );
}

// ============================================
// PRONUNCIATION CARD - 发音卡片
// ============================================

export function PronunciationCard({
  chinese,
  pinyin,
  english,
  audioUrl,
  showToneGuide = true,
  showStrokeOrder = false,
  style,
}) {
  const { colors } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);

  const tones = useMemo(() => {
    if (!pinyin) return [];
    return extractTones(pinyin);
  }, [pinyin]);

  return (
    <View style={[styles.pronCard, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>
      {/* Main content */}
      <View style={styles.pronMain}>
        <View style={styles.pronLeft}>
          <Text style={[styles.pronChinese, { color: colors.text }]}>{chinese}</Text>
          {pinyin && (
            <Text style={[styles.pronPinyin, { color: colors.primary }]}>
              {convertToneNumbersToMarks(pinyin)}
            </Text>
          )}
          {english && (
            <Text style={[styles.pronEnglish, { color: colors.mutedText }]}>{english}</Text>
          )}
        </View>

        <SpeechButton
          text={chinese}
          size="medium"
          variant="outline"
          onSpeakStart={() => setIsPlaying(true)}
          onSpeakEnd={() => setIsPlaying(false)}
        />
      </View>

      {/* Tone guide */}
      {showToneGuide && tones.length > 0 && (
        <View style={[styles.toneGuide, { borderTopColor: colors.border }]}>
          <Text style={[styles.toneGuideLabel, { color: colors.mutedText }]}>Tones: </Text>
          <View style={styles.toneMarks}>
            {tones.map((tone, index) => (
              <View key={index} style={[styles.toneMark, { backgroundColor: getToneColor(tone) + '20' }]}>
                <Text style={[styles.toneMarkText, { color: getToneColor(tone) }]}>
                  {tone === 0 ? '·' : tone}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

// ============================================
// TONE PRACTICE - 声调练习
// ============================================

export function TonePractice({
  chinese,
  pinyin,
  correctTone,
  onAnswer,
  style,
}) {
  const { colors } = useTheme();
  const [selectedTone, setSelectedTone] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (tone) => {
    setSelectedTone(tone);
    setShowResult(true);
    Haptics.impactAsync(
      tone === correctTone
        ? Haptics.ImpactFeedbackStyle.Success
        : Haptics.ImpactFeedbackStyle.Error
    ).catch(() => {});

    setTimeout(() => {
      onAnswer?.(tone === correctTone);
      setSelectedTone(null);
      setShowResult(false);
    }, 1500);
  };

  const toneOptions = [1, 2, 3, 4, 0]; // 0 = neutral tone

  return (
    <View style={[styles.tonePractice, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>
      <Text style={[styles.tonePracticeLabel, { color: colors.mutedText }]}>What tone is this?</Text>

      <View style={styles.tonePracticeContent}>
        <Text style={[styles.tonePracticeChinese, { color: colors.text }]}>{chinese}</Text>
        <Text style={[styles.tonePracticePinyin, { color: colors.primary }]}>
          {convertToneNumbersToMarks(pinyin)}
        </Text>
        <SpeechButton text={chinese} size="small" variant="minimal" />
      </View>

      <View style={styles.toneOptions}>
        {toneOptions.map((tone) => {
          const isSelected = selectedTone === tone;
          const isCorrect = showResult && tone === correctTone;
          const isWrong = showResult && isSelected && tone !== correctTone;

          return (
            <Pressable
              key={tone}
              style={[
                styles.toneOption,
                {
                  borderColor: isCorrect
                    ? colors.success
                    : isWrong
                    ? colors.error
                    : isSelected
                    ? colors.primary
                    : colors.border,
                  backgroundColor: isCorrect
                    ? colors.success + '15'
                    : isWrong
                    ? colors.error + '15'
                    : isSelected
                    ? colors.cinnabarGlow
                    : colors.surface,
                },
              ]}
              onPress={() => !showResult && handleSelect(tone)}
              disabled={showResult}
            >
              <Text style={[
                styles.toneOptionText,
                {
                  color: isCorrect
                    ? colors.success
                    : isWrong
                    ? colors.error
                    : isSelected
                    ? colors.primary
                    : colors.text,
                },
              ]}>
                {tone === 0 ? '·' : tone}
              </Text>
              <Text style={[
                styles.toneOptionLabel,
                { color: colors.mutedText },
              ]}>
                {getToneName(tone)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Convert tone numbers (ma1, ma2, etc.) to tone marks (mā, má, etc.)
function convertToneNumbersToMarks(pinyin) {
  if (!pinyin) return '';

  const toneMarks = {
    a: ['ā', 'á', 'ǎ', 'à', 'a'],
    e: ['ē', 'é', 'ě', 'è', 'e'],
    i: ['ī', 'í', 'ǐ', 'ì', 'i'],
    o: ['ō', 'ó', 'ǒ', 'ò', 'o'],
    u: ['ū', 'ú', 'ǔ', 'ù', 'u'],
    ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
    v: ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
  };

  // Simple conversion - find tone number and apply to vowel
  return pinyin.replace(/([aeiouüv])([1-4])?/gi, (match, vowel, tone) => {
    if (!tone) return vowel;
    const toneIndex = parseInt(tone) - 1;
    const lowerVowel = vowel.toLowerCase();
    if (toneMarks[lowerVowel]) {
      const marked = toneMarks[lowerVowel][toneIndex];
      return vowel === lowerVowel ? marked : marked.toUpperCase();
    }
    return vowel;
  }).replace(/[1-4]/g, '');
}

// Extract tone numbers from pinyin
function extractTones(pinyin) {
  if (!pinyin) return [];
  const tones = [];
  const matches = pinyin.match(/[1-4]/g);
  if (matches) {
    tones.push(...matches.map(Number));
  }
  // Check for syllables without tone marks (neutral tone)
  const syllables = pinyin.split(/\s+/);
  syllables.forEach(s => {
    if (!/[1-4]/.test(s) && s.length > 0) {
      tones.push(0);
    }
  });
  return tones;
}

// Get color for tone
function getToneColor(tone) {
  const colors = {
    1: '#E2B05E', // High level - gold
    2: '#6B8A94', // Rising - teal
    3: '#8B7355', // Falling-rising - brown
    4: '#B33B24', // Falling - red
    0: '#999999', // Neutral - gray
  };
  return colors[tone] || colors[0];
}

// Get tone name
function getToneName(tone) {
  const names = {
    1: 'High',
    2: 'Rising',
    3: 'Dip',
    4: 'Falling',
    0: 'Neutral',
  };
  return names[tone] || '';
}

const styles = StyleSheet.create({
  // Pinyin Display
  pinyinContainer: {
    alignItems: 'center',
  },
  pinyinText: {
    fontWeight: '600',
    letterSpacing: 1,
  },
  chineseText: {
    fontWeight: '700',
    marginTop: 2,
  },

  // Inline Pinyin Text
  pinyinTextContainer: {
    alignItems: 'center',
  },
  inlinePinyin: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  inlineChinese: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Pronunciation Card
  pronCard: {
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    padding: 16,
  },
  pronMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pronLeft: {
    flex: 1,
  },
  pronChinese: {
    fontSize: 28,
    fontWeight: '800',
  },
  pronPinyin: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  pronEnglish: {
    fontSize: 12,
    marginTop: 4,
  },
  toneGuide: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 0.5,
  },
  toneGuideLabel: {
    fontSize: 11,
  },
  toneMarks: {
    flexDirection: 'row',
    gap: 4,
  },
  toneMark: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toneMarkText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Tone Practice
  tonePractice: {
    borderRadius: theme.radii.md,
    borderWidth: 0.5,
    padding: 16,
  },
  tonePracticeLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 12,
  },
  tonePracticeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  tonePracticeChinese: {
    fontSize: 32,
    fontWeight: '800',
  },
  tonePracticePinyin: {
    fontSize: 16,
    fontWeight: '600',
  },
  toneOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  toneOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  toneOptionText: {
    fontSize: 20,
    fontWeight: '800',
  },
  toneOptionLabel: {
    fontSize: 9,
    marginTop: 2,
  },
});