"""Preserve the visible Makko portrait frames; no generation or remote edits."""
from pathlib import Path
from PIL import Image, ImageDraw
import urllib.request
import json
import hashlib

ROOT=Path(__file__).resolve().parents[1]
AID='fcb7b367-d01c-4702-9914-2ff81b7d1925'
RAW=ROOT/'source-art/makko-portraits-2026-09-16/arbiter-stern'
RAW.mkdir(parents=True,exist_ok=True)
frames=[];sources=[]
for n in range(6,73,6):
    name=f'1789579033336_frame_{n:03}.webp'
    url=f'https://api.makko.ai/storage/v1/object/public/animation-frames/{AID}/frames/{name}'
    path=RAW/name
    if not path.exists():urllib.request.urlretrieve(url,path)
    im=Image.open(path).convert('RGBA');frames.append(im)
    sources.append({'url':url,'raw':path.relative_to(ROOT).as_posix(),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'size':list(im.size)})
    print(n,im.size,im.getchannel('A').getbbox())

contact=Image.new('RGB',(6*200,2*225),'#18202c');pen=ImageDraw.Draw(contact)
for i,f in enumerate(frames):
    f=f.copy();f.thumbnail((196,200))
    contact.paste(f,((i%6)*200+(200-f.width)//2,(i//6)*225+20),f)
    pen.text(((i%6)*200+4,(i//6)*225+3),str(i),fill='white')
qa=ROOT/'reports/ratkin-art';qa.mkdir(exist_ok=True)
contact.save(qa/'arbiter-portrait-source.jpg',quality=94)
# One fixed head/shoulders crop across every pose; no face repaint or fake mouth.
# Frame zero listens. Selected authored mouth/blink poses form the speaking loop.
selected=[11,2,3,4,7,8,9,1]
crop=(70,0,540,470)
atlas=Image.new('RGBA',(256*len(selected),256))
for i,index in enumerate(selected):
    f=frames[index].crop(crop).resize((248,248),Image.Resampling.LANCZOS)
    atlas.paste(f,(i*256+4,4))
out=ROOT/'media/anim/dialogue_arbiter_stern.png';atlas.save(out,optimize=True)
preview=Image.new('RGB',atlas.size,'#18202c');preview.paste(atlas,(0,0),atlas)
preview.save(qa/'arbiter-portrait-runtime.jpg',quality=94)
(ROOT/'docs/arbiter-portrait-manifest.json').write_text(json.dumps({
    'source_animation':'https://www.makko.ai/studio/collection/f9872b5e-a186-43d7-9888-46cf3e575277/animation/'+AID,
    'sample_fps':4,'runtime_fps':8,'selected_source_frame_indices':selected,
    'crop':list(crop),'processing':'Fixed head/shoulders crop, uniform resize to 248px, 4px transparent margin in 256px cells; selected original mouth/blink frames, no synthesis.',
    'output':out.relative_to(ROOT).as_posix(),'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'sources':sources},indent=2)+'\n')
