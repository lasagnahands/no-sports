// Word lists and matching rules for No Sports.
// To block more things, the easiest way is the box in the popup.
// You can also add words to the lists below.
//
// How it decides:
//   - A "strong" word (a league, team, famous player, big event) is enough on its own.
//   - An "everyday" word (sports, football, golf...) is NOT enough on its own.
//     It needs backup, like a second sports word, a score, or a game word.
//   - A short label that is only a sports word (a tab or button that just says
//     "Sports" or "Baseball") is hidden too.

var NOSPORTS = (() => {
  'use strict';

  // Whole sites that get covered up completely.
  const sites = [
    'espn.com', 'espn.co.uk', 'espncricinfo.com', 'nfl.com', 'nba.com', 'mlb.com', 'nhl.com',
    'wnba.com', 'mlssoccer.com', 'ufc.com', 'wwe.com', 'formula1.com', 'nascar.com',
    'pgatour.com', 'atptour.com', 'wtatennis.com', 'fifa.com', 'uefa.com', 'premierleague.com',
    'bleacherreport.com', 'si.com', 'cbssports.com', 'foxsports.com', 'nbcsports.com',
    'sports.yahoo.com', 'theathletic.com', 'skysports.com', 'goal.com', '247sports.com',
    'on3.com', 'rivals.com', 'sbnation.com', 'deadspin.com', 'barstoolsports.com',
    'yardbarker.com', 'sportingnews.com', 'thescore.com', 'livescore.com', 'flashscore.com',
    'tsn.ca', 'sportsnet.ca', 'marca.com', 'transfermarkt.com', 'rotowire.com',
    'fantasypros.com', 'draftkings.com', 'fanduel.com', 'dazn.com', 'theringer.com',
    'talksport.com', 'sportskeeda.com', 'clutchpoints.com', 'outkick.com', 'profootballtalk.com',
    'pro-football-reference.com', 'basketball-reference.com', 'baseball-reference.com',
    'hockey-reference.com', 'sports-reference.com', 'olympics.com', 'motorsport.com'
  ];

  // The add-on only runs on these sites to start with.
  // More can be added from the popup, one site at a time.
  const defaultSites = ['x.com', 'twitter.com', 'reddit.com'];

  // STRONG words: clearly sports. One of these is enough.
  // A space also matches a dash, so "hat trick" catches "hat-trick" too.
  const strong = [
    'wnba', 'ncaa', 'cfb', 'mma', 'wwe', 'formula 1', 'formula1', 'formula one', 'motogp',
    'indycar', 'pga', 'lpga', 'wta', 'fifa', 'uefa', 'premier league', 'champions league',
    'europa league', 'la liga', 'bundesliga', 'ligue 1', 'world cup', 'super bowl',
    'superbowl', 'world series', 'stanley cup', 'march madness', 'touchdown', 'quarterback',
    'wide receiver', 'running back', 'linebacker', 'shortstop', 'outfielder', 'point guard',
    'three pointer', 'hat trick', 'goalkeeper', 'goalie', 'draft pick', 'mock draft',
    'fantasy league', 'fantasy football', 'college football', 'college basketball',
    'monday night football', 'sunday night football', 'thursday night football',
    'sportsbook', 'draftkings', 'fanduel', 'wimbledon', 'french open', 'australian open',
    'ryder cup', 'tour de france', 'wrestlemania', 'squaredcircle', 'sportscenter',
    'matchday', 'el clasico', 'hookem', 'hook em',

    // Teams with names that are hard to confuse with anything else
    'lakers', 'celtics', 'knicks', 'golden state warriors', '76ers', 'sixers', 'mavericks',
    'mavs', 'cavaliers', 'cavs', 'timberwolves', 'pacers', 'clippers', 'raptors', 'spurs',
    'miami heat', 'orlando magic', 'okc thunder', 'sacramento kings', 'phoenix suns',
    'utah jazz', 'brooklyn nets', 'chicago bulls', 'milwaukee bucks', 'houston rockets',
    'yankees', 'dodgers', 'red sox', 'white sox', 'mets', 'phillies', 'astros', 'orioles',
    'blue jays', 'padres', 'chicago cubs', 'atlanta braves', 'tampa bay rays',
    'steelers', 'packers', '49ers', 'niners', 'seahawks', 'bengals', 'broncos', 'buccaneers',
    'bucs', 'texans', 'dallas cowboys', 'new england patriots', 'kansas city chiefs',
    'philadelphia eagles', 'baltimore ravens', 'jacksonville jaguars', 'miami dolphins',
    'minnesota vikings', 'atlanta falcons', 'washington commanders', 'tennessee titans',
    'new orleans saints', 'las vegas raiders', 'buffalo bills', 'detroit lions',
    'chicago bears', 'new york giants', 'new york jets',
    'maple leafs', 'canadiens', 'bruins', 'red wings', 'blackhawks', 'oilers', 'canucks',
    'pittsburgh penguins', 'tampa bay lightning', 'florida panthers',
    'manchester united', 'man utd', 'manchester city', 'man city', 'liverpool fc',
    'arsenal fc', 'chelsea fc', 'tottenham hotspur', 'real madrid', 'fc barcelona',
    'bayern munich', 'juventus', 'psg', 'inter miami',

    // A few very famous names
    'messi', 'ronaldo', 'lebron', 'mahomes', 'tom brady', 'steph curry', 'ohtani',
    'travis kelce', 'caitlin clark', 'verstappen', 'djokovic', 'mbappe', 'haaland'
  ];

  // Strong at the start of a word ("nflmemes", "nbadiscussion").
  const strongPrefix = ['nfl', 'nba', 'mlb', 'nhl', 'ufc'];

  // Strong anywhere, even inside another word.
  const strongAnywhere = [
    'espn', 'nascar', 'fantasyfootball', 'collegefootball', 'collegebasketball'
  ];

  // EVERYDAY words: people say these in normal talk. Not enough on their own.
  const weak = [
    'sports', 'mls', 'f1', 'atp', 'boxing', 'cricket', 'rugby', 'tennis', 'golf', 'golfer',
    'lacrosse', 'halftime', 'playoff', 'postseason', 'olympics', 'olympic', 'paralympics',
    'grand prix', 'athlete', 'head coach', 'gridiron', 'the big game', 'game day', 'gameday',
    'all star game', 'final four', 'home run', 'grand slam', 'slam dunk', 'free agency',
    'free agent', 'trade deadline', 'transfer window', 'relegation'
  ];

  // Everyday words that also count inside another word ("footballers").
  const weakAnywhere = ['football', 'basketball', 'baseball', 'soccer', 'hockey', 'volleyball',
    'wrestling'];

  // Team nicknames that are also normal words. Capitalized only, and they need backup.
  const nicknames = [
    'Chiefs', 'Bills', 'Eagles', 'Cowboys', 'Ravens', 'Lions', 'Bears', 'Vikings', 'Falcons',
    'Raiders', 'Chargers', 'Dolphins', 'Jaguars', 'Panthers', 'Rams', 'Browns', 'Colts',
    'Commanders', 'Jets', 'Hawks', 'Pistons', 'Bucks', 'Bulls', 'Grizzlies', 'Pelicans',
    'Hornets', 'Wizards', 'Nuggets', 'Blazers', 'Rockets', 'Cubs', 'Braves', 'Tigers',
    'Rangers', 'Mariners', 'Guardians', 'Marlins', 'Brewers', 'Pirates', 'Rockies',
    'Diamondbacks', 'Sharks', 'Kraken', 'Avalanche', 'Hurricanes', 'Sabres', 'Islanders',
    'Flyers', 'Predators', 'Penguins', 'Gators', 'Seminoles', 'Buckeyes', 'Wolverines',
    'Crimson Tide', 'Longhorns', 'Sooners', 'Bulldogs', 'Patriots', 'Titans', 'Saints',
    'Cardinals', 'Giants', 'Warriors'
  ];

  // Game words. They only matter next to an everyday word or a nickname.
  const gameWords = [
    'beat', 'beats', 'win', 'wins', 'won', 'game', 'games', 'season', 'coach', 'vs', 'score',
    'scores', 'roster', 'injury', 'offense', 'defense', 'rookie', 'stadium', 'qb', 'fans',
    'highlights', 'matchup', 'team', 'teams', 'league', 'player', 'players', 'tournament',
    'championship', 'match'
  ];

  // Small words that can sit next to a sports word in a label
  // ("Live Sports", "Trending in Sports", "NFL News").
  const labelFiller = [
    'live', 'news', 'scores', 'score', 'and', 'the', 'today', 'tonight', 'top', 'latest',
    'more', 'all', 'trending', 'in', 'videos', 'highlights', 'college', 'pro', 'womens',
    'mens', 'fantasy', 'schedule', 'standings', 'results', 'now', 'on', 'tv', 'watch', 'us'
  ];

  // What to look at on a page.
  const selectors = [
    'shreddit-post', '.thing.link', '[data-testid="cellInnerDiv"]', 'article',
    '[role="article"]', '[data-testid="trend"]',
    'ytd-rich-item-renderer', 'ytd-video-renderer', 'ytd-compact-video-renderer',
    'ytd-grid-video-renderer', 'ytd-reel-item-renderer', 'yt-lockup-view-model',
    'ytm-shorts-lockup-view-model', 'a[href]'
  ].join(',');

  // When one of these wraps a match, hide the wrapper so no empty gap is left.
  const wrappers = '[data-testid="cellInnerDiv"], ytd-rich-item-renderer';

  // A link that matches hides its whole card, if the card is small.
  const cards = 'article, [role="article"], li, shreddit-post, .thing.link, ' +
    '[data-testid="cellInnerDiv"], ytd-rich-item-renderer, ytd-video-renderer, ' +
    'ytd-compact-video-renderer, yt-lockup-view-model';

  // Small side boxes on X. These are hidden when they start with clear sports content.
  const boxes = '[data-testid="sidebarColumn"] section, [data-testid="sidebarColumn"] aside, ' +
    '[data-testid="sidebarColumn"] [role="region"], [data-testid="sidebarColumn"] [role="complementary"]';

  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const phrase = (s) => esc(s.trim()).replace(/ +/g, '[\\s-]+');
  const join = (list) => list.map(phrase).join('|');
  const whole = (list) => "(?<![a-z0-9])(?:" + join(list) + ")(?:['’]?s)?(?![a-z0-9])";

  const weakPattern = whole(weak) + '|(?:' + join(weakAnywhere) + ')';
  const nickRegex = new RegExp('(?<![A-Za-z0-9])(?:' + join(nicknames) + ')(?![A-Za-z0-9])', 'g');
  const gameRegex = new RegExp('(?<![a-z0-9])(?:' + join(gameWords) + ')(?![a-z0-9])', 'gi');
  const fillerRegex = new RegExp('(?<![a-z0-9])(?:' + join(labelFiller) + ')(?![a-z0-9])', 'gi');
  // A win-loss record or score, like "6-2".
  const recordRegex = /(?<!\d)\d{1,3}\s?[-–]\s?\d{1,3}(?!\d)/;
  // The add-on's own name is not sports.
  const ownName = /no[\s-]?sports/gi;

  const distinct = (text, re) => {
    const found = text.match(re);
    return found ? new Set(found.map((f) => f.toLowerCase())).size : 0;
  };

  // Builds the matcher. Extra words from the popup count as strong.
  function build(extraWords) {
    const strongList = strong.concat((extraWords || []).filter(Boolean));
    const strongPattern = whole(strongList) +
      '|(?<![a-z0-9])(?:' + join(strongPrefix) + ')' +
      '|(?:' + join(strongAnywhere) + ')';
    const strongRe = new RegExp(strongPattern, 'i');
    const strongG = new RegExp(strongPattern, 'gi');
    const weakG = new RegExp(weakPattern, 'gi');
    const anyRe = new RegExp(strongPattern + '|' + weakPattern, 'i');

    // Any sports word at all. Used for names of things, like a subreddit.
    function hasTerm(text) {
      return !!text && anyRe.test(text.replace(ownName, ' '));
    }

    // Is this clearly sports content?
    function isSports(text) {
      if (!text) return false;
      text = text.replace(ownName, ' ');
      if (strongRe.test(text)) return true;
      const weakHits = distinct(text, weakG);
      const nickHits = distinct(text, nickRegex);
      if (!weakHits && !nickHits) return false;
      let points = weakHits * 2 + nickHits * 1.5;
      points += Math.min(2, distinct(text, gameRegex));
      if (recordRegex.test(text)) points += 1.5;
      return points >= 3;
    }

    // Is this a short label that is nothing but a sports word?
    // "Sports", "Baseball", "Live Sports", "Trending in Sports" are labels.
    // "i just hate sports" is not.
    function isLabel(text) {
      if (!text) return false;
      text = text.replace(ownName, ' ').trim();
      if (text.length > 40 || !anyRe.test(text)) return false;
      const rest = text.replace(strongG, ' ').replace(weakG, ' ')
        .replace(/['’]/g, '').replace(fillerRegex, ' ').replace(/[^a-z]/gi, '');
      return rest.length === 0;
    }

    return { hasTerm, isSports, isLabel };
  }

  return { sites, defaultSites, selectors, wrappers, cards, boxes, build };
})();
