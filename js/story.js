// Khet-Tak-Tor is Duy's jailer and the Ratkin Arbiter. Immediate danger is clear;
// the larger story is discovered in optional memories.
const ARBITER_NAME = 'KHET-TAK-TOR';
const STORY = {
  // Legacy preview card only. Normal first play starts directly with live dialogue.
  premise: [
    'The street is burning. Someone is calling your name.',
    'Run into the burning ratkin. Take their fire.',
    'Too much to carry? Hold VENT or SPACE.',
    'Khet-Tak-Tor says you have been here before.',
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
          yieldSub:['DISTRICT CLEARED', 'Rescue rewards banked.'] },
  riser: { rise:'FIRE WALL RISING', shed:'FIRE SHED', dead:'FIRE WALL DESTROYED' },
  study: { debut:['Khet-Tak-Tor watches where you stop.'],
           smug:['Khet-Tak-Tor checks something in his notes.','Khet-Tak-Tor was waiting at that corner.'],
           obsessed:['Khet-Tak-Tor turns back a page.','Khet-Tak-Tor crosses something out.'],
           respect:['Khet-Tak-Tor looks up from his notes.','For a moment, Khet-Tak-Tor has nothing to add.'] },
  // Short observations, not a chronological briefing. Diary chapters carry the deeper revelations.
  lore: [], // Present dialogue is now paced by witnessed events, not a lore timer.
  overload: ['MORE FIRE!', 'IT JUMPED TO YOU!', 'TOO MUCH!', 'IT PUSHED THROUGH!'],
  // First run: instructions and fragments, delivered during fully controllable action.
  intro: [
    { who:ARBITER_NAME, emotion:"stern", text:"On your feet, Duy. Take the fire off them." },
  ],
};

