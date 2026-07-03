import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { Card } from '../components/ui/Card';
import { spacing, typography, colors } from '../theme';
import { JournalEntry } from '../types/journal';

type Props = {
  route: { params: { entry: JournalEntry } };
};

export function EntryDetailScreen({ route }: Props) {
  const { entry } = route.params;

  return (
    <ScreenContainer style={styles.screen}>
      <ScrollView>
        <Card>
          <Text style={styles.title}>{entry.title}</Text>
          <Text style={styles.meta}>{new Date(entry.createdAt).toLocaleString()}</Text>
          <Text style={styles.reflection}>{entry.reflection}</Text>

          {entry.attachments && entry.attachments.length > 0 && (
            <View style={{ marginTop: spacing.md }}>
              <Text style={styles.section}>پیوست‌ها</Text>
              {entry.attachments.map((a) => (
                <Text key={a.id} style={styles.attachment}>
                  {a.type} — {a.uri}
                </Text>
              ))}
            </View>
          )}
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: 0 },
  title: { fontSize: typography.subtitle, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  meta: { color: colors.textTertiary, fontSize: typography.caption, marginBottom: spacing.md },
  reflection: { color: colors.textSecondary, fontSize: typography.body, lineHeight: 22 },
  section: { fontSize: typography.caption, color: colors.textPrimary, fontWeight: '700', marginBottom: spacing.xs },
  attachment: { color: colors.textTertiary, fontSize: typography.micro, marginTop: spacing.xs },
});
