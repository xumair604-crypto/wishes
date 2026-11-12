/* Wishora content data — edit this file to add occasions, messages and templates. */
const OCCASIONS = {
  "Birthday":       { emoji:"🎂", label:"A LITTLE CELEBRATION FOR" },
  "Love":           { emoji:"💌", label:"A NOTE FROM THE HEART" },
  "Anniversary":    { emoji:"💞", label:"CELEBRATING YOUR LOVE" },
  "Eid Mubarak":    { emoji:"🌙", label:"EID BLESSINGS FOR" },
  "Ramadan":        { emoji:"🏮", label:"RAMADAN KAREEM" },
  "Diwali":         { emoji:"🪔", label:"A FESTIVAL OF LIGHT FOR" },
  "Holi":           { emoji:"🎨", label:"A SPLASH OF COLOUR FOR" },
  "Christmas":      { emoji:"🎄", label:"SEASON'S GREETINGS" },
  "New Year":       { emoji:"🎆", label:"CHEERS TO A NEW YEAR" },
  "Festival":       { emoji:"✨", label:"SENDING YOU FESTIVE JOY" },
  "Special Moment": { emoji:"🎓", label:"CHEERS TO YOUR NEXT CHAPTER" },
  "Just Because":   { emoji:"🎁", label:"JUST A LITTLE REMINDER" },
  "Thank You":      { emoji:"🌷", label:"WITH A GRATEFUL HEART" },
  "Get Well Soon":  { emoji:"🌼", label:"SENDING WARM WISHES" }
};

const THEMES = ["violet","rose","sunshine","ocean","mint","midnight","emerald","marigold","holi"];
const STICKERS = ["✨","💖","🌸","🦋","🎈","⭐","🌙","🎉","🪔","🎨","🎆","🌷","🎁","☕","🌈","🕌"];

const DEFAULTS = {
  occasion:"Birthday", recipient:"Ayesha", sender:"Your best friend", headline:"Happy Birthday!",
  message:"You make every moment brighter. Hope your day is filled with all the happiness you bring to others!",
  signoff:"With lots of love ♡", theme:"violet", layout:"classic", background:"glow", font:"playfair",
  align:"center", headingSize:"medium", textSize:"medium", dir:"auto", stickers:["✨","💖"],
  music:"none", videoLink:"", voiceNote:"", animation:"float", reveal:"gift", eventDate:"",
  countdown:false, sparkles:true, border:true
};

