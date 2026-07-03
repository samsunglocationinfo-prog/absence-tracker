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
import { fetchFile, toBlobURL } from '@ffmpeg/util';
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
  style: 'khatereh' | 'daftarcheh' | 'ghamgin' | 'masire-tanhaei' | 'neon-ember' | 'neon-rain' | 'neon-drift';
};

const createTemplatePreviewUri = (template: ReelTemplate) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="360" viewBox="0 0 240 360">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${template.colors[0]}" />
          <stop offset="100%" stop-color="${template.colors[1]}" />
        </linearGradient>
      </defs>
      <rect width="240" height="360" rx="24" fill="url(#g)" />
      <rect x="24" y="24" width="192" height="180" rx="18" fill="rgba(255,255,255,0.16)" />
      <circle cx="64" cy="96" r="34" fill="${template.accent}" fill-opacity="0.78" />
      <rect x="32" y="240" width="176" height="72" rx="14" fill="rgba(255,255,255,0.16)" />
      <text x="32" y="274" fill="white" font-size="18" font-family="Arial, sans-serif" font-weight="700">${template.badge}</text>
      <text x="32" y="300" fill="rgba(255,255,255,0.8)" font-size="12" font-family="Arial, sans-serif">${template.subtitle}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const REEL_TEMPLATES: ReelTemplate[] = [
  {
    id: 'khatereh',
    name: 'خاطره محو',
    subtitle: 'پولاروید و غبار',
    quote: 'عکسا رنگ‌شون رفته، ولی دلتنگی هنوز تازه‌ست',
    caption: 'این قاب رو برای روزی که یاد کسی بیفتی نگه دار',
    badge: 'خاطره',
    colors: ['#1b1613', '#2a2320'],
    accent: '#cf9c73',
    overlay: 'rgba(16, 12, 10, 0.34)',
    style: 'khatereh',
  },
  {
    id: 'daftarcheh',
    name: 'دفترچه خاطرات',
    subtitle: 'کاغذ، خط و دلتنگی',
    quote: 'هر روز یه خط رو تقویم می‌کشم، ولی جای خالیِ تو پاک نمیشه',
    caption: 'اگه توام یه خطی داری که هنوز می‌کِشی\nاین صفحه رو برای خودت نگه‌دار',
    badge: 'دفترچه',
    colors: ['#ece4d3', '#e2d8c2'],
    accent: '#4a5a6b',
    overlay: 'rgba(255, 245, 230, 0.28)',
    style: 'daftarcheh',
  },
  {
    id: 'ghamgin',
    name: 'غمگین شبانه',
    subtitle: 'باران، ماه و سکوت',
    quote: 'از روزی که رفتی، زمان برای من ایستاده؛ ولی ساعت هنوز می‌شمرد',
    caption: 'این تمپلیت رو برای هر کسی بفرست\nکه هنوز یه نفر رو می‌شمره',
    badge: 'شب',
    colors: ['#0a0e17', '#121826'],
    accent: '#7ea3c9',
    overlay: 'rgba(4, 7, 13, 0.48)',
    style: 'ghamgin',
  },
  {
    id: 'masire-tanhaei',
    name: 'مسیر تنهایی',
    subtitle: 'جاده، مه و راه دور',
    quote: 'یه جاده‌ست که فقط خودم باید تنها تا آخرش برم',
    caption: 'هیچکس قرار نیست همه‌ی راه رو\nکنارت باشه؛ ولی می‌تونی ادامه بدی',
    badge: 'تنهایی',
    colors: ['#12181a', '#232c2b'],
    accent: '#9ec2b0',
    overlay: 'rgba(5, 8, 9, 0.38)',
    style: 'masire-tanhaei',
  },
  {
    id: 'neon-ember',
    name: 'نئون ember',
    subtitle: 'دود، برق و شب',
    quote: 'در این شب، فقط لامپ‌های خسته می‌درخشند',
    caption: 'برای لحظه‌ای که همه‌چیز از دور می‌سوزد',
    badge: 'ember',
    colors: ['#08060b', '#180b17'],
    accent: '#ff5f7a',
    overlay: 'rgba(8, 6, 11, 0.72)',
    style: 'neon-ember',
  },
  {
    id: 'neon-rain',
    name: 'باران نئون',
    subtitle: 'برق، شبنم و سکوت',
    quote: 'هر قطره از پنجره می‌رسد و نام تو را تکرار می‌کند',
    caption: 'یک ریلز برای شب‌هایی که هنوز نمی‌توانی بخندی',
    badge: 'rain',
    colors: ['#040913', '#0c1424'],
    accent: '#48d8ff',
    overlay: 'rgba(4, 9, 19, 0.74)',
    style: 'neon-rain',
  },
  {
    id: 'neon-drift',
    name: 'سرگردانی نئون',
    subtitle: 'مه و چراغ‌های دور',
    quote: 'در میان این شهر، من و تاریکی فقط یک چراغ مشترک داریم',
    caption: 'برای شب‌های طولانی و دل‌های بی‌قرار',
    badge: 'drift',
    colors: ['#06090d', '#111827'],
    accent: '#9b7cff',
    overlay: 'rgba(6, 9, 13, 0.76)',
    style: 'neon-drift',
  },
];

