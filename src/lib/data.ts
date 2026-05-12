export interface BulletLink {
  text: string;
  href: string;
}

export interface WorkItem {
  company: string;
  role: string;
  tagline: string;
  period: string;
  location: string;
  note?: string;
  description: (string | { text: string; link: BulletLink })[];
  links?: { label: string; href: string }[];
}

export interface ResearchItem {
  title: string;
  titleHtml?: string;
  tag: string;
  tagAccent?: boolean;
  award?: string;
  tagline: string;
  period: string;
  description: string[];
  links?: { label: string; href: string }[];
}

export const researchItems: ResearchItem[] = [
  {
    title: "Learning Conserved Quantities in Neural Simulators and Diffusion Models",
    tag: "Research",
    tagline: "Taught neural networks Hamiltonian physics; showed that low rollout MSE and physical conservation are orthogonal: diffusion energy drift is 7,500–36,000× ground truth.",
    period: "May 2026",
    description: [
      "• Developed a Conservation Discovery Network (CDN), a black-box MLP trained with a temporal consistency loss and variance-hinge regularizer to learn scalar invariants directly from Hamiltonian trajectories, without knowing the system's physics.",
      "• Showed that a diffusion model achieving rollout MSE ~10⁻³ simultaneously produces within-trajectory energy standard deviation 7,500–36,000× larger than ground truth, demonstrating that trajectory accuracy and conservation are orthogonal quality axes.",
      "• Benchmarked four model classes (CDN, polynomial CDN, structured T(v)+V(q) network, diffusion baseline) across projectile, pendulum, and spring-mass systems; structured network reached R²=0.9999 on clean data, CDN-Aligned reached R²=0.996.",
      "• Showed CDN outperforms the structured energy network on 2 of 3 systems under 1% state noise, and that the polynomial CDN's R² jumps from 0.78 to 0.9998 purely from extending the training schedule, revealing conservation-loss landscape sensitivity.",
    ],
    links: [
      { label: "Paper", href: "https://github.com/Coderrexe/physics-neural-net/blob/main/final_paper.pdf" },
      { label: "Repository", href: "https://github.com/Coderrexe/physics-neural-net" },
    ],
  },
  {
    title: "Optimized Quantum Cat Qubit Reed-Solomon & Tornado Codes",
    tag: "MIT iQuHack 1st Place",
    tagAccent: true,
    award: "MIT iQuHack 1st Place 2026: Alice & Bob",
    tagline: "Novel quantum error correction algorithm; Tornado architecture combining Reed-Solomon codes and repetition stabilizers for cat qubits.",
    period: "Jan 2026",
    description: [
      "• Built a novel quantum error correction architecture for cat qubits by combining Reed-Solomon codes (over GF(2ᵐ)) and repetition stabilizers in a simplified Tornado structure, achieving logical error rates orders of magnitude lower than either parent code alone.",
      "• Implemented the classical RS encoder via a symmetric generator matrix Gsym over GF(8), then translated CX gate placement directly from the parity matrix P of the row-reduced binary form, circumventing the need for non-Clifford DFT gates used in prior quantum RS implementations.",
      "• Benchmarked three architectures (Repetition, Reed-Solomon, Tornado) across physical error rates using Stim; the Tornado concatenation achieved the best error suppression by exploiting cat-qubit phase-flip bias.",
    ],
    links: [
      { label: "Repository", href: "https://github.com/Coderrexe/MIT-iQuHACK-Winner-2026" },
    ],
  },
  {
    title: "AEGIS: Pareto-Optimal Safe Pedestrian Navigation via Heuristic NAMOA* Pathfinding",
    tag: "PennApps 1st Place",
    tagAccent: true,
    award: "PennApps 1st Place 2025: Best Use of Statistics",
    tagline: "Reduced NAMOA* pathfinding runtime from O(N³) to O(N log N) via skyline pruning and cardinality bounding.",
    period: "Sep 2025",
    description: [
      "• Framed pedestrian safety as a multi-objective shortest path problem: minimise travel time and darkness exposure simultaneously, with hard exclusion of crime-flagged nodes, over Philadelphia's street graph (~110k nodes, ~330k edges).",
      "• Designed a heuristic NAMOA* variant with skyline-based dominance pruning, admissible reverse-Dijkstra dual heuristics, and a per-node cardinality cap (Kmax=3) — collapsing worst-case complexity from O(N³) to O(N log N) and achieving 5–10× faster queries vs. naive NAMOA* on city-scale graphs.",
      "• Fused NASA VIIRS VNP46A2 nighttime light radiance (500 m resolution, BRDF-corrected) with near real-time OpenDataPhilly crime reports to score every street segment; system dynamically recomputes Pareto-optimal routes when new incidents are published.",
      "• Built a full-stack platform (React 19 + Flask + C++/Cython algorithm core + Redis) surfacing three interpretable route choices — fastest, brightest, balanced — with on-map alerts and one-click rerouting around newly flagged zones.",
    ],
    links: [
      { label: "Paper", href: "https://github.com/Coderrexe/aegis-pennapps-2025/blob/main/AEGIS_Paper.pdf" },
      { label: "Repository", href: "https://github.com/Coderrexe/aegis-pennapps-2025" },
    ],
  },
  {
    title: "Towards a Novel Multi-Loss CycleGAN for Full-to-Flat Colour Transformation",
    tag: "Research",
    tagline: "GAN pipeline for zero-shot full-to-flat colour image transformation; CycleGAN augmented with depth geometry (InceptionV3), sketch extractor, and CLIP semantics losses.",
    period: "Aug 2023",
    description: [
      "• Proposed a CycleGAN architecture with three auxiliary loss functions — depth geometry loss (InceptionV3-based MIDOS network), sketch extractor loss (pretrained line extractor), and semantics loss (OpenAI CLIP ViT-B/32) — on top of standard adversarial, discriminant, and cycle-consistency losses.",
      "• Trained on a hand-picked unpaired dataset of full-colour and flat-colour images drawn from DanbooruDataset (~5M images), Guy Fictional Comics, Tiny-ThryElph, and Comic Characters Dataset; trained 100 epochs on a single NVIDIA GeForce GTX TITAN X.",
      "• Model generalises across portrait, anime, and cartoon styles without human input, preserving structural integrity, depth geometry, and semantic content while eliminating gradients and complex textures.",
      "• Identified and analysed a sudden GAN loss spike at epoch 31 attributable to discriminator learning-rate changes; model recovered and continued improving, demonstrating robustness of the multi-loss weighting scheme.",
    ],
    links: [
      { label: "Repository", href: "https://github.com/Coderrexe/full2flat" },
      { label: "Poster", href: "https://github.com/Coderrexe/full2flat/blob/master/Poster.png" },
    ],
  },
  {
    title: "Mycoflo: Pleurotus tuber-regium in Heavy Metal Filtration and Machine Learning for Water Potability Testing",
    titleHtml: "Mycoflo: <em>Pleurotus tuber-regium</em> in Heavy Metal Filtration and Machine Learning for Water Potability Testing",
    tag: "Research",
    tagline: "Mycofiltration using native Nigerian fungi + XGBoost/Random Forest ensemble for water potability; 63.75% copper reduction, 94% classification accuracy.",
    period: "Feb 2024",
    award: "Featured by United Nations; The Earth Prize 2024 Finalist (Top 10 of 1000+)",
    description: [
      "• Designed MycoSacks — layered hessian sacks of straw, wood chips, and Pleurotus tuber-regium spores — that grow a full mycelial network within five weeks; biosorption at chitin cell walls chelates metal ions, achieving a 63.75% reduction in copper (II) ion concentration (iodometric titration).",
      "• Built MycoAI: an ensemble of XGBoost and Random Forest classifiers with majority voting on five water parameters (pH, hardness, TDS, conductivity, turbidity); achieved 94% accuracy and 96.5% true-negative rate — model errs toward caution, minimising unsafe-water misclassification.",
      "• Prototyped MycoBot, a handheld Arduino-based device with a calibrated pH probe; reduces water-safety analysis from hours (lab transport + processing) to minutes in situ; designed to scale to 5 sensors (Raspberry Pi) for full MycoAI integration.",
      "• Compared to reverse osmosis ($2,000, wastes 80% of water): MycoSacks are 86% cheaper with comparable filtration efficacy and zero water waste; modelled deployment for 250,000+ Niger Delta residents.",
    ],
    links: [
      { label: "Paper", href: "https://drive.google.com/file/d/1nVvy11X8tHSYsx-lvU92wNRArW29D6q9/view?usp=sharing" },
      { label: "United Nations", href: "https://untoday.org/the-earth-prize-2024-finalists-focus-on-un-sdgs-6-12-and-15/" },
    ],
  },
];

