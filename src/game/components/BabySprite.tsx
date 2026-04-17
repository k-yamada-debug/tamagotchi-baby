'use client';

import { LifeStage, StatusValues } from '../types';
import { useState, useEffect } from 'react';

interface BabySpriteProps {
  stage: LifeStage;
  gender: 'boy' | 'girl';
  isCrying: boolean;
  isSick: boolean;
  status: StatusValues;
  actionFeedback: string | null;
}

type Expression = 'happy' | 'normal' | 'hungry' | 'dirty' | 'tired' | 'sad' | 'crying' | 'sick' | 'sleeping';

function getExpression(isCrying: boolean, isSick: boolean, status: StatusValues): Expression {
  if (isSick) return 'sick';
  if (isCrying) return 'crying';
  if (status.energy < 15) return 'sleeping';
  if (status.hunger < 20) return 'hungry';
  if (status.cleanliness < 20) return 'dirty';
  if (status.energy < 30) return 'tired';
  if (status.mood < 25) return 'sad';
  if (status.mood > 75 && status.hunger > 50) return 'happy';
  return 'normal';
}

function getAnimClass(expression: Expression): string {
  switch (expression) {
    case 'crying': return 'animate-cry';
    case 'sick': return 'animate-sick';
    case 'sleeping': return 'animate-sleep';
    case 'happy': return 'animate-happy';
    default: return 'animate-idle';
  }
}

function getHairColor(gender: 'boy' | 'girl'): string {
  return '#2d1b0e';
}

function getBodySize(stage: LifeStage): number {
  switch (stage) {
    case 'newborn': return 0.7;
    case 'infant': return 0.8;
    case 'toddler': return 0.9;
    case 'preschooler': return 1.0;
    case 'elementary': return 1.1;
    case 'middleSchool': return 1.2;
    default: return 1.0;
  }
}

