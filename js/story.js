// Keith is Duy's jailer. Immediate danger is clear; the larger story is discovered in optional memories.
const STORY = {
  // Legacy preview card only. Normal first play starts directly with live dialogue.
  premise: [
    'The street is burning. Someone is calling your name.',
    'Run into the burning ratkin. Take their fire.',
    'Too much to carry? Hold VENT or SPACE.',
    'Keith says you have been here before.',
  ],
  greet: {
    debut: { big:'ON YOUR FEET.', sub:['there you are.', 'take the fire off them.'] },
    smug: [
      { big:'SAME TURN?', sub:['you went that way last time.', 'i was waiting.'] },
      { big:'THERE YOU ARE.', sub:['i left room for you.', 'right where you always go.'] },
    ],
    obsessed: [
      { big:'AGAIN.', sub:['you changed your route.', 'i noticed.'] },
      { big:'STILL HERE.', sub:['yes, i keep the fires going.', 'watch the street.'] },
    ],
    respect: [
      { big:'ALL RIGHT.', sub:['a different route.', "let's see it."] },
      { big:'KEEP GOING.', sub:['you made it through.', "they're still out there."] },
    ],
  },
  fired: { smug:['THAT WAY, THEN.','LATE.'], obsessed:['I KNOW THAT TURN.','THERE.'],
           respect:['KEEP MOVING.','SHOW ME.'] },
  sniped: { smug:['SAME CORNER.','SAW YOU COMING.'], obsessed:['YOU STOPPED AGAIN.','I WAS WAITING.'],
            respect:['still caught you.','watch your next step.'] },
  broken: { smug:['oh.','you got through.'], obsessed:['AGAIN?','YOU CHANGED SOMETHING.'],
            respect:['good. keep moving.','i missed that.'] },
  duel: { rise:['MY TURN.','COME THROUGH ME.'],
          tag:['GIVE IT HERE.','FELT THAT.'],
          back:['TRY AGAIN.','STILL CARRYING IT?'],
          yieldSub:['clear. catch your breath.', 'there are more streets.'] },
  riser: { rise:'THAT WALL IS MOVING.', shed:'THE FIRE CAME OFF IT.', dead:'DOWN. KEEP MOVING.' },
  study: { debut:['Keith watches where you stop.'],
           smug:['Keith checks something in his notes.','Keith was waiting at that corner.'],
           obsessed:['Keith turns back a page.','Keith crosses something out.'],
           respect:['Keith looks up from his notes.','For a moment, Keith has nothing to add.'] },
  // Short observations, not a chronological briefing. Diary chapters carry the deeper revelations.
  lore: [
    'yes, i know your name. watch the fire.',
    'they can feel it too, Duy. get them out.',
    'look where they go when you let them go.',
    'that was a home. before you saw it burning.',
    'keep the embers. take them back to town.',
    'you keep looking for someone. keep moving.',
    'the same street. yes. i know.',
    'catch your breath while you can.',
    'they still have to sleep somewhere tonight.',
    'you can be angry with me and keep running.',
    'ask them what they need, when you get back.',
    "you want a date. i don't have one for you.",
    'i keep you here. they decide when you leave.',
    'when they let you help, listen.',
  ],
  overload: ['MORE FIRE!', 'IT JUMPED TO YOU!', 'TOO MUCH!', 'IT PUSHED THROUGH!'],
  // First run: instructions and fragments, delivered during fully controllable action.
  intro: [
    { who:'KEITH', text:'Duy. Up. The fire is moving.' },
    { who:'KEITH', text:'Run into the burning ratkin. Take their fire.' },
    { who:'KEITH', text:"Yes, you died. Keep moving. They can still feel it." },
    { who:'KEITH', text:"Keith. I keep you here. You help them. That's the sentence." },
    { who:'KEITH', text:'Hold VENT or SPACE. Finish the breath you start.' },
    { who:'KEITH', text:"You'll die again. Get up again. As often as it takes." },
    { who:'KEITH', text:"Watch how much you carry. I'll still be here." },
  ],
};

