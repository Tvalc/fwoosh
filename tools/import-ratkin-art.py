"""Download observed Makko exports and repack their grids without repainting pixels.

Requires Pillow. Raw exports and provenance are preserved; no generation API is used.
"""
from pathlib import Path
import hashlib
import json
import urllib.request
import statistics
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'source-art' / 'makko-ratkin-2026-09-16'
RAW.mkdir(parents=True, exist_ok=True)
ENTRIES = [
    ('arbiter_cast','0928a70d-5371-41c8-a465-2fa27f1bdc67','fwoosh_ratkin_arbiter_cast',8,3),
    ('arbiter_hit','eaa91d74-9f0a-4b73-b3bb-4125bc0a7677','fwoosh_ratkin_arbiter_hit',12,4),
    ('arbiter_attack','f404c11e-8d8f-4470-a1da-14e18353db58','fwoosh_ratkin_arbiter_attack',12,4),
    ('arbiter_idle','dcc8da49-cb69-4213-aa29-453f38bb1a4d','fwoosh_ratkin_arbiter_idle',12,4),
    ('arbiter_run','11b792ec-29ea-451f-a2b2-38ecf5522323','fwoosh_ratkin_arbiter_run',12,4),
    ('ratkin_walk','113a915b-75d3-4075-a695-ba18f096816d','fwoosh_ratkin_vest_walk',12,4),
    ('ratkin_idle','ea98d941-e0e1-41fd-a97f-e642872c6f28','fwoosh_ratkin_vest_idle',12,4),
    ('mason_walk','a079eb58-80ac-450a-bc0e-2797ef1e0fcb','fwoosh_fwoosh_ratkin_mason_walk',12,4),
    ('mason_idle','6914c4f5-2a7a-4ef8-a4af-c29fe9ac99f6','fwoosh_fwoosh_ratkin_mason_idle',12,4),
    ('farmer_walk','15d9ff65-7bf6-48c9-8036-e808eb01f487','fwoosh_ratkin_farmer_walk',12,4),
    ('farmer_idle','85d8a119-c7d1-4fec-b5a8-739429311fe3','fwoosh_ratkin_farmer_idle',12,4),
    ('ratkin_run','d626cabb-b167-4a09-b942-91d331d8f8e2','fwoosh_ratkin_run',10,4),
]

# Sources observed in the FWOOSH collection, September 16. These are civilians;
# the Arbiter is deliberately not part of the village population.
village_sources = json.loads((ROOT/'tools'/'ratkin-village-sources.json').read_text())
for role, sources in village_sources.items():
    for action in ('idle', 'walk', 'run'):
        key = role+'_'+action
        if any(entry[0] == key for entry in ENTRIES):
            continue
        ENTRIES.append((key, sources[action], sources['prefix']+'_'+action,
                        sources.get(action+'Frames', 12), 4))

manifest = {'collection':'https://www.makko.ai/studio/collection/f9872b5e-a186-43d7-9888-46cf3e575277',
            'observed':'2026-09-16', 'processing':'Row-major grid to horizontal PNG; uniform downsample to 180px maximum cell dimension. No recoloring or synthesized frames. Static fallbacks preserve original resolution.', 'assets':[]}
contact = Image.new('RGB',(12*170, len(ENTRIES)*205),'#18202c')
pen = ImageDraw.Draw(contact)
for key, aid, name, count, columns in ENTRIES:
    url = f'https://api.makko.ai/storage/v1/object/public/sprite-sheets/{aid}/{name}.webp'
    path = RAW / (name+'.webp')
    if not path.exists():
        urllib.request.urlretrieve(url,path)
    im = Image.open(path).convert('RGBA')
    rows=3
    assert im.width%columns == 0 and im.height%rows == 0, (key, im.size)
    fw,fh=im.width//columns,im.height//rows
    frames=[im.crop(((i%columns)*fw,(i//columns)*fh,(i%columns+1)*fw,(i//columns+1)*fh)) for i in range(count)]
    assert all(f.getchannel('A').getbbox() for f in frames), key
    native_fw,native_fh=fw,fh
    scale=min(1,180/max(fw,fh)); fw,fh=round(fw*scale),round(fh*scale)
    runtime=[f.resize((fw,fh),Image.Resampling.LANCZOS) for f in frames]
    # Mid-body alpha center avoids putting long tails on the collision center.
    centers=[]
    for f in runtime:
        alpha=f.getchannel('A'); weights=[sum(alpha.getpixel((x,y)) for y in range(fh//4,fh*2//3)) for x in range(fw)]
        centers.append(sum(x*w for x,w in enumerate(weights))/max(1,sum(weights)))
    anchor_x=round(statistics.median(centers),2)
    atlas=Image.new('RGBA',(fw*count,fh))
    for i,f in enumerate(runtime): atlas.paste(f,(i*fw,0))
    out=ROOT/'media'/'anim'/(key+'.png')
    atlas.save(out,optimize=True)
    # Save a frame as a static fallback; the full export is preserved above.
    if key.endswith('_idle'):
        frames[0].save(ROOT/'media'/'spr'/(key.removesuffix('_idle')+'.png'),optimize=True)
    if key=='arbiter_idle':
        frames[0].crop((20,0,126,106)).save(ROOT/'media'/'spr'/'arbiter_portrait.png',optimize=True)
    entry={'key':key,'name':name,'animation_id':aid,'source_url':url,
           'animation_url':manifest['collection']+'/animation/'+aid,
           'raw':path.relative_to(ROOT).as_posix(),'raw_sha256':hashlib.sha256(path.read_bytes()).hexdigest(),
           'source_size':list(im.size),'source_columns':columns,'source_rows':rows,
           'frames':count,'fw':fw,'fh':fh,'anchorX':anchor_x,'native_cell':[native_fw,native_fh],'output':out.relative_to(ROOT).as_posix(),
           'output_sha256':hashlib.sha256(out.read_bytes()).hexdigest(),
           'fps_note':'Runtime playback is tuned separately; export preview did not specify fps.',
           'frame_alpha_bounds':[f.getchannel('A').getbbox() for f in frames]}
    manifest['assets'].append(entry)
    row=len(manifest['assets'])-1
    pen.text((4,row*205+2),key,fill='white')
    for i,f in enumerate(frames):
        preview=f.copy();preview.thumbnail((164,178),Image.Resampling.LANCZOS)
        contact.paste(preview,(i*170+(170-preview.width)//2,row*205+24+178-preview.height),preview)
    print(key, count, fw, fh, out.stat().st_size)

(ROOT/'docs'/'ratkin-art-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
qa=ROOT/'reports'/'ratkin-art';qa.mkdir(parents=True,exist_ok=True)
contact.save(qa/'source-contact.jpg',quality=92)
