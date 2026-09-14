// Keith is Duy's jailer. The first run explains little; later dialogue and Duy's diary reveal the sentence.
const STORY = {
  // Legacy preview card only. Normal first play starts directly with live dialogue.
  premise: [
    'you died. then you woke in the fire.',
    'the ratkin are burning. take the fire off them.',
    'Keith calls this punishment.',
    'dying again will not end it.',
  ],
  greet: {
    debut: { big:'BACK ON YOUR FEET.', sub:['still here. so are they.', "take the fire off them."] },
    smug: [
      { big:'YOU AGAIN.',    sub:['you run to the same spot every time.', "i'm standing on it."] },
      { big:'PREDICTABLE.',  sub:['i know where you go.', "i've always known."] },
    ],
    obsessed: [
      { big:'I HAVE NOTES.', sub:['on every run.', 'you keep giving me more.'] },
      { big:"I DON'T BURN.", sub:["keeping the fire going is my job.", 'yours is getting them out.'] },
    ],
    respect: [
      { big:"I CAN'T READ YOU.", sub:['you keep changing.', 'i keep taking notes.'] },
      { big:'GO ON THEN.',        sub:["i've got nothing.", 'first time for everything.'] },
    ],
  },
  fired:  { smug:['KNEW IT.','TOO SLOW.'], obsessed:['RIGHT ON SCHEDULE.','SAME AS ALWAYS.'],
            respect:["...LET'S SEE.",'SURPRISE ME.'] },
  sniped: { smug:['PREDICTABLE.','TOLD YOU.'], obsessed:['EVERY. TIME.','I HAD IT WRITTEN DOWN.'],
            respect:['huh. still got you.','old habits. even yours.'] },
  broken: { smug:["...that's new.",'wait.'], obsessed:['STOP IMPROVING.','WHO TAUGHT YOU THAT.'],
            respect:['beautiful. again.',"didn't see that coming. good."] },
  duel:   { rise:["IT'S JUST US NOW.",'MY TURN.'],
            tag:["FINE. I'LL HOLD IT.",'GIVE IT HERE THEN.'],
            back:['NOT TODAY.','RETURN TO SENDER.'],
            yieldSub:['this street is clear.','your sentence is not.'] },
  riser:  { rise:'ONE OF YOUR WALLS IS UP.', shed:'IT SHED THE BURN.', dead:'BACK DOWN. STAY DOWN.' },
  study:  { debut:['Keith is taking notes.'],
            smug:['Keith logged this run. Keith remembers.','Keith has your number.'],
            obsessed:['Keith watched every second of that.','Keith is not okay about you.'],
            respect:["Keith isn't sure what to write anymore.",'Keith respects you. he hates that.'] },
  // Later run dialogue reveals more; the jailer does not decide release.
  lore: [
    "punishment is the easy word. keep running. you'll find the rest.",
    "they have names. start remembering them.",
    "taking the fire off is a beginning. look at what they've lost.",
    "a rescued family still needs somewhere to sleep.",
    "the embers you bring back can help rebuild this place.",
    "i keep the sentence running. the ratkin decide when you're done.",
    "you can put me down. that doesn't buy your release.",
    "clear a street. then help make it a home again.",
    "they need their society back, Duy. not a victory speech.",
    "you don't get to tell them when they've forgiven you.",
    "your partner is still carrying an account out there.",
    "what you do here can reach further than this town.",
    "keep the embers. you haven't learned everything they're for.",
    "earn their favor. they're the ones who have to live with what comes next.",
  ],
  // a hunter catching you while LIT shoves its fire onto you
  overload: ['IT PILED ON!', 'THE FIRE JUMPED TO YOU!', 'TOO MUCH FIRE!', 'IT SHOVED IT BACK!'],
  // FIRST RUN: Duy is disoriented; Keith speaks during fully controllable action.
  intro: [
    { who:'KEITH', text:"Up. You're dead, Duy. This is the part after." },
    { who:'KEITH', text:'See them burning? Run into them. Take the fire off.' },
    { who:'KEITH', text:'Ratkin. You owe them more than an apology.' },
    { who:'KEITH', text:"I'm Keith. Your jailer. Yes, this is a punishment." },
    { who:'KEITH', text:'Too much fire? Vent it. Then get back to them.' },
    { who:'KEITH', text:"You'll die here. A lot. Doesn't mean you're done." },
    { who:'KEITH', text:"Less staring at me. They're still suffering." },
  ],
};

