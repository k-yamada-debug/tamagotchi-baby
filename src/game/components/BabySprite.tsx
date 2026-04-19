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
  photoDataUrl?: string | null;
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

// 写真版の顔: 表情に応じて写真そのものに強めのフィルタ＋ブレンドで変化をつける
interface PhotoStyle {
  filter: string;
  tintColor: string | null; // overlay color (mix-blend: multiply for illness look)
  tintOpacity: number;
  shake?: boolean;
}

function getPhotoStyle(expression: Expression): PhotoStyle {
  switch (expression) {
    case 'sick':
      return {
        filter: 'saturate(0.55) brightness(0.9) hue-rotate(60deg) contrast(0.95)',
        tintColor: '#8fd3a8',
        tintOpacity: 0.35,
      };
    case 'sleeping':
      return {
        filter: 'brightness(0.7) saturate(0.7) blur(0.6px)',
        tintColor: '#29345e',
        tintOpacity: 0.3,
      };
    case 'tired':
      return {
        filter: 'brightness(0.85) saturate(0.7) contrast(0.95)',
        tintColor: '#6b5c8a',
        tintOpacity: 0.18,
      };
    case 'crying':
      return {
        filter: 'saturate(1.25) contrast(1.1) brightness(0.97)',
        tintColor: '#ff8a9c',
        tintOpacity: 0.2,
        shake: true,
      };
    case 'sad':
      return {
        filter: 'saturate(0.55) brightness(0.95) contrast(0.95)',
        tintColor: '#5c7cb0',
        tintOpacity: 0.22,
      };
    case 'hungry':
      return {
        filter: 'saturate(0.8) brightness(0.95) contrast(1.05)',
        tintColor: '#d4a34a',
        tintOpacity: 0.1,
      };
    case 'dirty':
      return {
        filter: 'saturate(0.65) sepia(0.4) brightness(0.9) contrast(1.05)',
        tintColor: '#8b6f3a',
        tintOpacity: 0.25,
      };
    case 'happy':
      return {
        filter: 'saturate(1.4) brightness(1.1) contrast(1.08)',
        tintColor: '#ffc0cb',
        tintOpacity: 0.08,
      };
    default:
      return { filter: 'none', tintColor: null, tintOpacity: 0 };
  }
}

