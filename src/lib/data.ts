export interface BulletLink {
  text: string;
  href: string;
}

export interface WorkItem {
  company: string;
  role: string;
  tagline: string;
  taglineHtml?: string;
  period: string;
  location: string;
  note?: string;
  description: (string | { text: string; link: BulletLink })[];
  links?: { label: string; href: string }[];
  hidden?: boolean; // password-protected: only visible after Cmd+K unlock
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
  hidden?: boolean; // password-protected: only visible after Cmd+K unlock
}

export const researchItems: ResearchItem[] = [
  {
    title: "Activation Steering and Chain-of-Thought Disclosure in Reasoning Models",
    tag: "Research",
    // tagAccent: true,
    hidden: true,
    tagline: "Activation steering and chain-of-thought monitoring to show reasoning models leak malign hidden system-prompt directives in chain-of-thought more than benign equivalents.",
    period: "Feb 2026 – Jun 2026",
    description: [
      "• Showed 5 models across 3 families (Qwen3, MiniMax, DeepSeek) selectively leak malign hidden system prompts in chain-of-thought significantly more than benign equivalents, with +8.2pp cross-family gap (n = 460, p < 0.0001).",
      "• Extracted causal steering vectors in MiniMax-M2.5 that reliably induce and suppress chain-of-thought disclosure.",
    ],
    links: [
      { label: "Paper", href: "https://drive.google.com/file/d/1kw-1LELxohkOyXoFWw3xoJxcbRSo5Yyz/view?usp=sharing" },
    ],
  },
  {
    title: "Learning Conserved Quantities in Neural Simulators and Diffusion Models",
    tag: "arXiv",
    // tagAccent: true,
    tagline: "Trained neural nets to discover Hamiltonian physics; showed that low rollout MSE and physical conservation are orthogonal: diffusion energy drift is 7,500–36,000× ground truth.",
    period: "May 2026",
    description: [
      "• Demonstrated that diffusion models with low prediction error (MSE near 10⁻³) can still violate fundamental physics, exhibiting energy variance up to 36,000× greater than ground-truth trajectories.",
      "• Designed and tested three neural network architectures — Structured Energy Network, black-box Conservation Discovery Network (CDN), and Polynomial CDN — to extract globally conserved quantities directly from state observations of Hamiltonian systems.",
      "• Revealed that while hard-coded structured models (T(v) + V(q)) achieve near-perfect accuracy (R² ≥ 0.9999) on clean data, black-box CDNs are more robust and outperform them when subjected to 1% additive Gaussian state noise.",
      "• Proved that temporal consistency objectives require weak standardized energy alignment to reliably select true physical energy, and showed that extending training schedules can rescue models from poor optimization landscapes (improving R² from 0.78 to 0.9998).",
    ],
    links: [
      { label: "Paper (arXiv)", href: "https://arxiv.org/abs/2605.18883" },
      { label: "Repository", href: "https://github.com/Coderrexe/physics-neural-net" },
    ],
  },
  {
    title: "Optimized Quantum Cat Qubit Reed-Solomon & Tornado Codes",
    tag: "MIT iQuHack 1st Place",
    // tagAccent: true,
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
    title: "Safe Pedestrian Navigation App using NAMOA*",
    tag: "PennApps 1st Place",
    // tagAccent: true,
    award: "PennApps 1st Place 2025: Best Use of Statistics",
    tagline: "Reduced NAMOA* pathfinding runtime from O(N³) to O(N log N) via skyline pruning and cardinality bounding.",
    period: "Sep 2025",
    description: [
      "• Built full-stack GPS navigation app with React frontend and Flask REST API (C++ spatial processing), routing pedestrians away from crime hotspots using real-time police reports and NASA satellite data.",
      "• Implemented heuristic multi-objective NAMOA* pathfinding with skyline pruning and cardinality bounds.",
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
    role: "Machine Learning Intern",
    tagline: "Scaling ML edge inference for hardware at one of UK's top computer vision unicorns.",
    period: "May 2026 – Present",
    note: "Series E, $1B valuation",
    location: "London, UK",
    description: [
      "• Scaling ML edge inference for hardware at one of UK's top computer vision unicorns.",
      "• Led TensorRT/Triton pipeline for computer vision models for vehicle damage assessment (Mask2Former, RAFT optical flow) on NVIDIA A10G/Jetson GPUs on Linux; achieved 100% claim completions at zero error rate.",
      "• Validated ML inference optimizations via A/B benchmarking: Valkey distributed image cache (42% latency reduction) and asyncio batch dispatch (22.1% throughput gain)."
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
    company: "Yale Graph and Geometric Learning Lab",
    role: "Student Researcher",
    tagline: "Researched post-training and RL for multimodal time-series LLMs for quantitative finance. Mentored by Rex Ying.",
    taglineHtml: "Researched post-training and RL for multimodal time-series LLMs for quantitative finance. Mentored by <a href=\"https://scholar.google.com/citations?user=6fqNXooAAAAJ&hl=en\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-fg underline underline-offset-2 decoration-line hover:text-accent transition-colors duration-150\">Rex Ying</a>.",
    period: "Mar 2026 – Present",
    location: "New Haven, CT",
    description: [
      {
        text: "• Researched post-training and RL for multimodal time-series LLMs for quantitative finance. Mentored by Rex Ying.",
        link: {
          text: "Rex Ying",
          href: "https://scholar.google.com/citations?user=6fqNXooAAAAJ&hl=en",
        },
      },
      "• Built GPT-4o-mini RAG pipeline synthesizing 12,216 structured market briefings across 524 S&P 500 tickers with 4-layer anti-leakage system; produced 9,843 clean training samples for fine-tuning.",
    ],
    links: [
      { label: "Lab Page", href: "https://graph-and-geometric-learning.github.io/" },
    ],
  },
  {
    company: "SPAR Research",
    role: "AI Alignment Research Fellow",
    tagline: "Activation steering and chain-of-thought monitorability with MIT and ex-Meta researchers.",
    period: "Feb 2026 – Present",
    location: "Berkeley, CA",
    links: [
      { label: "Paper", href: "https://drive.google.com/file/d/1kw-1LELxohkOyXoFWw3xoJxcbRSo5Yyz/view?usp=sharing" },
    ],
    description: [
      "• Activation steering and chain-of-thought monitorability with MIT and ex-Meta researchers."
    ],
  },
  {
    company: "ReefSound",
    role: "Co-Founder",
    tagline: "Audio AI & underwater robotics for automating ocean monitoring. Deployed in 7 countries. Featured by The Independent, NASA, National Geographic.",
    period: "Jul 2023 – Aug 2025",
    location: "London, UK",
    description: [
      "• Built audio AI & underwater robotics achieving 99.4% accuracy classifying coral reef health from underwater sound recordings via novel CNNs and gradient boosting models; deployed across 7 countries and 3 continents.",
      {
        text: "• Featured by The Independent, NASA, National Geographic; winner of NASA Conrad Challenge against 2000 teams.",
        link: {
          text: "The Independent",
          href: "https://www.independent.co.uk/news/uk/home-news/nasa-climate-reefsound-technology-eton-schoolboys-b2610861.html",
        },
      },
      "• Trained models on 130+ hours of bioacoustic recordings using spectrogram transforms and data augmentation.",
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
    role: "Machine Learning Engineer Intern",
    tagline: "Computer vision and YOLOv8 inference pipelines for industrial recycling.",
    period: "Jul 2024 – Sep 2024",
    location: "London, UK",
    note: "Series B, $30M raised",
    description: [
      "• Optimized YOLOv8 object detection for real-time classification of 80+ industrial waste material types at production recycling facilities.",
      "• Engineered PyTorch inference pipeline with test-time augmentation on GPU cluster for factory waste management.",
    ],
    links: [
      { label: "TIME", href: "https://time.com/collections/best-inventions-2025/7318490/greyparrot-analyzer/" },
      { label: "Business Insider", href: "https://www.businessinsider.com/ai-recycling-startup-raises-greyparrot-leonardo-dicaprio-regeneration-2023-2" },
      { label: "TechCrunch", href: "https://techcrunch.com/2024/02/07/greyparrot-bollegraaf/" },
    ],
  },
  {
    company: "CVSSP Lab, University of Surrey",
    role: "Machine Learning Research Intern",
    tagline: "GANs for zero-shot image translation; seq2seq transformers and graph convolutional networks for audio captioning.",
    period: "Jun 2023 – Feb 2025",
    location: "Guildford, UK",
    note: "#1 ranked computer vision lab in UK",
    description: [
      "• Designed novel multi-loss CycleGAN (6 custom losses: adversarial, cycle consistency, CLIP semantics, MiDaS depth, sketch extractor) for unpaired full-to-flat-color image transformation, trained on 2,246 portrait images.",
      "• Researched graph-based audio captioning model combining BART transformer with graph convolutional network and syntax-aware dependency parsing on the Clotho benchmark.",
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