export const workItems: WorkItem[] = [
  {
    company: "Tractable",
    role: "ML Intern",
    tagline: "Working on MLOps and research at one of UK's top computer vision unicorns.",
    period: "May 2026 – Present",
    note: "Series E, $1B valuation",
    location: "London, UK",
    description: [
      "• Working on MLOps and research at one of UK's top computer vision unicorns.",
    ],
    links: [
      { label: "Forbes", href: "https://www.forbes.com/sites/iainmartin/2021/06/16/uk-computer-vision-startup-tractable-reaches-unicorn-status/" },
      { label: "Fortune", href: "https://fortune.com/2021/06/16/tractable-unicorn-fundraise-insuretech-cars-to-property/" },
      { label: "Wall Street Journal", href: "https://www.wsj.com/tech/ai/geico-to-use-artificial-intelligence-to-speed-up-car-repairs-11621944000" },
      { label: "TechCrunch", href: "https://techcrunch.com/2021/06/16/tractable-raises-60m-at-a-1b-valuation-to-make-damage-appraisals-using-ai/" },
      { label: "Wired", href: "https://www.wired.com/story/car-crash-tractable-ai/" },
    ],
  },
  {
    company: "Yale Graph & Geometric Learning Lab",
    role: "Undergraduate Researcher",
    tagline: "LLM post-training and RL for multimodal time-series reasoning.",
    period: "Mar 2026 – Present",
    location: "New Haven, CT",
    description: [
      "• LLM architectures and post-training/RL for multimodal time-series reasoning.",
      "• Building data pipelines for next-gen foundation models.",
    ],
    links: [
      { label: "Lab Page", href: "https://graph-and-geometric-learning.github.io/" },
    ],
  },
  {
    company: "SPAR Research",
    role: "AI Alignment Research Fellow",
    tagline: "Activation steering in chain-of-thought LLM obfuscation with MIT and ex-Meta researchers.",
    period: "Feb 2026 – Present",
    location: "Berkeley, CA",
    description: [
      "• Activation steering in chain-of-thought LLM obfuscation with MIT and ex-Meta researchers."
    ],
  },
  {
    company: "ReefSound",
    role: "Co-Founder",
    tagline: "Audio AI & underwater robotics for automating ocean monitoring. Deployed in 7 countries. Featured by The Independent, NASA, National Geographic.",
    period: "Jul 2023 – Aug 2025",
    location: "London, UK",
    description: [
      "• Built audio AI & underwater robotics for coral reef monitoring with 99.4% accuracy using sound recordings.",
      {
        text: "• Scaled product to 7 countries and 3 continents; news feature by The Independent, NASA, National Geographic.",
        link: {
          text: "The Independent",
          href: "https://www.independent.co.uk/news/uk/home-news/nasa-climate-reefsound-technology-eton-schoolboys-b2610861.html",
        },
      },
      "• Winner of NASA Conrad Challenge (2000 teams, 50 countries); won ~$300k in scholarships.",
      "• Researched novel CNNs + gradient boosting models; trained AI on 130+ hours of coral reef recordings.",
    ],
    links: [
      { label: "The Independent", href: "https://www.independent.co.uk/news/uk/home-news/nasa-climate-reefsound-technology-eton-schoolboys-b2610861.html" },
      { label: "Space Center Houston", href: "https://spacecenter.org/top-high-school-inventors-awarded-as-pete-conrad-scholars/" },
      { label: "National Geographic", href: "https://blog.education.nationalgeographic.org/2024/05/08/inspiring-the-next-generation-2024-slingshot-challenge-award-recipients-announced/" },
      { label: "International Coral Reef Initiative", href: "https://icriforum.org/reef-sound-school-students/" },
    ],
  },
  {
    company: "Greyparrot",
    role: "ML Engineer Intern",
    tagline: "Computer vision and YOLOv8 inference pipelines for industrial recycling.",
    period: "Jul 2024 – Sep 2024",
    location: "London, UK",
    note: "Series B, $30M raised",
    description: [
      "• Engineered PyTorch inference pipeline with test-time augmentation deployed across GPU clusters, improving F1-score while optimizing real-time processing speeds for complex computer vision tasks.",
      "• Built YOLOv8 object detection models to accurately classify 80+ distinct classes for industrial recycling facilities.",
      "• Worked directly with Head of Deep Learning and agile engineering teams to rapidly iterate and ship ML solutions.",
    ],
    links: [
      { label: "TIME", href: "https://time.com/collections/best-inventions-2025/7318490/greyparrot-analyzer/" },
      { label: "Business Insider", href: "https://www.businessinsider.com/ai-recycling-startup-raises-greyparrot-leonardo-dicaprio-regeneration-2023-2" },
      { label: "TechCrunch", href: "https://techcrunch.com/2024/02/07/greyparrot-bollegraaf/" },
    ],
  },
  {
    company: "CVSSP Lab, University of Surrey",
    role: "ML Research Intern",
    tagline: "GANs for zero-shot image translation; seq2seq transformers and graph convolutional networks for audio captioning.",
    period: "Jun 2023 – Feb 2025",
    location: "Guildford, UK",
    note: "#1 ranked computer vision lab in UK",
    description: [
      "• Researched GAN model (CycleGAN + CLIP + InceptionV3) in PyTorch to perform complex image-to-image translations from full-color to flat-color; built computational photography pipeline for unpaired datasets.",
      "• Built novel sequence-to-sequence architectures (BART transformer + graph convolutional networks) for automated audio captioning; benchmarked on the Clotho dataset.",
    ],
    links: [
      { label: "Lab Page", href: "https://sketchx.ai/" },
    ],
  },
];

