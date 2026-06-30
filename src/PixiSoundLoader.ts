import 'pixi.js';
import { sound } from '@pixi/sound';

export class PixiSoundLoader {
  async loadSinglePack(url, mimeType = 'audio/mpeg') {
    const response = await fetch(url);
    
    const arrayBuffer = await response.arrayBuffer();

    const view = new DataView(arrayBuffer);
    const jsonLength = view.getUint32(0, true);

    const jsonUint8Array = new Uint8Array(arrayBuffer, 4, jsonLength);
    const decoder = new TextDecoder('utf-8');
    const indexTable = JSON.parse(decoder.decode(jsonUint8Array));

    const audioBlockStartOffset = 4 + jsonLength;

    const totalBlob = new Blob([arrayBuffer]);

    for (const cueName in indexTable) {
        const { offset, length } = indexTable[cueName];

        // 絕對位置 = 音訊區塊起點 + 音訊自身的相對偏移量
        const absoluteOffset = audioBlockStartOffset + offset;
        
        // 切片
        const audioSegmentBlob = totalBlob.slice(absoluteOffset, absoluteOffset + length, mimeType);
        const blobUrl = URL.createObjectURL(audioSegmentBlob);

        // 註冊
        sound.add(cueName, blobUrl);
    }

    console.log("完成");
  }

  play(cueName, options = {}) {
    if (sound.exists(cueName)) {
        sound.play(cueName, options);
    }
  }
}
