export interface Department {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
  semesters: number;
  subjects: string[];
}

export const departments: Department[] = [
  {
    id: "agriculture",
    name: "Agriculture",
    slug: "agriculture",
    icon: "🌾",
    description:
      "Comprehensive study of crop production, soil management, and agricultural sciences for sustainable farming practices.",
    color: "#2E7D32",
    semesters: 8,
    subjects: [
      "Principles of Agronomy",
      "Field Crops",
      "Weed Management",
      "Irrigation Management",
      "Crop Physiology",
      "Farming Systems",
    ],
  },
  {
    id: "horticulture",
    name: "Horticulture",
    slug: "horticulture",
    icon: "🍎",
    description:
      "Study of fruits, vegetables, spices, plantation crops, and floriculture for enhanced productivity.",
    color: "#E65100",
    semesters: 8,
    subjects: [
      "Fruit Science",
      "Vegetable Science",
      "Floriculture",
      "Spices & Plantation Crops",
      "Post-Harvest Technology",
      "Landscaping",
    ],
  },
  {
    id: "forestry",
    name: "Forestry",
    slug: "forestry",
    icon: "🌲",
    description:
      "Forest management, silviculture, forest ecology, and conservation of natural resources.",
    color: "#1B5E20",
    semesters: 8,
    subjects: [
      "Silviculture",
      "Forest Management",
      "Forest Ecology",
      "Wood Science",
      "Wildlife Management",
      "Agroforestry",
    ],
  },
  {
    id: "biotechnology",
    name: "Biotechnology",
    slug: "biotechnology",
    icon: "🧬",
    description:
      "Application of biological systems and organisms to develop products and technologies in agriculture.",
    color: "#7B1FA2",
    semesters: 8,
    subjects: [
      "Cell Biology",
      "Molecular Biology",
      "Recombinant DNA Technology",
      "Genetic Engineering",
      "Bioprocess Engineering",
      "Bioinformatics",
    ],
  },
  {
    id: "agri-engineering",
    name: "Agricultural Engineering",
    slug: "agricultural-engineering",
    icon: "⚙️",
    description:
      "Engineering principles applied to agriculture, farm machinery, irrigation, and food processing.",
    color: "#0277BD",
    semesters: 8,
    subjects: [
      "Farm Machinery",
      "Soil & Water Engineering",
      "Renewable Energy",
      "Food Process Engineering",
      "Agricultural Structures",
      "Dairy Engineering",
    ],
  },
  {
    id: "community-science",
    name: "Community Science",
    slug: "community-science",
    icon: "👨‍👩‍👧‍👦",
    description:
      "Holistic study of human development, family resource management, and community welfare.",
    color: "#C2185B",
    semesters: 8,
    subjects: [
      "Human Development",
      "Food & Nutrition",
      "Family Resource Management",
      "Textiles & Clothing",
      "Extension Education",
      "Communication Systems",
    ],
  },
  {
    id: "food-nutrition",
    name: "Food Nutrition & Dietetics",
    slug: "food-nutrition-dietetics",
    icon: "🥗",
    description:
      "Science of nutrition, diet planning, therapeutic nutrition, and public health nutrition.",
    color: "#00838F",
    semesters: 8,
    subjects: [
      "Human Nutrition",
      "Therapeutic Nutrition",
      "Public Health Nutrition",
      "Food Science",
      "Diet Therapy",
      "Nutritional Biochemistry",
    ],
  },
  {
    id: "dairy-technology",
    name: "Dairy Technology",
    slug: "dairy-technology",
    icon: "🥛",
    description:
      "Processing, preservation, and quality control of milk and dairy products manufacturing.",
    color: "#5D4037",
    semesters: 8,
    subjects: [
      "Dairy Chemistry",
      "Dairy Microbiology",
      "Dairy Engineering",
      "Dairy Products Technology",
      "Quality Control",
      "Dairy Plant Management",
    ],
  },
  {
    id: "food-technology",
    name: "Food Technology",
    slug: "food-technology",
    icon: "🏭",
    description:
      "Food processing, packaging, preservation, and quality assurance in food industries.",
    color: "#EF6C00",
    semesters: 8,
    subjects: [
      "Food Processing",
      "Food Packaging",
      "Food Safety & Quality",
      "Food Chemistry",
      "Food Analysis",
      "Novel Food Products",
    ],
  },
  {
    id: "plant-pathology",
    name: "Plant Pathology",
    slug: "plant-pathology",
    icon: "🍂",
    description:
      "Study of plant diseases, their causes, mechanisms, and control measures for crop protection.",
    color: "#4E342E",
    semesters: 8,
    subjects: [
      "Principles of Pathology",
      "Mycology",
      "Bacteriology",
      "Virology",
      "Nematology",
      "Disease Management",
    ],
  },
  {
    id: "entomology",
    name: "Entomology",
    slug: "entomology",
    icon: "🐛",
    description:
      "Scientific study of insects, their behavior, ecology, and pest management strategies.",
    color: "#6A1B9A",
    semesters: 8,
    subjects: [
      "General Entomology",
      "Insect Morphology",
      "Insect Physiology",
      "Insect Ecology",
      "Pest Management",
      "Biological Control",
    ],
  },
  {
    id: "agronomy",
    name: "Agronomy",
    slug: "agronomy",
    icon: "🌱",
    description:
      "Science of soil management and crop production for optimizing agricultural output sustainably.",
    color: "#33691E",
    semesters: 8,
    subjects: [
      "Principles of Agronomy",
      "Field Crops I & II",
      "Weed Science",
      "Water Management",
      "Farming Systems",
      "Organic Farming",
    ],
  },
  {
    id: "soil-science",
    name: "Soil Science",
    slug: "soil-science",
    icon: "🪴",
    description:
      "Study of soil properties, classification, fertility, and management for sustainable agriculture.",
    color: "#795548",
    semesters: 8,
    subjects: [
      "Soil Physics",
      "Soil Chemistry",
      "Soil Fertility",
      "Soil Survey",
      "Soil Conservation",
      "Soil Microbiology",
    ],
  },
  {
    id: "plant-breeding",
    name: "Plant Breeding & Genetics",
    slug: "plant-breeding-genetics",
    icon: "🧬",
    description:
      "Development of improved crop varieties through genetic manipulation and breeding techniques.",
    color: "#303F9F",
    semesters: 8,
    subjects: [
      "Principles of Genetics",
      "Cytogenetics",
      "Quantitative Genetics",
      "Plant Breeding Methods",
      "Seed Technology",
      "Molecular Breeding",
    ],
  },
  {
    id: "seed-science",
    name: "Seed Science",
    slug: "seed-science",
    icon: "🌰",
    description:
      "Seed production, processing, testing, storage, and certification for quality seed supply.",
    color: "#827717",
    semesters: 8,
    subjects: [
      "Seed Production",
      "Seed Processing",
      "Seed Testing",
      "Seed Certification",
      "Seed Health",
      "Seed Storage",
    ],
  },
  {
    id: "agri-economics",
    name: "Agricultural Economics",
    slug: "agricultural-economics",
    icon: "📊",
    description:
      "Economic aspects of agriculture, marketing, policy, and rural development studies.",
    color: "#00695C",
    semesters: 8,
    subjects: [
      "Microeconomics",
      "Macroeconomics",
      "Farm Management",
      "Agricultural Marketing",
      "Production Economics",
      "Policy & Planning",
    ],
  },
  {
    id: "agri-extension",
    name: "Agricultural Extension",
    slug: "agricultural-extension",
    icon: "📢",
    description:
      "Dissemination of agricultural information, technology transfer, and community development.",
    color: "#455A64",
    semesters: 8,
    subjects: [
      "Extension Methods",
      "Rural Sociology",
      "Communication",
      "Programme Planning",
      "Diffusion of Innovation",
      "Training & Visit",
    ],
  },
  {
    id: "animal-science",
    name: "Animal Science",
    slug: "animal-science",
    icon: "🐄",
    description:
      "Study of animal breeding, nutrition, physiology, and management for livestock production.",
    color: "#BF360C",
    semesters: 8,
    subjects: [
      "Animal Breeding",
      "Animal Nutrition",
      "Animal Physiology",
      "Livestock Management",
      "Poultry Science",
      "Animal Products Technology",
    ],
  },
  {
    id: "veterinary-science",
    name: "Veterinary Science",
    slug: "veterinary-science",
    icon: "🏥",
    description:
      "Animal health, disease diagnosis, treatment, prevention, and veterinary public health.",
    color: "#37474F",
    semesters: 10,
    subjects: [
      "Veterinary Anatomy",
      "Veterinary Physiology",
      "Veterinary Pharmacology",
      "Veterinary Pathology",
      "Veterinary Medicine",
      "Veterinary Surgery",
    ],
  },
  {
    id: "fisheries",
    name: "Fisheries",
    slug: "fisheries",
    icon: "🐟",
    description:
      "Aquaculture, fish processing, fisheries management, and aquatic resource utilization.",
    color: "#01579B",
    semesters: 8,
    subjects: [
      "Aquaculture",
      "Fishery Biology",
      "Fish Processing",
      "Fish Nutrition",
      "Fishery Engineering",
      "Coastal Aquaculture",
    ],
  },
  {
    id: "sericulture",
    name: "Sericulture",
    slug: "sericulture",
    icon: "🦋",
    description:
      "Silkworm rearing, silk production, mulberry cultivation, and silk industry management.",
    color: "#4A148C",
    semesters: 8,
    subjects: [
      "Mulberry Cultivation",
      "Silkworm Rearing",
      "Grainage Management",
      "Seed Technology",
      "Silk Reeling",
      "Disease Management",
    ],
  },
  {
    id: "agribusiness",
    name: "Agri Business Management",
    slug: "agri-business-management",
    icon: "💼",
    description:
      "Business management in agriculture sector including marketing, finance, and entrepreneurship.",
    color: "#E65100",
    semesters: 8,
    subjects: [
      "Management Principles",
      "Agri Marketing",
      "Financial Management",
      "Supply Chain",
      "Agri Entrepreneurship",
      "Business Law",
    ],
  },
  {
    id: "microbiology",
    name: "Microbiology",
    slug: "microbiology",
    icon: "🔬",
    description:
      "Study of microorganisms, their applications in agriculture, industry, and environment.",
    color: "#004D40",
    semesters: 8,
    subjects: [
      "General Microbiology",
      "Bacteriology",
      "Virology",
      "Immunology",
      "Industrial Microbiology",
      "Agricultural Microbiology",
    ],
  },
  {
    id: "biochemistry",
    name: "Biochemistry",
    slug: "biochemistry",
    icon: "⚗️",
    description:
      "Chemical processes within living organisms, metabolism, enzymes, and molecular biology.",
    color: "#283593",
    semesters: 8,
    subjects: [
      "Biomolecules",
      "Enzymology",
      "Metabolism",
      "Molecular Biology",
      "Clinical Biochemistry",
      "Plant Biochemistry",
    ],
  },
  {
    id: "environmental-science",
    name: "Environmental Science",
    slug: "environmental-science",
    icon: "🌍",
    description:
      "Environmental protection, ecology, pollution control, and natural resource management.",
    color: "#1B5E20",
    semesters: 8,
    subjects: [
      "Ecology",
      "Environmental Chemistry",
      "Pollution Control",
      "Biodiversity",
      "Climate Change",
      "Environmental Laws",
    ],
  },
];

export const getDepartmentBySlug = (slug: string): Department | undefined => {
  return departments.find((dept) => dept.slug === slug);
};

export const getDepartmentsByCategory = (category: string): Department[] => {
  const categories: Record<string, string[]> = {
    core: ["agriculture", "horticulture", "forestry", "agronomy", "soil-science"],
    life_sciences: ["biotechnology", "microbiology", "biochemistry", "plant-pathology", "entomology"],
    engineering: ["agri-engineering", "food-technology", "dairy-technology"],
    science: ["plant-breeding", "seed-science", "environmental-science"],
    social: ["agri-economics", "agri-extension", "community-science", "agribusiness"],
    animal: ["animal-science", "veterinary-science", "fisheries", "sericulture"],
    nutrition: ["food-nutrition"],
  };
  
  const slugs = categories[category] || [];
  return departments.filter((dept) => slugs.includes(dept.id));
};
