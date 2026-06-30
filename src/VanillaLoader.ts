export class HTMLAudioPackLoader {

    voicePlayer: HTMLAudioElement | null = null;

    indexTable: Record<string, { offset: number; length: number }> | null;
    audioBankBlob: Blob | null;
    mimeType: string;
    audioBlockStartOffset: number;
    audioMap: Map<string, any>;

    constructor() {
        this.indexTable = null;
        this.audioBankBlob = null;
        this.mimeType = 'audio/mpeg';
        this.audioBlockStartOffset = 0;
        this.audioMap = new Map();
    }

    async loadPack(url, mimeType = 'audio/mpeg') {
        this.mimeType = mimeType;

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();

        const view = new DataView(arrayBuffer);
        const jsonLength = view.getUint32(0, true); 

        const jsonUint8Array = new Uint8Array(arrayBuffer, 4, jsonLength);
        const decoder = new TextDecoder('utf-8');
        this.indexTable = JSON.parse(decoder.decode(jsonUint8Array));

        this.audioBlockStartOffset = 4 + jsonLength;

        this.audioBankBlob = new Blob([arrayBuffer]);

        for (const cueName in this.indexTable) {
            const { offset, length } = this.indexTable[cueName];

            // 絕對位置 = 音訊區塊起點 + 音訊自身的相對偏移量
            const absoluteOffset = this.audioBlockStartOffset + offset;
            
            // 切片
            const audioSegmentBlob = this.audioBankBlob.slice(absoluteOffset, absoluteOffset + length, this.mimeType);
            const blobUrl = URL.createObjectURL(audioSegmentBlob);

            this.audioMap.set(cueName, blobUrl);
        }

        console.log("完成");
    }


    // 3. 播放音效
    play(cueName, options = {} as any) {
        const { loop = false, volume = 1.0 } = options;
        this.voicePlayer = this.voicePlayer || new Audio();

        if(!this.voicePlayer.paused) {
            this.voicePlayer.pause();
            this.voicePlayer.currentTime = 0;
        }

        this.voicePlayer.src = this.audioMap.get(cueName);
        this.voicePlayer.loop = loop;
        this.voicePlayer.volume = volume;

        // this.voicePlayer.addEventListener('ended', () => {
        //    
        // });

        // 開始播放
        this.voicePlayer.play().catch(err => {
            console.warn(`音訊 [${cueName}] 播放失敗 :`, err);
        });

    }

    stop() {
        if (this.voicePlayer) {
            this.voicePlayer.pause();
        }
    }
}