function BabyPhotoFace({ expression, photoDataUrl }: { expression: Expression; photoDataUrl: string }) {
  const style = getPhotoStyle(expression);
  const size = 240;

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* 写真本体 */}
      <div
        className={`absolute inset-0 rounded-3xl overflow-hidden ${style.shake ? 'animate-cry' : ''}`}
        style={{
          border: '4px solid #ffe0c2',
          boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
          background: '#f5f0eb',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoDataUrl}
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: style.filter, transition: 'filter 0.5s ease' }}
          draggable={false}
        />

        {/* 感情ティント: 写真全体に色を乗せて表情を変える */}
        {style.tintColor && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: style.tintColor,
              opacity: style.tintOpacity,
              mixBlendMode: 'multiply',
              transition: 'opacity 0.5s ease',
            }}
          />
        )}

        {/* 嬉しい時: 頬染めをグラデーションで追加（写真の上から） */}
        {expression === 'happy' && (
          <>
            <div
              className="absolute pointer-events-none"
              style={{
                left: '10%', top: '55%', width: '25%', height: '20%',
                background: 'radial-gradient(ellipse at center, rgba(255,143,163,0.55), transparent 70%)',
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                right: '10%', top: '55%', width: '25%', height: '20%',
                background: 'radial-gradient(ellipse at center, rgba(255,143,163,0.55), transparent 70%)',
              }}
            />
          </>
        )}

        {/* 悲しい/泣いてる時: 写真の目の位置に涙 */}
        {(expression === 'crying' || expression === 'sad') && (
          <>
            <div
              className="absolute"
              style={{
                left: '28%', top: '45%',
                width: 10, height: 22,
                background: 'linear-gradient(180deg, rgba(135,206,235,0.6), rgba(135,206,235,0.95))',
                borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
                animation: expression === 'crying' ? 'tear-drop 1.2s infinite' : undefined,
                boxShadow: '0 0 4px rgba(135,206,235,0.6)',
              }}
            />
            <div
              className="absolute"
              style={{
                right: '28%', top: '45%',
                width: 10, height: 22,
                background: 'linear-gradient(180deg, rgba(135,206,235,0.6), rgba(135,206,235,0.95))',
                borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
                animation: expression === 'crying' ? 'tear-drop 1.2s infinite 0.3s' : undefined,
                boxShadow: '0 0 4px rgba(135,206,235,0.6)',
              }}
            />
          </>
        )}

        {/* 寝てる時: 瞼オーバーレイ + Z */}
        {expression === 'sleeping' && (
          <>
            {/* 上半分を少し暗くして瞼感 */}
            <div
              className="absolute inset-x-0 top-0 pointer-events-none"
              style={{
                height: '60%',
                background: 'linear-gradient(180deg, rgba(0,0,0,0.25), transparent)',
              }}
            />
            {/* 閉じた目のライン */}
            <svg
              className="absolute pointer-events-none"
              style={{ left: '15%', top: '40%', width: '70%', height: '15%' }}
              viewBox="0 0 100 20"
            >
              <path d="M 5 10 Q 25 15 45 10" stroke="#2d1b0e" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 55 10 Q 75 15 95 10" stroke="#2d1b0e" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </>
        )}

        {/* 疲れてる時: 半目ライン */}
        {expression === 'tired' && (
          <svg
            className="absolute pointer-events-none"
            style={{ left: '15%', top: '40%', width: '70%', height: '10%' }}
            viewBox="0 0 100 20"
          >
            <path d="M 5 5 Q 25 15 45 5" stroke="#2d1b0e" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
            <path d="M 55 5 Q 75 15 95 5" stroke="#2d1b0e" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
          </svg>
        )}

        {/* 汚い時: 顔にほこり/土汚れ風のシミ */}
        {expression === 'dirty' && (
          <>
            <div className="absolute" style={{ left: '20%', top: '62%', width: 22, height: 14, background: '#6b4423', opacity: 0.45, borderRadius: '50%', filter: 'blur(3px)' }} />
            <div className="absolute" style={{ right: '25%', top: '35%', width: 16, height: 10, background: '#6b4423', opacity: 0.4, borderRadius: '50%', filter: 'blur(3px)' }} />
            <div className="absolute" style={{ left: '45%', bottom: '25%', width: 18, height: 12, background: '#6b4423', opacity: 0.4, borderRadius: '50%', filter: 'blur(3px)' }} />
          </>
        )}

        {/* お腹すいた: 頬をへこませる暗い影 */}
        {expression === 'hungry' && (
          <>
            <div
              className="absolute pointer-events-none"
              style={{
                left: '8%', top: '55%', width: '20%', height: '25%',
                background: 'radial-gradient(ellipse at center, rgba(80,60,40,0.35), transparent 70%)',
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                right: '8%', top: '55%', width: '20%', height: '25%',
                background: 'radial-gradient(ellipse at center, rgba(80,60,40,0.35), transparent 70%)',
              }}
            />
          </>
        )}
      </div>

      {/* === 写真の外に装飾 === */}

      {/* 寝てるマーク */}
      {expression === 'sleeping' && (
        <div className="absolute" style={{ right: -12, top: -12 }}>
          <span style={{ fontSize: 20, color: '#8b7355', opacity: 0.7, position: 'absolute', left: 0, top: 50, fontWeight: 'bold' }}>z</span>
          <span style={{ fontSize: 28, color: '#8b7355', opacity: 0.6, position: 'absolute', left: 15, top: 22, fontWeight: 'bold' }}>z</span>
          <span style={{ fontSize: 36, color: '#8b7355', opacity: 0.5, position: 'absolute', left: 32, top: -10, fontWeight: 'bold' }}>Z</span>
        </div>
      )}

      {/* お腹すいた → 吹き出し */}
      {expression === 'hungry' && (
        <div className="absolute" style={{ right: -18, top: -12 }}>
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 54, height: 44, background: 'white', border: '2px solid #e0d0c0' }}
          >
            <span style={{ fontSize: 26 }}>🍼</span>
          </div>
        </div>
      )}

      {/* 病気 → 体温計 */}
      {expression === 'sick' && (
        <div className="absolute" style={{ right: -8, top: 20, transform: 'rotate(-25deg)', fontSize: 36 }}>🌡️</div>
      )}

      {/* 汚い → モヤモヤ */}
      {expression === 'dirty' && (
        <>
          <div className="absolute" style={{ left: -10, top: 60, fontSize: 24, opacity: 0.85 }}>💦</div>
          <div className="absolute" style={{ right: -10, top: 40, fontSize: 22, opacity: 0.85 }}>💦</div>
          <div className="absolute" style={{ right: -15, bottom: 30, fontSize: 20, opacity: 0.75 }}>💨</div>
        </>
      )}

      {/* 嬉しい → キラキラ */}
      {expression === 'happy' && (
        <>
          <div className="absolute animate-sparkle" style={{ left: -5, top: 20, fontSize: 24 }}>✨</div>
          <div className="absolute animate-sparkle" style={{ right: -5, top: 0, fontSize: 20, animationDelay: '0.2s' }}>✨</div>
          <div className="absolute animate-sparkle" style={{ right: 0, bottom: 20, fontSize: 22, animationDelay: '0.4s' }}>⭐</div>
        </>
      )}

      {/* 悲しい/泣いてる → 追加しずく */}
      {expression === 'sad' && (
        <div className="absolute" style={{ left: '50%', top: -10, transform: 'translateX(-50%)', fontSize: 20, opacity: 0.7 }}>💧</div>
      )}
    </div>
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

export function BabySprite({ stage, gender, isCrying, isSick, status, actionFeedback, photoDataUrl }: BabySpriteProps) {
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
        {photoDataUrl ? (
          <BabyPhotoFace expression={expression} photoDataUrl={photoDataUrl} />
        ) : (
          <BabyFaceSVG expression={expression} stage={stage} gender={gender} />
        )}
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