// Optional memories in Duy's voice. No currency reward and no progression requirement.
// Preserve chapter IDs, unlock predicates, read flags and Makko asset references across prose revisions.
const DIARY = [
  { id:"morning", title:"The Last Morning", art:"", teaser:"I can remember the fan. The rest takes longer.",
    when:()=>true, hint:"",
    pages:[
  "The fan kept catching halfway round. Click, turn, click. I knew that sound before I could remember the room.",
  "A bed against the wall. A hotplate by the sink. Through the window, somebody else's window, still shut. I used to lie there until the fan clicked again, then give myself another minute.",
  "Saturday. I had a shift. There was cold rice in a bowl and no time to warm it. I ate standing up, trying to keep it off my uniform.",
  "I was twenty-five and had lived alone long enough to talk to the mirror. Growing up without parents leaves you a few habits. I straightened my collar and gave myself a wink.",
  "Cuong would already be waiting. I tried out an excuse on the stairs. It sounded unlikely even to me. I went with it anyway."
] },
  { id:"walk", title:"Cuong", art:"", teaser:"He was waiting on the corner.",
    when:()=>META.saved>=1, hint:"carry 1 life from the fire",
    pages:[
  "Cuong looked at his watch when he saw me. I began my excuse while I was still crossing the road. He waited until I got to the part about the fan, then started walking.",
  "Three years as partners. He knew when to let me talk. Sometimes he would wait through everything I had to say, then ask the one question I had hoped he wouldn't.",
  "We were police. That morning our pistols stayed in their holsters. We were headed to Phu Nhuan market, and I was thinking about breakfast again.",
  "His sister Diep was meeting us there. Nineteen years old, a martial arts champion, and pleased with herself for putting me on the ground twice. I had given her plenty of advice from down there.",
  "She was bringing corn for a party that night. She owed me some from a bet. I reminded Cuong that I intended to collect. He looked straight ahead, but the corner of his mouth moved."
] },
  { id:"vendor", title:"Two Bags of Spring Rolls", art:"", teaser:"The second bag was already leaking.",
    when:()=>META.saved>=3, hint:"carry 3 lives from the fire",
    pages:[
  "At the market I could hardly hear Cuong beside me. Sellers were calling across the lane. Water ran between the stalls. Somewhere close, spring rolls were coming out of the oil.",
  "The auntie at the front saw me looking. I told her she looked younger than her daughter. She called me a liar, then a bad policeman, and reached for another bag.",
  "I had ordered one. She gave me two. I tried thanking her and she waved me away before I could make a performance of it.",
  "The paper was going dark with grease. I held both bags over my head to show Cuong across the lane. He shook his head. Beside him, Diep started laughing.",
  "I can still see her face when she laughed. I try to stay with that part. The bags were hot against my fingers. I was about to call her over."
] },
  { id:"gunfire", title:"The White Shirts", art:"", teaser:"I remember the shirts before I remember the faces.",
    when:()=>META.saved>=5, hint:"carry 5 lives from the fire",
    pages:[
  "Three men came into the lane in white tank tops. Their hands went to their waistbands. By the time I understood what they were holding, the first shots had gone off.",
  "People were falling where I had been looking for a way through them. I couldn't find Cuong. Every time I turned toward a voice, another shot drowned it out.",
  "Miss Hue was beside the fish stall. Our neighbor. She had argued with nearly everyone on that street, and I had never seen her back away from anybody. She went down among the baskets.",
  "Cuong took a bullet through the shoulder. I saw him hit the ground, tried to get to him, and lost my footing. There was something wrong with my hip. My leg wouldn't take my weight.",
  "I dragged myself behind a steel table. I got my pistol out and fired around its edge with one hand. I couldn't tell where my shots were going."
] },
  { id:"betrayal", title:"The Knife", art:"", teaser:"Mei was kneeling beside her.",
    when:()=>META.saved>=7, hint:"carry 7 lives from the fire",
    pages:[
  "Cuong was still firing from the ground. Two of the men fell. I kept looking between his shoulder and the lane beyond him, trying to count how many were left.",
  "Then I found Diep. She was on the stones. Mei, her roommate, was kneeling over her. I thought she was helping. I remember being grateful for a moment.",
  "There was a knife in Mei's hand. She brought it down. I watched her arm move and kept waiting for what I was seeing to make sense.",
  "Cuong saw her. He turned his pistol toward Mei and fired. I tried to say Diep's name. I couldn't get enough air for it.",
  "I knew nothing about Mei's brother then. That came afterward, from her own mouth. In the market I could only see the knife and Cuong trying to get up."
] },
  { id:"death", title:"The Last Joke", art:"", teaser:"There was still one man standing.",
    when:()=>META.saved>=9, hint:"carry 9 lives from the fire",
    pages:[
  "The third gunman was walking toward the street. He stepped around the people on the ground. I remember how carefully he placed his feet.",
  "I had the table between us. I pushed myself up against it and shouted. My pistol caught on the edge as I tried to bring it round.",
  "He turned. Three shots. I slid down the table before I could get clear of it. My gun was somewhere beside me and I couldn't make my hand close on it.",
  "The floor felt cool against my cheek. I could hear Cuong calling, though he sounded much farther away than he should have. I wanted to tell him I was right there.",
  "Instead I thought of the corn Diep owed me. There was a joke in it. I had the beginning. I was still trying to find the rest when I couldn't hear Cuong anymore."
] },
  { id:"void", title:"The Waiting Room", art:"", teaser:"My shirt was clean.",
    when:()=>META.saved>=12, hint:"carry 12 lives from the fire",
    pages:[
  "Cold stone under my palms. I sat up too quickly and reached for my hip. My fingers found cloth, then skin. I pressed harder. I couldn't find the wound.",
  "Diep was there. I looked at her chest before I looked at her face. Cuong was there too, and Miss Hue. I wanted to ask how they had got here. I was afraid of what Cuong would say.",
  "Mei stood apart from us. Nobody was holding her. There was no knife in her hand. I kept checking.",
  "The room went farther than I could see. A line of people stretched into the dark. When it moved, everyone took a small step, then waited again.",
  "I tried to remember getting off the market floor. There was nothing between that and the stone under my hands. I looked down the line, hoping to see where it led."
] },
  { id:"gods", title:"The Job Offer", art:"", teaser:"The man in the hat had an offer.",
    when:()=>META.saved>=15, hint:"carry 15 lives from the fire",
    pages:[
  "The man who came over wore a cowboy hat. He introduced himself as Adonai and said he was a god. I looked at Cuong. Cuong was watching his hands.",
  "Adonai told us we were dead. He gave us a moment with it. Behind him stood a man with one eye, called Odin. He waited without offering us anything to make it easier.",
  "There was another world. They needed champions there. Adonai offered us another life if we went to fight for its people. I looked at Diep. She was listening to every word.",
  "Mei began to talk. The gunmen had taken her brother. She had given us up to them, and the knife had been part of their price. She said it where Diep could hear. I wanted her to stop. I wanted the rest of it.",
  "Nobody offered Mei forgiveness. We listened until she had finished. She was nineteen, the same age as Diep. I kept coming back to that and finding it helped me with nothing.",
  "A hand touched Miss Hue. Her back straightened. The years went out of her face while I watched, until a young woman stood where our neighbor had been. I recognized her expression before anything else.",
  "We accepted. I wish I could remember a better reason than the line behind us, still moving one step at a time."
] },
  { id:"cell", title:"The Dark Cell", art:"", teaser:"There was a door behind us.",
    when:()=>META.saved>=18, hint:"carry 18 lives from the fire",
    pages:[
  "The next place was so dark I held a hand in front of my eyes to check they were open. Stone underfoot. Cuong close enough that I could hear him breathe.",
  "Something was moving. Small feet, many of them, coming fast. I reached for the pistol. It was still there. I heard Cuong draw his too.",
  "We fired toward the sound. The shots lit pieces of the room too briefly for me to understand them. I kept firing until the movement stopped.",
  "When the light came, I could see an open door behind us. The bodies lay between it and the far end of the cell. They had been trying to get past us.",
  "Nineteen ratkin. Small enough that I had mistaken the first one for a child. I looked for a weapon beside each body, then looked again. There weren't any.",
  "I knelt down. Cuong took hold of my arm. I couldn't get up. Every time I looked toward the door I could see the path they had been running."
] },
  { id:"debt", title:"The Debt", art:"", teaser:"The words stayed in the air.",
    when:()=>META.saved>=21, hint:"carry 21 lives from the fire",
    pages:[
  "Writing appeared above the floor. I moved my head and it stayed where it was, bright enough to read. Nineteen lives taken. Nineteen owed.",
  "The ruling named Cuong's account: nineteen. Then mine, a separate five. Caedite Eos. I read those words more than once. Knowing the number didn't tell me what to do with my hands.",
  "The System, they called it. It could give credit for saving a life at personal risk. I could understand that much. I kept looking from the writing to the people on the floor.",
  "Cuong put his pistol away. I tried to do the same. I missed the holster the first time and had to look down to find it. When I looked up, the words were still there."
] },
  { id:"gate", title:"The Gate", art:"duy_gate", teaser:"The iron began to rise.",
    when:()=>META.saved>=24, hint:"carry 24 lives from the fire",
    pages:[
  "Beyond the cell was more prison. We ran through it looking for a way out. A jailer came after us, huge enough to fill the passage. I could hear it behind the sound of our feet.",
  "We brought an iron gate down on it. The impact went through the floor into my legs. For a moment it stayed pinned. The others were still getting clear.",
  "Then I saw space beneath the iron. The jailer was pushing it up with its back. The gap widened. I looked past it toward my friends. There wasn't time for all of them.",
  "I went back and forced myself into the gap. Iron pressed against me. I could see the others running through, one after another. I tried to keep looking at them.",
  "Diep looked back. I grinned at her and shouted that she still owed me corn. This time I got the whole thing out. She heard me.",
  "The gate shifted. I lost sight of her. There was weight everywhere, and then I was trying to draw a breath in a street full of smoke."
] },
  { id:"fire", title:"The Town on Fire", art:"duy_save", teaser:"I knew the shape of their hands.",
    when:()=>META.saved>=27, hint:"carry 27 lives from the fire",
    pages:[
  "For a moment I was still braced against the gate. Then my hands were on paving stones. I pushed up, expecting the iron to come down with me.",
  "Someone ran past, burning. I reached out before I had decided to. The fire came across to me. They stumbled clear and kept going. I stood there with it climbing my arms.",
  "Ratkin. I knew the hands, the small faces. In the cell I had only seen them properly after the light came on. Here they were moving. One of them was looking straight at me.",
  "I kept searching the smoke for Cuong. For Diep. The last I saw of them, they were getting clear. I couldn't see anyone I knew here. Keith kept calling me back to the street.",
  "The fires return. I have cleared places I recognize and found them burning again. I don't know what happens to the street while I'm gone. I know where I left people.",
  "Getting someone out leaves me with another question: where can they go? I look at the houses and try to remember what stood before the roof fell in."
] },
  { id:"misses", title:"The Ones I Drop", art:"wraith", teaser:"Sometimes the movement in the smoke comes toward me.",
    when:()=>((META.flags&&META.flags.sawWraith)||META.saved>=30), hint:"let a rescue burn to a wraith",
    pages:[
  "Sometimes I see someone fall before I can reach them. There are other people between us. I try to get through. By the time I do, the figure on the ground has stopped moving.",
  "Then it moves again. Black along the limbs, bright in the cracks. I start toward it with my hand out and realize it is coming for me.",
  "I hear my name through the smoke. I keep thinking I should recognize the voice. I can't tell whether I have heard it here before or somewhere I am trying not to remember.",
  "I used to think getting there would be enough. Now I look for a sign that there is still someone I can reach. It is hard to make myself look closely. It is worse when I don't."
] },
  { id:"keith", title:"Keith", art:"", teaser:"He looked up when I called him a jailer.",
    when:()=>((META.flags&&META.flags.reachedDuel)||META.saved>=34), hint:"face Keith in a duel",
    pages:[
  "Keith has no trouble finding me. I have come back in streets I didn't recognize and heard him before I saw him. He uses my name as if we have been introduced properly.",
  "He keeps notes. At first I thought that was for show. Then he was waiting at the corner where I always stopped. I took another route. He noticed that too.",
  "I asked him why he kept setting the fires. He told me to watch the street. There was someone burning behind me. By the time I turned back, I had lost the question I meant to ask next.",
  "The System has a use for him here. I called him a jailer and he looked up. He seemed less interested in whether I hated him than in whether I would stand still to tell him.",
  "I can make him give ground. I've seen it. I keep waiting for that to change something about the way he says my name the next time I wake up."
] },
  { id:"home", title:"The Door", art:"", teaser:"I have seen a door beyond the smoke.",
    when:()=>(((META.district||1)>=5)||META.saved>=40), hint:"reach Keith's House",
    pages:[
  "I saw a door once, far enough away that I couldn't make out the handle. I watched it until the smoke covered it again. Since then I catch myself looking in that direction while someone is calling from the other side of the street.",
  "I want Cuong there when it opens. Diep too. Miss Hue with that new face and the same expression. I even wonder where Mei has ended up. I have questions for her that I couldn't ask on the marble floor.",
  "I asked Keith how much longer. He said he couldn't release me. The ratkin would decide. I looked toward the people I had just brought out. I hadn't asked any of them anything.",
  "I owe them a place they can live in. Homes, work, the things that made this a town before I knew it as a fire. I have to help rebuild their society and earn their favor. I don't know how to ask whether they will ever trust me.",
  "If they release me, I can return to life. I think about that constantly. Then somebody needs help and I have to decide which way to run."
] },
];
function diaryUnlocked(e){ try{ return !!e.when(); }catch(_){ return false; } }
function diaryIsRead(id){ return META.diary && META.diary.read && META.diary.read.indexOf(id)>=0; }
function diaryMarkRead(id){ if(!META.diary) META.diary={read:[]}; if(!META.diary.read) META.diary.read=[];
  if(META.diary.read.indexOf(id)<0){ META.diary.read.push(id); saveMeta(); } }
function diaryFreshCount(){ return DIARY.filter(e=>diaryUnlocked(e) && !diaryIsRead(e.id)).length; }

const INTRO = { WALK: 205, CHAR: 0.028, HOLD: 1.5, START_Y: 0.90, IGNITE_Y: 0.5 };
const INTRO_VERSION = 4;   // bump to replay the intro once for everyone after an intro change
