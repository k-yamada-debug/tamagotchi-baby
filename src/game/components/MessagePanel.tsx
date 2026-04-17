'use client';

import { useState, useRef, useEffect } from 'react';
import { LifeStage, StatusValues } from '../types';

interface MessagePanelProps {
  stage: LifeStage;
  status: StatusValues;
  babyName: string;
  isSick: boolean;
  isCrying: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: number;
  sender: 'parent' | 'baby';
  text: string;
  timestamp: number;
}

function generateBabyResponse(
  parentMessage: string,
  stage: LifeStage,
  status: StatusValues,
  babyName: string,
  isSick: boolean,
  isCrying: boolean,
): string {
  // 新生児: 泣き声のみ
  if (stage === 'newborn') {
    if (isCrying) return 'うわぁぁぁん！！😭';
    if (status.hunger < 30) return 'ふぇ…ふぇぇ…🍼';
    if (status.energy < 30) return 'くぅ…すぅ…💤';
    const newbornResponses = [
      'あぅ〜',
      'うー…うー…',
      'きゃっ♪',
      'ばぶ〜',
      'あうあう',
    ];
    return newbornResponses[Math.floor(Math.random() * newbornResponses.length)];
  }

  // 乳児: 喃語
  if (stage === 'infant') {
    if (isCrying) return 'えーん！えーん！😭';
    if (isSick) return 'ぅぅ…いたい…😢';
    if (status.hunger < 30) return 'まんま…まんま…🍼';
    if (status.mood > 70) {
      const happyResponses = [
        'あばばば！😊',
        'きゃっきゃ♪',
        'まーまー！❤️',
        'だー！だー！',
        'にこー♪😊',
      ];
      return happyResponses[Math.floor(Math.random() * happyResponses.length)];
    }
    return ['あうー', 'ばぶー', 'うーうー', 'だぁだぁ'][Math.floor(Math.random() * 4)];
  }

  // 幼児: 片言
  if (stage === 'toddler') {
    if (isCrying) return 'ママぁ〜！やだぁ〜！😭';
    if (isSick) return 'おなか…いたいの…😢';
    if (status.hunger < 30) return 'おなかすいたぁ…ごはんたべたい🍚';
    if (status.cleanliness < 30) return 'おしりきもちわるいの…';
    if (status.energy < 30) return 'ねむい…ねんねする…💤';

    if (parentMessage.includes('好き') || parentMessage.includes('すき')) {
      return 'ママだいすきー！！❤️❤️';
    }
    if (parentMessage.includes('おやすみ')) {
      return 'おやすみなさい…すぅ…💤';
    }

    if (status.mood > 70) {
      const responses = [
        'ママ、あそぼ！😊',
        'ねぇねぇ！みてみて！',
        `${babyName}ね、きょうたのしい！`,
        'ぎゅーして！❤️',
        'ママのこと、だーいすき♪',
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    return ['うん！', 'えへへ', 'なぁに？', 'ママー！'][Math.floor(Math.random() * 4)];
  }

  // 園児: 簡単な文
  if (stage === 'preschooler') {
    if (isSick) return 'ママ…しんどい…おくすりのむ…😢';
    if (isCrying) return 'うわぁーん！ママのばかぁ！😭';
    if (status.hunger < 30) return 'おなかぺこぺこだよ〜！ごはんまだ？🍚';
    if (status.cleanliness < 30) return 'おふろはいりたいな〜🛁';

    if (parentMessage.includes('好き') || parentMessage.includes('すき')) {
      return `えへへ、${babyName}もママのこと世界一すき！❤️`;
    }
    if (parentMessage.includes('がんばれ') || parentMessage.includes('頑張')) {
      return 'うん！がんばる！💪✨';
    }
    if (parentMessage.includes('おやすみ')) {
      return 'おやすみなさい！いいゆめみてね！💤✨';
    }
    if (parentMessage.includes('かわいい') || parentMessage.includes('可愛い')) {
      return 'えへへ〜ありがとう！ママもかわいいよ！😊💕';
    }

    if (status.mood > 70) {
      const responses = [
        'ようちえんでね、おともだちできたの！😊',
        'ママ、きょうのごはんなぁに？',
        `ねぇママ！${babyName}おえかきしたの！みて！🎨`,
        'ママだいすき〜ぎゅ〜っ！❤️',
        'おさんぽいきたいな〜！🌸',
        'ママにおはなつんできたの！🌷',
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    return ['うん！', 'なぁに？', 'そうなの！', 'わかった！'][Math.floor(Math.random() * 4)];
  }

  // 小学生: しっかりした会話
  if (stage === 'elementary') {
    if (isSick) return '熱がある…学校休みたい…🤒';
    if (status.hunger < 30) return 'ママ、おなかすいた！おやつある？🍩';
    if (status.mood < 30) return '今日、ちょっと嫌なことあった…😔';

    if (parentMessage.includes('好き') || parentMessage.includes('すき')) {
      return 'も、もう！恥ずかしいな…でもありがとう😊❤️';
    }
    if (parentMessage.includes('がんばれ') || parentMessage.includes('頑張')) {
      return 'ありがとう！テスト頑張るね！✏️💪';
    }
    if (parentMessage.includes('おやすみ')) {
      return 'おやすみ！明日も楽しみだな〜💤';
    }
    if (parentMessage.includes('学校') || parentMessage.includes('がっこう')) {
      return '今日の給食おいしかったよ！友達とたくさん遊んだ！😄';
    }

    if (status.mood > 70) {
      const responses = [
        'ママ、聞いて聞いて！今日ね…😊',
        'テストで100点とったよ！褒めて！💯',
        `ママ、${babyName}大きくなったでしょ？`,
        'いつもありがとう、ママ❤️',
        '将来の夢ができたんだ！✨',
        'ママの作るごはん、世界一おいしい！🍳',
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    return ['うん！', 'わかった〜', 'そうだね！', 'え、なに？'][Math.floor(Math.random() * 4)];
  }

  // 中学生: 思春期
  if (stage === 'middleSchool') {
    if (isSick) return '大丈夫…寝てれば治るから…';
    if (status.mood < 30) return '別に…ほっといてよ…';

    if (parentMessage.includes('好き') || parentMessage.includes('すき')) {
      return '…ありがと。…ママも好きだよ（小声）😊';
    }
    if (parentMessage.includes('がんばれ') || parentMessage.includes('頑張')) {
      return 'わかってるって。…ありがとね✨';
    }
    if (parentMessage.includes('おやすみ')) {
      return 'おやすみ。…ママも早く寝なよ';
    }
    if (parentMessage.includes('ごはん') || parentMessage.includes('ご飯')) {
      return '今日のごはん何？…ママの唐揚げがいいな';
    }
    if (parentMessage.includes('かわいい') || parentMessage.includes('可愛い')) {
      return 'もう子供じゃないんだけど！…でも、ありがと😊';
    }

    if (status.mood > 70) {
      const responses = [
        '…今日部活で褒められた。えへ✨',
        'ママ、ちょっと相談があるんだけど…',
        `ママ、今まで育ててくれてありがとう…なんでもない！😊`,
        '友達と映画行ってもいい？…お弁当作って♪',
        'ママのこと、尊敬してるよ。…本当だって！',
        '将来はママみたいな親になりたいな…なんてね😊',
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    return ['…別に', 'ふーん', 'はいはい', '…うん'][Math.floor(Math.random() * 4)];
  }

  return 'ばぶー';
}

export function MessagePanel({ stage, status, babyName, isSick, isCrying, onClose }: MessagePanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      sender: 'baby',
      text: stage === 'newborn' ? 'ばぶ〜' :
        stage === 'infant' ? 'あばー！' :
          stage === 'toddler' ? 'ママ〜！' :
            stage === 'preschooler' ? 'ママ、おはなししよ！' :
              stage === 'elementary' ? 'ママ、聞いて！' :
                '…なに？',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const parentMsg: ChatMessage = {
      id: Date.now(),
      sender: 'parent',
      text: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, parentMsg]);
    setInput('');

    setTimeout(() => {
      const response = generateBabyResponse(input.trim(), stage, status, babyName, isSick, isCrying);
      const babyMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: 'baby',
        text: response,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, babyMsg]);
    }, 500 + Math.random() * 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-2 bg-black/30">
      <div className="animate-overlay-in max-w-lg w-full rounded-t-2xl game-card flex flex-col"
        style={{ maxHeight: '70vh' }}>
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <span className="text-xl">💬</span>
            <span className="font-bold">{babyName}とおはなし</span>
          </div>
          <button onClick={onClose} className="text-xl hover:scale-110 transition-transform">✕</button>
        </div>

        {/* メッセージ一覧 */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ minHeight: '200px' }}>
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'parent' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'baby' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 mr-2"
                  style={{ background: '#ffe0c2' }}>
                  👶
                </div>
              )}
              <div
                className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                  msg.sender === 'parent'
                    ? 'rounded-tr-sm text-white'
                    : 'rounded-tl-sm'
                }`}
                style={{
                  background: msg.sender === 'parent' ? 'var(--accent)' : '#f5f0eb',
                  color: msg.sender === 'parent' ? 'white' : 'var(--text-primary)',
                }}
              >
                {msg.text}
              </div>
              {msg.sender === 'parent' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ml-2"
                  style={{ background: '#e8f5e9' }}>
                  👩
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 入力エリア */}
        <div className="p-3 border-t flex gap-2" style={{ borderColor: 'var(--border)' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
            placeholder={`${babyName}に話しかける…`}
            className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 text-sm"
            style={{ borderColor: 'var(--border)', '--tw-ring-color': 'var(--accent)' } as React.CSSProperties}
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 rounded-full text-white font-bold text-sm transition-colors"
            style={{ background: 'var(--accent)' }}
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
}
