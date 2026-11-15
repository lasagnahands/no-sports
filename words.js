// Word lists and matching rules for No Sports.
// To block more things, the easiest way is the box in the popup.
// You can also add words to the lists below.

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

  // Words that count as sports when they show up as a whole word or phrase.
  // A space also matches a dash, so "hat trick" catches "hat-trick" too.
  const words = [
    'sports', 'mls', 'wnba', 'ncaa', 'cfb', 'mma', 'wwe', 'f1', 'formula 1', 'formula1',
    'formula one', 'motogp', 'indycar', 'pga', 'lpga', 'atp', 'wta', 'fifa', 'uefa',
    'premier league', 'champions league', 'europa league', 'la liga', 'bundesliga', 'ligue 1',
    'world cup', 'super bowl', 'superbowl', 'the big game', 'world series', 'stanley cup', 'march madness',
    'final four', 'playoff', 'postseason', 'touchdown', 'quarterback', 'wide receiver',
    'running back', 'linebacker', 'home run', 'shortstop', 'outfielder', 'grand slam',
    'slam dunk', 'point guard', 'three pointer', 'hat trick', 'goalkeeper', 'goalie',
    'free agency', 'free agent', 'trade deadline', 'draft pick', 'mock draft', 'fantasy league',
    'sportsbook', 'draftkings', 'fanduel', 'wimbledon', 'french open', 'australian open',
    'ryder cup', 'tour de france', 'olympics', 'olympic', 'paralympics', 'grand prix',
    'boxing', 'wrestlemania', 'squaredcircle', 'cricket', 'rugby', 'tennis', 'golf', 'golfer',
    'lacrosse', 'halftime', 'all star game', 'matchday', 'transfer window', 'el clasico',
    'relegation', 'athlete', 'hookem', 'hook em', 'gameday', 'game day', 'head coach', 'sportscenter', 'gridiron',

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

  // These count at the start of a word ("nflmemes", "nbadiscussion").
  const prefixWords = ['nfl', 'nba', 'mlb', 'nhl', 'ufc'];

  // These count anywhere, even inside another word ("fantasyfootball").
  const anywhereWords = [
    'football', 'basketball', 'baseball', 'soccer', 'hockey', 'volleyball', 'wrestling',
    'nascar', 'espn'
  ];

  // Team nicknames that are also normal words. These only count when they are
  // capitalized AND a game word (below) is nearby, or two of them show up together.
  const nicknames = [
    'Chiefs', 'Bills', 'Eagles', 'Cowboys', 'Ravens', 'Lions', 'Bears', 'Vikings', 'Falcons',
    'Raiders', 'Chargers', 'Dolphins', 'Jaguars', 'Panthers', 'Rams', 'Browns', 'Colts',
    'Commanders', 'Jets', 'Hawks', 'Pistons', 'Bucks', 'Bulls', 'Grizzlies', 'Pelicans',
    'Hornets', 'Wizards', 'Nuggets', 'Blazers', 'Rockets', 'Cubs', 'Braves', 'Tigers',
    'Rangers', 'Mariners', 'Guardians', 'Marlins', 'Brewers', 'Pirates', 'Rockies',
    'Diamondbacks', 'Sharks', 'Kraken', 'Avalanche', 'Hurricanes', 'Sabres', 'Islanders',
    'Flyers', 'Predators', 'Penguins', 'Gators', 'Seminoles', 'Buckeyes', 'Wolverines',
    'Crimson Tide', 'Longhorns', 'Sooners', 'Bulldogs', 'Patriots', 'Titans', 'Saints',
    'Cardinals', 'Giants', 'Warriors', 'Seahawks', 'Steelers', 'Packers', 'Texans',
    'Bengals', 'Broncos', 'Buccaneers', 'Lakers', 'Celtics', 'Knicks', 'Yankees', 'Dodgers'
  ];

  const gameWords = [
    'beat', 'beats', 'win', 'wins', 'won', 'loss', 'lose', 'loses', 'lost', 'game', 'games',
    'season', 'coach', 'vs', 'score', 'scores', 'roster', 'injury', 'offense', 'defense',
    'rookie', 'stadium', 'qb', 'fans', 'trade', 'traded', 'draft', 'highlights', 'matchup'
  ];

  // What to look at on a page.
  const selectors = [
    'shreddit-post', '.thing.link', '[data-testid="cellInnerDiv"]', 'article', '[role="article"]', '[data-testid="trend"]',
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

  // Small side boxes on X. These are hidden when they start with a sports word.
  const boxes = '[data-testid="sidebarColumn"] section, [data-testid="sidebarColumn"] aside, ' +
    '[data-testid="sidebarColumn"] [role="region"], [data-testid="sidebarColumn"] [role="complementary"]';

  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const phrase = (s) => esc(s.trim()).replace(/ +/g, '[\\s-]+');
  const join = (list) => list.map(phrase).join('|');

  function buildRegex(extraWords) {
    const all = words.concat((extraWords || []).filter(Boolean));
    const pattern =
      "(?<![a-z0-9])(?:" + join(all) + ")(?:['’]?s)?(?![a-z0-9])" +
      '|(?<![a-z0-9])(?:' + join(prefixWords) + ')' +
      '|(?:' + join(anywhereWords) + ')';
    return new RegExp(pattern, 'i');
  }

  const nickRegex = new RegExp('(?<![A-Za-z0-9])(?:' + join(nicknames) + ')(?![A-Za-z0-9])', 'g');
  const gameRegex = new RegExp('(?<![a-z0-9])(?:' + join(gameWords) + ')(?![a-z0-9])', 'i');

  // A win-loss record or score, like "6-2".
  const recordRegex = /(?<!\d)\d{1,3}\s?[-\u2013]\s?\d{1,3}(?!\d)/;

  function nicknameMatch(text) {
    const found = text.match(nickRegex);
    if (!found) return false;
    if (new Set(found).size >= 2) return true;
    return gameRegex.test(text) || recordRegex.test(text);
  }

  // The add-on's own name is not sports.
  const ownName = /no[\s-]?sports/gi;

  function isSports(text, regex) {
    if (!text) return false;
    text = text.replace(ownName, ' ');
    return regex.test(text) || nicknameMatch(text);
  }

  return { sites, selectors, wrappers, cards, boxes, buildRegex, isSports };
})();
