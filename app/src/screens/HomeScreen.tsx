import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppHeader } from '../components/ui/AppHeader';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { EmptyState } from '../components/ui/EmptyState';
import { MetricTile } from '../components/ui/MetricTile';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import { colors, radius, spacing, typography } from '../theme';
import { formatNumber, getElapsedParts } from '../utils/date';
import { useMemoryStats, useMoodStats } from '../hooks/useMemory';

const LAST_MEETING = new Date('2025-04-20T09:30:00');

export function HomeScreen() {
  const [now, setNow] = useState(() => Date.now());
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;
  
  // Hooks برای یادآوری‌ها
  const memoryStats = useMemoryStats();
  const moodStats = useMoodStats();

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]).start();
    return () => clearInterval(interval);
  }, [fadeAnim, slideAnim]);

  const elapsed = useMemo(() => getElapsedParts(LAST_MEETING, now), [now]);

  const perspectives = [
    { label: 'Days', value: `${elapsed.days}` },
    { label: 'Weeks', value: `${Math.floor(elapsed.days / 7)}` },
    { label: 'Months', value: `${Math.floor(elapsed.days / 30)}` },
    { label: 'Seasons', value: `${Math.floor(elapsed.days / 92)}` },
  ];

  const withoutCards = [
    { icon: '👀', title: 'Haven’t seen their photo', value: `${elapsed.days} days` },
    { icon: '🎤', title: 'Haven’t heard their voice', value: `${elapsed.days} days` },
    { icon: '💬', title: 'Haven’t exchanged messages', value: `${elapsed.days} days` },
  ];

  const events = [
    { icon: '🌅', label: 'Sunrises', value: `${elapsed.days + 1}` },
    { icon: '🌇', label: 'Sunsets', value: `${elapsed.days}` },
    { icon: '🌙', label: 'Nights', value: `${elapsed.days + 2}` },
  ];

  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];

  return (
    <ScreenContainer style={styles.screen}>
      <AppHeader
        title="Memory Timeline"
        subtitle="A quiet museum of the days that kept passing."
        right={<View style={styles.headerBadge}><Text style={styles.headerBadgeText}>Live</Text></View>}
      />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.heroCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.06)']} style={styles.heroGlow}>
            <Text style={styles.heroLabel}>Since the last meeting</Text>
            <View style={styles.timerRow}>
              <View style={styles.timerBox}>
                <Text style={styles.timerValue}>{formatNumber(elapsed.days)}</Text>
                <Text style={styles.timerUnit}>Days</Text>
              </View>
              <View style={styles.timerBox}>
                <Text style={styles.timerValue}>{formatNumber(elapsed.hours)}</Text>
                <Text style={styles.timerUnit}>Hours</Text>
              </View>
            </View>
            <View style={styles.timerRow}>
              <View style={styles.timerBox}>
                <Text style={styles.timerValue}>{formatNumber(elapsed.minutes)}</Text>
                <Text style={styles.timerUnit}>Minutes</Text>
              </View>
              <View style={styles.timerBox}>
                <Text style={styles.timerValue}>{formatNumber(elapsed.seconds)}</Text>
                <Text style={styles.timerUnit}>Seconds</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Card style={styles.sectionCard}>
          <SectionHeader title="Time perspectives" hint="Several ways to feel the same distance." />
          <View style={styles.chipRow}>
            <Chip label="Live" active />
            <Chip label="Seasonal" />
            <Chip label="Calm" />
          </View>
          <View style={styles.grid}>
            {perspectives.map((item) => (
              <MetricTile key={item.label} value={item.value} label={item.label} />
            ))}
          </View>
        </Card>

        {/* بخش یادآوری‌ها */}
        {memoryStats && memoryStats.totalEntries > 0 && (
          <Card style={styles.sectionCard}>
            <SectionHeader title="یادآوری‌های شما" hint="اطلاعات درباره‌ی ثبت‌های خود" />
            <View style={styles.memoryStatsRow}>
              <View style={styles.memoryStat}>
                <Text style={styles.memoryStatValue}>{memoryStats.totalEntries}</Text>
                <Text style={styles.memoryStatLabel}>کل یادآوری</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.memoryStat}>
                <Text style={styles.memoryStatValue}>{memoryStats.entriesThisMonth}</Text>
                <Text style={styles.memoryStatLabel}>این ماه</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.memoryStat}>
                <Text style={styles.memoryStatValue}>{memoryStats.entriesThisWeek}</Text>
                <Text style={styles.memoryStatLabel}>این هفته</Text>
              </View>
            </View>

            {/* حالات روحی */}
            <View style={styles.moodSection}>
              <Text style={styles.moodSectionTitle}>حالات روحی اخیر:</Text>
              <View style={styles.moodBadges}>
                {Object.entries(moodStats).map(([mood, count]) => {
                  if (count === 0) return null;
                  return (
                    <Badge
                      key={mood}
                      label={`${mood} (${count})`}
                      variant={
                        mood === 'خوشحال'
                          ? 'success'
                          : mood === 'آرام'
                            ? 'accent'
                            : mood === 'غمگین'
                              ? 'error'
                              : mood === 'نگران'
                                ? 'warning'
                                : 'neutral'
                      }
                      size="sm"
                    />
                  );
                })}
              </View>
            </View>
          </Card>
        )}

        <Card style={styles.sectionCard}>
          <SectionHeader title="Without…" hint="Gentle counters for what changed in absence." />
          {withoutCards.map((item) => (
            <Pressable key={item.title} style={styles.listRow}>
              <Text style={styles.listIcon}>{item.icon}</Text>
              <View style={styles.listContent}>
                <Text style={styles.listTitle}>{item.title}</Text>
                <Text style={styles.listValue}>{item.value}</Text>
              </View>
            </Pressable>
          ))}
          <View style={styles.emptyBlock}>
            <EmptyState title="Personalized counters" hint="You can rename, enable, or create new ones later." />
          </View>
        </Card>

        <Card style={styles.sectionCard}>
          <SectionHeader title="What happened while they were away" hint="The world continued without pause." />
          <View style={styles.grid}>
            {events.map((item) => (
              <MetricTile key={item.label} value={item.value} label={item.label} />
            ))}
          </View>
        </Card>

        <Card style={styles.sectionCard}>
          <SectionHeader title="Seasonal timeline" hint="A calm path through the passing year." />
          <View style={styles.timelineList}>
            {seasons.map((season, index) => (
              <View key={season} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <Text style={styles.timelineText}>{season}</Text>
                <Text style={styles.timelineBadge}>{index < 2 ? '✓' : '•'}</Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 0,
  },
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 40,
  },
  headerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(94, 234, 212, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.28)',
  },
  headerBadgeText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  heroCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#02030b',
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
  heroGlow: {
    padding: spacing.lg,
    gap: 12,
  },
  heroLabel: {
    color: '#dfe8ff',
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  timerRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timerBox: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(5, 10, 24, 0.28)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  timerValue: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 3,
  },
  timerUnit: {
    color: colors.accent,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  sectionCard: {
    marginBottom: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyBlock: {
    marginTop: spacing.sm,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  listIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    marginBottom: 2,
  },
  listValue: {
    color: colors.accentSoft,
    fontSize: 12,
  },
  timelineList: {
    gap: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(5, 10, 24, 0.24)',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
    marginRight: 10,
  },
  timelineText: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 14,
  },
  timelineBadge: {
    color: colors.accentSoft,
    fontSize: 14,
  },

  // Memory Stats
  memoryStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  memoryStat: {
    alignItems: 'center',
    flex: 1,
  },
  memoryStatValue: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  memoryStatLabel: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
  },

  // Mood Section
  moodSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  moodSectionTitle: {
    fontSize: typography.caption,
    color: colors.textTertiary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  moodBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
