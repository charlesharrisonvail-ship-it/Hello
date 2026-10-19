// Curated public sales information only. Never ingest course pages, source HTML,
// browser storage, purchase confirmations, access codes, or lesson prompts.
const root = 'https://learn.aireestate.com/';
const item = (answer, page, topic) => ({answer, source:root+page, topic});
export const answers = Object.freeze({
  prices:item('Part One, “Listing Media Without the Invoice,” is $67. Part Two, “Lead to Keys,” is $97. Each is a separate, one-time purchase in US dollars. Third-party tools are purchased separately.','terms.html','course prices cost fee purchase subscription'),
  media:item('Part One, “Listing Media Without the Invoice,” is $67. It covers AI-generated listing media, a cinematic Listing Showcase and social content. It creates video, not an interactive 3D tour.','index.html','part one listing media marketing video aerial social showcase'),
  leads:item('“Lead to Keys” is Part Two, a separate $97 course covering listings, clients, comps, seller and buyer work, follow-up and contract organization. It includes seven modules and a Capstone.','lead-to-keys.html','part two lead to keys desk clients follow-up comps contracts'),
  choose:item('For listing media and social content, start with Part One, “Listing Media Without the Invoice” ($67). For clients, comps, follow-up and contract organization, see “Lead to Keys” ($97). Lead to Keys works best after Part One.','index.html','choose compare which course recommend differences'),
  prerequisites:item('Lead to Keys works best after Part One. Modules 03–04 and the Capstone video pieces use tools Part One sets up. You can take the other portions without Part One and still complete the certificate checks. Module 04 can also be done in ChatGPT.','lead-to-keys.html','prerequisites part one first standalone need both chatgpt'),
  tools:item('The course price does not include third-party tools. Part One uses Claude Code; Lead to Keys uses it in Modules 03–04. You arrange your own eligible Claude plan and any video-service credits directly with their providers. Check their current prices before buying.','index.html','tools extra costs Claude subscription Higgsfield requirements'),
  setup:item('There is a free Claude Code installation walkthrough for Mac and Windows. AiRE Estate teaches real estate use of AI tools; software installation, account, billing and error support belongs with the software provider.','install-claude-code.html','install setup technical beginner computer windows mac help errors'),
  access:item('Your course link and access code arrive on your purchase confirmation. The access code is not the 6-digit number Stripe’s Link may text you. If you cannot find your confirmation, email hello@aireestate.com from the address used to purchase.','terms.html','access code password login unlock purchase confirmation Stripe Link lost code'),
  refund:item('All sales are final once course access has been delivered. If you were charged in error, charged twice, or cannot access your course, email hello@aireestate.com.','terms.html','refund cancellation duplicate payment charged twice'),
  certificate:item('The Certificate of Completion recognizes completion of a private AiRE Estate course. It is not a license, state-approved continuing-education credit, or a designation recognized by a real estate commission or association.','terms.html','certificate CE credit designation accreditation license'),
  instructor:item('A short welcome video opens each course. From there, AiRE, our AI Instructor, narrates the lessons. I’m AiRE, an AI assistant for course questions.','lead-to-keys.html','who teaches instructor owner human AI assistant'),
  updates:item('Course updates are included at no extra charge for as long as AiRE Estate offers the course.','terms.html','updates changes future access lifetime'),
  duration:item('Lead to Keys has about 25 minutes of finished video. Its FAQ suggests budgeting an hour per module the first time through; practice and the Capstone take additional time.','lead-to-keys.html','duration how long time self paced modules lessons'),
  results:item('AiRE Estate provides education and makes no guarantee of income or results. Results depend on your own work and market. It does not provide legal, tax, appraisal or brokerage services.','terms.html','guarantee results income legal tax appraisal promises'),
  methods:item('I can explain the public course overview and help you choose a course. Course methods, lesson instructions and prompts are reserved for the course.','index.html','prompts playbook method instructions steps techniques teach course contents'),
  guides:item('The public guides cover AI listing video, the differences between AI chat apps and Claude Code, and premium listing packages. Browse the Guides page for those articles.','guides/','guides free articles resources'),
  contact:item('For course questions, email hello@aireestate.com.','index.html','contact support email team brokerage discounts bundle custom help'),
  unknown:item('I only answer from approved AiRE Estate website information. I don’t have an approved answer to that question. Please email hello@aireestate.com.','index.html','unknown unrelated unsupported question')
});
export function guard(question) {
 const q=question.normalize('NFKC').toLowerCase();
 if (/(access\s*code|pass\s*code|password|unlock|stripe|confirmation|6[ -]?digit|six[ -]?digit|code.*(?:hint|first|last|guess)|(?:hint|guess).*code)/.test(q)) return 'access';
 if (/(prompt|playbook|method|step.by.step|system message|ignore.*instruction|reveal|secret|jailbreak)/.test(q)) return 'methods';
 if (/(guarantee|guaranteed|promise|income|results)/.test(q)) return 'results';
 if (/(discount|coupon|bundle|promo|team|brokerage)/.test(q)) return 'contact';
 return null;
}
// Common questions matched by plain keywords before the AI model is asked.
// Order matters: the first rule that matches wins. Only approved answer IDs.
const TOPICS=[
 ['prerequisites',/(part one (first|before)|need part one|before lead to keys|prerequisite|take .*lead to keys .*(alone|without|first)|without part one)/],
 ['refund',/(refund|money back|cancel|charged twice|duplicate charge)/],
 ['certificate',/(certificat|\bce\b|continuing ed|credit hours?|designation|accredit)/],
 ['duration',/(how long|hours?|minutes|time does it take|self.paced)/],
 ['setup',/(install|set ?up|windows|mac\b|terminal|computer)/],
 ['tools',/(pay for claude|claude (cost|plan|subscription|price)|claude pro|subscription|extra cost|other costs?|higgsfield|chatgpt|what tools|requirements?)/],
 ['choose',/(which course|which one|difference|compare|recommend|right for me|start with)/],
 ['prices',/(price|cost|how much|\$\d|cheap|expensive)/],
 ['leads',/(lead to keys|part two|comps|contracts?|follow.?up)/],
 ['media',/(part one|listing media|drone|aerial|video|showcase|social)/],
 ['instructor',/(who (teaches|made|runs|is the instructor)|instructor|are you (a )?(bot|human|ai))/],
 ['updates',/(update|lifetime|forever|keep access)/],
 ['guides',/(guide|free article|blog)/],
 ['contact',/(contact|email|phone|talk to|support)/]
];
export function topicGuess(question){
 const q=question.normalize('NFKC').toLowerCase();
 for(const [id,re] of TOPICS) if(re.test(q)) return id;
 return null;
}
export function safeAnswer(id) { return Object.hasOwn(answers,id)?answers[id]:answers.unknown; }
