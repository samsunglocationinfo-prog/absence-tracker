import React, { useEffect, useRef, useState } from 'react';
import {
  Alert as NativeAlert,
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionHeader } from '../components/ui/SectionHeader';
import { colors, radius, spacing, typography } from '../theme';

type ReelPhoto = {
  id: string;
  uri: string;
};

type ReelTemplate = {
  id: string;
  name: string;
  subtitle: string;
  quote: string;
  caption: string;
  badge: string;
  colors: [string, string];
  accent: string;
  overlay: string;
};

const REEL_TEMPLATES: ReelTemplate[] = [
  {
    id: 'khatereh',
    name: 'خاطره محو',
    subtitle: 'پولاروید و غبار',
    quote: 'عکسا رنگ‌شون رفته، ولی دلتنگی هنوز تازه‌ست',
    caption: 'این قاب رو برای روزی که یاد کسی بیفتی نگه دار',
    badge: 'خاطره',
    colors: ['#1b1613', '#3a261d'],
    accent: '#cf9c73',
    overlay: 'rgba(10, 7, 5, 0.46)',
  },
  {
    id: 'masire-tanhaei',
    name: 'مسیر تنهایی',
    subtitle: 'جاده، مه و راه دور',
    quote: 'یه جاده‌ست که فقط خودم باید تا آخرش برم',
    caption: 'هیچکس همه‌ی راه رو کنارت نیست، ولی می‌توانی ادامه بدهی',
    badge: 'تنهایی',
    colors: ['#12181a', '#232c2b'],
    accent: '#9ec2b0',
    overlay: 'rgba(5, 8, 9, 0.38)',
  },
  {
    id: 'daftarcheh',
    name: 'دفترچه خاطرات',
    subtitle: 'کاغذ، خط و دلتنگی',
    quote: 'هر روز یه خط رو تقویم می‌کشم، ولی جای خالی تو پاک نمی‌شود',
    caption: 'اگه توام، این صفحه را برای خودت نگه دار',
    badge: 'دفترچه',
    colors: ['#ece4d3', '#e2d8c2'],
    accent: '#4a5a6b',
    overlay: 'rgba(255, 245, 230, 0.28)',
  },
  {
    id: 'ghamgin',
    name: 'غمگین شبانه',
    subtitle: 'باران، ماه و سکوت',
    quote: 'از روزی که رفتی، زمان برای من ایستاده، ولی ساعت هنوز می‌شمرد',
    caption: 'این تمپلیت را برای کسی بفرست که هنوز می‌شمارد',
    badge: 'شب',
    colors: ['#0a0e17', '#121826'],
    accent: '#7ea3c9',
    overlay: 'rgba(4, 7, 13, 0.48)',
  },
  {
    id: 'nazar',
    name: 'نظاره',
    subtitle: 'نور کم و آهسته',
    quote: 'بعضی غم‌ها فقط با سکوت می‌توانند دیده شوند',
    caption: 'این نسخه برای لحظه‌های آرام و خیره‌کننده است',
    badge: 'نظاره',
    colors: ['#0f1320', '#23253f'],
    accent: '#c7b0ff',
    overlay: 'rgba(8, 10, 20, 0.42)',
  },
  {
    id: 'sobh',
    name: 'سحر',
    subtitle: 'طلوع و خاموشی',
    quote: 'سحر می‌آید و هنوز تو را در دل من می‌بیند',
    caption: 'تک‌تک ثانیه‌ها به آرامی از میان می‌گذرند',
    badge: 'سحر',
    colors: ['#13161f', '#2b3545'],
    accent: '#f0b97a',
    overlay: 'rgba(10, 12, 18, 0.38)',
  },
];

