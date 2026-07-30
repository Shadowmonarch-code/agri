export interface CompetitiveExam {
  id: string;
  name: string;
  slug: string;
  fullName: string;
  description: string;
  icon: string;
  color: string;
  eligibility: string;
  pattern: string;
  syllabus: string[];
  features: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  duration: string;
  marks: number;
  popular: boolean;
}

export const competitiveExams: CompetitiveExam[] = [
  {
    id: "icar-jrf",
    name: "ICAR JRF",
    slug: "icar-jrf",
    fullName: "ICAR Junior Research Fellowship",
    description:
      "Premier national-level examination for admission to Master's programs in agriculture and allied sciences with Junior Research Fellowship.",
    icon: "🎓",
    color: "#2E7D32",
    eligibility: "Bachelor's degree with minimum 50% (General) or 45% (Reserved)",
    pattern: "Single exam, MCQ based, 480 marks total",
    syllabus: [
      "Physics",
      "Chemistry",
      "Biology/Agriculture/Mathematics",
      "Subject-specific syllabus",
    ],
    features: [
      "National Level Exam",
      "JRF Stipend: ₹31,000/month",
      "Admission to Top ICAR Institutes",
      "Research Opportunities",
    ],
    difficulty: "Hard",
    duration: "3 Hours",
    marks: 480,
    popular: true,
  },
  {
    id: "icar-srf",
    name: "ICAR SRF",
    slug: "icar-srf",
    fullName: "ICAR Senior Research Fellowship",
    description:
      "Advanced fellowship for pursuing doctoral research in agricultural sciences with enhanced stipend.",
    icon: "🔬",
    color: "#1565C0",
    eligibility: "Master's degree in relevant discipline with qualifying score",
    pattern: "Single exam, MCQ + Descriptive, research proposal evaluation",
    syllabus: [
      "Research Methodology",
      "Subject-specific advanced topics",
      "Statistics & Data Analysis",
      "Recent Advances in Field",
    ],
    features: [
      "SRF Stipend: ₹35,000-42,000/month",
      "PhD Admission Support",
      "Research Grant Eligibility",
      "Career in Agricultural Research",
    ],
    difficulty: "Hard",
    duration: "3 Hours",
    marks: 500,
    popular: false,
  },
  {
    id: "icar-pg",
    name: "ICAR PG",
    slug: "icar-pg",
    fullName: "ICAR Postgraduate Admission",
    description:
      "All India entrance examination for admission to postgraduate degree programs across ICAR deemed universities.",
    icon: "📚",
    color: "#7B1FA2",
    eligibility: "Bachelor's degree with minimum OGPA/percentage as per ICAR norms",
    pattern: "Single MCQ exam covering cross-disciplinary and subject-specific areas",
    syllabus: [
      "General Aptitude",
      "Domain Knowledge",
      "Subject-Specific Topics",
      "Current Affairs in Agriculture",
    ],
    features: [
      "100+ Participating Universities",
      "Multiple Discipline Options",
      "Merit-based Counseling",
      "Scholarship Opportunities",
    ],
    difficulty: "Medium",
    duration: "2.5 Hours",
    marks: 480,
    popular: true,
  },
  {
    id: "aieea",
    name: "AIEEA",
    slug: "aieea",
    fullName: "All India Entrance Examination for Admission",
    description:
      "Undergraduate entrance exam for bachelor's programs in agriculture and allied sciences at ICAR institutions.",
    icon: "🌾",
    color: "#E65100",
    eligibility: "10+2/Intermediate with PCB/PCM/PCMB stream",
    pattern: "MCQ based exam with PCM/PCB compulsory and optional subject",
    syllabus: [
      "Physics",
      "Chemistry",
      "Mathematics/Biology/Agriculture",
      "Aptitude",
    ],
    features: [
      "UG Admission to Top Colleges",
      "20% All India Quota",
      "Multiple Course Options",
      "National Recognition",
    ],
    difficulty: "Medium",
    duration: "2.5 Hours",
    marks: 600,
    popular: true,
  },
  {
    id: "csir-net",
    name: "CSIR NET",
    slug: "csir-net",
    fullName: "CSIR National Eligibility Test",
    description:
      "National level test for determining eligibility for Junior Research Fellowship and Lectureship in science subjects.",
    icon: "🧪",
    color: "#00695C",
    eligibility: "M.Sc. or equivalent degree with minimum 55%",
    pattern: "Single paper MCQ test divided into Parts A, B, C",
    syllabus: [
      "General Aptitude (Part A)",
      "Subject-related (Part B & C)",
      "Life Sciences / Chemical Sciences",
      "Analytical Skills",
    ],
    features: [
      "JRF + LS Eligibility",
      "CSIR Labs Recruitment",
      "Valid for 2 Years",
      "Prestigious Certification",
    ],
    difficulty: "Hard",
    duration: "3 Hours",
    marks: 340,
    popular: true,
  },
  {
    id: "dbt-bet",
    name: "DBT BET",
    slug: "dbt-bet",
    fullName: "DBT Biotechnology Eligibility Test",
    description:
      "National-level examination for DBT-JRF and awarding of lectureship/assistant professor positions in biotechnology.",
    icon: "🧬",
    color: "#7B1FA2",
    eligibility: "Postgraduate degree in Biotechnology/Life Sciences",
    pattern: "Part A (Aptitude) + Part B (Subject Specific)",
    syllabus: [
      "General Biotechnology",
      "Molecular Biology",
      "Biochemistry",
      "Genetics & Genomics",
    ],
    features: [
      "DBT-JRF Fellowship",
      "GATE Qualified Exemption",
      "Biotech Industry Recognition",
      "Research Funding Access",
    ],
    difficulty: "Hard",
    duration: "2 Hours",
    marks: 300,
    popular: false,
  },
  {
    id: "iit-jam",
    name: "IIT JAM",
    slug: "iit-jam",
    fullName: "Joint Admission Test for Masters",
    description:
      "National-level entrance test for admission to M.Sc. and other post-bachelor programs at IITs and integrated PhD at IISc.",
    icon: "🎯",
    color: "#C62828",
    eligibility: "Bachelor's degree with minimum 55%/CGPA 5.5",
    pattern: "MCQ, MSQ, and NAT questions",
    syllabus: [
      "Biological Sciences (BL)",
      "Chemistry (CY)",
      "Geology (GG)",
      "Mathematics (MA)",
      "Physics (PH)",
      "Mathematical Statistics (MA)",
    ],
    features: [
      "IIT/IISc Admission",
      "Quality Education",
      "Research Opportunities",
      "Industry Placements",
    ],
    difficulty: "Hard",
    duration: "3 Hours",
    marks: 100,
    popular: true,
  },
  {
    id: "gate-bt",
    name: "GATE Biotechnology",
    slug: "gate-biotechnology",
    fullName: "Graduate Aptitude Test in Engineering - BT",
    description:
      "National examination for admission to ME/M.Tech/PhD programs and PSUs recruitment in biotechnology sector.",
    icon: "⚡",
    color: "#AD1457",
    eligibility: "Bachelor's degree in Engineering/Technology/Science (3rd year or completed)",
    pattern: "MCQ and NAT type questions over 3 hours",
    syllabus: [
      "Engineering Mathematics",
      "General Biotechnology",
      "Recombinant DNA Technology",
      "Plant & Animal Biotechnology",
      "Bioprocess Engineering",
      "Bioinformatics",
    ],
    features: [
      "PSU Recruitment",
      "M.Tech Admissions",
      "GATE Score Validity: 3 Years",
      "Fellowship for GATE qualified",
    ],
    difficulty: "Hard",
    duration: "3 Hours",
    marks: 100,
    popular: true,
  },
  {
    id: "gate-ls",
    name: "GATE Life Sciences",
    slug: "gate-life-sciences",
    fullName: "Graduate Aptitude Test in Engineering - XL",
    description:
      "GATE examination specifically designed for life sciences graduates seeking higher education and research opportunities.",
    icon: "🧫",
    color: "#00838F",
    eligibility: "Master's degree in Life Sciences or related field",
    pattern: "Compulsory Chemistry + Optional Subject Papers",
    syllabus: [
      "Chemistry (Compulsory)",
      "Biochemistry",
      "Botany",
      "Microbiology",
      "Zoology",
      "Food Technology",
    ],
    features: [
      "IITs/NITs Admission",
      "PSU Jobs",
      "Research Fellowships",
      "Career Advancement",
    ],
    difficulty: "Hard",
    duration: "3 Hours",
    marks: 100,
    popular: false,
  },
  {
    id: "asrb",
    name: "ASRB",
    slug: "asrb",
    fullName: "Agricultural Scientists Recruitment Board",
    description:
      "Recruitment examinations for scientific and research positions under Indian Council of Agricultural Research.",
    icon: "🏛️",
    color: "#37474F",
    eligibility: "Master's/PhD degree in relevant agricultural discipline",
    pattern: "Preliminary ARS + Main Examination + Interview",
    syllabus: [
      "Domain Knowledge",
      "Agricultural Research Methods",
      "Current Issues in Agriculture",
      "General Awareness",
    ],
    features: [
      "Government Scientist Position",
      "ICAR Research Institutes",
      "Job Security",
      "Career Growth",
    ],
    difficulty: "Very Hard",
    duration: "2-3 Hours each paper",
    marks: 150,
    popular: false,
  },
  {
    id: "ars-net",
    name: "ARS NET",
    slug: "ars-net",
    fullName: "Agricultural Research Service - National Eligibility Test",
    description:
      "Combined examination for ARS (recruitment) and NET (eligibility for lectureship) in agricultural sciences.",
    icon: "📋",
    color: "#455A64",
    eligibility: "Master's degree with minimum 55% (6.0/10 OGPA)",
    pattern: "Preliminary (ARS/NET) + Main (ARS only) + Viva-Voce",
    syllabus: [
      "General Agriculture",
      "Subject Specialization",
      "Research Methodology",
      "Current Affairs",
    ],
    features: [
      "Lecturer Eligibility",
      "Scientist Position",
      "SAU Positions",
      "National Recognition",
    ],
    difficulty: "Very Hard",
    duration: "2 Hours (Preliminary)",
    marks: 200,
    popular: false,
  },
  {
    id: "net-ls",
    name: "NET Life Sciences",
    slug: "net-life-sciences",
    fullName: "NET Examination in Life Sciences",
    description:
      "Eligibility test for assistant professor and junior research fellowship in life sciences domain.",
    icon: "🔬",
    color: "#5E35B1",
    eligibility: "Master's degree in Life Sciences with minimum 55%",
    pattern: "Paper I (Teaching Aptitude) + Paper II (Subject)",
    syllabus: [
      "Teaching Methodology",
      "Cell Biology",
      "Molecular Biology",
      "Genetics",
      "Biochemistry",
      "Ecology",
    ],
    features: [
      "Assistant Professor Eligibility",
      "JRF Opportunity",
      "University/College Teaching",
      "UGC Recognized",
    ],
    difficulty: "Hard",
    duration: "3 Hours combined",
    marks: 300,
    popular: true,
  },
  {
    id: "cuet-pg",
    name: "CUET PG",
    slug: "cuet-pg",
    fullName: "Common University Entrance Test - Postgraduate",
    description:
      "National-level common entrance test for admission to various postgraduate programs across central and participating universities.",
    icon: "🎓",
    color: "#D81B60",
    eligibility: "Bachelor's degree from recognized university",
    pattern: "Computer Based Test (CBT), MCQ format",
    syllabus: [
      "General/Domain Knowledge",
      "Language Comprehension",
      "Reasoning",
      "Subject-Specific Syllabus",
    ],
    features: [
      "44+ Central Universities",
      "Single Application Process",
      "Multiple Program Options",
      "Transparent Merit List",
    ],
    difficulty: "Medium",
    duration: "2 Hours",
    marks: 400,
    popular: true,
  },
  {
    id: "ugc-net",
    name: "UGC NET",
    slug: "ugc-net",
    fullName: "UGC National Eligibility Test",
    description:
      "Examination for determining eligibility for Assistant Professor and Junior Research Fellowship in Indian universities.",
    icon: "📖",
    color: "#0277BD",
    eligibility: "Master's degree with minimum 55%",
    pattern: "Paper I (General) + Paper II (Elective Subject)",
    syllabus: [
      "Teaching & Research Aptitude",
      "Subject-specific topics",
      "Reasoning Ability",
      "Data Interpretation",
      "ICT",
    ],
    features: [
      "Assistant Professor Eligibility",
      "JRF Fellowship",
      "University Positions",
      "Valid Nationwide",
    ],
    difficulty: "Hard",
    duration: "3 Hours combined",
    marks: 300,
    popular: true,
  },
];

export const getExamBySlug = (slug: string): CompetitiveExam | undefined => {
  return competitiveExams.find((exam) => exam.slug === slug);
};

export const getPopularExams = (): CompetitiveExam[] => {
  return competitiveExams.filter((exam) => exam.popular);
};

export const getExamsByDifficulty = (
  difficulty: "Easy" | "Medium" | "Hard"
): CompetitiveExam[] => {
  return competitiveExams.filter((exam) => exam.difficulty === difficulty);
};
