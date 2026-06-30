# WDS 解壓後音檔合併測試方案

鑑於 [**wds-sirius/Adv-Resource**](https://github.com/wds-sirius/Adv-Resource) 解壓後的劇情音檔過多過大。
為了解決這個問題以及方便日後可以搬到R2(有機會)，故此嘗試把音檔進行封裝，透過將多個音檔與索引表去合併為單一的二進位檔案。

---

## 檔案結構

打包後的檔案採用以下的二進位結構：

| Header (4 Bytes)  | Index Table         | Binary Audio Payload     |
|-------------------|---------------------|--------------------------|
| Unsigned Int (LE) | UTF-8 String Data   | Audio Streams (.mp3/.ogg)|

1. **Header**：前 4 個位元組（小端序無號整數），記錄JSON索引表區塊的長度。
2. **Index Table**：儲存每個音效的名稱（Cue）、位元組偏移量（Offset）與大小（Length）。
3. **Binary Audio Payload**：所有音訊依 4 位元組對齊首尾拼接的原始數據。

<!-- --- -->

## 合併使用方法

### 打包方法 (Python)

大概過程 : acb -> wav -> packerInOne.py

[`packer.py`](./script/packer.py) : 會匯出一個檔以及一個JSON索引表檔案

[`packerInOne.py`](./script/packerInOne.py) : 合併成一個檔案

### 讀取方法

參考[`main.ts`](./src/main.ts)

---

## Quick Start

```shell
# Install dependencies
yarn install

# Start development server
yarn run dev

# Build for production
yarn run build
```