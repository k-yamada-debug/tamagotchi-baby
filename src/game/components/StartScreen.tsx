'use client';

import { useState } from 'react';

interface StartScreenProps {
  onStart: (name: string, gender: 'boy' | 'girl', timeScale: number) => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'boy' | 'girl'>('girl');
  const [timeScale, setTimeScale] = useState(1);

  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <div className="game-card p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">👶</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          たまごっちベビー
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          赤ちゃんを育てよう！
        </p>

        <div className="border-t pt-6" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-bold mb-4">あたらしくはじめる</h2>

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
            onClick={() => onStart(name || 'あかちゃん', gender, timeScale)}
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
