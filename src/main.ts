
/* 
// Pixi Assets + Pixi Sound 版本

import { Assets } from 'pixi.js';
import { sound } from '@pixi/sound';
import './PixiAssetsLoader';

const audioBundle = await Assets.load({ alias: 'audio_bundle', src: './audio_bundle.cpk', parser: 'wds-voice-loader' });
console.log('音訊包已載入', audioBundle);

const button = document.createElement('button');
button.textContent = '播放音效';
button.addEventListener('click', () => {
  console.log('播放音效');
  sound.play('1100110010');
});
document.body.appendChild(button);

*/

//-----------------------------------------------

/*
// Pixi Sound 版本
import { PixiSoundLoader } from './PixiSoundLoader';

const audioManager = new PixiSoundLoader();
await audioManager.loadSinglePack('audio_bundle.cpk', 'audio/mpeg')

const button = document.createElement('button');
button.textContent = '播放音效';
button.addEventListener('click', () => {
  console.log('播放音效');
  audioManager.play('1100110010');
});
document.body.appendChild(button);
*/

//-----------------------------------------------

// Vanilla 版本 (HTMLAudioElement)
import { HTMLAudioPackLoader } from './VanillaLoader';
const audioManager = new HTMLAudioPackLoader();
await audioManager.loadPack('audio_bundle.cpk', 'audio/mpeg');

const button = document.createElement('button');
button.textContent = '播放音效';
button.addEventListener('click', () => {
  console.log('播放音效');
  audioManager.play('1100110020', { loop: false, volume: 1.0 });
});
document.body.appendChild(button);