// THE DIARY — optional lore in Duy's voice, illustrated with Makko art. Pays nothing, gates nothing.
// Each chapter unlocks off a milestone you'd hit naturally. `art` = a sprite key used as the illustration
// (bespoke scene art swaps in by the same key). Keep pages short — a diary, not a novel.
const DIARY = [
  { id:"morning", title:"The Last Morning", art:"", teaser:"A Saturday shift. Nothing special. I did not know.",
    when:()=>true, hint:"",
    pages:[ "The fan was broken. It turned halfway, gave up, and turned back. I lay there and let it lose.", "My apartment was one room. A bed, a hotplate, a window that looked at another window. Nobody else lived there. Nobody ever had.", "I was twenty-five. An orphan, a cop, and late for a Saturday shift. I ate cold rice over the sink and called it breakfast.", "I put on the uniform and winked at myself in the mirror, because someone in that room had to.", "It was an ordinary morning. I did not know it was the last one I would ever wake up alive." ] },
  { id:"walk", title:"Cuong", art:"", teaser:"My partner. The steady one. I did the talking for both of us.",
    when:()=>META.saved>=1, hint:"carry 1 life from the fire",
    pages:[ "Cuong was already on the corner. He was always already there. He looked at his watch when he saw me and said nothing about it.", "We had been partners three years. He thought before he spoke. I spoke to find out what I thought. Between us we made one sensible man.", "We were police. We carried pistols and mostly used them to point at things while we argued.", "We were walking to the Phu Nhuan market. His little sister Diep was meeting us there. Nineteen, a martial arts champion, and she had put me on the ground twice, for fun.", "She was bringing corn for a party that night, and she still owed me a bag of it from a bet three days back. I told Cuong I planned to collect. The corner of his mouth moved. That was him laughing." ] },
  { id:"vendor", title:"Two Bags of Spring Rolls", art:"", teaser:"One order, two bags. Everyone loved me. I made sure of it.",
    when:()=>META.saved>=3, hint:"carry 3 lives from the fire",
    pages:[ "The market was loud and wet and full of good smells fighting each other. I loved it there. I loved anywhere with that many people.", "There is an old auntie near the front who fries spring rolls. She pretends she cannot stand me. This is our game.", "I told her she looked younger than her own daughter. She called me a liar and a bad policeman. She handed me two bags anyway, hot and going greasy through the paper. One order, twice the rolls.", "I held them up over my head so Cuong could see across the lane. He shook his head. Diep laughed at me.", "It was a good minute. A man with too many spring rolls, waving at his friend. If you want to know who I was, it was that." ] },
  { id:"gunfire", title:"The White Shirts", art:"", teaser:"Three men, guns, no warning. The market came apart.",
    when:()=>META.saved>=5, hint:"carry 5 lives from the fire",
    pages:[ "Three men in white tank tops stepped into the lane. They pulled guns from their waistbands. They started firing into the crowd.", "There was no shout and no reason. People I had smiled at a second before dropped where they stood. The noise was enormous, and everything went quiet under it.", "Miss Hue went down. She was our neighbor, a fierce old woman afraid of nothing. She was buying fish. The bullet was not even meant for her.", "Cuong took one through the shoulder and hit the ground. Something tore open in my hip and put me down too. My leg stopped being mine.", "I dragged myself behind a steel table and got my gun up one-handed and fired back, badly. Somewhere in there the grin came off my face. I do not know where it went." ] },
  { id:"betrayal", title:"The Knife", art:"", teaser:"The knife was not there to save her.",
    when:()=>META.saved>=7, hint:"carry 7 lives from the fire",
    pages:[ "Cuong was flat on his back and still shooting. He killed two of them from the ground. My partner, the quiet one.", "I looked for Diep. I found her on the stones. Her roommate Mei was kneeling over her with a knife.", "I waited for Mei to help. She was not helping. She was pushing the knife in.", "She had sold us to the men in white. We learned the whole of it later. They had taken her brother and named her the price. She was nineteen too.", "Cuong saw it the same second I did. He shot Mei. His hand did not shake. A sound came out of me that did not sound like a person." ] },
  { id:"death", title:"The Last Joke", art:"", teaser:"The third one walked out. I stood up anyway.",
    when:()=>META.saved>=9, hint:"carry 9 lives from the fire",
    pages:[ "Two shooters were dead. One was left. He turned and walked toward the street, calm, like a man leaving a shop.", "Behind the table was the smart place to stay. I came up over it anyway, yelling, gun out. Loud to the end.", "He turned and shot me three times before I was clear of the table. My legs quit. I folded down against the steel and slid to the floor.", "It was cool against my cheek. That was nice. The market went far away, and Cuong was calling my name from somewhere.", "My last thought was a joke. Of course it was. Something about the corn Diep still owed me. I died before the punchline, twenty-five years old, on a floor that smelled like frying oil." ] },
  { id:"void", title:"The Waiting Room", art:"", teaser:"Cold marble. No wounds. A line into the dark.",
    when:()=>META.saved>=12, hint:"carry 12 lives from the fire",
    pages:[ "I woke on cold marble, flat on my back. I sat up and patted myself down. My hip was whole. My shirt was clean. No blood anywhere.", "This was a problem. I had just died. You do not forget dying.", "They were all there. Diep. Miss Hue. Cuong. I do not know how Cuong died. I went first. He was already on this side when I arrived.", "Mei was there too, off to the edge, not looking at anyone. The woman who put the knife in Diep, standing on the same floor as the rest of us.", "It was not heaven. No light, no music, no soft old man with a book. It was a gray room, and it was enormous.", "A line ran out from where we stood and into the dark. It was full of the dead, waiting their turn, and I could not see the end of it. Nobody had to tell us what it was for." ] },
  { id:"gods", title:"The Job Offer", art:"", teaser:"A tired god in a cowboy hat. Take the deal, or take the line.",
    when:()=>META.saved>=15, hint:"carry 15 lives from the fire",
    pages:[ "A man came out of the dark in a cowboy hat. He looked tired. Not sleepy. Worn all the way through. He said his name was Adonai, and that he was a god.", "He did not soften it. You are dead, he said. All of you. I am not here to judge you. I am here to offer you a job.", "Another one stood behind him. One eye, no patience, a face like weather. Odin, he was called. He offered nothing. He just watched.", "The job was a second life, on another world, as its champions. We would fight for the living there, since we could not fight for anyone here anymore.", "Mei confessed all of it out loud, in front of Diep. Her brother, the men, the price. Nobody forgave her. Nobody told her to stop, either.", "They put a hand on Miss Hue and she stood up young, sixty years falling off her, with something hard and terrible awake behind her eyes. Then we looked at the line, and we took the deal. That is not bravery. That is just not wanting to wait in that line." ] },
  { id:"cell", title:"The Dark Cell", art:"", teaser:"Something rushed us in the black. We fired.",
    when:()=>META.saved>=18, hint:"carry 18 lives from the fire",
    pages:[ "The gods dropped us into a stone cell with no light in it at all. Not dim. Black. My open eyes were useless.", "Something moved in the dark. A lot of somethings, rushing at us, fast and low and all around.", "Cuong and I still had our pistols. We were cops. We were afraid. We fired at the noise until the noise stopped.", "Then the light came up.", "Nineteen small bodies on the floor. Rat-people, the world calls them, ratkin, no bigger than children. Not a weapon on any of them.", "There was an open door behind us. They had not been coming at us. They were running past us, for the door. That is all they were doing.", "I went down on my knees in it. Cuong could not lift me. I did not want to be lifted." ] },
  { id:"debt", title:"The Debt", art:"", teaser:"The System keeps the accounts. I remember the numbers.",
    when:()=>META.saved>=21, hint:"carry 21 lives from the fire",
    pages:[ "There is a thing over that world that keeps the accounts. Cold, patient, everywhere at once. People there call it the System. It is not a person. It is more like a law that talks.", "Words came into the air in front of all of us. The System counted the bodies and made its ruling, the way a clerk stamps a form. Nineteen lives taken. Nineteen lives owed.", "Cuong's account began at nineteen. Mine carried a separate five. The System called my judgment Caedite Eos. Saving a life at personal risk could credit an account. Being sorry could not.", "Cuong holstered his gun and went quiet. He carries things by folding them small. I could not find the fold. I carried mine in both arms where everyone could see it." ] },
  { id:"gate", title:"The Gate", art:"duy_gate", teaser:"The cell was a prison. Getting out cost me.",
    when:()=>META.saved>=24, hint:"carry 24 lives from the fire",
    pages:[ "The cell was one room in a prison, and prisons have doors, and doors have guards. We ran for the way out.", "The guard was a jailer, a huge thing, more animal than man. It came after us down a tunnel with an iron gate hanging above it.", "We dropped the gate on it. Tons of old iron, straight down, pinning it to the floor. For one second we had won.", "Then the gate began to lift. The thing got its back under it and pushed, and the iron rose an inch at a time. The others were not clear yet.", "I threw myself back under and jammed my body into the gap the gate wanted. It stopped wanting it. The others ran.", "The gate came down. This time it came down on me. I was grinning. I told Diep she still owed me that corn, and she heard it. Then the gate was all there was. I thought that was the end." ] },
  { id:"fire", title:"The Town on Fire", art:"duy_save", teaser:"I woke a third time. This one is my sentence to serve.",
    when:()=>META.saved>=27, hint:"carry 27 lives from the fire",
    pages:[ "I woke a third time. I am getting good at it. I do not recommend the practice.", "The others walked through a door into that champion world. I did not. I woke here instead. The debt was all of ours. The fire is only mine. I was the one who could not put it down.", "This place is a town, and the town is on fire. Not once. Always. It burns, and it burns again, and it never turns to ash.", "It is daylight here, and that is the whole point. In the cell it was dark and I could not see their faces. Here I see every single one.", "The streets are full of ratkin. Families, neighbors, people with names I do not know yet. They are screaming and trapped in the fire. I know what it is to hear that sound and do the wrong thing.", "In the dark, I fired at people I could not see. Here I have to look. I take the fire off them. I carry what I can. Then I see the homes they have lost, and I understand that getting them out is only the beginning.", "This is their society to rebuild, not my tally to finish. They need homes and work and a future that is not another fire. So I run in. That is where you found me." ] },
  { id:"misses", title:"The Ones I Drop", art:"wraith", teaser:"The fire remembers the ones I could not reach.",
    when:()=>((META.flags&&META.flags.sawWraith)||META.saved>=30), hint:"let a rescue burn to a wraith",
    pages:[ "I do not save all of them. I am fast. I am not always fast enough. Some go down in the fire while I am still streets away with my arms full.", "They do not stay down. They get up burned, black and glowing along the seams, and they are not calling for help anymore.", "They come for me through the smoke. They know my face. They knew it for one second in a dark room, and they have not forgotten since.", "They say my name in a voice like paper catching. They do not say anything else. That is the worst part. I would take yelling. I am good at yelling.", "I do not run from them. That is the one rule I made for myself in here. I look at them first. Then I go find the next living one." ] },
  { id:"keith", title:"Keith", art:"", teaser:"Someone keeps relighting the fire behind me.",
    when:()=>((META.flags&&META.flags.reachedDuel)||META.saved>=34), hint:"face Keith in a duel",
    pages:[ "The fires should burn out. Every town runs out of things to burn. This one never does.", "There is a warden here. The System keeps him on to keep me honest. He goes by Keith, which is the least frightening name I have ever been afraid of.", "When I beat back a blaze and clear a street, Keith walks along behind me and lights it again. Every time.", "He is not cruel about it. That is the worst of it. He relights the town the way a man clocks in. Saturday was my shift once. This is his.", "I have shouted at Keith. I have thrown things at Keith. Keith relights the town. So I stopped arguing with the weather and started running faster than he can strike a match. Some days that is even true." ] },
  { id:"home", title:"The Door", art:"", teaser:"The ratkin decide when I have earned my way back.",
    when:()=>(((META.district||1)>=5)||META.saved>=40), hint:"reach Keith's House",
    pages:[ "I used to think a count would tell me when I was finished. The ratkin have to live here after I leave. They need more than a number from me.", "At the end of it there is a door. I have seen it once, far off through the smoke. It is very plain. Doors that matter usually are.", "Behind it is the other world, the real one, the one they sent the rest of us to. Cuong is there, folding things small. Diep is there, still owing me corn. Miss Hue is there, young and terrible and ours. Even Mei is there somewhere, trying to be worth the second life.", "We took nineteen lives in that dark cell. I cannot call a cleared street repayment for a civilization. I have to help rebuild what they lost, earn their favor, and hear their judgment. Keith cannot give me that.", "I was Duy. The loud one. The joker. The guy who filled the room so nobody had to sit in the quiet. I am still him. I just fill it with running now.", "If the ratkin release me, I can return to life. Until then I carry one out, set them down where it is cool, and go back. I want to see my friends again. I want these people to have a home when I do." ] },
];
function diaryUnlocked(e){ try{ return !!e.when(); }catch(_){ return false; } }
function diaryIsRead(id){ return META.diary && META.diary.read && META.diary.read.indexOf(id)>=0; }
function diaryMarkRead(id){ if(!META.diary) META.diary={read:[]}; if(!META.diary.read) META.diary.read=[];
  if(META.diary.read.indexOf(id)<0){ META.diary.read.push(id); saveMeta(); } }
function diaryFreshCount(){ return DIARY.filter(e=>diaryUnlocked(e) && !diaryIsRead(e.id)).length; }

const INTRO = { WALK: 205, CHAR: 0.028, HOLD: 1.5, START_Y: 0.90, IGNITE_Y: 0.5 };
const INTRO_VERSION = 3;   // bump to replay the intro once for everyone after an intro change