function BabyFaceSVG({ expression, stage, gender }: {
  expression: Expression;
  stage: LifeStage;
  gender: 'boy' | 'girl';
}) {
  const hairColor = getHairColor(gender);
  const skinColor = '#ffe0c2';
  const cheekColor = '#ffb3b3';
  const isOlder = stage === 'elementary' || stage === 'middleSchool';
  const isToddlerUp = stage !== 'newborn' && stage !== 'infant';

  return (
    <svg viewBox="0 0 200 220" width="180" height="200">
      {/* 髪の毛（後ろ） */}
      <ellipse cx="100" cy="75" rx="75" ry="72" fill={hairColor} />

      {/* 顔 */}
      <ellipse cx="100" cy="100" rx="68" ry="65"
        fill={expression === 'sick' ? '#f5d6b8' : skinColor} />

      {/* 髪の毛（前髪） */}
      {gender === 'girl' ? (
        <>
          <path d="M 32 80 Q 35 40 70 30 Q 85 25 100 28 Q 115 25 130 30 Q 165 40 168 80"
            fill={hairColor} />
          <path d="M 40 75 Q 55 55 70 50 Q 80 47 90 52 L 85 70 Z" fill={hairColor} />
          <path d="M 160 75 Q 145 55 130 50 Q 120 47 110 52 L 115 70 Z" fill={hairColor} />
          {/* リボンやヘアアクセ */}
          {!isOlder && (
            <g transform="translate(145, 45) rotate(15)">
              <path d="M 0 0 Q -8 -10 -3 -15 Q 0 -18 3 -15 Q 8 -10 0 0" fill="#ff8fa3" />
              <path d="M 0 0 Q 8 -10 3 -15 Q 0 -18 -3 -15 Q -8 -10 0 0" fill="#ff6b8a" />
              <circle cx="0" cy="0" r="2" fill="#fff" />
            </g>
          )}
        </>
      ) : (
        <>
          <path d="M 32 80 Q 35 40 70 30 Q 85 25 100 28 Q 115 25 130 30 Q 165 40 168 80"
            fill={hairColor} />
          <path d="M 45 75 Q 55 50 75 48 L 80 65 Z" fill={hairColor} />
          <path d="M 155 75 Q 145 50 125 48 L 120 65 Z" fill={hairColor} />
          <path d="M 70 45 Q 90 38 110 42 L 105 55 Q 90 48 75 55 Z" fill={hairColor} />
        </>
      )}

      {/* 目 */}
      {expression === 'sleeping' || expression === 'tired' ? (
        <>
          {/* 閉じた目 / 眠い目 */}
          <path d={expression === 'sleeping'
            ? "M 65 95 Q 75 100 85 95"
            : "M 65 95 Q 75 98 85 95"}
            stroke="#4a3728" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d={expression === 'sleeping'
            ? "M 115 95 Q 125 100 135 95"
            : "M 115 95 Q 125 98 135 95"}
            stroke="#4a3728" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      ) : expression === 'crying' ? (
        <>
          {/* 泣いてる目 */}
          <path d="M 65 90 Q 75 85 85 90" stroke="#4a3728" strokeWidth="2" fill="none" />
          <path d="M 65 93 Q 75 98 85 93" stroke="#4a3728" strokeWidth="2" fill="none" />
          <path d="M 115 90 Q 125 85 135 90" stroke="#4a3728" strokeWidth="2" fill="none" />
          <path d="M 115 93 Q 125 98 135 93" stroke="#4a3728" strokeWidth="2" fill="none" />
          {/* 涙 */}
          <ellipse cx="62" cy="105" rx="4" ry="6" fill="#87ceeb" opacity="0.7" />
          <ellipse cx="138" cy="105" rx="4" ry="6" fill="#87ceeb" opacity="0.7" />
        </>
      ) : expression === 'sad' ? (
        <>
          {/* 悲しい目 */}
          <ellipse cx="75" cy="93" rx="8" ry="9" fill="white" />
          <ellipse cx="75" cy="95" rx="5" ry="5.5" fill="#3d2512" />
          <ellipse cx="74" cy="94" rx="2" ry="2" fill="white" />
          <ellipse cx="125" cy="93" rx="8" ry="9" fill="white" />
          <ellipse cx="125" cy="95" rx="5" ry="5.5" fill="#3d2512" />
          <ellipse cx="124" cy="94" rx="2" ry="2" fill="white" />
          {/* 下がった眉毛 */}
          <path d="M 63 82 Q 72 80 83 84" stroke="#4a3728" strokeWidth="2" fill="none" />
          <path d="M 137 82 Q 128 80 117 84" stroke="#4a3728" strokeWidth="2" fill="none" />
        </>
      ) : expression === 'sick' ? (
        <>
          {/* 具合悪い目 */}
          <path d="M 67 93 Q 75 90 83 93" stroke="#4a3728" strokeWidth="2.5" fill="none" />
          <path d="M 117 93 Q 125 90 133 93" stroke="#4a3728" strokeWidth="2.5" fill="none" />
          {/* 下がった眉 */}
          <path d="M 65 83 Q 73 79 83 82" stroke="#4a3728" strokeWidth="2" fill="none" />
          <path d="M 135 83 Q 127 79 117 82" stroke="#4a3728" strokeWidth="2" fill="none" />
        </>
      ) : expression === 'hungry' ? (
        <>
          {/* お腹すいた目（うるうる） */}
          <ellipse cx="75" cy="93" rx="9" ry="10" fill="white" />
          <ellipse cx="75" cy="94" rx="6" ry="7" fill="#3d2512" />
          <ellipse cx="73" cy="92" rx="3" ry="3" fill="white" />
          <ellipse cx="77" cy="96" rx="1.5" ry="1.5" fill="white" />
          <ellipse cx="125" cy="93" rx="9" ry="10" fill="white" />
          <ellipse cx="125" cy="94" rx="6" ry="7" fill="#3d2512" />
          <ellipse cx="123" cy="92" rx="3" ry="3" fill="white" />
          <ellipse cx="127" cy="96" rx="1.5" ry="1.5" fill="white" />
        </>
      ) : expression === 'dirty' ? (
        <>
          {/* 不快な目 */}
          <ellipse cx="75" cy="93" rx="7" ry="7" fill="white" />
          <ellipse cx="75" cy="94" rx="4.5" ry="4.5" fill="#3d2512" />
          <ellipse cx="73" cy="92" rx="2" ry="2" fill="white" />
          <ellipse cx="125" cy="93" rx="7" ry="7" fill="white" />
          <ellipse cx="125" cy="94" rx="4.5" ry="4.5" fill="#3d2512" />
          <ellipse cx="123" cy="92" rx="2" ry="2" fill="white" />
          {/* しかめ眉 */}
          <path d="M 63 84 Q 70 80 83 83" stroke="#4a3728" strokeWidth="2.5" fill="none" />
          <path d="M 137 84 Q 130 80 117 83" stroke="#4a3728" strokeWidth="2.5" fill="none" />
        </>
      ) : (
        <>
          {/* 通常 / 嬉しい目 */}
          <ellipse cx="75" cy="93" rx="8" ry={expression === 'happy' ? 9 : 8} fill="white" />
          <ellipse cx="75" cy="94" rx="5" ry={expression === 'happy' ? 6 : 5} fill="#3d2512" />
          <ellipse cx="73" cy="92" rx="2.5" ry="2.5" fill="white" />
          <ellipse cx="125" cy="93" rx="8" ry={expression === 'happy' ? 9 : 8} fill="white" />
          <ellipse cx="125" cy="94" rx="5" ry={expression === 'happy' ? 6 : 5} fill="#3d2512" />
          <ellipse cx="123" cy="92" rx="2.5" ry="2.5" fill="white" />
          {expression === 'happy' && (
            <>
              <ellipse cx="77" cy="97" rx="1.5" ry="1.5" fill="white" />
              <ellipse cx="127" cy="97" rx="1.5" ry="1.5" fill="white" />
            </>
          )}
        </>
      )}

      {/* ほっぺ */}
      {expression !== 'sick' && (
        <>
          <ellipse cx="55" cy="110" rx="12" ry="8" fill={cheekColor} opacity="0.35" />
          <ellipse cx="145" cy="110" rx="12" ry="8" fill={cheekColor} opacity="0.35" />
        </>
      )}

      {/* 口 */}
      {expression === 'happy' ? (
        <path d="M 82 118 Q 100 135 118 118" stroke="#d4726a" strokeWidth="2.5" fill="#ff9b9b" />
      ) : expression === 'crying' ? (
        <ellipse cx="100" cy="122" rx="12" ry="10" fill="#d4726a" />
      ) : expression === 'hungry' ? (
        <ellipse cx="100" cy="120" rx="8" ry="10" fill="#d4726a" />
      ) : expression === 'dirty' ? (
        <path d="M 85 122 Q 100 115 115 122" stroke="#d4726a" strokeWidth="2.5" fill="none" />
      ) : expression === 'sad' ? (
        <path d="M 88 125 Q 100 118 112 125" stroke="#d4726a" strokeWidth="2.5" fill="none" />
      ) : expression === 'sick' ? (
        <path d="M 90 122 Q 100 120 110 122" stroke="#c9a08a" strokeWidth="2" fill="none" />
      ) : expression === 'sleeping' ? (
        <path d="M 92 120 Q 100 123 108 120" stroke="#d4726a" strokeWidth="2" fill="none" />
      ) : expression === 'tired' ? (
        <ellipse cx="100" cy="121" rx="6" ry="5" fill="#d4726a" opacity="0.6" />
      ) : (
        <path d="M 88 118 Q 100 128 112 118" stroke="#d4726a" strokeWidth="2.5" fill="none" />
      )}

      {/* 病気の時: 体温計 */}
      {expression === 'sick' && (
        <g transform="translate(130, 112) rotate(-30)">
          <rect x="0" y="0" width="4" height="25" rx="2" fill="#e0e0e0" />
          <rect x="0" y="20" width="4" height="5" rx="2" fill="#ff4444" />
        </g>
      )}

      {/* 寝てる時: zzZ */}
      {expression === 'sleeping' && (
        <g>
          <text x="150" y="70" fontSize="16" fill="#8b7355" opacity="0.6" fontWeight="bold">z</text>
          <text x="160" y="55" fontSize="20" fill="#8b7355" opacity="0.5" fontWeight="bold">z</text>
          <text x="172" y="38" fontSize="24" fill="#8b7355" opacity="0.4" fontWeight="bold">Z</text>
        </g>
      )}

      {/* お腹すいた時: 吹き出し */}
      {expression === 'hungry' && (
        <g>
          <ellipse cx="160" cy="55" rx="20" ry="16" fill="white" stroke="#e0d0c0" strokeWidth="1.5" />
          <path d="M 145 65 L 140 75 L 150 68" fill="white" stroke="#e0d0c0" strokeWidth="1.5" />
          <text x="150" y="60" fontSize="18" textAnchor="middle">🍼</text>
        </g>
      )}

      {/* 汚い時: モヤモヤ */}
      {expression === 'dirty' && (
        <g opacity="0.4">
          <text x="40" y="70" fontSize="16">💦</text>
          <text x="150" y="65" fontSize="14">💦</text>
        </g>
      )}

      {/* 体（ステージに合わせた服） */}
      {isToddlerUp && (
        <g>
          <path d={`M 65 155 Q 100 145 135 155 L 130 200 Q 100 205 70 200 Z`}
            fill={gender === 'girl' ? '#ffb3d1' : '#a8d8ea'} />
          {isOlder && (
            <path d="M 85 160 L 85 175 M 100 158 L 100 175 M 115 160 L 115 175"
              stroke={gender === 'girl' ? '#ff8fb3' : '#7ec8e3'} strokeWidth="1.5" />
          )}
        </g>
      )}
    </svg>
  );
}