// Optional memories in Duy's voice. No currency reward and no progression requirement.
// Preserve chapter IDs, unlock predicates, read flags and Makko asset references across prose revisions.
const DIARY = [
  { id:"morning", title:"The Last Morning", art:"", teaser:"A Saturday morning, before the market.",
    when:()=>true, hint:"",
    pages:[
  "On my last Saturday at home, I woke to the fan clicking above my bed. It caught at the same place on every turn. I lay there listening until I remembered Cuong would be waiting downstairs. There was cold rice by the sink. I ate standing up, already in uniform, and brushed a few grains off my shirt. My room barely held the bed and hotplate, but I still managed to lose things in it whenever I was late.",
  "I was twenty-five. I had grown up without parents and lived alone long enough to stop expecting someone to call me for breakfast. Before leaving, I checked my collar in the mirror and gave myself an encouraging wink. At least one person thought I looked ready for work. On the stairs I started assembling an excuse for Cuong. I knew he wouldn't believe it. That had never stopped me telling him one before."
] },
  { id:"walk", title:"Cuong", art:"", teaser:"Cuong was my partner. Diep was his sister.",
    when:()=>META.saved>=1, hint:"carry 1 life from the fire",
    pages:[
  "Cuong was waiting on the corner when I came out. He looked at his watch, then at me. I began my explanation before he could say anything. He let me finish and started walking toward Phu Nhuan market. We had been police partners for three years. He was quieter than me, which left me plenty of room to talk. Sometimes I could get him smiling without his noticing. That morning I was trying to do it before we reached the first stall.",
  "His sister Diep was meeting us at the market with her roommate, Mei. Diep was nineteen and already a martial arts champion. She had put me on the ground twice. I maintained that I had been demonstrating mistakes for her to avoid. There was a party that night, and Diep was bringing corn. She owed me some from a bet. I reminded Cuong that a debt was a serious matter. He kept walking, but I saw him trying not to smile."
] },
  { id:"vendor", title:"Two Bags of Spring Rolls", art:"", teaser:"Breakfast at Phu Nhuan market.",
    when:()=>META.saved>=3, hint:"carry 3 lives from the fire",
    pages:[
  "The market was already crowded when we arrived. Sellers called across the lane, and water from the stalls ran between our feet. I could smell spring rolls frying. Cuong went ahead while I stopped to buy breakfast. The auntie serving them caught me looking. I told her she looked younger than her daughter. She called me a liar and a bad policeman, but she was reaching for a second bag as she said it.",
  "I had paid for one. She handed me two and waved me along before I could thank her properly. Grease was soaking through the paper. I held the bags away from my uniform and looked for Cuong. He was across the lane with Diep. I raised both bags so they could see what I had accomplished. Cuong shook his head. Diep laughed, and I waved her over before the spring rolls got cold."
] },
  { id:"gunfire", title:"The White Shirts", art:"", teaser:"Three armed men entered the market.",
    when:()=>META.saved>=5, hint:"carry 5 lives from the fire",
    pages:[
  "Three men in white tank tops came into the market lane. I saw their hands go to their waistbands. The first shots sounded before I had my pistol out. People ducked and pushed into one another, trying to get out of the lane. Miss Hue, our neighbor, was beside the fish stall. I knew her voice well enough to pick it out in a crowd. Now she was on the ground among the baskets. I tried to see whether she was moving, but people kept crossing in front of her.",
  "A shot caught Cuong in the shoulder and knocked him down. I moved toward him. Then pain struck my hip and my leg folded under me. I hit the stones hard, still trying to keep him in sight. I dragged myself behind a steel table and drew my pistol. From there I could fire around the edge, but I couldn't stand. The lane that had been full of people buying breakfast was full of people trying to find cover."
] },
  { id:"betrayal", title:"The Knife", art:"", teaser:"Mei was kneeling beside Diep.",
    when:()=>META.saved>=7, hint:"carry 7 lives from the fire",
    pages:[
  "Cuong was still shooting from the ground despite his wounded shoulder. Two of the gunmen fell. There had been three. I kept watching the lane for the last one, then looking back for Diep. I found her on the stones. Her roommate Mei was kneeling beside her. For a moment I thought someone had reached her in time to help. Then I saw the knife in Mei's hand. She drove it into Diep. I could see the movement clearly. I couldn't understand why she was doing it.",
  "Cuong turned toward them. He saw the knife too. He raised his pistol and shot Mei. I tried to call Diep's name from behind the table, but all I could get out was a breath."
] },
  { id:"death", title:"The Last Joke", art:"", teaser:"The last gunman was still standing.",
    when:()=>META.saved>=9, hint:"carry 9 lives from the fire",
    pages:[
  "The third gunman was moving toward the street, stepping around people who had fallen. I was still behind the steel table. My hip hurt too much to stand unaided, so I pulled myself up against its edge. I shouted at him and tried to bring my pistol around the table. He turned before I had it clear. Three shots struck me. I slid down onto the stones with the gun beside me.",
  "Cuong was calling. I wanted to answer so he would know where I was, but I couldn't draw enough air. The ground felt cool against my cheek. I thought of Diep and the corn she owed me. There was still a joke to make. I started trying to say it, sure I could get the words out if I took one more breath. I never finished."
] },
  { id:"void", title:"The Waiting Room", art:"", teaser:"After the market, I woke somewhere else.",
    when:()=>META.saved>=12, hint:"carry 12 lives from the fire",
    pages:[
  "I woke on a marble floor and immediately reached for my hip. I had been shot there. I remembered falling. Under my clean shirt, though, the skin was whole. I pressed it with my fingers, expecting the pain to return. Cuong and Diep were there, and Miss Hue. I looked at each of them for the wounds I had seen in the market. I couldn't find them. I wanted to ask Cuong what had happened after I fell, but I was afraid to hear the answer.",
  "Mei stood apart from us. Her hands were empty. Seeing her beside Diep again made me look for the knife, even though I had watched Cuong shoot her. A line of people stretched through the room into the distance. It advanced a few steps, stopped, and waited. Nobody around us seemed surprised by any of this. I kept looking between my friends and the line, trying to work out where we had been brought."
] },
  { id:"gods", title:"The Job Offer", art:"", teaser:"The people waiting with us had died too.",
    when:()=>META.saved>=15, hint:"carry 15 lives from the fire",
    pages:[
  "A man in a cowboy hat came over and introduced himself as Adonai. He said he was a god. Beside him stood a man with one eye whom he called Odin. Cuong watched them while I tried to decide whether Adonai was serious. He told us we had died. There was another world, he said, and its people needed champions. He was offering us a life there if we agreed to go. Behind him, the waiting line moved forward again.",
  "Before we left, Mei told us why she had betrayed us. The gunmen had taken her brother. She had helped them because they were holding him, and stabbing Diep had been part of what they demanded. Diep had to listen to her roommate explain that. I watched her face while Mei spoke. Now I knew why Mei had held the knife, but I could still see her bringing it down. Nobody told her it was all right.",
  "Then Miss Hue's body changed. Her back straightened and the years disappeared from her face until a young woman stood before us. I recognized the way she looked at people. Even with that face, she was unmistakably our neighbor. We accepted the offer. I wanted another chance to be alive with these people, even after everything that had happened between us. Adonai had named a destination. None of us had seen it."
] },
  { id:"cell", title:"The Dark Cell", art:"", teaser:"We thought the people running toward us were attacking.",
    when:()=>META.saved>=18, hint:"carry 18 lives from the fire",
    pages:[
  "After accepting the gods' offer, Cuong and I found ourselves in a dark cell. I could hear him close beside me. There were other sounds too: many small feet moving quickly over stone, coming toward us. We still had our pistols. I drew mine when the footsteps came close. Cuong drew his. We fired into the darkness, afraid of what was rushing us. Each shot lit the room for an instant. We kept firing until the movement stopped.",
  "When there was enough light to see, I found the open doorway behind us. The people we had shot lay along the route toward it. They had been trying to get out of the cell. We had been standing in their way. There were nineteen ratkin on the floor. I searched for weapons beside their hands. I didn't find any. In the darkness I had heard people running and decided they were coming to hurt us.",
  "I knelt beside them. Cuong took my arm, trying to get me up. I kept looking at the doorway. It had been close enough for them to reach if we had let them pass."
] },
  { id:"debt", title:"The Debt", art:"", teaser:"The System recorded what we had done.",
    when:()=>META.saved>=21, hint:"carry 21 lives from the fire",
    pages:[
  "We were still in the cell when writing appeared in the air. It recorded the ratkin we had killed and assigned a debt. I read it while their bodies lay on the floor beneath it. Cuong's account showed nineteen lives owed. There was a separate balance of five against my name. The System had recorded both of us. I looked at Cuong, but he had no answer for me.",
  "The ruling said that preserving a life at personal risk could earn credit against a debt. That was something a person could do. I tried to think past the room we were standing in, toward someone who might still need help. I put my pistol away. It took two attempts to find the holster. Cuong was waiting for me to move, and the doorway was still open. I got up and went with him."
] },
  { id:"gate", title:"The Gate", art:"duy_gate", teaser:"The gate held the Warden. Then it began to lift.",
    when:()=>META.saved>=24, hint:"carry 24 lives from the fire",
    pages:[
  "We were trying to escape the prison when the Warden caught up with us. It was huge, filling the passage behind the party. We brought an iron gate down on it and pinned it long enough to start getting away. Then the Warden began to lift the gate. I saw the iron rising and looked toward my friends. They were still getting clear. If it freed itself now, it would be after them again.",
  "I went back under the gate to hold it. The weight pressed into me. I could see the others moving away, and I kept watching until I found Diep among them. She looked back. I grinned at her and shouted that she still owed me corn. She heard it this time. I had managed to finish the joke. The gate shifted and the weight came down. I lost sight of her. The next breath I remember taking was full of smoke, in a street where ratkin were burning."
] },
  { id:"fire", title:"The Town on Fire", art:"duy_save", teaser:"The fire left them. The pain stayed with me.",
    when:()=>META.saved>=27, hint:"carry 27 lives from the fire",
    pages:[
  "The last thing I remembered was holding an iron gate while my friends escaped. I had stayed behind to stop the jailer following them. Then the weight came down, and I died. Now I was lying in a street, coughing on smoke. I pushed myself up and looked for Cuong and Diep. Neither of them was there. Houses were burning on both sides of the street, and small figures were running between them. Through the smoke I could make out their ears and tails. Ratkin.",
  "One of them staggered toward me with fire climbing their back. I reached out to help. The flames left their clothes and swept up my arm. Pain shot through it, sharp enough that I cried out and tried to pull away. The heat was already spreading into my chest. The ratkin stopped screaming. Their shoulders relaxed, and light gathered around them. I watched their feet lift off the stones. They rose through the smoke and disappeared into the light. I stood clutching my arm. The flames were gone from them, but I could still feel the burning inside me.",
  "“Duy. Get the next one.” I turned toward the voice. “What happened? Where are the others?” “Khet-Tak-Tor. Your jailer.” Someone screamed farther down the street. I looked toward the sound, then back toward him. “These people are suffering,” he said. “You're here to help them.” “I died.” “You did. You'll die here too. And you'll come back. Keep moving.”",
  "I wanted to stay and make him explain. Instead I ran toward the scream. There was another ratkin trying to put out the fire on their clothes. This time I knew what reaching for them would do. I reached for them. Fresh heat poured into the places that already hurt. My knees buckled, and I had to fight to stay upright. The second ratkin rose into the light while I stood below, trying to catch my breath.",
  "The first rescue had hurt. The second left me shaking. Taking more fire meant adding to the heat I was still carrying; the pain grew with it. Farther down the street, another ratkin was burning. I started toward them, afraid of what the next touch would feel like. I still didn't know where my friends were, or why I had been brought here. But I could get the fire off these people. For the moment, that gave me something to do."
] },
  { id:"misses", title:"The Ones I Drop", art:"wraith", teaser:"A rescue can become a different kind of danger.",
    when:()=>((META.flags&&META.flags.sawWraith)||META.saved>=30), hint:"let a rescue burn to a wraith",
    pages:[
  "In the burning streets, I can't always reach everyone. Sometimes I see a ratkin fall while I'm still trying to get through the crowd. I keep moving toward them, hoping there is time. If I reach the cinder they leave while I am carrying fire, I can still help. I have seen one rise into the light afterward. I look for them among the things the fires leave behind.",
  "But sometimes the shape on the ground changes before I get there. It begins to move on its own, black along the limbs and bright in the cracks. Then it comes toward me, and I have to get out of its way. Now I watch the ground as well as the people running. When I see someone fall, I have a little time to decide how to reach them. Hesitating can use all of it."
] },
  { id:"keith", title:"Khet-Tak-Tor", art:"", teaser:"The Ratkin Arbiter watches how I move.",
    when:()=>((META.flags&&META.flags.reachedDuel)||META.saved>=34), hint:"face the Arbiter in a duel",
    pages:[
  "Khet-Tak-Tor finds me whenever I return to the streets. He calls me by name and tells me to keep moving. He is the jailer here, and an Arbiter among the ratkin. I have stopped expecting him to let me catch my breath before the fires start. He watches where I go. After I stopped at the same corner too often, he was waiting for me there. I changed my route. The next time I passed, I saw him checking his notes.",
  "I can force him to give ground. When that happens, I want it to mean I've earned a way out. But he is still there when I return, watching for the next place I will stop. He has told me who decides whether I leave: the ratkin. I can get through one of his attacks and still owe them help. Knowing that changes what I am trying to accomplish when I go back into the street."
] },
  { id:"home", title:"The Door", art:"", teaser:"I want to see my friends again.",
    when:()=>(((META.district||1)>=5)||META.saved>=40), hint:"reach the Arbiter's district",
    pages:[
  "Sometimes I think about what I would say if I found Cuong and Diep waiting for me. I would ask whether they got clear of the prison. Then I would probably say something foolish because I couldn't bear to stand there saying nothing. I wonder about Miss Hue too, with her new face and the same fierce expression. And Mei. The things she told us in the waiting room have stayed with me. I still don't know what I would say to her.",
  "Khet-Tak-Tor says the ratkin decide when I am released. Helping them escape the flames is part of what I owe. They have also lost homes and the work and ordinary routines that made this a town. I have to help them rebuild their society and earn their favor. I want that work to end with a way back to life. I want to see my friends. But I cannot decide for the ratkin that I have done enough. For now, when I return to the street, there is usually someone calling for help."
] },

];
function diaryUnlocked(e){ try{ return !!e.when(); }catch(_){ return false; } }
function diaryIsRead(id){ return META.diary && META.diary.read && META.diary.read.indexOf(id)>=0; }
function diaryMarkRead(id){ if(!META.diary) META.diary={read:[]}; if(!META.diary.read) META.diary.read=[];
  if(META.diary.read.indexOf(id)<0){ META.diary.read.push(id); saveMeta(); } }
