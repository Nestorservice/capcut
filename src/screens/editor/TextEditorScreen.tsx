import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditorStackParamList } from '@types/navigation.types';
import { ToolHeader } from './_shared/ToolHeader';
import { Slider } from '@components/ui/Slider';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { useEditorStore } from '@store/editorStore';
import { TextOverlay } from '@types/editor.types';
import { uuid } from '@utils/index';

type Props = NativeStackScreenProps<EditorStackParamList, 'TextEditor'>;

const COLORS = ['#ffffff', '#000000', '#ff4081', '#9c27b0', '#03a9f4', '#4caf50', '#ffeb3b', '#ff5722'];

export function TextEditorScreen({ route, navigation }: Props) {
  const overlayId = route.params?.overlayId;
  const existing = useEditorStore(s => (overlayId ? s.textOverlays.find(t => t.id === overlayId) ?? null : null));
  const currentTime = useEditorStore(s => s.currentTime);
  const totalDuration = useEditorStore(s => s.totalDuration);
  const addText = useEditorStore(s => s.addTextOverlay);
  const updateText = useEditorStore(s => s.updateTextOverlay);

  const [content, setContent] = useState(existing?.content ?? 'Add text');
  const [color, setColor] = useState(existing?.color ?? '#ffffff');
  const [fontSize, setFontSize] = useState(existing?.fontSize ?? 32);
  const [shadow, setShadow] = useState(existing?.shadow ?? true);

  const onApply = () => {
    if (existing) {
      updateText(existing.id, { content, color, fontSize, shadow });
    } else {
      const overlay: TextOverlay = {
        id: uuid(),
        content,
        fontFamily: 'Default',
        fontSize,
        fontWeight: 'bold',
        color,
        backgroundColor: undefined,
        positionX: 0.5,
        positionY: 0.5,
        scale: 1,
        rotation: 0,
        startTime: currentTime,
        endTime: Math.min(totalDuration, currentTime + 5),
        shadow,
        alignment: 'center',
      };
      addText(overlay);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.root}>
      <ToolHeader title="Text" onClose={() => navigation.goBack()} onApply={onApply} applyLabel="Save" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.preview}>
            <Text
              style={{
                color,
                fontSize,
                fontWeight: '800',
                textShadowColor: shadow ? 'rgba(0,0,0,0.5)' : 'transparent',
                textShadowRadius: shadow ? 3 : 0,
              }}
            >
              {content || ' '}
            </Text>
          </View>
          <TextInput
            style={styles.input}
            value={content}
            onChangeText={setContent}
            placeholder="Enter text"
            placeholderTextColor={Colors.text.tertiary}
            multiline
          />

          <Text style={styles.section}>Color</Text>
          <View style={styles.colorRow}>
            {COLORS.map(c => (
              <Pressable
                key={c}
                onPress={() => setColor(c)}
                style={[styles.swatch, { backgroundColor: c }, color === c && styles.swatchActive]}
              />
            ))}
          </View>

          <Slider value={fontSize} min={12} max={120} step={1} onChange={setFontSize} label="Size" formatValue={v => `${v.toFixed(0)}px`} />

          <Pressable style={styles.row} onPress={() => setShadow(s => !s)}>
            <Text style={styles.rowText}>Shadow</Text>
            <View style={[styles.toggle, shadow && styles.toggleActive]}>
              <View style={[styles.toggleThumb, shadow && styles.toggleThumbActive]} />
            </View>
          </Pressable>

          <Pressable
            style={styles.animationBtn}
            onPress={() =>
              existing &&
              navigation.navigate('TextAnimation', { overlayId: existing.id })
            }
            disabled={!existing}
          >
            <Text style={styles.animationLabel}>Animations</Text>
            <Text style={styles.animationHint}>{existing ? 'Configure entrance, loop, exit' : 'Save text first'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  content: { padding: Dim.spacing.lg, gap: 16 },
  preview: { height: 120, backgroundColor: Colors.bg.elevated, borderRadius: 12, alignItems: 'center', justifyContent: 'center', padding: 12 },
  input: { backgroundColor: Colors.bg.input, padding: 12, borderRadius: 8, color: '#ffffff', fontSize: Typography.sizes.base, minHeight: 60 },
  section: { color: Colors.text.secondary, fontSize: Typography.sizes.sm, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  swatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: 'transparent' },
  swatchActive: { borderColor: '#ffffff' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  rowText: { color: '#ffffff', fontSize: Typography.sizes.base },
  toggle: { width: 44, height: 26, borderRadius: 13, backgroundColor: Colors.border.default, padding: 2 },
  toggleActive: { backgroundColor: Colors.accent.pink },
  toggleThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#ffffff' },
  toggleThumbActive: { transform: [{ translateX: 18 }] },
  animationBtn: { padding: 16, backgroundColor: Colors.bg.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border.light },
  animationLabel: { color: '#ffffff', fontSize: Typography.sizes.base, fontWeight: '700' },
  animationHint: { color: Colors.text.secondary, fontSize: Typography.sizes.sm, marginTop: 4 },
});