/* Ready-made designs. Each one only overrides the fields it lists. */
const TEMPLATES = [
  { id:"bday-classic", name:"Birthday glow", occasion:"Birthday", headline:"Happy Birthday!", recipient:"Ayesha",
    message:"Another year of you is the best gift the world got. Hope today is as warm and bright as you are!",
    signoff:"With lots of love ♡", theme:"violet", font:"playfair", stickers:["🎈","🎉","✨"], animation:"confetti", reveal:"gift", music:"celebrate" },
  { id:"bday-fun", name:"Party mode", occasion:"Birthday", headline:"It's your day!", recipient:"Hamza",
    message:"Cake first, questions later. Have the loudest, happiest, most ridiculous birthday ever.",
    signoff:"Your partner in crime", theme:"sunshine", font:"script", stickers:["🎂","🎉","⭐"], animation:"confetti", reveal:"tap", background:"stars", music:"celebrate" },
  { id:"love-letter", name:"Love letter", occasion:"Love", headline:"Just for you", recipient:"My love",
    message:"Some days I still can't believe I get to love you. Thank you for being my favourite place in the world.",
    signoff:"Forever yours ♡", theme:"rose", font:"vibes", stickers:["💖","🌸"], animation:"hearts", reveal:"envelope", music:"romantic" },
  { id:"anniv", name:"Our story", occasion:"Anniversary", headline:"Happy Anniversary", recipient:"Us",
    message:"Every year with you feels like the best chapter yet. Here's to all the ones still to be written.",
    signoff:"All my love, always", theme:"midnight", font:"playfair", stickers:["💖","⭐","🌙"], animation:"hearts", reveal:"envelope", background:"stars", music:"romantic", layout:"minimal" },
  { id:"eid-urdu", name:"عید مبارک", occasion:"Eid Mubarak", headline:"عید مبارک", recipient:"Ammi & Abbu",
    message:"May this Eid bring peace to your heart, light to your home and endless barakah to our family. Eid Mubarak!",
    signoff:"Duaon ke saath ♡", theme:"emerald", font:"urdu", stickers:["🌙","⭐","🕌"], animation:"lanterns", reveal:"gift", background:"stars", music:"festive" },
  { id:"eid-classic", name:"Eid blessings", occasion:"Eid Mubarak", headline:"Eid Mubarak!", recipient:"Sara",
    message:"Wishing you a joyful Eid full of sweet sheer khurma, warm hugs and every blessing you've been praying for.",
    signoff:"With love and duas", theme:"emerald", font:"playfair", stickers:["🌙","✨"], animation:"lanterns", reveal:"envelope", music:"festive" },
  { id:"ramadan", name:"Ramadan Kareem", occasion:"Ramadan", headline:"Ramadan Kareem", recipient:"Dear friend",
    message:"May this blessed month fill your days with patience, your nights with peace and your heart with light.",
    signoff:"Remember me in your duas", theme:"midnight", font:"playfair", stickers:["🌙","⭐"], animation:"lanterns", reveal:"none", background:"stars", music:"soft" },
  { id:"diwali", name:"Festival of lights", occasion:"Diwali", headline:"Happy Diwali!", recipient:"Priya",
    message:"May a thousand diyas light up your home, and may this year bring you love, laughter and sweet success.",
    signoff:"Shubh Deepavali ✨", theme:"marigold", font:"playfair", stickers:["🪔","✨","🎆"], animation:"lanterns", reveal:"gift", music:"festive" },
  { id:"holi", name:"Colour splash", occasion:"Holi", headline:"Happy Holi!", recipient:"Rohan",
    message:"Bura na mano, Holi hai! Wishing you a day full of colour, gujiya and the people you love most.",
    signoff:"Rang barse 🎨", theme:"holi", font:"script", stickers:["🎨","🌈","🎉"], animation:"confetti", reveal:"tap", music:"celebrate" },
  { id:"newyear", name:"Midnight cheers", occasion:"New Year", headline:"Happy New Year!", recipient:"Everyone I love",
    message:"Thank you for being part of my year. Here's to new adventures, big dreams and more moments together.",
    signoff:"Cheers to us ✨", theme:"midnight", font:"sans", stickers:["🎆","⭐","🎉"], animation:"confetti", reveal:"tap", background:"stars", music:"celebrate" },
  { id:"christmas", name:"Cosy Christmas", occasion:"Christmas", headline:"Merry Christmas", recipient:"The Khans",
    message:"Wishing you a season of warm lights, full plates and the kind of laughter that fills the whole house.",
    signoff:"Warmest wishes", theme:"emerald", font:"vibes", stickers:["⭐","🎁"], animation:"float", reveal:"gift", music:"festive" },
  { id:"grad", name:"New chapter", occasion:"Special Moment", headline:"You did it!", recipient:"Bilal",
    message:"All those late nights paid off. So proud of you — the world isn't ready for what you'll do next.",
    signoff:"Proud of you, always", theme:"ocean", font:"sans", stickers:["⭐","🎉"], animation:"confetti", reveal:"gift", music:"celebrate" },
  { id:"thanks", name:"Grateful heart", occasion:"Thank You", headline:"Thank you", recipient:"Ms. Fatima",
    message:"You made a bigger difference than you'll ever know. Thank you for your patience, kindness and belief in me.",
    signoff:"With gratitude", theme:"mint", font:"playfair", stickers:["🌷","✨"], animation:"float", reveal:"none", layout:"minimal", music:"soft" },
  { id:"getwell", name:"Feel better", occasion:"Get Well Soon", headline:"Get well soon", recipient:"Nani",
    message:"Sending you the biggest hug, a warm cup of chai and every good wish. Rest up — we miss your smile!",
    signoff:"Lots of love and duas", theme:"sunshine", font:"script", stickers:["🌼","☕","💖"], animation:"float", reveal:"none", music:"soft" },
  { id:"justbecause", name:"Thinking of you", occasion:"Just Because", headline:"Hey, you ♡", recipient:"Zoya",
    message:"No reason. I just wanted you to know you're one of my favourite people and the world is better with you in it.",
    signoff:"Always here for you", theme:"rose", font:"script", stickers:["🌈","💖"], animation:"hearts", reveal:"tap", layout:"scrapbook", music:"soft" }
];

