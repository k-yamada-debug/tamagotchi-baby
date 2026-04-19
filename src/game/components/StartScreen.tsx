'use client';

import { useRef, useState } from 'react';

interface StartScreenProps {
  onStart: (name: string, gender: 'boy' | 'girl', timeScale: number, photoDataUrl: string | null) => void;
}

// 画像をリサイズして data URL (JPEG) に変換
async function resizeImageToDataUrl(file: File, size = 512, quality = 0.88): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(size / bitmap.width, size / bitmap.height, 1);
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unavailable');
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', quality);
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'boy' | 'girl'>('girl');
  const [timeScale, setTimeScale] = useState(1);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError(null);
    if (!file.type.startsWith('image/')) {
      setPhotoError('画像ファイルを選んでください');
      return;
    }
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      setPhotoDataUrl(dataUrl);
    } catch {
      setPhotoError('画像を読み込めませんでした');
    } finally {
      // 同じファイルでも再選択できるように input をリセット
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <div className="game-card p-6 sm:p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">👶</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          たまごっちベビー
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          赤ちゃんを育てよう！
        </p>

        <div className="border-t pt-6" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-bold mb-4">あたらしくはじめる</h2>

          {/* 顔写真アップロード（任意） */}
          <div className="mb-4">
            <label className="block text-sm mb-2 text-left" style={{ color: 'var(--text-secondary)' }}>
              おかお写真
            </label>
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-40 h-40 rounded-2xl flex items-center justify-center overflow-hidden border-2"
                style={{ borderColor: 'var(--border)', background: '#f5f0eb' }}
              >
                {photoDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoDataUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl">📷</span>
                )}
              </div>
              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 rounded-lg border-2 text-sm active:scale-95 transition-transform"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {photoDataUrl ? '写真を変更' : '写真を選ぶ'}
                </button>
                {photoDataUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoDataUrl(null)}
                    className="py-2 px-3 rounded-lg text-xs active:scale-95 transition-transform"
                    style={{ color: 'var(--text-secondary)', background: '#f5f0eb' }}
                  >
                    削除
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            {photoError && (
              <p className="text-xs mt-2 text-left" style={{ color: 'var(--danger)' }}>
                {photoError}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1 text-left" style={{ color: 'var(--text-secondary)' }}>
              なまえ
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="あかちゃんの名前"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: 'var(--border)', '--tw-ring-color': 'var(--accent)' } as React.CSSProperties}
              maxLength={10}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1 text-left" style={{ color: 'var(--text-secondary)' }}>
              せいべつ
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setGender('girl')}
                className={`flex-1 py-2 rounded-lg border-2 transition-colors ${
                  gender === 'girl' ? 'border-pink-400 bg-pink-50' : ''
                }`}
                style={gender !== 'girl' ? { borderColor: 'var(--border)' } : undefined}
              >
                👧 おんなのこ
              </button>
              <button
                onClick={() => setGender('boy')}
                className={`flex-1 py-2 rounded-lg border-2 transition-colors ${
                  gender === 'boy' ? 'border-blue-400 bg-blue-50' : ''
                }`}
                style={gender !== 'boy' ? { borderColor: 'var(--border)' } : undefined}
              >
                👦 おとこのこ
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-1 text-left" style={{ color: 'var(--text-secondary)' }}>
              ゲーム速度
            </label>
            <div className="flex gap-2">
              {[
                { value: 1, label: 'ふつう' },
                { value: 3, label: 'はやい' },
                { value: 10, label: 'とてもはやい' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setTimeScale(opt.value)}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm transition-colors ${
                    timeScale === opt.value ? 'border-orange-400 bg-orange-50' : ''
                  }`}
                  style={timeScale !== opt.value ? { borderColor: 'var(--border)' } : undefined}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {timeScale === 1 && '1分 = 1時間（リアルタイム寄り）'}
              {timeScale === 3 && '1分 = 3時間（8分で1日）'}
              {timeScale === 10 && '1分 = 10時間（約2.4分で1日）'}
            </p>
          </div>

          <button
            onClick={() => onStart(name || 'あかちゃん', gender, timeScale, photoDataUrl)}
            className="w-full py-3 px-6 rounded-xl text-white font-bold text-lg transition-colors"
            style={{ background: 'var(--success)' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#4caf50')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--success)')}
          >
            はじめる
          </button>
        </div>
      </div>
    </div>
  );
}
