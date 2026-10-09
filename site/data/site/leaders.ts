/**
 * Our leadership (LEAD §2). 15 leaders in 3 groups, copy verbatim from the wireframe.
 * Figma artefacts trimmed per the spec: trailing spaces, the zero-width space after "Malkani",
 * the blank lines after Jai Mirpuri's bio; the non-breaking hyphen in "Asia-Pacific" is a normal hyphen.
 */
export type Leader = {
  group: string;
  name: string;
  /** A string, or one line per array item (explicit line breaks) */
  title: string | string[];
  bio: string;
  /** Shows the inert "View [area of focus]" button */
  hasAreaButton: boolean;
};

export const LEADER_GROUP_TITLES = ["Independent Chair", "Group Co-founders & Co-CEOs", "Executive Leadership Team"] as const;

const [CHAIR, FOUNDERS, EXEC] = LEADER_GROUP_TITLES;

export const LEADERS: Leader[] = [
  {
    group: CHAIR,
    name: "Brett Robson",
    title: "Independent Board Chair",
    bio: "Brett was appointed Independent Board Chair in 2025, having advised the privatisation consortium earlier that year. He spent 21 years at Macquarie, including as Global Head of Macquarie Capital Real Estate Investments, and has served on numerous portfolio company boards and real estate fund investment committees.",
    hasAreaButton: true,
  },
  {
    group: FOUNDERS,
    name: "Jeffrey Shen",
    title: "Co-founder and Co-Chief Executive Officer",
    bio: "Jeffrey co-founded e-Shang in 2011 and has been Co-CEO since the 2016 merger that formed ESR. He drives group vision, strategy and key decisions alongside Stuart and the executive team. He has more than 25 years in industrial real estate in China, and was previously Senior Vice President at GLP Investment Management (China). He holds a degree in Technical Economics from Shanghai Jiao Tong University.",
    hasAreaButton: true,
  },
  {
    group: FOUNDERS,
    name: "Stuart Gibson",
    title: "Co-founder and Co-Chief Executive Officer",
    bio: "Stuart co-founded the Redwood Group in 2006 and has been Co-CEO of ESR since the 2016 merger. He oversees group operations and business development. He was previously country head of Prologis Japan and co-founded AMB BlackPine, later incorporated into Prologis. He holds a degree in English Literature from Manchester University.",
    hasAreaButton: true,
  },
  {
    group: EXEC,
    name: "Phil Pearce",
    title: "President",
    bio: "Phil established the Australia and New Zealand business in 2018 and grew it into one of the region’s leading industrial and logistics platforms. Appointed President in 2025, he is responsible for day to day execution of strategy and operations, including oversight of regional leadership teams. He joined ESR in 2017 and has served as Group Deputy CEO.",
    hasAreaButton: true,
  },
  {
    group: EXEC,
    name: "Matthew Lawson",
    title: "Chief Financial Officer",
    bio: "Matthew was appointed Group CFO in 2025, having previously served as Group Chief Operating Officer. He joined ESR Australia as Chief Financial Officer in 2020, where he ran finance, corporate development, treasury and technology.",
    hasAreaButton: false,
  },
  {
    group: EXEC,
    name: "Karine Scelles",
    title: "Chief People Officer",
    bio: "Karine Scelles is Chief People Officer of ESR, responsible for leading the company’s people and culture strategy. Karine oversees the implementation of HR policies and programmes to build engaged, high-performing teams, foster a culture of inclusion, and elevate organisational capabilities to realise ESR’s business goals and strategic priorities.",
    hasAreaButton: true,
  },
  {
    group: EXEC,
    name: "David Matheson",
    title: "Chief Investment Officer, Group Strategy and Investments",
    bio: "David joined ESR in 2025 to lead group strategy and investments. He was previously Co-Head of Europe at Starwood Capital Group and Executive Vice President, Europe and Asia Pacific at Oxford Properties.",
    hasAreaButton: true,
  },
  {
    group: EXEC,
    name: "Justin Gabbani",
    title: "Group Head of Fund Management",
    bio: "Justin Gabbani is Group Head of Fund Management at ESR. He leads the Group’s fund management platform, with responsibility for fund performance, product strategy, and capital raising. His role focuses on strengthening investor engagement, disciplined capital deployment, active asset management and supporting scalable execution across ESR’s platform to drive long term value creation for capital partners.",
    hasAreaButton: true,
  },
  {
    group: EXEC,
    name: "Kellie Parker",
    title: "Chief Marketing Officer",
    bio: "Kellie is a senior marketing leader with over 25 years’ experience shaping and leading global marketing strategies across multiple market segments in the Asia-Pacific region.",
    hasAreaButton: false,
  },
  {
    group: EXEC,
    name: "Grace Yuen",
    title: "Chief Legal and Risk Officer",
    bio: "Grace Yuen is Chief Legal and Risk Officer, responsible for shaping the overall legal, regulatory and risk strategy to ensure alignment with ESR’s investment and operational goals. She oversees legal execution of strategic transactions, while managing governance, compliance, ESG and risk frameworks, and legal risk across the company.",
    hasAreaButton: false,
  },
  {
    group: EXEC,
    name: "John Marsh",
    title: ["Group Head of Development", "Chairman of Australia & New Zealand"],
    bio: "John Marsh is responsible for leading growth initiatives across the ESR group. John draws on his deep industry experience to forge long-term partnerships with key customers and capital partners, as well as scale major development projects across ESR’s markets. He also continues to oversee the strategic direction and performance of the company’s energy transition infrastructure business. John is also Chairman of ESR Australia & New Zealand.",
    hasAreaButton: true,
  },
  {
    group: EXEC,
    name: "Dalmar Sheikh",
    title: "Chief Executive Officer, Data Centres",
    bio: "Dalmar Sheikh leads ESR’s Data Centres business across Asia-Pacific, with responsibility for strategy, performance, growth and the continued development of the platform. He oversees the execution of ESR’s data centre strategy, including expansion of the development pipeline, strategic customer and investor relationships, and the development of new solutions and growth opportunities across the region.",
    hasAreaButton: true,
  },
  {
    group: EXEC,
    name: "Abhijit Malkani",
    title: "Chief Executive Officer, India",
    bio: "As Chief Executive Officer, India at ESR, Abhijit Malkani is responsible for devising and executing the overarching growth strategy for the company’s Indian business and operations. His remit spans investments, development, leasing, and fund management.",
    hasAreaButton: true,
  },
  {
    group: EXEC,
    name: "Jai Mirpuri",
    title: "Head, Southeast Asia",
    bio: "Mr. Jai Mirpuri is Head, Southeast Asia driving business strategies and expanding ESR’s footprint across Indonesia, Singapore, Thailand, Vietnam, Malaysia, and the Philippines. Mr. Mirpuri took on this expanded portfolio in March 2024.",
    hasAreaButton: true,
  },
  {
    group: EXEC,
    name: "Thomas Nam",
    title: "Chief Executive Officer, Korea",
    bio: "Mr. Sunwoo Thomas Nam is the CEO of ESR Kendall Square, the Group’s South Korea Platform. With over 26 years of experience in the real estate sector, he was the President of Prologis Korea, once the largest logistics asset investment and development platform in South Korea. Previously he founded Kendall Square Investment, a real estate investment management company in Korea with Warburg Pincus.",
    hasAreaButton: true,
  },
];
