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

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function matchesAny(message: string, keywords: string[]): boolean {
  return keywords.some(k => message.includes(k));
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
    if (isCrying) {
      return pick(['うわぁぁぁん！！😭', 'ふぇぇぇん！😭', 'びぇぇぇ〜！😭', 'うぇ〜ん！うぇ〜ん！😭']);
    }
    if (isSick) {
      return pick(['ふぇ…ぐずっ…😢', 'うぅ…うぅ…😷', 'ふにゃ…ふにゃ…']);
    }
    if (status.hunger < 30) {
      return pick(['ふぇ…ふぇぇ…🍼', 'んまっ…んまっ…🍼', 'ふぇ〜…おっぱい…']);
    }
    if (status.cleanliness < 30) {
      return pick(['ぐずっ…ぐずっ…', 'ふにゃあ…きもちわるい…']);
    }
    if (status.energy < 30) {
      return pick(['くぅ…すぅ…💤', 'ふぁ…ねむい…😪', 'うとうと…💤']);
    }
    if (status.mood > 70) {
      return pick([
        'きゃっ♪', 'あー♪あー♪', 'にこっ😊', 'うふふっ♪',
        'きゃっきゃ！', 'あうー♪', 'ぷくぷく🫧', 'にぱっ☺️',
      ]);
    }
    return pick([
      'あぅ〜', 'うー…うー…', 'きゃっ♪', 'ばぶ〜', 'あうあう',
      'ふにゃ〜', 'んー？', 'あぶあぶ', 'ぷぅ〜', 'うにゃ〜',
      'ふぇ？', 'あむあむ', 'もぐもぐ…', 'ぱちぱち👀',
    ]);
  }

  // 乳児: 喃語
  if (stage === 'infant') {
    if (isCrying) {
      return pick(['えーん！えーん！😭', 'ふぇーん！😭', 'びえーん！😭', 'うぇぇぇ…😭']);
    }
    if (isSick) {
      return pick(['ぅぅ…いたい…😢', 'まんま…いらない…😷', 'うぅ…ねんね…😷']);
    }
    if (status.hunger < 30) {
      return pick(['まんま…まんま…🍼', 'ぱい！ぱい！🍼', 'まんまぁ…😢', 'おっぱい〜！']);
    }
    if (status.cleanliness < 30) {
      return pick(['しっしー！', 'うぅ…きもちわるい…', 'むにゃ…おむつ…']);
    }
    if (status.energy < 30) {
      return pick(['ねんね…💤', 'ふぁ〜…😪', 'ねむねむ…']);
    }
    if (matchesAny(parentMessage, ['ママ', 'まま'])) {
      return pick(['まー！まー！❤️', 'まんま〜！', 'まっ！まっ！']);
    }
    if (matchesAny(parentMessage, ['パパ', 'ぱぱ'])) {
      return pick(['ぱっ！ぱっ！', 'ぱぁぱ〜！', 'ぱぱー！❤️']);
    }
    if (matchesAny(parentMessage, ['かわいい', '可愛い', 'いいこ', '良い子'])) {
      return pick(['きゃっきゃ♪😊', 'うふー！', 'にぱ〜☺️']);
    }
    if (matchesAny(parentMessage, ['おはよう', 'おきた'])) {
      return pick(['あー！あー！😊', 'ばぶー♪', 'きゃっ☀️']);
    }
    if (matchesAny(parentMessage, ['おやすみ', 'ねんね'])) {
      return pick(['ねんねぇ…💤', 'くぅ…すぅ…💤', 'ふぁ〜💤']);
    }
    if (status.mood > 70) {
      return pick([
        'あばばば！😊', 'きゃっきゃ♪', 'まーまー！❤️', 'だー！だー！',
        'にこー♪😊', 'ぱちぱち👏', 'うきゃっ♪', 'ばぁ！ばぁ！',
        'あーう♪', 'だいすきー❤️', 'てって✋', 'ばぶばぶ♪',
      ]);
    }
    return pick([
      'あうー', 'ばぶー', 'うーうー', 'だぁだぁ',
      'あーあー', 'んまー', 'ぷっ！', 'ばー！',
      'ふんふん', 'もぐもぐ', 'あむあむ', 'んー？',
    ]);
  }

  // 幼児: 片言
  if (stage === 'toddler') {
    if (isCrying) {
      return pick(['ママぁ〜！やだぁ〜！😭', 'びえぇぇん！😭', 'やだやだやだー！😭', 'ママ〜！だっこ〜！😭']);
    }
    if (isSick) {
      return pick(['おなか…いたいの…😢', 'ねつでちゃった…😷', 'あたまいたいよぉ…😢']);
    }
    if (status.hunger < 30) {
      return pick(['おなかすいたぁ…ごはんたべたい🍚', 'まんまちょうだい〜！🍚', 'おなかぐぅーってなってる…😢']);
    }
    if (status.cleanliness < 30) {
      return pick(['おしりきもちわるいの…', 'おむつ…かえて〜', 'べたべたするの…🛁']);
    }
    if (status.energy < 30) {
      return pick(['ねむい…ねんねする…💤', 'ふぁ〜…もうねむい…😪', 'だっこでねんねする〜']);
    }

    if (matchesAny(parentMessage, ['好き', 'すき', 'だいすき'])) {
      return pick([
        'ママだいすきー！！❤️❤️',
        `${babyName}もママすき〜！❤️`,
        'だいすきぎゅー！❤️',
      ]);
    }
    if (matchesAny(parentMessage, ['おやすみ', 'ねんね', 'ねよう'])) {
      return pick(['おやすみなさい…すぅ…💤', 'ねんねする〜💤', 'ママといっしょにねんね〜']);
    }
    if (matchesAny(parentMessage, ['おはよう', 'おきた'])) {
      return pick(['おはよー！☀️', 'おきたー！', 'ママおはよ〜😊']);
    }
    if (matchesAny(parentMessage, ['ありがとう', 'ありがと'])) {
      return pick(['どういたしまして♪', 'えへへ😊', 'うん！']);
    }
    if (matchesAny(parentMessage, ['ごめん', 'ごめんね'])) {
      return pick(['いいよ〜！', 'うん、だいじょぶ！', 'ぎゅーして♪']);
    }
    if (matchesAny(parentMessage, ['かわいい', '可愛い'])) {
      return pick(['えへへ〜♪', 'ママもかわいい！', 'うふふっ😊']);
    }
    if (matchesAny(parentMessage, ['すごい', 'えらい', 'じょうず'])) {
      return pick(['えへん！😤', 'ほめられた〜♪', `${babyName}がんばったの！`]);
    }
    if (matchesAny(parentMessage, ['だっこ', 'ぎゅー'])) {
      return pick(['だっこ〜！❤️', 'ぎゅーっ♪', 'ママ、だっこして〜！']);
    }
    if (matchesAny(parentMessage, ['なに', '何してる'])) {
      return pick(['あそんでるの！', 'おえかきしてるの〜🎨', 'ママみてた〜']);
    }
    if (matchesAny(parentMessage, ['だめ', 'やめて'])) {
      return pick(['やだー！😢', 'うん…わかった…', 'ごめんなさい…']);
    }

    if (status.mood > 70) {
      return pick([
        'ママ、あそぼ！😊',
        'ねぇねぇ！みてみて！',
        `${babyName}ね、きょうたのしい！`,
        'ぎゅーして！❤️',
        'ママのこと、だーいすき♪',
        'おそとでたい〜！🌸',
        'ちょうちょいたよ！🦋',
        'ねぇねぇ、おうたうたって〜🎵',
        'えほんよんで〜📖',
        `${babyName}、おっきくなったの！`,
      ]);
    }

    return pick([
      'うん！', 'えへへ', 'なぁに？', 'ママー！',
      'そうなの〜', 'わかった！', 'ふーん', 'あのね…',
      'うんうん♪', 'いや〜ん', 'ねぇねぇ',
    ]);
  }

  // 園児: 簡単な文
  if (stage === 'preschooler') {
    if (isSick) {
      return pick(['ママ…しんどい…おくすりのむ…😢', 'ねつでちゃった…びょういんいく？😷', 'おなかいたくてうごけない…😢']);
    }
    if (isCrying) {
      return pick(['うわぁーん！ママのばかぁ！😭', 'やだやだやだ〜！😭', 'もうママなんかしらない〜！😭']);
    }
    if (status.hunger < 30) {
      return pick(['おなかぺこぺこだよ〜！ごはんまだ？🍚', 'おやつたべたい〜！🍪', 'ぺこぺこ〜おなかぐぅーってなってる！']);
    }
    if (status.cleanliness < 30) {
      return pick(['おふろはいりたいな〜🛁', 'あせかいちゃった〜😓', 'きょうどろんこあそびしたの！🧼']);
    }
    if (status.energy < 30) {
      return pick(['ねむくなってきた…😪', 'もうねる〜💤', 'おひるねしたい…']);
    }

    if (matchesAny(parentMessage, ['好き', 'すき', 'だいすき'])) {
      return pick([
        `えへへ、${babyName}もママのこと世界一すき！❤️`,
        'うふふ〜だいすき❤️ぎゅ〜！',
        'ママのことだーいすき！😊',
      ]);
    }
    if (matchesAny(parentMessage, ['がんばれ', '頑張', 'ファイト'])) {
      return pick(['うん！がんばる！💪✨', `${babyName}ね、ぜったいやるの！`, 'えいえいおー！✊✨']);
    }
    if (matchesAny(parentMessage, ['おやすみ', 'ねよう'])) {
      return pick(['おやすみなさい！いいゆめみてね！💤✨', 'ままといっしょにねる〜！💤', 'えほんよんでからねるー📖']);
    }
    if (matchesAny(parentMessage, ['かわいい', '可愛い'])) {
      return pick(['えへへ〜ありがとう！ママもかわいいよ！😊💕', 'うふふっ♪', 'てれちゃう〜😊']);
    }
    if (matchesAny(parentMessage, ['ありがとう', 'ありがと'])) {
      return pick(['どういたしまして！😊', 'えへへ、うれしい♪', 'ママもありがとう！']);
    }
    if (matchesAny(parentMessage, ['ごめん', 'ごめんね'])) {
      return pick(['いいよ〜！なかなおり！🤝', 'うん、もうおこってないよ！😊', 'ぎゅーしよ❤️']);
    }
    if (matchesAny(parentMessage, ['おはよう', 'おきた'])) {
      return pick(['ママおはよー！☀️', 'ぐっすりねたよ〜😊', 'きょうなにしてあそぶ〜？']);
    }
    if (matchesAny(parentMessage, ['ようちえん', '幼稚園', '保育園'])) {
      return pick([
        'きょうね、おともだちとおにごっこしたの！🏃',
        'せんせいにえらいっていわれた〜✨',
        'ようちえんのごはんおいしかった〜🍱',
      ]);
    }
    if (matchesAny(parentMessage, ['すごい', 'えらい', 'じょうず'])) {
      return pick(['えへん！😤✨', `${babyName}がんばったの！`, 'もっとほめて〜♪']);
    }
    if (matchesAny(parentMessage, ['ばいばい', 'またね'])) {
      return pick(['ばいば〜い👋', 'またあとでね〜！', 'はやくかえってきてね〜🥺']);
    }
    if (matchesAny(parentMessage, ['いってらっしゃい', 'いってきます'])) {
      return pick(['いってらっしゃい〜👋', 'きをつけてね〜！', `${babyName}おるすばんできるよ！`]);
    }
    if (matchesAny(parentMessage, ['たのしい', '楽しい'])) {
      return pick(['うん！たのしい〜！😊', 'ママもいっしょでうれしい♪', 'もっとあそぼ〜！']);
    }

    if (status.mood > 70) {
      return pick([
        'ようちえんでね、おともだちできたの！😊',
        'ママ、きょうのごはんなぁに？',
        `ねぇママ！${babyName}おえかきしたの！みて！🎨`,
        'ママだいすき〜ぎゅ〜っ！❤️',
        'おさんぽいきたいな〜！🌸',
        'ママにおはなつんできたの！🌷',
        'きょうのゆめ、すごかったんだよ〜！✨',
        'おうたうたっていい？きらきらぼし〜🎵',
        'ねぇねぇ、なぞなぞしよ〜！',
        `${babyName}、おおきくなったらおまわりさんになるの！👮`,
      ]);
    }

    return pick([
      'うん！', 'なぁに？', 'そうなの！', 'わかった！',
      'ほんと〜？', 'えー！そうなんだ！', 'ふむふむ…',
      'ねぇねぇ、きいて〜', 'あのね…', 'うんうん♪',
    ]);
  }

  // 小学生: しっかりした会話
  if (stage === 'elementary') {
    if (isSick) {
      return pick(['熱がある…学校休みたい…🤒', 'ママ、頭いたい…病院いく？😷', 'のどがいがいがする…']);
    }
    if (status.hunger < 30) {
      return pick(['ママ、おなかすいた！おやつある？🍩', 'ごはんまだ〜？おなかぺこぺこ！🍚', 'なんかつまめるものない〜？']);
    }
    if (status.cleanliness < 30) {
      return pick(['お風呂入ってくる〜🛁', 'あ、今日体育あったんだ〜汗かいた😓', 'シャワーあびたい！']);
    }
    if (status.energy < 30) {
      return pick(['なんか疲れたな〜…', 'ちょっと昼寝していい？😪', '今日の宿題多くて疲れた…']);
    }
    if (status.mood < 30) {
      return pick(['今日、ちょっと嫌なことあった…😔', '友達とケンカしちゃった…', 'なんかやる気でない…']);
    }

    if (matchesAny(parentMessage, ['好き', 'すき', 'だいすき'])) {
      return pick([
        'も、もう！恥ずかしいな…でもありがとう😊❤️',
        '僕もママ大好きだよ！えへへ',
        '急にどうしたの〜？でもうれしい😊',
      ]);
    }
    if (matchesAny(parentMessage, ['がんばれ', '頑張', 'ファイト'])) {
      return pick(['ありがとう！テスト頑張るね！✏️💪', 'うん！絶対いい点とる！💯', 'ママも応援よろしくね〜！']);
    }
    if (matchesAny(parentMessage, ['おやすみ', 'ねよう'])) {
      return pick(['おやすみ！明日も楽しみだな〜💤', 'ママおやすみ〜☺️', '明日は遠足だ〜！早く寝よ💤']);
    }
    if (matchesAny(parentMessage, ['学校', 'がっこう'])) {
      return pick([
        '今日の給食おいしかったよ！友達とたくさん遊んだ！😄',
        '算数の授業ちょっと難しかった〜🧮',
        '明日体育でリレーがあるんだ！楽しみ！🏃',
        '今日、先生に褒められたよ〜✨',
      ]);
    }
    if (matchesAny(parentMessage, ['宿題', 'しゅくだい'])) {
      return pick([
        'え〜今やる〜！ちょっと待って〜📚',
        'もう終わったよ！えらいでしょ😊',
        'ママ、ここ教えて〜🙏',
      ]);
    }
    if (matchesAny(parentMessage, ['ありがとう', 'ありがと'])) {
      return pick(['こちらこそ〜😊', 'えへへ、役に立てたかな？', 'いつでも頼ってね！']);
    }
    if (matchesAny(parentMessage, ['ごめん', 'ごめんね'])) {
      return pick(['ううん、気にしてないよ！', 'だいじょうぶだよ〜😊', 'ママも疲れてたんだよね、お疲れさま']);
    }
    if (matchesAny(parentMessage, ['かわいい', '可愛い'])) {
      return pick(['え〜恥ずかしい〜😳', 'もう〜からかわないでよ〜💦', 'えへへ、ありがとう😊']);
    }
    if (matchesAny(parentMessage, ['おはよう', 'おきた'])) {
      return pick(['ママおはよう！☀️', 'ぐっすり眠れたよ〜', '今日も一日がんばる！💪']);
    }
    if (matchesAny(parentMessage, ['すごい', 'えらい', 'じょうず'])) {
      return pick(['えへん！😤', 'まだまだ頑張るよ〜！', 'ママに言われるとうれしいな😊']);
    }
    if (matchesAny(parentMessage, ['いってらっしゃい', 'いってきます'])) {
      return pick(['いってきまーす！🎒', 'はい！いってらっしゃい！', 'お仕事がんばって〜💪']);
    }
    if (matchesAny(parentMessage, ['ごはん', 'ご飯', '晩ごはん', '朝ごはん'])) {
      return pick(['ママのごはん大好き！🍳', '今日なに〜？カレーがいいな〜🍛', 'おなかすいた〜！']);
    }
    if (matchesAny(parentMessage, ['ともだち', '友達', '友だち'])) {
      return pick(['今日も楽しく遊んだよ！', 'いっぱいいるから安心して〜😊', 'みんないいやつなんだ！']);
    }
    if (matchesAny(parentMessage, ['ゲーム', 'げーむ'])) {
      return pick(['え〜もうちょっとだけ〜！🎮', '今クリア目前なの！', 'ママも一緒にやろう！']);
    }
    if (matchesAny(parentMessage, ['テスト', 'てすと'])) {
      return pick(['今度こそ100点とる！💯', 'え〜やだな〜…でもがんばる！', '勉強やらなきゃ…📚']);
    }

    if (status.mood > 70) {
      return pick([
        'ママ、聞いて聞いて！今日ね…😊',
        'テストで100点とったよ！褒めて！💯',
        `ママ、${babyName}大きくなったでしょ？`,
        'いつもありがとう、ママ❤️',
        '将来の夢ができたんだ！✨',
        'ママの作るごはん、世界一おいしい！🍳',
        '今日の空きれいだね〜！☁️',
        'ねえ、休みの日どこか行こうよ〜！',
        'クラスで絵が一番だったよ〜！🎨',
        '新しい本買って〜！📖',
      ]);
    }

    return pick([
      'うん！', 'わかった〜', 'そうだね！', 'え、なに？',
      'ふーん…', 'なるほど〜', 'そうなんだ！', 'へぇ〜',
      'まぁね〜', 'うんうん',
    ]);
  }

  // 中学生: 思春期
  if (stage === 'middleSchool') {
    if (isSick) {
      return pick(['大丈夫…寝てれば治るから…', '…薬くれる？🥺', '病院…一緒に来てほしい…（小声）']);
    }
    if (status.mood < 30) {
      return pick(['別に…ほっといてよ…', '…今話したくない', '…なんでもないってば', 'うざい…😤']);
    }
    if (status.hunger < 30) {
      return pick(['…おなか空いた', 'ママ、なんか食べるものある？', '…夜食作ってほしい…']);
    }
    if (status.energy < 30) {
      return pick(['眠い…もう寝ていい？😪', '部活つかれた…', '今日はもう無理…']);
    }

    if (matchesAny(parentMessage, ['好き', 'すき', 'だいすき'])) {
      return pick([
        '…ありがと。…ママも好きだよ（小声）😊',
        '…急に何？でもまあ、うん。',
        'べ、別に照れてないし…😳',
      ]);
    }
    if (matchesAny(parentMessage, ['がんばれ', '頑張', 'ファイト'])) {
      return pick(['わかってるって。…ありがとね✨', 'うん、やるよ。', '…そう言われると力出るかも😊']);
    }
    if (matchesAny(parentMessage, ['おやすみ', 'ねよう'])) {
      return pick(['おやすみ。…ママも早く寝なよ', '…うん、おやすみ💤', 'もうちょっとしたら寝る']);
    }
    if (matchesAny(parentMessage, ['ごはん', 'ご飯'])) {
      return pick([
        '今日のごはん何？…ママの唐揚げがいいな',
        'なんでもいい。…嘘、カレーがいい🍛',
        '…お腹すいた。何かある？',
      ]);
    }
    if (matchesAny(parentMessage, ['かわいい', '可愛い'])) {
      return pick(['もう子供じゃないんだけど！…でも、ありがと😊', '…やめてよ恥ずかしい😳', 'うるさい…（でも嬉しい）']);
    }
    if (matchesAny(parentMessage, ['ありがとう', 'ありがと'])) {
      return pick(['…どういたしまして', '別に、当たり前のことだし', '…うん']);
    }
    if (matchesAny(parentMessage, ['ごめん', 'ごめんね'])) {
      return pick(['…いいよ、気にしてない', '…うん、もう大丈夫', '…こっちこそごめん']);
    }
    if (matchesAny(parentMessage, ['おはよう', 'おきた'])) {
      return pick(['…おはよ', 'ん、おはよう', '…もうそんな時間？']);
    }
    if (matchesAny(parentMessage, ['学校', 'がっこう'])) {
      return pick(['まあ、普通かな。', '今日はちょっと楽しかった…かも', 'テスト近いんだよね…😓']);
    }
    if (matchesAny(parentMessage, ['部活', 'ぶかつ'])) {
      return pick(['今日もハードだった〜😮‍💨', '先輩にちょっと褒められた✨', '今度試合あるんだ。応援きて…ほしいかも']);
    }
    if (matchesAny(parentMessage, ['テスト', 'てすと', '勉強'])) {
      return pick(['…うるさいな、わかってるよ', '今やろうと思ってたとこ！', 'ちゃんとやってるから大丈夫']);
    }
    if (matchesAny(parentMessage, ['スマホ', 'ゲーム'])) {
      return pick(['あとちょっとだから〜！', '友達と連絡中なんだよ…', 'え〜もう少しだけ！']);
    }
    if (matchesAny(parentMessage, ['友達', 'ともだち'])) {
      return pick(['うん、まあいる。', '最近仲いい子できたよ😊', '…意外と気が合うやつがいてさ']);
    }
    if (matchesAny(parentMessage, ['すごい', 'えらい', '偉い'])) {
      return pick(['…そう？まあ、普通だよ', 'ふふん😤', '…そんなこと言われるの慣れてない💦']);
    }
    if (matchesAny(parentMessage, ['いってらっしゃい', 'いってきます'])) {
      return pick(['…いってきます', 'うん、いってらっしゃい', '帰りに寄り道するかも']);
    }
    if (matchesAny(parentMessage, ['将来', 'しょうらい', '夢'])) {
      return pick(['まだ決めてない…けど考えてる', '…ちょっとやりたいこと見つかった', '…あとで話すよ']);
    }
    if (matchesAny(parentMessage, ['元気', 'げんき', 'だいじょうぶ', '大丈夫'])) {
      return pick(['うん、大丈夫', '…心配しないで', 'まあ、なんとかなってる']);
    }

    if (status.mood > 70) {
      return pick([
        '…今日部活で褒められた。えへ✨',
        'ママ、ちょっと相談があるんだけど…',
        `ママ、今まで育ててくれてありがとう…なんでもない！😊`,
        '友達と映画行ってもいい？…お弁当作って♪',
        'ママのこと、尊敬してるよ。…本当だって！',
        '将来はママみたいな親になりたいな…なんてね😊',
        '…今日いいことあったんだ、聞く？',
        'ママ、今日の髪型なんかいいじゃん',
        '…ハグとかしないから（ちらっ）',
        'ねえ、今度の休み一緒に出かけない…？',
      ]);
    }

    return pick([
      '…別に', 'ふーん', 'はいはい', '…うん',
      '…まあね', '別に普通', 'そうかもね', '…それで？',
      'へぇ', 'ふむ',
    ]);
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
