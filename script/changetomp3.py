import os
import shutil
from pydub import AudioSegment
import json

mp3_output_dir = "./audio_mp3"
input_dir = './110011'

# manifest = []

if not os.path.exists(mp3_output_dir):
    os.makedirs(mp3_output_dir)

if os.path.exists(input_dir):
    for wavfile in os.listdir(input_dir):
        if wavfile.endswith(".wav"):
            full_wav_path = os.path.join(input_dir, wavfile)
            print(f"Converting {full_wav_path} to mp3...")
            sound = AudioSegment.from_wav(full_wav_path)
            mono_sound = sound.set_channels(1)
            mono_sound.export(os.path.join(mp3_output_dir, wavfile.replace('.wav', '.mp3')), format="mp3", codec="libmp3lame", bitrate="64k", parameters=["-ar", "48000"])
            # manifest.append(wavfile.split('.wav')[0])

# manifest_data = json.dumps(manifest, indent=4, ensure_ascii=False)
# open(os.path.join(mp3_output_dir,'manifest.json'), "w", encoding='utf8').write(manifest_data)