/* Which templates show for each occasion in the editor ("Festival" shows all festival ones). */
const TEMPLATE_GROUPS = { "Festival":["eid-classic","diwali","holi","christmas","newyear","ramadan"] };

/* Messages for the “Inspire me” button. */
const INSPIRATIONS = {
  "Birthday":[
    "Happy birthday to someone who makes ordinary days feel like celebrations. May this year give back all the joy you give everyone else.",
    "Another trip around the sun, and you're still the brightest thing in it. Have the most wonderful birthday!",
    "Wishing you cake, laughter, zero stress and every dream you whispered over the candles.",
    "Today the world celebrates you — and honestly, it should do that more often. Happy birthday!",
    "Thank you for being exactly who you are. Here's to your best year yet!"],
  "Love":[
    "You are my favourite hello and my hardest goodbye. I love you more than words can hold.",
    "In a world full of people, my heart still chooses you — every single day.",
    "You make the ordinary feel magical. Thank you for loving me the way you do.",
    "If I could give you one thing, it would be the ability to see yourself through my eyes."],
  "Anniversary":[
    "Another year of us, and I'd still choose you in every lifetime. Happy anniversary!",
    "Here's to the inside jokes, the late-night talks and the love that keeps growing. Happy anniversary, my love.",
    "Every year with you is my favourite year. Thank you for building this beautiful life with me."],
  "Eid Mubarak":[
    "May Allah fill your home with peace, your heart with joy and your life with endless blessings. Eid Mubarak!",
    "Eid Mubarak! Wishing you sweet sheer khurma, warm hugs and a heart full of gratitude.",
    "May this Eid bring you closer to everything you've been praying for. Eid Mubarak to you and your family!",
    "آپ کو اور آپ کے گھر والوں کو دل کی گہرائیوں سے عید مبارک۔ اللہ آپ کو ہمیشہ خوش رکھے۔"],
  "Ramadan":[
    "May this Ramadan bring you peace, patience and countless blessings. Ramadan Kareem!",
    "Wishing you a blessed month of reflection, kindness and light. Remember me in your duas.",
    "رمضان کریم! اللہ آپ کے روزے اور عبادتیں قبول فرمائے۔"],
  "Diwali":[
    "May the light of a thousand diyas fill your home with happiness and your year with success. Happy Diwali!",
    "Wishing you sweets, sparkle and the warmth of family this Diwali. Shubh Deepavali!",
    "May this festival of lights brighten every corner of your life. Happy Diwali to you and yours!"],
  "Holi":[
    "Bura na mano, Holi hai! Wishing you a day full of colour, laughter and gujiya.",
    "May your life be as colourful as Holi itself. Have a joyful, messy, wonderful day!",
    "Splashing you with every colour of happiness this Holi!"],
  "Christmas":[
    "Wishing you a Christmas full of warm lights, good food and the people you love most.",
    "May your holidays sparkle with joy and your new year shine with hope. Merry Christmas!"],
  "New Year":[
    "Here's to new beginnings, brave dreams and more moments together. Happy New Year!",
    "Thank you for being part of my year. May the next one be your best yet!",
    "New year, same you — and that's the best part. Cheers to an amazing year ahead!"],
  "Festival":[
    "Wishing you a festival full of light, love, laughter and sweet moments with family.",
    "May this celebration bring joy to your heart and blessings to your home."],
  "Special Moment":[
    "You worked so hard for this, and it shows. So proud of you — the best is still ahead!",
    "Congratulations on this new chapter. The world is lucky to have you in it.",
    "Big moments deserve big celebrations. Cheers to you and everything you'll do next!"],
  "Just Because":[
    "No special reason — I just wanted you to know you matter to me.",
    "Saw something today that reminded me of you and made me smile. So here's a little smile back.",
    "Just a reminder that you're doing better than you think, and you're deeply loved."],
  "Thank You":[
    "Thank you for showing up when it mattered most. I'll never forget it.",
    "Your kindness made a bigger difference than you'll ever know. Thank you, truly.",
    "Some people make life lighter just by being in it. Thank you for being one of them."],
  "Get Well Soon":[
    "Sending you a big warm hug and wishes for a speedy recovery. Rest up — we miss you!",
    "Get well soon! Take it easy, drink your chai and let us take care of you for a change.",
    "Thinking of you and praying you're back on your feet very soon."]
};
