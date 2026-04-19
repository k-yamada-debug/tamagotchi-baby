'use client';

import { useEffect, useRef, useState } from 'react';

interface StartScreenProps {
  onStart: (name: string, gender: 'boy' | 'girl', timeScale: number, photoDataUrl: string | null) => void;
}

const CROP_SIZE = 260;   // プレビュー枠 (px)
const OUTPUT_SIZE = 512; // 出力解像度 (px)

async function loadBitmap(file: File): Promise<ImageBitmap> {
  return await createImageBitmap(file);
}

function renderCrop(
  bitmap: ImageBitmap,
  zoom: number,
  panX: number,
  panY: number,
  quality = 0.88,
): string {
  const ratio = OUTPUT_SIZE / CROP_SIZE;
  const base = Math.max(CROP_SIZE / bitmap.width, CROP_SIZE / bitmap.height);
  const s = base * zoom;
  const dw = bitmap.width * s * ratio;
  const dh = bitmap.height * s * ratio;
  const dx = (OUTPUT_SIZE - dw) / 2 + panX * ratio;
  const dy = (OUTPUT_SIZE - dh) / 2 + panY * ratio;

  const canvas = document.createElement('canvas');
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unavailable');
  // 余白が出る場合は背景色で塗る
  ctx.fillStyle = '#f5f0eb';
  ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
  ctx.drawImage(bitmap, dx, dy, dw, dh);
  return canvas.toDataURL('image/jpeg', quality);
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'boy' | 'girl'>('girl');
  const [timeScale, setTimeScale] = useState(1);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropper state
  const [cropBitmap, setCropBitmap] = useState<ImageBitmap | null>(null);
  const [cropImgUrl, setCropImgUrl] = useState<string | null>(null); // <img> 表示用 blob URL
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const cropAreaRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  // cropImgUrl をアンマウント時に解放
  useEffect(() => {
    return () => {
      if (cropImgUrl) URL.revokeObjectURL(cropImgUrl);
    };
  }, [cropImgUrl]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError(null);
    if (!file.type.startsWith('image/')) {
      setPhotoError('画像ファイルを選んでください');
      return;
    }
    try {
      const bitmap = await loadBitmap(file);
      if (cropImgUrl) URL.revokeObjectURL(cropImgUrl);
      setCropBitmap(bitmap);
      setCropImgUrl(URL.createObjectURL(file));
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } catch {
      setPhotoError('画像を読み込めませんでした');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const closeCropper = () => {
    if (cropImgUrl) URL.revokeObjectURL(cropImgUrl);
    setCropBitmap(null);
    setCropImgUrl(null);
  };

  const confirmCrop = () => {
    if (!cropBitmap) return;
    try {
      const dataUrl = renderCrop(cropBitmap, zoom, pan.x, pan.y);
      setPhotoDataUrl(dataUrl);
      closeCropper();
    } catch {
      setPhotoError('画像の処理に失敗しました');
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pan.x,
      origY: pan.y,
    };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = dragStateRef.current;
    if (!s) return;
    setPan({ x: s.origX + (e.clientX - s.startX), y: s.origY + (e.clientY - s.startY) });
  };
  const onPointerUp = () => {
    dragStateRef.current = null;
  };

  // 画像の表示スタイル（プレビューの中央に配置、zoomと panで調整）
  const imgStyle: React.CSSProperties = cropBitmap
    ? (() => {
        const base = Math.max(CROP_SIZE / cropBitmap.width, CROP_SIZE / cropBitmap.height);
        const s = base * zoom;
        const w = cropBitmap.width * s;
        const h = cropBitmap.height * s;
        return {
          position: 'absolute',
          width: w,
          height: h,
          maxWidth: 'none',
          maxHeight: 'none',
          left: (CROP_SIZE - w) / 2 + pan.x,
          top: (CROP_SIZE - h) / 2 + pan.y,
          userSelect: 'none',
          pointerEvents: 'none',
          touchAction: 'none',
        };
      })()
    : {};

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

          {/* 顔写真アップロード */}
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

      {/* 写真トリミング モーダル */}
      {cropBitmap && cropImgUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in p-4">
          <div className="animate-overlay-in game-card p-5 max-w-sm w-full">
            <h3 className="font-bold mb-3">写真を調整</h3>
            <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
              ドラッグで位置、スライダーで拡大・縮小できます
            </p>

            {/* プレビュー（トリミング枠） */}
            <div className="flex justify-center mb-4">
              <div
                ref={cropAreaRef}
                className="relative overflow-hidden rounded-2xl"
                style={{
                  width: CROP_SIZE,
                  height: CROP_SIZE,
                  background: '#f5f0eb',
                  border: '2px solid var(--border)',
                  touchAction: 'none',
                  cursor: 'grab',
                }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cropImgUrl} alt="" style={imgStyle} draggable={false} />
              </div>
            </div>

            {/* ズームスライダー */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>拡大・縮小</span>
                <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                  {zoom.toFixed(2)}x
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(2)))}
                  className="w-8 h-8 rounded-lg border-2 active:scale-95"
                  style={{ borderColor: 'var(--border)' }}
                  aria-label="縮小"
                >−</button>
                <input
                  type="range"
                  min={0.5}
                  max={4}
                  step={0.01}
                  value={zoom}
                  onChange={e => setZoom(Number(e.target.value))}
                  className="flex-1 accent-pink-400"
                />
                <button
                  type="button"
                  onClick={() => setZoom(z => Math.min(4, +(z + 0.1).toFixed(2)))}
                  className="w-8 h-8 rounded-lg border-2 active:scale-95"
                  style={{ borderColor: 'var(--border)' }}
                  aria-label="拡大"
                >＋</button>
              </div>
            </div>

            {/* 操作ボタン */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeCropper}
                className="flex-1 py-2 rounded-lg border-2 active:scale-95 transition-transform"
                style={{ borderColor: 'var(--border)' }}
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={confirmCrop}
                className="flex-1 py-2 rounded-lg text-white font-bold active:scale-95 transition-transform"
                style={{ background: 'var(--accent)' }}
              >
                決定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