export interface EssaySection {
  heading?: string;
  body: string;
  html?: boolean;
}

export interface Essay {
  slug: string;
  title: string;
  date: string;
  displayDate: string;
  collectionSlug: string;
  description?: string;
  comingSoon?: boolean;
  sections: EssaySection[];
}

export interface Collection {
  slug: string;
  name: string;
  description?: string;
  quote?: { text: string; author: string; authorHtml?: string };
  essaySlugs: string[];
  comingSoon?: boolean;
}

// Essays sorted newest first
export const essays: Essay[] = [
  {
    slug: "apophenia",
    title: "apophenia",
    date: "2025-05-08",
    displayDate: "May 8, 2025",
    collectionSlug: "poetry",
    sections: [
      {
        heading: "i. calculus",
        body: `to chart affection in units of distance with
shoulders six centimetres foreign on the 8:14.
conversion of heat into hypothesis –
my hand static on the steel bar,
yours twitching at the edge of yes.
you say silence is just sound with all its clothes on.
you say love is not a graph but a gradient.
i say nothing
because proof eludes me.`,
      },
      {
        heading: "ii. mnemonic",
        html: true,
        body: `seven ways you lock.\n<em>one</em>: polaroid in negative\n<em>two</em>: scent of bergamot in wet wool\n<em>three</em>: scarf curled in throatlike architecture\n<em>four</em>: abandoned comma in your goodbye\n<em>five</em>: hands fluttering between your favourite constellation\n<em>six</em>: shùn blowing against coronado like ash\n<em>seven</em>: bruise-blue of your eyes`,
      },
      {
        heading: "iii. apophenia",
        body: `once, i mistake rust-gold for lipstick on the corner of my mug
& sea-black sky for apology & shredded song
where you aren't
moving through the city like a widow.
still, i find your shape in
the ash patterns of bus tickets or
the hollow between radio stations.`,
      },
      {
        heading: "iv. palaeontology",
        body: `at the back of my drawer
a receipt from the café i swear i'd never return to.
how my last text – untainted virgin –
shimmers in radioactivity.
how nine months of carbon-dating & one halting syllable later,
i am left digging you out with bare hands
& fingernails choked with flint.`,
      },
      {
        heading: "v. deduction",
        html: true,
        body: `if love is a theorem
then grief is fermat's favourite toy.
etched into the chalkboard long
after class is ended,
the lecturer gone
& the room echoing still
with the sound
of nothing.
on the flight back
she is a city
blurred under cloud
as stars fall into the aisle
like torches.
i remember her name
& coordinates
<em>RA 06h 45m 08.9s | Dec –16° 42′ 58″</em>
i think about visiting someday.`,
      },
    ],
  },
  {
    slug: "coronado",
    title: "Coronado",
    date: "2025-06-25",
    displayDate: "June 25, 2025",
    collectionSlug: "poetry",
    sections: [
      {
        body: `Instead, let it be the echo of waves / the bruise-blue sea / the surrendering sand / scream through the air like a name / a seagull stunned with falling / your phantom image / engraved still in my mind / how I stare into the green canvas / & pray to be erased / the way tides erode memories / to be brushed away with a distant boat / against the crushing horizon / against your moss-covered skin with / my name forever trapped in Coronado as / a shard of dawn breaks the skyline / ignites the mine / & unveils the truth / your hand in mine / a blade of honey burns through the earth to / light up our faces / your face my hands / until the pink & white whittles down / into amber into nothing / but instead, let me watch the night / bleed through the lighthouse where / beyond the shore / stars siphon heaven dry / & already with salty lips / & tears grappling my skin / I am whispering / I love you / to my empty hands.`,
      },
    ],
  },
  {
    slug: "someday",
    title: "someday i\u2019ll love simba shi",
    date: "2025-07-14",
    displayDate: "July 14, 2025",
    collectionSlug: "poetry",
    sections: [
      {
        heading: "i.",
        body: `head first, arms outstretched, we took a leap of faith. i remember the first time you waited, hair wrung out in pearls, arms reaching into the tropical heat, a wry smile imbued across your face like a secret heard at last. as i catch your gaze in the distance, your palms a polka in synchronisation, i wonder how every person who has ever met you doesn’t fall at least a little in love – how their hearts don’t beat their wings a little, their souls baptised. with you, i was already lost; surrendered to my own will & could never conquer again.`,
      },
      {
        heading: "ii.",
        body: `i remember the night i asked you, under a milk-blue moon, to be my forever. late fall, it was. gazing into the sea-black sky & lying across the cold stone slabs, november moonlight pooling into our cheeks, i whispered i love you for the first time. & a thousand syllables later – under distant stars, nebular clouds & misty skies – i never looked away again.`,
      },
      {
        heading: "iii.",
        body: `what is the role of humanity in a post-agi world? dreams, i am told, are nothing more than regrets from our past lives, but i dream it often – that in a few years, some say three, or five, or ten, ai will do everything that we can do. at the behest of scaling laws, we watch our existence crumble into fragments. will it lift us from maslow's hierarchy or reduce us to hollows? can we live our lives the way the dead chase after days? do we have souls? can they love like we used to, wrapping their arms around the nape of their necks, tracing moons around their names? my mother told me i could be anything i wanted, but i choose to be a humanist. tell me i was born to taste your lips, our bodies folded in fabric wet as wounds. like a true ilya – i love you all.`,
      },
      {
        heading: "iv.",
        body: `& if this is the end, i wish we never meet again in any life or universe.`,
      },
    ],
  },
  {
    slug: "world-of-einsteins",
    title: "a world of einsteins",
    date: "2099-01-01",
    displayDate: "",
    collectionSlug: "world-of-einsteins",
    // description: "contemplations about AGI",
    comingSoon: true,
    sections: [],
  },
];