function getStatusHint(expression: Expression): string {
  switch (expression) {
    case 'hungry': return 'おなかすいたよ〜';
    case 'dirty': return 'きたないよ〜';
    case 'tired': return 'ねむいよ〜';
    case 'sad': return 'さみしいよ〜';
    case 'crying': return 'うわーん！';
    case 'sick': return 'おなかいたい…';
    case 'sleeping': return 'すぅ…すぅ…';
    case 'happy': return 'ごきげん♪';
    default: return '';
  }
}

export function BabySprite({ stage, gender, isCrying, isSick, status, actionFeedback }: BabySpriteProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    if (actionFeedback) {
      setFeedbackText(actionFeedback);
      setShowFeedback(true);
      const timer = setTimeout(() => setShowFeedback(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [actionFeedback]);

  const expression = getExpression(isCrying, isSick, status);
  const animClass = getAnimClass(expression);
  const hint = getStatusHint(expression);

  return (
    <div className="relative flex flex-col items-center justify-center py-4">
      {/* 赤ちゃん本体 */}
      <div className={`relative ${animClass}`}>
        <BabyFaceSVG expression={expression} stage={stage} gender={gender} />
      </div>

      {/* ステータスヒント */}
      {hint && (
        <div className="mt-1 text-sm font-bold px-3 py-1 rounded-full"
          style={{
            color: expression === 'happy' ? 'var(--success)' : 'var(--accent)',
            background: expression === 'happy' ? '#e8f5e9' : '#fff3e0',
          }}
        >
          {hint}
        </div>
      )}

      {/* アクションフィードバック */}
      {showFeedback && (
        <div className="absolute top-0 animate-float-up text-3xl pointer-events-none">
          {feedbackText}
        </div>
      )}
    </div>
  );
}
