import os
import json
import struct

def pack_all_in_one(input_folder, output_package_path):
    valid_extensions = ('.ogg', '.mp3', '.m4a', '.wav')
    audio_files = [f for f in os.listdir(input_folder) if f.endswith(valid_extensions)]
    audio_files.sort()
    
    index_table = {}
    current_offset = 0
    audio_bytes_list = []
    
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
        
        audio_bytes_list.append(audio_data)
        current_offset += data_length
        
        padding_needed = (4 - (data_length % 4)) % 4
        if padding_needed > 0:
            audio_bytes_list.append(b'\x00' * padding_needed)
            current_offset += padding_needed

    json_bytes = json.dumps(index_table, ensure_ascii=False).encode('utf-8')
    json_length = len(json_bytes)
    
    with open(output_package_path, 'wb') as f:
        # I 代表 4 位元組無號整數 紀錄 JSON 長度
        f.write(struct.pack('<I', json_length)) 
        
        # 寫入 JSON 資料
        f.write(json_bytes)
        
        # 寫入所有音訊資料
        for audio_data in audio_bytes_list:
            f.write(audio_data)
            
    print(f"資產包: {output_package_path}")

if __name__ == "__main__":
    pack_all_in_one('audio_mp3', 'audio_bundle.cpk')