const formatPersianClockValue = (value: number) =>
  String(value).padStart(2, '0').replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);

const getClockParts = (date: Date) => ({
  year: formatPersianClockValue(date.getFullYear()),
  month: formatPersianClockValue(date.getMonth() + 1),
  day: formatPersianClockValue(date.getDate()),
  hour: formatPersianClockValue(date.getHours()),
  minute: formatPersianClockValue(date.getMinutes()),
  second: formatPersianClockValue(date.getSeconds()),
});

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
  const [startedAt, setStartedAt] = useState<Date | null>(null);
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
    setStartedAt(null);
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
    setStartedAt(new Date());
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
      const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}/` : '/';
      const coreURL = await toBlobURL(`${baseUrl}ffmpeg-core.js`, 'text/javascript');
      const wasmURL = await toBlobURL(`${baseUrl}ffmpeg-core.wasm`, 'application/wasm');
      await ffmpeg.load({
        coreURL,
        wasmURL,
      });

      const activePhotoUri = (photos[activePhotoIndex] ?? photos[0]).uri;
      const selectedTemplate = REEL_TEMPLATES.find((template) => template.id === selectedTemplateId) ?? REEL_TEMPLATES[0];
      const inputName = 'template-frame.png';
      const outputName = 'output.mp4';
      const clockParts = getClockParts(startedAt ?? new Date());
      const timeLabel = liveTime || new Date().toLocaleString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      let frameBlob: Blob | null = null;
      if (typeof window !== 'undefined') {
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1920;
        const context = canvas.getContext('2d');
        if (context) {
          const gradient = context.createLinearGradient(0, 0, 0, 1920);
          gradient.addColorStop(0, selectedTemplate.colors[0]);
          gradient.addColorStop(1, selectedTemplate.colors[1]);
          context.fillStyle = gradient;
          context.fillRect(0, 0, canvas.width, canvas.height);

          if (selectedTemplate.style === 'khatereh') {
            context.fillStyle = 'rgba(255,255,255,0.06)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = '#efe6d8';
            context.fillRect(180, 120, 720, 760);
            context.fillStyle = '#d9c6a8';
            context.fillRect(200, 140, 680, 720);
            context.fillStyle = '#4b3f34';
            context.font = '700 34px serif';
            context.fillText('تابستون ۱۴۰۱', 350, 860);

            if (activePhotoUri) {
              const image = new window.Image();
              image.crossOrigin = 'anonymous';
              image.src = activePhotoUri;
              await new Promise<void>((resolve, reject) => {
                image.onload = () => resolve();
                image.onerror = () => reject(new Error('Failed to load photo for export'));
              });
              context.save();
              context.globalAlpha = 0.9;
              context.drawImage(image, 250, 180, 580, 580);
              context.restore();
            }

            context.fillStyle = '#d9c9b4';
            context.font = 'italic 42px serif';
            context.textAlign = 'center';
            context.fillText(selectedTemplate.quote, 540, 1180);
            context.font = '400 28px sans-serif';
            context.fillStyle = '#9c8d80';
            context.fillText('۴۱۲ روز از آخرین باری که دیدمت', 540, 1260);
            const timerBox = (x: number, y: number, value: string, label: string) => {
              context.fillStyle = 'rgba(255,255,255,0.04)';
              context.fillRect(x, y, 96, 116);
              context.fillStyle = '#ece2d6';
              context.font = '700 32px sans-serif';
              context.fillText(value, x + 48, y + 64);
              context.font = '400 20px sans-serif';
              context.fillStyle = '#9c8d80';
              context.fillText(label, x + 48, y + 104);
            };
            timerBox(130, 1320, clockParts.month, 'ماه');
            timerBox(250, 1320, clockParts.day, 'روز');
            timerBox(370, 1320, clockParts.hour, 'ساعت');
            timerBox(490, 1320, clockParts.minute, 'دقیقه');
            timerBox(610, 1320, clockParts.second, 'ثانیه');
            context.font = '400 28px sans-serif';
            context.fillStyle = '#9c8d80';
            context.fillText(selectedTemplate.caption, 540, 1530);
          } else if (selectedTemplate.style === 'daftarcheh') {
            context.fillStyle = '#ece4d3';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.strokeStyle = 'rgba(0,0,0,0.06)';
            context.lineWidth = 2;
            for (let y = 120; y < 1780; y += 34) {
              context.beginPath();
              context.moveTo(110, y);
              context.lineTo(970, y);
              context.stroke();
            }
            context.fillStyle = '#4a5a6b';
            context.fillRect(80, 90, 6, 1680);
            context.fillStyle = '#2b2c33';
            context.font = '700 38px sans-serif';
            context.textAlign = 'center';
            context.fillText('دفترچه‌ی من — صفحه‌ی ۱۴۲', 540, 180);
            context.font = '700 40px serif';
            context.fillText(selectedTemplate.quote, 540, 420);
            context.font = '400 28px sans-serif';
            context.fillStyle = '#726b5a';
            context.fillText('۱۵۶ روزه که این خط‌ها رو می‌کشم', 540, 520);
            const timerBox = (x: number, y: number, value: string, label: string) => {
              context.fillStyle = 'transparent';
              context.strokeStyle = '#2b2c33';
              context.lineWidth = 3;
              context.strokeRect(x, y, 90, 112);
              context.fillStyle = '#2b2c33';
              context.font = '700 30px sans-serif';
              context.fillText(value, x + 45, y + 64);
              context.font = '400 20px sans-serif';
              context.fillText(label, x + 45, y + 104);
            };
            timerBox(90, 620, clockParts.month, 'ماه');
            timerBox(220, 620, clockParts.day, 'روز');
            timerBox(350, 620, clockParts.hour, 'ساعت');
            timerBox(480, 620, clockParts.minute, 'دقیقه');
            timerBox(610, 620, clockParts.second, 'ثانیه');
            context.font = '400 28px sans-serif';
            context.fillText(selectedTemplate.caption, 540, 1520);
          } else if (selectedTemplate.style === 'ghamgin') {
            context.fillStyle = '#0a0e17';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = '#121826';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = '#e9edf3';
            context.beginPath();
            context.arc(540, 220, 70, 0, Math.PI * 2);
            context.fill();
            for (let i = 0; i < 28; i += 1) {
              const x = (i * 37) % 1040;
              const y = 100 + (i % 12) * 80;
              context.fillStyle = 'rgba(126,163,201,0.24)';
              context.fillRect(x, y, 2, 60);
            }
            context.fillStyle = '#c3cede';
            context.font = 'italic 40px serif';
            context.textAlign = 'center';
            context.fillText(selectedTemplate.quote, 540, 420);
            context.font = '400 28px sans-serif';
            context.fillStyle = '#8390a6';
            context.fillText('۲۳۱ روز از نبودنت گذشت', 540, 510);
            const timerBox = (x: number, y: number, value: string, label: string) => {
              context.fillStyle = 'rgba(255,255,255,0.03)';
              context.fillRect(x, y, 100, 120);
              context.fillStyle = '#dfe6ee';
              context.font = '700 32px sans-serif';
              context.fillText(value, x + 50, y + 64);
              context.font = '400 20px sans-serif';
              context.fillStyle = '#8390a6';
              context.fillText(label, x + 50, y + 106);
            };
            timerBox(90, 620, clockParts.month, 'ماه');
            timerBox(220, 620, clockParts.day, 'روز');
            timerBox(350, 620, clockParts.hour, 'ساعت');
            timerBox(480, 620, clockParts.minute, 'دقیقه');
            timerBox(610, 620, clockParts.second, 'ثانیه');
            context.font = '400 28px sans-serif';
            context.fillText(selectedTemplate.caption, 540, 1500);
          } else {
            context.fillStyle = '#12181a';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = '#9ec2b0';
            context.beginPath();
            context.arc(540, 260, 100, 0, Math.PI * 2);
            context.fill();
            context.fillStyle = '#1a2020';
            context.beginPath();
            context.moveTo(0, 980);
            context.lineTo(1080, 980);
            context.lineTo(1080, 1920);
            context.lineTo(0, 1920);
            context.closePath();
            context.fill();
            context.fillStyle = '#4c5a56';
            context.fillRect(220, 1220, 640, 300);
            context.fillStyle = '#dfe6e1';
            context.font = '300 42px sans-serif';
            context.textAlign = 'center';
            context.fillText(selectedTemplate.quote, 540, 420);
            context.font = '400 28px sans-serif';
            context.fillStyle = '#7c8a84';
            context.fillText('۹۰ روزه که این مسیر رو تنها می‌رم', 540, 500);
            const timerBox = (x: number, y: number, value: string, label: string) => {
              context.fillStyle = 'rgba(255,255,255,0.03)';
              context.fillRect(x, y, 100, 120);
              context.fillStyle = '#dfe6e1';
              context.font = '700 32px sans-serif';
              context.fillText(value, x + 50, y + 64);
              context.font = '400 20px sans-serif';
              context.fillStyle = '#7c8a84';
              context.fillText(label, x + 50, y + 106);
            };
            timerBox(90, 620, clockParts.month, 'ماه');
            timerBox(220, 620, clockParts.day, 'روز');
            timerBox(350, 620, clockParts.hour, 'ساعت');
            timerBox(480, 620, clockParts.minute, 'دقیقه');
            timerBox(610, 620, clockParts.second, 'ثانیه');
            context.font = '400 28px sans-serif';
            context.fillText(selectedTemplate.caption, 540, 1520);
          }

          frameBlob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob((blob) => resolve(blob), 'image/png');
          });
        }
      }

      if (!frameBlob) {
        const imageData = await fetchFile(activePhotoUri);
        await ffmpeg.writeFile(inputName, imageData);
      } else {
        const frameArrayBuffer = await frameBlob.arrayBuffer();
        await ffmpeg.writeFile(inputName, new Uint8Array(frameArrayBuffer));
      }

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
      const outputBytes = data instanceof Uint8Array ? data : new Uint8Array(data as unknown as ArrayBufferLike);
      const outputBuffer = new ArrayBuffer(outputBytes.byteLength);
      const outputView = new Uint8Array(outputBuffer);
      outputView.set(outputBytes);
      const blob = new Blob([outputBuffer], { type: 'video/mp4' });
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
  const previewClock = getClockParts(startedAt ?? new Date());

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
              const previewUri = createTemplatePreviewUri(template);
              return (
                <Pressable
                  key={template.id}
                  onPress={() => setSelectedTemplateId(template.id)}
                  style={[styles.templateCard, active && styles.templateCardActive]}
                >
                  <Image source={{ uri: previewUri }} style={styles.templatePreviewImage} />
                  <View style={styles.templateCardContent}>
                    <View style={[styles.templateChip, { backgroundColor: template.accent }]} />
                    <Text style={styles.templateCardTitle}>{template.name}</Text>
                    <Text style={styles.templateCardSubtitle}>{template.subtitle}</Text>
                  </View>
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
                {selectedTemplate.style === 'khatereh' ? (
                  <View style={styles.templatePreviewStack}>
                    <Text style={{ color: 'rgba(255,255,255,0.74)', fontSize: 11, letterSpacing: 0.4, textAlign: 'center', marginBottom: 2 }}>
                      {liveTime || 'در حال به‌روزرسانی…'}
                    </Text>
                    <View style={styles.khaterehPolaroid}>
                      <View style={styles.khaterehFrame} />
                      <Text style={styles.khaterehFrameLabel}>تابستون ۱۴۰۱</Text>
                    </View>
                    <Text style={styles.khaterehQuote}>{selectedTemplate.quote}</Text>
                    <Text style={styles.khaterehSub}>۴۱۲ روز از آخرین باری که دیدمت</Text>
                    <View style={styles.timerRow}>
                      {[previewClock.month, previewClock.day, previewClock.hour, previewClock.minute, previewClock.second].map((value, index) => (
                        <View key={`${value}-${index}`} style={styles.timerUnitBox}>
                          <Text style={styles.timerUnitValue}>{value}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.khaterehCaption}>{selectedTemplate.caption}</Text>
                  </View>
                ) : null}

                {selectedTemplate.style === 'daftarcheh' ? (
                  <View style={styles.templatePreviewStack}>
                    <Text style={{ color: 'rgba(255,255,255,0.74)', fontSize: 11, letterSpacing: 0.4, textAlign: 'center', marginBottom: 2 }}>
                      {liveTime || 'در حال به‌روزرسانی…'}
                    </Text>
                    <Text style={styles.daftarTitle}>دفترچه‌ی من — صفحه‌ی ۱۴۲</Text>
                    <Text style={styles.daftarQuote}>{selectedTemplate.quote}</Text>
                    <Text style={styles.daftarSub}>۱۵۶ روزه که این خط‌ها رو می‌کشم</Text>
                    <View style={styles.timerRow}>
                      {[previewClock.month, previewClock.day, previewClock.hour, previewClock.minute, previewClock.second].map((value, index) => (
                        <View key={`${value}-${index}`} style={styles.timerUnitBox}>
                          <Text style={styles.timerUnitValue}>{value}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.daftarCaption}>{selectedTemplate.caption}</Text>
                  </View>
                ) : null}

                {selectedTemplate.style === 'ghamgin' ? (
                  <View style={styles.templatePreviewStack}>
                    <Text style={{ color: 'rgba(255,255,255,0.74)', fontSize: 11, letterSpacing: 0.4, textAlign: 'center', marginBottom: 2 }}>
                      {liveTime || 'در حال به‌روزرسانی…'}
                    </Text>
                    <Text style={styles.ghamginEyebrow}>هنوز باورم نشده</Text>
                    <Text style={styles.ghamginQuote}>{selectedTemplate.quote}</Text>
                    <Text style={styles.ghamginSub}>۲۳۱ روز از نبودنت گذشت</Text>
                    <View style={styles.timerRow}>
                      {[previewClock.month, previewClock.day, previewClock.hour, previewClock.minute, previewClock.second].map((value, index) => (
                        <View key={`${value}-${index}`} style={styles.timerUnitBox}>
                          <Text style={styles.timerUnitValue}>{value}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.ghamginCaption}>{selectedTemplate.caption}</Text>
                  </View>
                ) : null}

                {selectedTemplate.style === 'masire-tanhaei' ? (
                  <View style={styles.templatePreviewStack}>
                    <Text style={{ color: 'rgba(255,255,255,0.74)', fontSize: 11, letterSpacing: 0.4, textAlign: 'center', marginBottom: 2 }}>
                      {liveTime || 'در حال به‌روزرسانی…'}
                    </Text>
                    <Text style={styles.masireEyebrow}>از این‌جا به بعد</Text>
                    <Text style={styles.masireQuote}>{selectedTemplate.quote}</Text>
                    <Text style={styles.masireSub}>۹۰ روزه که این مسیر رو تنها می‌رم</Text>
                    <View style={styles.timerRow}>
                      {[previewClock.month, previewClock.day, previewClock.hour, previewClock.minute, previewClock.second].map((value, index) => (
                        <View key={`${value}-${index}`} style={styles.timerUnitBox}>
                          <Text style={styles.timerUnitValue}>{value}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.masireCaption}>{selectedTemplate.caption}</Text>
                  </View>
                ) : null}

                {selectedTemplate.style === 'neon-ember' ? (
                  <View style={styles.templatePreviewStack}>
                    <Text style={{ color: 'rgba(255,255,255,0.74)', fontSize: 11, letterSpacing: 0.4, textAlign: 'center', marginBottom: 2 }}>
                      {liveTime || 'در حال به‌روزرسانی…'}
                    </Text>
                    <View style={{ width: 146, height: 146, borderRadius: 73, borderWidth: 2, borderColor: 'rgba(255,95,122,0.5)', backgroundColor: 'rgba(255,95,122,0.14)', alignItems: 'center', justifyContent: 'center', marginTop: 2, shadowColor: '#ff5f7a', shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 0 } }}>
                      <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#ff5f7a', opacity: 0.95 }} />
                    </View>
                    <Text style={{ color: '#ffe4ea', fontSize: 15, lineHeight: 22, textAlign: 'center', maxWidth: 260, fontWeight: '700' }}>{selectedTemplate.quote}</Text>
                    <Text style={{ color: '#ff9fb0', fontSize: 11, textAlign: 'center' }}>شبِ دود و برق</Text>
                    <View style={styles.timerRow}>
                      {[previewClock.month, previewClock.day, previewClock.hour, previewClock.minute, previewClock.second].map((value, index) => (
                        <View key={`${value}-${index}`} style={styles.timerUnitBox}>
                          <Text style={styles.timerUnitValue}>{value}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={{ color: '#ff9fb0', fontSize: 11, lineHeight: 16, textAlign: 'center', maxWidth: 260 }}>{selectedTemplate.caption}</Text>
                  </View>
                ) : null}

                {selectedTemplate.style === 'neon-rain' ? (
                  <View style={styles.templatePreviewStack}>
                    <Text style={{ color: 'rgba(255,255,255,0.74)', fontSize: 11, letterSpacing: 0.4, textAlign: 'center', marginBottom: 2 }}>
                      {liveTime || 'در حال به‌روزرسانی…'}
                    </Text>
                    <View style={{ width: 158, height: 92, borderWidth: 1, borderColor: 'rgba(72,216,255,0.35)', borderRadius: 12, backgroundColor: 'rgba(72,216,255,0.08)', marginTop: 2, shadowColor: '#48d8ff', shadowOpacity: 0.25, shadowRadius: 14, shadowOffset: { width: 0, height: 0 } }} />
                    <Text style={{ color: '#e9fbff', fontSize: 15, lineHeight: 22, textAlign: 'center', maxWidth: 260, fontWeight: '700' }}>{selectedTemplate.quote}</Text>
                    <Text style={{ color: '#7ddfff', fontSize: 11, textAlign: 'center' }}>باران از پنجره می‌گذرد</Text>
                    <View style={styles.timerRow}>
                      {[previewClock.month, previewClock.day, previewClock.hour, previewClock.minute, previewClock.second].map((value, index) => (
                        <View key={`${value}-${index}`} style={styles.timerUnitBox}>
                          <Text style={styles.timerUnitValue}>{value}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={{ color: '#7ddfff', fontSize: 11, lineHeight: 16, textAlign: 'center', maxWidth: 260 }}>{selectedTemplate.caption}</Text>
                  </View>
                ) : null}

                {selectedTemplate.style === 'neon-drift' ? (
                  <View style={styles.templatePreviewStack}>
                    <Text style={{ color: 'rgba(255,255,255,0.74)', fontSize: 11, letterSpacing: 0.4, textAlign: 'center', marginBottom: 2 }}>
                      {liveTime || 'در حال به‌روزرسانی…'}
                    </Text>
                    <View style={{ width: 156, height: 156, borderRadius: 78, borderWidth: 2, borderColor: 'rgba(155,124,255,0.45)', alignItems: 'center', justifyContent: 'center', marginTop: 2, shadowColor: '#9b7cff', shadowOpacity: 0.3, shadowRadius: 18, shadowOffset: { width: 0, height: 0 } }}>
                      <View style={{ width: 92, height: 92, borderRadius: 46, backgroundColor: '#9b7cff' }} />
                    </View>
                    <Text style={{ color: '#efeaff', fontSize: 15, lineHeight: 22, textAlign: 'center', maxWidth: 260, fontWeight: '700' }}>{selectedTemplate.quote}</Text>
                    <Text style={{ color: '#b9a8ff', fontSize: 11, textAlign: 'center' }}>سرگردانی در شهرِ مه‌آلود</Text>
                    <View style={styles.timerRow}>
                      {[previewClock.month, previewClock.day, previewClock.hour, previewClock.minute, previewClock.second].map((value, index) => (
                        <View key={`${value}-${index}`} style={styles.timerUnitBox}>
                          <Text style={styles.timerUnitValue}>{value}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={{ color: '#b9a8ff', fontSize: 11, lineHeight: 16, textAlign: 'center', maxWidth: 260 }}>{selectedTemplate.caption}</Text>
                  </View>
                ) : null}
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
              <Button title="دانلود ویدیو MP4" onPress={() => typeof window !== 'undefined' && window.open(exportUrl, '_blank')} />
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
    minWidth: 126,
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
  templatePreviewImage: {
    width: '100%',
    height: 120,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  templateCardContent: {
    gap: 4,
  },
  templateChip: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 2,
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
    minHeight: 320,
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
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
  templatePreviewStack: {
    gap: 10,
    alignItems: 'center',
    width: '100%',
  },
  timerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 2,
    width: '100%',
  },
  timerUnitBox: {
    minWidth: 46,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  timerUnitValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  liveTimeText: {
    color: 'rgba(255,255,255,0.74)',
    fontSize: 11,
    letterSpacing: 0.4,
    textAlign: 'center',
    marginBottom: 2,
  },
  khaterehPolaroid: {
    alignSelf: 'center',
    width: 174,
    backgroundColor: '#efe6d8',
    padding: 10,
    borderRadius: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  khaterehFrame: {
    width: '100%',
    height: 120,
    backgroundColor: '#8a7a63',
    borderRadius: 2,
  },
  khaterehFrameLabel: {
    marginTop: 8,
    color: '#4b3f34',
    fontSize: 11,
    textAlign: 'center',
  },
  khaterehQuote: {
    color: '#f4eadf',
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
    textAlign: 'center',
    maxWidth: 252,
    fontWeight: '600',
  },
  khaterehSub: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: -2,
  },
  khaterehCaption: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    maxWidth: 260,
    marginTop: 2,
  },
  daftarTitle: {
    color: '#2b2c33',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  daftarQuote: {
    color: '#2b2c33',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '700',
    maxWidth: 260,
    letterSpacing: 0.1,
  },
  daftarSub: {
    color: 'rgba(43,44,51,0.74)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: -2,
  },
  daftarCaption: {
    color: 'rgba(43,44,51,0.74)',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    maxWidth: 260,
    marginTop: 2,
  },
  ghamginEyebrow: {
    color: '#8390a6',
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 1.2,
    marginTop: 2,
    fontWeight: '600',
  },
  ghamginQuote: {
    color: '#dfe6ee',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    maxWidth: 260,
    fontWeight: '600',
  },
  ghamginSub: {
    color: '#8390a6',
    fontSize: 11,
    textAlign: 'center',
    marginTop: -2,
  },
  ghamginCaption: {
    color: '#8390a6',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    maxWidth: 260,
    marginTop: 2,
  },
  masireEyebrow: {
    color: '#7c8a84',
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 1.2,
    marginTop: 2,
    fontWeight: '600',
  },
  masireQuote: {
    color: '#dfe6e1',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '300',
    maxWidth: 260,
    letterSpacing: 0.1,
  },
  masireSub: {
    color: '#7c8a84',
    fontSize: 11,
    textAlign: 'center',
    marginTop: -2,
  },
  masireCaption: {
    color: '#7c8a84',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    maxWidth: 260,
    marginTop: 2,
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
