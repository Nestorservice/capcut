import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditorStackParamList } from '@types/navigation.types';
import { ToolHeader } from './_shared/ToolHeader';
import { Button } from '@components/ui/Button';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { useKeyframe } from '@hooks/useKeyframe';
import { useEditorStore } from '@store/editorStore';
import { formatTime } from '@utils/formatTime';

type Props = NativeStackScreenProps<EditorStackParamList, 'Keyframe'>;

export function KeyframeScreen({ route, navigation }: Props) {
  const { keyframes, insertKeyframe, removeKeyframe } = useKeyframe(route.params.targetId);
  const currentTime = useEditorStore(s => s.currentTime);

  const onAdd = () => {
    insertKeyframe(
      currentTime,
      { scale: 1, rotation: 0, opacity: 1, positionX: 0.5, positionY: 0.5 },
      'linear',
      route.params.targetType,
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <ToolHeader title="Keyframes" onClose={() => navigation.goBack()} onApply={() => navigation.goBack()} />
      <View style={styles.summary}>
        <Text style={styles.summaryValue}>{keyframes.length}</Text>
        <Text style={styles.summaryLabel}>keyframe{keyframes.length === 1 ? '' : 's'}</Text>
      </View>
      <Button label="Add keyframe at playhead" icon="add" variant="primary" size="md" fullWidth onPress={onAdd} style={{ marginHorizontal: Dim.spacing.lg }} />
      <ScrollView contentContainerStyle={styles.list}>
        {keyframes.map(k => (
          <View key={k.id} style={styles.row}>
            <View style={styles.diamond}>
              <Icon name="diamond" size={16} color={Colors.editor.keyframe} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>At {formatTime(k.time, true)}</Text>
              <Text style={styles.rowMeta}>scale {(k.properties.scale ?? 1).toFixed(2)}, rotate {(k.properties.rotation ?? 0).toFixed(0)}°</Text>
            </View>
            <Pressable onPress={() => removeKeyframe(k.id)} hitSlop={8}>
              <Icon name="delete" size={20} color={Colors.status.error} />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  summary: { alignItems: 'center', padding: Dim.spacing.lg },
  summaryValue: { color: '#ffffff', fontSize: 40, fontWeight: '800' },
  summaryLabel: { color: Colors.text.secondary, fontSize: Typography.sizes.sm, marginTop: 4 },
  list: { padding: Dim.spacing.lg, gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12, backgroundColor: Colors.bg.card, borderRadius: 8 },
  diamond: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.bg.elevated, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { color: '#ffffff', fontSize: Typography.sizes.base, fontWeight: '600' },
  rowMeta: { color: Colors.text.secondary, fontSize: Typography.sizes.sm, marginTop: 2 },
});