// Flat ordered list for writing page: apophenia, Coronado, someday, world-of-einsteins
export const orderedEssays: Essay[] = [
  essays.find(e => e.slug === 'apophenia')!,
  essays.find(e => e.slug === 'coronado')!,
  essays.find(e => e.slug === 'someday')!,
  essays.find(e => e.slug === 'world-of-einsteins')!,
];

export const collections: Collection[] = [
  {
    slug: "poetry",
    name: "poetry",
    essaySlugs: ["apophenia", "coronado", "someday"],
  },
  {
    slug: "world-of-einsteins",
    name: "a world of einsteins",
    description: "contemplations about AGI",
    quote: {
      text: "When I watched you dancing that day, I saw something else. I saw a new world coming rapidly. More scientific, efficient, yes. More cures for the old sicknesses. Very good. But a harsh, cruel world. And I saw a little girl, her eyes tightly closed, holding to her breast the old kind world, one that she knew in her heart could not remain, and she was holding it and pleading, never to let her go. That is what I saw. It wasn't really you, what you were doing, I know that. But I saw you and it broke my heart. And I've never forgotten.",
      author: "Kazuo Ishiguro",
      authorHtml: "Kazuo Ishiguro, <em>Never Let Me Go</em>",
    },
    essaySlugs: [],
    comingSoon: true,
  },
];

export function getCollectionEssays(collection: Collection): Essay[] {
  return collection.essaySlugs
    .map((slug) => essays.find((e) => e.slug === slug))
    .filter((e): e is Essay => Boolean(e));
}
