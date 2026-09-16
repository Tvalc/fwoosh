"""Register the verified village locomotion exports and create QA contact pages."""
from pathlib import Path
import json
import re
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
sources = json.loads((root/'tools/ratkin-village-sources.json').read_text())
rescues = json.loads((root/'tools/ratkin-rescue-sources.json').read_text())
manifest = json.loads((root/'docs/ratkin-art-manifest.json').read_text())
entries = {a['key']: a for a in manifest['assets']}
path = root/'js/media-meta.js'
text = path.read_text()
for a in manifest['assets']:
    meta = {k:a[k] for k in ('frames','fw','fh','anchorX')}
    line = 'MAKKO_ANIM.'+a['key']+'='+json.dumps(meta)+';'
    pattern = r'MAKKO_ANIM\.'+re.escape(a['key'])+r'=\{[^\n]*?\};'
    if re.search(pattern, text):
        text = re.sub(pattern, lambda _: line, text)
    else:
        text += line+'\n'
with path.open('w', newline='') as f: f.write(text.replace('\n','\r\n'))

# Literal URLs let the existing resource audit verify every registered image.
path=root/'js/media.js'
text=path.read_text()
start=text.index('for(const role of RATKIN_VILLAGERS.slice(1)){') if 'for(const role of RATKIN_VILLAGERS.slice(1)){' in text else text.index('// BEGIN VILLAGE SOURCES')
end=text.index('// Shared with the arcade cast;',start)
sprites={role:'./media/spr/'+role+'.png' for role in sources}
animations={role+'_'+action:'./media/anim/'+role+'_'+action+'.png' for role in sources for action in ('idle','walk')}
animations.update({role+'_'+action:'./media/anim/'+role+'_'+action+'.png' for role in rescues for action in ('panic','ascend')})
block='// BEGIN VILLAGE SOURCES (tools/prepare-village-runtime.py)\n'
block+='Object.assign(MAKKO_SPR_SRC, '+json.dumps(sprites,indent=2)+');\n'
block+='Object.assign(MAKKO_ANIM_SRC, '+json.dumps(animations,indent=2)+');\n'
block+='// END VILLAGE SOURCES\n'
with path.open('w',newline='') as f:f.write((text[:start]+block+text[end:]).replace('\n','\r\n'))

# Every frame, composited over dark ground, at a readable size in short pages.
keys = [role+'_'+action for role in rescues for action in ('ascend','panic')]
for page in range(0,len(keys),6):
    batch = keys[page:page+6]
    canvas = Image.new('RGB',(1440,len(batch)*144),'#18202c')
    pen = ImageDraw.Draw(canvas)
    for row,key in enumerate(batch):
        a=entries[key]; im=Image.open(root/a['output']).convert('RGBA')
        pen.text((4,row*144+2),key,fill='white')
        for i in range(a['frames']):
            f=im.crop((i*a['fw'],0,(i+1)*a['fw'],a['fh']))
            f.thumbnail((116,120))
            canvas.paste(f,(i*120+(120-f.width)//2,row*144+22+120-f.height),f)
    canvas.save(root/f'reports/ratkin-art/rescue-{page//6+1}.jpg',quality=92)
