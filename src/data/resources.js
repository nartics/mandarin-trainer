// Per-chapter study & native-listening resources, taken from the class homework.
// ChinesePod episodes are native-speaker dialogues (the class's main listening source);
// Quizlet sets and the HSK Standard Course textbook lessons back up vocab + reading.
//
// Access note: ChinesePod & the Quizlet sets use the class login from the course sheet
// (ManhattanMandarin.co.uk). Episodes without a captured direct link open a title search.

const cpSearch = (title) =>
  `https://www.chinesepod.com/search?q=${encodeURIComponent(title)}`

const cp = (title, url) => ({ title, url: url || cpSearch(title) })

export const PORTAL = {
  site: 'ManhattanMandarin.co.uk',
  chinesepod: 'https://www.chinesepod.com',
  note: 'ChinesePod & Quizlet use the class login from your course sheet.',
}

export const RESOURCES = {
  1: {
    quizlet: 'https://quizlet.com/gb/731834657/hsk-11-flash-cards/',
    chinesepod: [
      cp('A Self Introduction', 'https://www.chinesepod.com/lesson/a-self-introduction'),
      cp('Student or Teacher'), cp("What's Your Name?"), cp('Where Are You From?'),
    ],
  },
  2: {
    quizlet: 'https://quizlet.com/731943214/hsk-12-flash-cards/',
    chinesepod: [
      cp('Where Are You Going in China', 'https://www.chinesepod.com/lesson/where-are-you-going-in-china/977'),
      cp("What's Your Surname?"),
    ],
  },
  3: {
    quizlet: 'https://quizlet.com/731952275/hsk-13-flash-cards/',
    chinesepod: [
      cp('What Do You Want to Eat', 'https://www.chinesepod.com/lesson/what-do-you-want-to-eat/977'),
    ],
  },
  4: {
    quizlet: 'https://quizlet.com/731958616/hsk-14-flash-cards/',
    chinesepod: [
      cp('Introducing a Friend', 'https://www.chinesepod.com/lesson/introducing-a-friend'),
    ],
  },
  5: {
    chinesepod: [
      cp('How Old Are You?'),
      cp('Haggle for a Good Deal', 'https://www.chinesepod.com/lesson/haggle-for-a-good-deal'),
      cp('I Want to Buy This One', 'https://www.chinesepod.com/lesson/i-want-to-buy-this-one'),
    ],
  },
  6: {
    chinesepod: [
      cp('Can You Speak Chinese?'), cp('What Are Your Hobbies?'), cp('Likes and Dislikes - Hobbies'),
    ],
  },
  7: {
    chinesepod: [
      cp('Talking About Dates in Chinese'), cp('When is Your Birthday?'),
      cp('很 Adjective'), cp('非常 Adjective'),
    ],
  },
  8: {
    chinesepod: [
      cp('Weekend Activities'), cp('Ordering Noodles'), cp('How Do You Take Your Coffee?'),
      cp("I'd Like an Americano Please"), cp('Wrong Change'),
    ],
  },
  9: {
    chinesepod: [
      cp('Where Do You Live?'), cp('Where Are You? How to Use 在 with Location'),
      cp("He's Not In"), cp('Where Are My Socks?'), cp("Where's the Bathroom?"),
    ],
  },
  10: {
    chinesepod: [
      cp('Important Measure Words for Food and Drink'), cp('How Much is Your Car?'), cp('Wrong Change'),
    ],
  },
  11: {
    chinesepod: [
      cp('Telling Time in Chinese'), cp('Asking the Time'), cp('What Time is It Now?'),
      cp('Time Word Tips P1: 上 and 下'), cp('Time Word Tips P2: 前 and 后'),
    ],
  },
  12: {
    chinesepod: [
      cp("How's the Weather?"), cp("I'm Hot!"), cp('Bring Your Umbrella'),
      cp('Describing the Weather'), cp('Season Preferences'),
    ],
  },
  13: {
    chinesepod: [
      cp('How to Use 了: Action Complete'), cp('啊 & 呀'), cp('在…呢 Progressive Aspect'),
    ],
  },
  14: {
    chinesepod: [
      cp('How to Use 了: Action Complete'), cp('Keys, Wallet, Phone'), cp("I'm Hot! (都)"),
    ],
  },
  15: {
    chinesepod: [
      cp('The 是…的 Pattern'), cp('Time Word Tips P2: 前 and 后'), cp('Keys, Wallet, Phone'),
    ],
  },
}

export function chapterResources(ch) {
  return RESOURCES[ch] || { chinesepod: [] }
}
