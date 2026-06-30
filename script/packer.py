import os
import json

def pack_audio_files(input_folder, output_bin_path, output_json_path):
    valid_extensions = ('.ogg', '.mp3', '.wav')
    
    audio_files = [f for f in os.listdir(input_folder) if f.endswith(valid_extensions)]
    audio_files.sort() # 確保順序一致
    
    index_table = {}
    current_offset = 0
    
    with open(output_bin_path, 'wb') as bin_file:
        for file_name in audio_files:
            file_path = os.path.join(input_folder, file_name)
            
            with open(file_path, 'rb') as f:
                audio_data = f.read()
                
            data_length = len(audio_data)
            
            cue_name = os.path.splitext(file_name)[0]
            
            index_table[cue_name] = {
                "offset": current_offset,
                "length": data_length
            }
            
            bin_file.write(audio_data)
            
            current_offset += data_length
            
            padding_needed = (4 - (data_length % 4)) % 4
            if padding_needed > 0:
                bin_file.write(b'\x00' * padding_needed)
                current_offset += padding_needed

    with open(output_json_path, 'w', encoding='utf-8') as json_file:
        json.dump(index_table, json_file, indent=4, ensure_ascii=False)
        
    print(f"成功打包 {len(audio_files)} 個音檔！")
    print(f"索引檔: {output_json_path}")
    print(f"數據包: {output_bin_path}")

# 使用範例
if __name__ == "__main__":
    pack_audio_files('audio_mp3', './audio_bank.bin', './audio_index.json')