function diaryFreshCount(){ return DIARY.filter(e=>diaryUnlocked(e) && !diaryIsRead(e.id)).length; }

const INTRO = { WALK: 205, CHAR: 0.028, HOLD: 1.5, START_Y: 0.90, IGNITE_Y: 0.5 };
const INTRO_VERSION = 5;   // bump to replay the intro once for everyone after an intro change


// Present-tense exchanges: witnessed events first, explanations on later returns.
// No past-life revelations here. New art must come from Makko; see docs/DIALOGUE.md.
const PRESENT = {
  rescue:[
    {who:'DUY',emotion:'pain',text:'The fire went into me. It hurts!'},
    {who:ARBITER_NAME,emotion:'stern',text:"Look. They're free of it. Get the next one."}],
  heat:[
    {who:'DUY',emotion:'pain',text:"Every one hurts more. I can barely hold it."},
    {who:ARBITER_NAME,emotion:'stern',text:'Let some heat out. Watch what comes out with it.'}],
  vent:[
    {who:'DUY',emotion:'startled',text:'That thing came out of me?'},
    {who:ARBITER_NAME,emotion:'dry',text:'You let the heat loose. Now deal with it.'}],
  return:[
    {who:'DUY',emotion:'startled',text:'I died. How am I here?'},
    {who:ARBITER_NAME,emotion:'stern',text:"You'll come back every time. They're still burning."}],
  jailer:[
    {who:'DUY',emotion:'questioning',text:'What do you want from me?'},
    {who:ARBITER_NAME,emotion:'stern',text:"I'm your jailer and their Arbiter. Help the ratkin. That's your punishment."}],
  release:[
    {who:'DUY',emotion:'questioning',text:'If I get past you, can I leave?'},
    {who:ARBITER_NAME,emotion:'stern',text:"I keep you here. The ratkin decide when you've done enough."}],
  rebuild:[
    {who:'DUY',emotion:'concerned',text:'Their homes are gone. What do they have to go back to?'},
    {who:ARBITER_NAME,emotion:'stern',text:"That's part of what you owe them. Help them rebuild."}]
};
const JUDGMENT_LINES=[
  {who:ARBITER_NAME,emotion:'stern',text:'Five quarters stand. Nineteen spirits rose. Food and salvage move through homes you raised. The ratkin have seen it.'},
  {who:'DUY',emotion:'questioning',text:'Then I paid the debt. Let me go.'},
  {who:ARBITER_NAME,emotion:'stern',text:'You rebuilt enough for them to live. Release requires their favor. From this moment, the ratkin will weigh what you do with the life you restored.'}
];
let presentDialogue=null, presentGap=0, presentCount=0, presentTaunts=0, presentEvents={};
let dialogueHistoryPage=0;
function dialogueSave(){
  const d=META.dialogue;
  if(!d || typeof d!=='object' || Array.isArray(d)) META.dialogue={};
  const out=META.dialogue;
  out.seen=Array.isArray(out.seen)?out.seen.filter(x=>typeof x==='string').slice(-32):[];
  out.history=Array.isArray(out.history)?out.history.filter(x=>x && typeof x.text==='string' && ['DUY','KEITH',ARBITER_NAME].includes(x.who)).map(x=>x.who==='KEITH'?{...x,who:ARBITER_NAME}:x).slice(-100):[];
  return out;
}
function rememberDialogue(line){
  const d=dialogueSave();
  // Keep one copy of each delivered line, with the latest at the end.
  d.history=d.history.filter(x=>x.text!==line.text || x.who!==line.who);
  d.history.push({who:line.who,text:line.text,emotion:line.emotion||'stern'});
  d.history=d.history.slice(-100);saveMeta();
}
function resetPresentDialogue(){
  presentDialogue=null;presentGap=0;presentCount=0;presentTaunts=0;presentEvents={};
}
function notePresentEvent(id){presentEvents[id]=elapsed;}
function presentSeen(id){return dialogueSave().seen.includes(id);}
function startPresentDialogue(id){
  if(!PRESENT[id] || presentSeen(id) || presentDialogue || intro) return false;
  presentDialogue={id,lines:PRESENT[id],i:0,t:0,recorded:false};presentCount++;return true;
}
function speakArbiter(text,emotion='dry'){
  // Combat never queues speech behind an exchange or restarts a line already being read.
  if(mode!=='play' || onTitle || intro || presentDialogue || presentGap>0 || presentTaunts>=1 || elapsed<12) return;
  presentDialogue={id:null,lines:[{who:ARBITER_NAME,emotion,text}],i:0,t:0,recorded:false};presentTaunts++;
}
function tickPresentDialogue(dt){
  if(mode!=='play' || onTitle) return;
  if(intro) return;
  if(presentDialogue){
    const d=presentDialogue,line=d.lines[d.i];d.t+=dt;
    if(!d.recorded && d.t>=line.text.length*INTRO.CHAR){rememberDialogue(line);d.recorded=true;}
    const duration=line.text.length*INTRO.CHAR+Math.max(2.6,line.text.length*0.045);
    if(d.t>=duration){
      d.i++;d.t=0;d.recorded=false;
      if(d.i>=d.lines.length){
        if(d.id){const saved=dialogueSave();if(!saved.seen.includes(d.id))saved.seen.push(d.id);saveMeta();}
        presentDialogue=null;presentGap=16;
      }
    }
    return;
  }
  presentGap=Math.max(0,presentGap-dt);
  if(presentGap>0 || presentCount>=2 || duelActive) return;
  const fresh=id=>presentEvents[id]!==undefined && elapsed-presentEvents[id]<6;
  if(fresh('rescue') && !presentSeen('rescue')){startPresentDialogue('rescue');return;}
  if(player.heat>=3 && presentSeen('rescue') && !presentSeen('heat')){startPresentDialogue('heat');return;}
  if(fresh('vent') && presentSeen('rescue') && !presentSeen('vent')){startPresentDialogue('vent');return;}
  // Only one return-related exchange per run, near its beginning. Missed beats can recur later.
  if(elapsed<4 || elapsed>12 || presentEvents.returnUsed) return;
  const runs=opp.runs||0,last=META.recentRuns[META.recentRuns.length-1];
  const id=last && !last.won && !presentSeen('return')?'return':
    runs>=2 && !presentSeen('jailer')?'jailer':
    runs>=4 && presentSeen('jailer') && !presentSeen('release')?'release':
    runs>=6 && presentSeen('release') && META.saved>=16 && !presentSeen('rebuild')?'rebuild':null;
  if(id){presentEvents.returnUsed=true;startPresentDialogue(id);}
}