export function ReelStudioScreen() {
  const [soundtrackUri, setSoundtrackUri] = useState('');
  const [photos, setPhotos] = useState<ReelPhoto[]>([]);
  const [duration, setDuration] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [remaining, setRemaining] = useState(30);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [liveTime, setLiveTime] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(REEL_TEMPLATES[0].id);
  const soundRef = useRef<Audio.Sound | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const ffmpegRef = useRef<FFmpeg | null>(null);

  useEffect(() => {
    setRemaining(duration);
  }, [duration]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setLiveTime(
        now.toLocaleString('fa-IR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isPlaying || !photos.length) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsPlaying(false);
          setActivePhotoIndex(0);
          return 0;
        }

        const nextRemaining = prev - 1;
        const segmentDuration = Math.max(2, Math.floor(duration / Math.max(photos.length, 1)));
        const nextIndex = Math.min(photos.length - 1, Math.floor((duration - nextRemaining) / segmentDuration));
        setActivePhotoIndex(nextIndex);
        return nextRemaining;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, isPlaying, photos.length]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.2, duration: 140, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [activePhotoIndex, fadeAnim]);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.stopAsync().catch(() => undefined);
        soundRef.current.unloadAsync().catch(() => undefined);
      }
    };
  }, []);

  const pickPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        NativeAlert.alert('اجازه لازم است', 'برای انتخاب عکس به گالری دسترسی نیاز داریم.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
      });

      if (!result.canceled) {
        setPhotos((prev) => [{ id: `${Date.now()}`, uri: result.assets[0].uri }, ...prev].slice(0, 6));
      }
    } catch (error) {
      console.error('pickPhoto error', error);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        NativeAlert.alert('اجازه لازم است', 'برای گرفتن عکس به دوربین دسترسی نیاز داریم.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({ quality: 0.85 });
      if (!result.canceled) {
        setPhotos((prev) => [{ id: `${Date.now()}`, uri: result.assets[0].uri }, ...prev].slice(0, 6));
      }
    } catch (error) {
      console.error('takePhoto error', error);
    }
  };

  const playSoundtrack = async () => {
    try {
      if (!soundtrackUri.trim()) {
        NativeAlert.alert('فایل صوتی', 'لطفاً آدرس فایل صوتی یا لینک را وارد کنید.');
        return;
      }

      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync({ uri: soundtrackUri.trim() });
      soundRef.current = sound;
      setIsAudioReady(true);
      await sound.playAsync();
    } catch (error) {
      console.warn('playSoundtrack warning', error);
      setIsAudioReady(false);
    }
  };

  const stopPreview = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    setIsPlaying(false);
    setRemaining(duration);
    setActivePhotoIndex(0);
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
    if (activePhotoIndex >= 0) {
      setActivePhotoIndex(0);
    }
  };

  const startPreview = async () => {
    if (!photos.length) {
      NativeAlert.alert('عکس', 'حداقل یک عکس را انتخاب کنید تا پیش‌نمایش ساخته شود.');
      return;
    }

    setIsPlaying(true);
    setRemaining(duration);
    setActivePhotoIndex(0);
    await playSoundtrack();
  };

  const updateDuration = (delta: number) => {
    setDuration((prev) => Math.max(15, Math.min(60, prev + delta)));
  };

  const exportVideo = async () => {
    if (!photos.length) {
      NativeAlert.alert('عکس', 'حداقل یک عکس را برای ساخت ریلز انتخاب کنید.');
      return;
    }

    try {
      setIsExporting(true);
      setExportUrl('');
      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;
      await ffmpeg.load({
        coreURL: '/ffmpeg-core.js',
        wasmURL: '/ffmpeg-core.wasm',
      });

      const activePhotoUri = (photos[activePhotoIndex] ?? photos[0]).uri;
      const inputName = 'input.png';
      const outputName = 'output.mp4';
      const imageData = await fetchFile(activePhotoUri);
      await ffmpeg.writeFile(inputName, imageData);

      const args = [
        '-loop',
        '1',
        '-i',
        inputName,
        '-t',
        `${duration}`,
        '-vf',
        'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2',
        '-c:v',
        'libx264',
        '-pix_fmt',
        'yuv420p',
        outputName,
      ];

      if (soundtrackUri.trim()) {
        try {
          const audioName = 'audio.mp3';
          const audioData = await fetchFile(soundtrackUri.trim());
          await ffmpeg.writeFile(audioName, audioData);
          args.splice(args.length - 1, 0, '-i', audioName, '-c:a', 'aac', '-shortest');
        } catch (audioError) {
          console.warn('audio mux warning', audioError);
        }
      }

      await ffmpeg.exec(args);
      const data = await ffmpeg.readFile(outputName);
      const bytes = data instanceof Uint8Array ? data : new Uint8Array(data as unknown as ArrayBufferLike);
      const buffer = new ArrayBuffer(bytes.byteLength);
      const view = new Uint8Array(buffer);
      view.set(bytes);
      const blob = new Blob([view], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      setExportUrl(url);
      if (typeof window !== 'undefined') {
        const link = document.createElement('a');
        link.href = url;
        link.download = `reel-${Date.now()}.mp4`;
        link.click();
      }
      NativeAlert.alert('انجام شد', 'فایل ریلز ساخته شد و برای دانلود آماده است.');
    } catch (error) {
      console.error('exportVideo error', error);
      NativeAlert.alert('خطا', 'ساخت MP4 با خطا روبه‌رو شد.');
    } finally {
      setIsExporting(false);
    }
  };

  const progress = duration > 0 ? (remaining / duration) * 100 : 0;
  const activePhoto = photos[activePhotoIndex] ?? null;
  const segmentDuration = Math.max(2, Math.floor(duration / Math.max(photos.length, 1)));
  const selectedTemplate = REEL_TEMPLATES.find((template) => template.id === selectedTemplateId) ?? REEL_TEMPLATES[0];

  return (
    <ScreenContainer style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <SectionHeader
            title="استودیو ریلز"
            hint="آهنگ، عکس، تایمر و حس لوفی تاریک را در یک پیش‌نمایش شیشه‌ای کنار هم بگذار."
          />

          <Text style={styles.sectionTitle}>آهنگ</Text>
          <TextInput
            value={soundtrackUri}
            onChangeText={setSoundtrackUri}
            placeholder="آدرس فایل یا لینک آهنگ"
            placeholderTextColor="rgba(255,255,255,0.45)"
            style={styles.input}
          />
          <View style={styles.inlineButtons}>
            <Button title="پخش نمونه" onPress={playSoundtrack} variant="secondary" size="sm" />
            <Button
              title="آماده برای ریلز"
              onPress={() => setIsAudioReady(Boolean(soundtrackUri.trim()))}
              variant="ghost"
              size="sm"
            />
          </View>

          <Text style={styles.sectionTitle}>مدت زمان</Text>
          <View style={styles.durationRow}>
            <Button title="- 5" onPress={() => updateDuration(-5)} variant="secondary" size="sm" />
            <View style={styles.durationBox}>
              <Text style={styles.durationValue}>{duration} ثانیه</Text>
              <Text style={styles.durationHint}>از 15 تا 60</Text>
            </View>
            <Button title="+ 5" onPress={() => updateDuration(5)} variant="secondary" size="sm" />
          </View>

          <View style={styles.quickDurations}>
            {[15, 30, 45, 60].map((value) => (
              <Pressable
                key={value}
                onPress={() => setDuration(value)}
                style={[styles.pill, duration === value && styles.pillActive]}
              >
                <Text style={[styles.pillText, duration === value && styles.pillTextActive]}>{value}s</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionTitle}>تمپلیت ریلز</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateScroller}>
            {REEL_TEMPLATES.map((template) => {
              const active = template.id === selectedTemplateId;
              return (
                <Pressable
                  key={template.id}
                  onPress={() => setSelectedTemplateId(template.id)}
                  style={[styles.templateCard, active && styles.templateCardActive]}
                >
                  <View style={[styles.templateChip, { backgroundColor: template.accent }]} />
                  <Text style={styles.templateCardTitle}>{template.name}</Text>
                  <Text style={styles.templateCardSubtitle}>{template.subtitle}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.sectionTitle}>تصاویر</Text>
          <View style={styles.inlineButtons}>
            <Button title="انتخاب عکس" onPress={pickPhoto} variant="secondary" size="sm" />
            <Button title="عکس با دوربین" onPress={takePhoto} variant="ghost" size="sm" />
          </View>

          {photos.length > 0 ? (
            <>
              <View style={styles.photoGrid}>
                {photos.map((photo, index) => (
                  <View key={photo.id} style={styles.photoThumbWrapper}>
                    <Pressable onPress={() => setActivePhotoIndex(index)} style={styles.photoThumb}>
                      <Image source={{ uri: photo.uri }} style={styles.photoThumbImage} />
                      {index === activePhotoIndex ? <View style={styles.photoThumbBadge} /> : null}
                    </Pressable>
                    <Pressable onPress={() => removePhoto(photo.id)} style={styles.removePhotoButton}>
                      <Text style={styles.removePhotoText}>×</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
              <Text style={styles.helperText}>هر عکس در این پیش‌نمایش به‌صورت خودکار برای {segmentDuration} ثانیه نمایش داده می‌شود. اگر پخش آهنگ در این محیط محدود باشد، پیش‌نمایش بدون صدا ادامه می‌یابد.</Text>
            </>
          ) : (
            <View style={styles.emptyImageState}>
              <Text style={styles.emptyImageText}>هنوز تصویری انتخاب نشده؛ از گالری یا دوربین برای شروع استفاده کن.</Text>
            </View>
          )}

          <Animated.View style={[styles.previewCard, { transform: [{ scale: pulseAnim }] }]}> 
            <LinearGradient
              colors={selectedTemplate.colors}
              style={styles.previewGradient}
            >
              {activePhoto ? (
                <Animated.Image source={{ uri: activePhoto.uri }} style={[styles.previewImage, { opacity: 0.72 }]} />
              ) : (
                <View style={styles.previewPlaceholder}>
                  <Text style={styles.previewPlaceholderTitle}>Lo-fi dark</Text>
                  <Text style={styles.previewPlaceholderSubtitle}>شیشه‌ای، غمگین و آرام</Text>
                </View>
              )}

              <View style={[styles.glassOverlay, { backgroundColor: selectedTemplate.overlay }]}>
                <Text style={[styles.glassLabel, { color: selectedTemplate.accent }]}>Reel mood</Text>
                <Text style={styles.glassTitle}>{selectedTemplate.quote}</Text>
                <Text style={styles.glassSub}>{selectedTemplate.caption}</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${Math.max(4, progress)}%`, backgroundColor: selectedTemplate.accent }]} />
                </View>
                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>{remaining} ثانیه</Text>
                  <Text style={styles.footerText}>{liveTime || 'در حال محاسبه'}</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          <View style={styles.inlineButtons}>
            <Button title={isPlaying ? 'در حال پخش' : 'شروع پیش‌نمایش'} onPress={startPreview} />
            <Button title="توقف" onPress={stopPreview} variant="ghost" />
            <Button title={isExporting ? 'در حال ساخت MP4' : 'ساخت MP4'} onPress={exportVideo} variant="secondary" />
          </View>

          {exportUrl ? (
            <View
              style={{
                padding: spacing.md,
                borderRadius: radius.md,
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.12)',
              }}
            >
              <Text style={{ color: colors.textPrimary, fontSize: typography.body, fontWeight: '700', marginBottom: spacing.sm }}>
                فایل آماده دانلود
              </Text>
              <Button title="دانلود MP4" onPress={() => typeof window !== 'undefined' && window.open(exportUrl, '_blank')} />
            </View>
          ) : null}
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
    padding: spacing.lg,
    paddingBottom: 48,
  },
  card: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  inlineButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  durationBox: {
    flex: 1,
    alignItems: 'center',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  durationValue: {
    color: colors.textPrimary,
    fontSize: typography.subtitle,
    fontWeight: '700',
  },
  durationHint: {
    color: colors.textSecondary,
    fontSize: typography.caption,
  },
  quickDurations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  templateScroller: {
    marginBottom: spacing.xs,
  },
  templateCard: {
    minWidth: 110,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginRight: spacing.sm,
  },
  templateCardActive: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(94, 234, 212, 0.16)',
  },
  templateChip: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: spacing.xs,
  },
  templateCardTitle: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: '700',
    marginBottom: 2,
  },
  templateCardSubtitle: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  pillActive: {
    backgroundColor: colors.accent,
  },
  pillText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#fff',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoThumbWrapper: {
    position: 'relative',
  },
  photoThumb: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  photoThumbImage: {
    width: '100%',
    height: '100%',
  },
  photoThumbBadge: {
    position: 'absolute',
    inset: 0,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
  },
  removePhotoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 14,
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  emptyImageState: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  emptyImageText: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
  previewCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  previewGradient: {
    minHeight: 300,
    justifyContent: 'flex-end',
  },
  previewImage: {
    ...StyleSheet.absoluteFill,
    resizeMode: 'cover',
  },
  previewPlaceholder: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(6,8,19,0.9)',
  },
  previewPlaceholderTitle: {
    color: '#f5edff',
    fontSize: 22,
    fontWeight: '800',
  },
  previewPlaceholderSubtitle: {
    color: 'rgba(245,237,255,0.74)',
    fontSize: 13,
    marginTop: 6,
  },
  glassOverlay: {
    padding: spacing.lg,
    backgroundColor: 'rgba(7, 9, 21, 0.42)',
  },
  glassLabel: {
    color: colors.accent,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  glassTitle: {
    color: '#f6f2ff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  glassSub: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.16)',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 12,
    fontWeight: '600',
  },
});
