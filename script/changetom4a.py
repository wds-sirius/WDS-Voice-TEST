import os
import shutil
from pydub import AudioSegment
import json

m4a_output_dir = "./audio_m4a"
input_dir = './110011'

if not os.path.exists(m4a_output_dir):
    os.makedirs(m4a_output_dir)

if os.path.exists(input_dir):
    for wavfile in os.listdir(input_dir):
        if wavfile.endswith(".wav"):
            full_wav_path = os.path.join(input_dir, wavfile)
            print(f"Converting {full_wav_path} to m4a...")
            sound = AudioSegment.from_wav(full_wav_path)
            mono_sound = sound.set_channels(1)
            mono_sound.export(os.path.join(m4a_output_dir, wavfile.replace('.wav', '.m4a')), format="ipod", codec="aac", bitrate="64k", parameters=["-ar", "48000"])
