import React, { useState, useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Platform, Alert as NativeAlert } from 'react-native';
import { AppHeader } from '../components/ui/AppHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import { Alert as CustomAlert } from '../components/ui/Alert';
import { colors, spacing, typography } from '../theme';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { JournalEntry, MoodType, Attachment } from '../types/journal';
import { useMemories, useAddMemory, useDeleteMemory, useMoodStats, useUpdateMemory } from '../hooks/useMemory';

const MOODS: MoodType[] = ['آرام', 'خوشحال', 'غمگین', 'نگران', 'خسته', 'انرژی دار'];

export function JournalScreen() {
  const { entries, isLoading: entriesLoading, error: entriesError } = useMemories();
  const { addEntry, isLoading: addLoading, error: addError } = useAddMemory();
  const { deleteEntry, deleteAllEntries, isLoading: deleteLoading } = useDeleteMemory();
  const { updateEntry, isLoading: updateLoading, error: updateError } = useUpdateMemory();
  const moodStats = useMoodStats();

  // فیلترهای صفحه
  const [selectedMood, setSelectedMood] = useState<MoodType | 'همه'>('همه');
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [reflection, setReflection] = useState('');
  const [reflectionError, setReflectionError] = useState('');
  const [mood, setMood] = useState<MoodType>('آرام');
  const [showClearWarning, setShowClearWarning] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [attachmentUri, setAttachmentUri] = useState<string>('');
  const [attachmentType, setAttachmentType] = useState<'photo' | 'audio'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingInstance, setRecordingInstance] = useState<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playingUri, setPlayingUri] = useState<string | null>(null);

  // فیلتر کردن ورودی‌ها بر اساس حالت روحی انتخاب‌شده
  const filteredEntries = useMemo(() => {
    if (selectedMood === 'همه') return entries;
    return entries.filter((entry) => entry.mood === selectedMood);
  }, [entries, selectedMood]);

  const validateForm = (): boolean => {
    let isValid = true;
    setTitleError('');
    setReflectionError('');

    if (!title.trim()) {
      setTitleError('عنوان الزامی است');
      isValid = false;
    } else if (title.trim().length < 3) {
      setTitleError('عنوان باید حداقل 3 کاراکتر باشد');
      isValid = false;
    }

    if (!reflection.trim()) {
      setReflectionError('متن بازتاب الزامی است');
      isValid = false;
    } else if (reflection.trim().length < 10) {
      setReflectionError('متن بازتاب باید حداقل 10 کاراکتر باشد');
      isValid = false;
    }

    return isValid;
  };

  // --- Image picker helpers ---
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        NativeAlert.alert('اجازه مورد نیاز', 'دسترسی به گالری نیاز است');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const a: Attachment = {
          id: `${Date.now()}`,
          type: 'photo',
          uri: result.assets[0].uri,
          createdAt: new Date().toISOString(),
        };
        setAttachments((p) => [a, ...p]);
      }
    } catch (error) {
      console.error('pickImage error', error);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        NativeAlert.alert('اجازه مورد نیاز', 'دسترسی به دوربین نیاز است');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
      if (!result.canceled && result.assets?.[0]?.uri) {
        const a: Attachment = {
          id: `${Date.now()}`,
          type: 'photo',
          uri: result.assets[0].uri,
          createdAt: new Date().toISOString(),
        };
        setAttachments((p) => [a, ...p]);
      }
    } catch (error) {
      console.error('takePhoto error', error);
    }
  };

  // --- Audio recording helpers ---
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        NativeAlert.alert('اجازه مورد نیاز', 'دسترسی به میکروفون نیاز است');
        return;
      }

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      setRecordingInstance(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('startRecording error', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingInstance) return;
      await recordingInstance.stopAndUnloadAsync();
      const uri = recordingInstance.getURI();
      setRecordingInstance(null);
      setIsRecording(false);

      if (uri) {
        const a: Attachment = {
          id: `${Date.now()}`,
          type: 'audio',
          uri,
          createdAt: new Date().toISOString(),
        };
        setAttachments((p) => [a, ...p]);
      }
    } catch (error) {
      console.error('stopRecording error', error);
    }
  };

  const playAttachment = async (uri: string) => {
    try {
      if (playingUri === uri) {
        // stop
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        setPlayingUri(null);
        return;
      }

      // stop any existing
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setPlayingUri(null);
      }

      const { sound } = await Audio.Sound.createAsync({ uri });
      soundRef.current = sound;
      setPlayingUri(uri);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status?.didJustFinish) {
          sound.unloadAsync();
          soundRef.current = null;
          setPlayingUri(null);
        }
      });
    } catch (error) {
      console.error('playAttachment error', error);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (editingId) {
        // update existing
        await updateEntry(editingId, {
          title: title.trim(),
          reflection: reflection.trim(),
          mood,
          attachments: attachments.length > 0 ? attachments : undefined,
        });
      } else {
        await addEntry({
          title: title.trim(),
          reflection: reflection.trim(),
          mood,
          tags: [],
          attachments: attachments.length > 0 ? attachments : undefined,
        });
      }

      // ریست فرم
      setTitle('');
      setReflection('');
      setMood('آرام');
      setAttachments([]);
      setVisible(false);
      setEditingId(null);
    } catch (error) {
      console.error('خطا در ذخیره‌سازی:', error);
    }
  };

  // تبدیل تاریخ به فرمت دقیق‌تر شامل ثانیه
  const formatDetailedDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('fa-IR', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };


  const handleDelete = async (id: string) => {
    await deleteEntry(id);
  };

  const handleClearAll = async () => {
    await deleteAllEntries();
    setShowClearWarning(false);
  };

  const getMoodVariant = (moodText: MoodType): 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    switch (moodText) {
      case 'آرام':
        return 'accent';
      case 'خوشحال':
        return 'success';
      case 'غمگین':
        return 'error';
      case 'نگران':
        return 'warning';
      case 'خسته':
        return 'info';
      case 'انرژی دار':
        return 'success';
      default:
        return 'neutral';
    }
  };

  return (
    <ScreenContainer style={styles.screen}>
      <AppHeader title="دفتر یادآوری" subtitle="لحظات آرام که اهمیت دارند را ثبت کنید." />

      {/* پیام خطا */}
      {entriesError && (
        <CustomAlert title="خطا" message={entriesError} variant="error" />
      )}
      {addError && (
        <CustomAlert title="خطا" message={addError} variant="error" />
      )}

      {/* آمار کوتاه */}
      {entries.length > 0 && (
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{entries.length}</Text>
              <Text style={styles.statLabel}>کل یادآوری‌ها</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{moodStats['خوشحال']}</Text>
              <Text style={styles.statLabel}>لحظات خوب</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{entries[0]?.createdAt ? 'بله' : '-'}</Text>
              <Text style={styles.statLabel}>آخرین ورودی</Text>
            </View>
          </View>
        </Card>
      )}

      <SectionHeader
        title="ورودی‌ها"
        hint="مجموعه‌ای زنده از بازتاب‌های شما."
      />

      {/* فیلتر مود */}
      <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.sm }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity onPress={() => setSelectedMood('همه')}>
            <Chip label="همه" active={selectedMood === 'همه'} />
          </TouchableOpacity>
          {MOODS.map((m) => (
            <TouchableOpacity key={m} onPress={() => setSelectedMood(m)}>
              <Chip label={m} active={selectedMood === m} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* کارت اطلاعات */}
      <Card style={styles.card}>
        <Text style={styles.title}>یادآوری‌های شما اینجا نمایش خواهند یافت</Text>
        <Text style={styles.body}>شروع به اضافه کردن بازتاب‌ها، عکس‌ها و حالات روحی روزانه کنید.</Text>
        <View style={styles.actions}>
          <Button
            title="یادآوری جدید"
            onPress={() => {
              setEditingId(null);
              setTitle('');
              setReflection('');
              setMood('آرام');
              setVisible(true);
            }}
            fullWidth
          />
          {entries.length > 0 && (
            <Button
              title="حذف همه"
              variant="danger"
              onPress={() => setShowClearWarning(true)}
              fullWidth
            />
          )}
        </View>
      </Card>

      {/* لیست ورودی‌ها */}
      {entries.length === 0 ? (
        <View style={styles.state}>
          <EmptyState
            title="هیچ ورودی نیست"
            hint="این فضا به یک آرشیو شخصی تبدیل خواهد شد."
          />
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
            {filteredEntries.map((entry) => (
            <Card key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryTitleContainer}>
                  <Text style={styles.entryTitle}>{entry.title}</Text>
                  <Badge label={entry.mood} variant={getMoodVariant(entry.mood)} size="sm" />
                </View>
                <View style={styles.entryActions}>
                  <Button
                    title="ویرایش"
                    variant="ghost"
                    size="sm"
                    onPress={() => {
                      setEditingId(entry.id);
                      setTitle(entry.title);
                      setReflection(entry.reflection);
                      setMood(entry.mood);
                      setVisible(true);
                    }}
                  />
                  <Button
                    title="حذف"
                    variant="danger"
                    size="sm"
                    onPress={() => handleDelete(entry.id)}
                  />
                </View>
              </View>

              <Text style={styles.entryReflection}>{entry.reflection}</Text>

              {entry.attachments && entry.attachments.length > 0 && (
                <View style={{ marginTop: spacing.sm }}>
                  <Text style={{ color: colors.textTertiary, fontSize: typography.caption }}>
                    {`پیوست‌ها: ${entry.attachments.map((a) => a.type).join(', ')}`}
                  </Text>
                </View>
              )}

              <View style={styles.entryFooter}>
                <Text style={styles.entryDate}>{formatDetailedDate(entry.createdAt)}</Text>
                {entry.updatedAt !== entry.createdAt && (
                  <Text style={styles.entryUpdated}>(ویرایش‌شده)</Text>
                )}
              </View>
            </Card>
          ))}
        </ScrollView>
      )}

      {/* مودال فرم */}
      <Modal
        visible={visible}
        title={editingId ? 'ویرایش یادآوری' : 'یادآوری جدید'}
        subtitle="این لحظه را ثبت کنید"
        onClose={() => {
          setVisible(false);
          setEditingId(null);
          setTitle('');
          setReflection('');
          setMood('آرام');
        }}
        size="lg"
        footer={
          <View style={styles.modalFooter}>
            <Button
              title="لغو"
              variant="secondary"
              onPress={() => {
                setVisible(false);
                setEditingId(null);
              }}
              fullWidth
            />
            <Button
              title={editingId ? 'بروز رسانی' : 'ذخیره'}
              onPress={handleSave}
              loading={addLoading}
              fullWidth
            />
          </View>
        }
      >
        <Input
          label="عنوان"
          placeholder="چه اتفاقی افتاد؟"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setTitleError('');
          }}
          error={titleError}
          helperText="یک عنوان معنی‌داری برای یادآوری خود انتخاب کنید"
        />

        <Input
          label="بازتاب"
          placeholder="افکار و احساسات خود را درباره‌ی این لحظه بیان کنید..."
          value={reflection}
          onChangeText={(text) => {
            setReflection(text);
            setReflectionError('');
          }}
          error={reflectionError}
          multiline
          maxLength={500}
          showCharCount
          helperText="احساسات و افکار خود را بیان کنید"
        />

        <Input
          label="حالت روحی"
          placeholder="وضعیت احساسی خود را انتخاب کنید"
          value={mood}
          onChangeText={(text) => setMood(text as MoodType)}
          helperText={`موارد: ${MOODS.join('، ')}`}
        />

        <Input
          label="افزودن پیوست (آدرس)"
          placeholder="https://... یا مسیر فایل"
          value={attachmentUri}
          onChangeText={(t) => setAttachmentUri(t)}
        />

        <Input
          label="نوع پیوست"
          placeholder="photo یا audio"
          value={attachmentType}
          onChangeText={(t) => setAttachmentType(t as 'photo' | 'audio')}
        />

        <View style={{ marginTop: spacing.sm }}>
          <Button
            title="افزودن پیوست"
            onPress={() => {
              if (!attachmentUri.trim()) return;
              const a: Attachment = {
                id: `${Date.now()}`,
                type: attachmentType,
                uri: attachmentUri.trim(),
                createdAt: new Date().toISOString(),
              };
              setAttachments((prev) => [a, ...prev]);
              setAttachmentUri('');
            }}
            fullWidth
          />

          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
            <Button title="گالری" onPress={pickImage} />
            <Button title="دوربین" onPress={takePhoto} />
            {!isRecording ? (
              <Button title="شروع ضبط" variant="accent" onPress={startRecording} />
            ) : (
              <Button title="پایان ضبط" variant="danger" onPress={stopRecording} />
            )}
          </View>

          {attachments.length > 0 && (
            <View style={{ marginTop: spacing.sm }}>
              {attachments.map((att) => (
                <View key={att.id} style={{ marginTop: spacing.xs, flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                  <Text style={{ color: colors.textTertiary }}>{att.type} - {att.uri}</Text>
                  {att.type === 'audio' && (
                    <Button title={playingUri === att.uri ? 'توقف' : 'پخش'} size="sm" onPress={() => playAttachment(att.uri)} />
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </Modal>

      {/* مودال تأیید حذف */}
      <Modal
        visible={showClearWarning}
        title="تأیید حذف"
        onClose={() => setShowClearWarning(false)}
        size="sm"
        footer={
          <View style={styles.modalFooter}>
            <Button
              title="لغو"
              variant="secondary"
              onPress={() => setShowClearWarning(false)}
              fullWidth
            />
            <Button
              title="حذف تمام"
              variant="danger"
              onPress={handleClearAll}
              loading={deleteLoading}
              fullWidth
            />
          </View>
        }
      >
        <Text style={styles.warningText}>
          آیا مطمئن هستید که می‌خواهید تمام یادآوری‌ها را حذف کنید؟ این اقدام برگشت‌ناپذیر است.
        </Text>
      </Modal>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  screen: { paddingTop: 0 },

  // آمار
  statsCard: { marginTop: spacing.md, marginBottom: spacing.md },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: colors.accent,
    fontSize: typography.subtitle,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
  },

  // کارت اطلاعات
  card: { marginTop: spacing.md },
  title: {
    color: colors.textPrimary,
    fontSize: typography.subtitle,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  actions: { marginTop: spacing.md, flexDirection: 'column', gap: spacing.sm },

  // لیست
  state: { marginTop: spacing.lg, flex: 1 },
  list: { marginTop: spacing.md, flex: 1 },
  listContent: { paddingBottom: spacing.xl },

  // کارت ورودی
  entryCard: { marginBottom: spacing.md },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  entryTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginRight: spacing.sm,
  },
  entryTitle: {
    color: colors.textPrimary,
    fontSize: typography.body + 1,
    fontWeight: '700',
    flex: 1,
  },
  entryActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },

  // متن ورودی
  entryReflection: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },

  // پاصورت ورودی
  entryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  entryDate: {
    color: colors.textTertiary,
    fontSize: typography.micro,
    fontWeight: '500',
  },
  entryUpdated: {
    color: colors.warning,
    fontSize: typography.micro,
    fontWeight: '500',
  },

  // مودال
  modalFooter: { flexDirection: 'column', gap: spacing.md },
  warningText: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
    marginVertical: spacing.md,
  },
});
