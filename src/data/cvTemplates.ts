import type { CVData } from "../types/cv";

export interface CVTemplate {
  id: string;
  labelFr: string;
  labelEn: string;
  descFr: string;
  descEn: string;
  data: Omit<CVData, "meta"> & { meta: Pick<CVData["meta"], "template" | "title"> };
}

const uid = () => crypto.randomUUID();

export const CV_TEMPLATES: CVTemplate[] = [
  {
    id: "developer",
    labelFr: "Developpeur",
    labelEn: "Developer",
    descFr: "Stack technique, projets, GitHub",
    descEn: "Tech stack, projects, GitHub",
    data: {
      meta: { template: "modern", title: "CV Developpeur" },
      profile: {
        firstName: "Alex",
        lastName: "Martin",
        photo: "",
        jobTitle: "Developpeur Full Stack",
        email: "alex.martin@email.com",
        phone: "+33 6 12 34 56 78",
        location: "Paris, France",
        summary:
          "Developpeur Full Stack avec 4 ans d'experience en React, Node.js et TypeScript. Passionne par la qualite du code, les architectures scalables et l'experience utilisateur.",
        linkedin: "linkedin.com/in/alexmartin",
        website: "alexmartin.dev",
      },
      sections: [
        {
          id: "experience",
          type: "experience",
          visible: true,
          items: [
            {
              id: uid(),
              company: "TechCorp",
              position: "Developpeur Full Stack",
              startDate: "2022-03",
              endDate: "",
              current: true,
              description:
                "Developpement d'une plateforme SaaS avec React et Node.js. Mise en place de CI/CD, tests automatises. Amelioration des performances de 40%.",
            },
            {
              id: uid(),
              company: "StartupXYZ",
              position: "Developpeur Frontend",
              startDate: "2020-06",
              endDate: "2022-02",
              current: false,
              description:
                "Creation d'interfaces utilisateur en React et TypeScript. Integration d'APIs REST. Collaboration avec l'equipe design pour ameliorer l'UX.",
            },
          ],
        },
        {
          id: "education",
          type: "education",
          visible: true,
          items: [
            {
              id: uid(),
              institution: "Universite Paris-Saclay",
              degree: "Master",
              field: "Informatique",
              startDate: "2018",
              endDate: "2020",
              description: "",
            },
          ],
        },
        {
          id: "skills",
          type: "skills",
          visible: true,
          items: [
            { id: uid(), category: "Frontend", items: ["React", "TypeScript", "Tailwind CSS", "Next.js"] },
            { id: uid(), category: "Backend", items: ["Node.js", "Express", "PostgreSQL", "Docker"] },
            { id: uid(), category: "Outils", items: ["Git", "GitHub Actions", "Figma", "Jira"] },
          ],
        },
        {
          id: "languages",
          type: "languages",
          visible: true,
          items: [
            { id: uid(), language: "Francais", level: "native" },
            { id: uid(), language: "Anglais", level: "fluent" },
          ],
        },
        {
          id: "projects",
          type: "projects",
          visible: true,
          items: [
            {
              id: uid(),
              name: "TaskFlow",
              role: "Createur",
              url: "github.com/alexmartin/taskflow",
              startDate: "2023",
              endDate: "",
              description: "Application de gestion de taches en React avec drag & drop et synchronisation temps reel.",
            },
          ],
        },
      ],
      customization: {
        colors: { accent: "#2563eb" },
        font: "Inter",
        fontSize: 10,
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        lineSpacing: 1.15,
      },
    },
  },
  {
    id: "marketing",
    labelFr: "Marketing",
    labelEn: "Marketing",
    descFr: "Campagnes, KPIs, strategie",
    descEn: "Campaigns, KPIs, strategy",
    data: {
      meta: { template: "creative", title: "CV Marketing" },
      profile: {
        firstName: "Camille",
        lastName: "Dubois",
        photo: "",
        jobTitle: "Responsable Marketing Digital",
        email: "camille.dubois@email.com",
        phone: "+33 6 98 76 54 32",
        location: "Lyon, France",
        summary:
          "5 ans d'experience en marketing digital. Expertise en SEO, SEA, social media et content marketing. Resultats prouves : +150% de trafic organique, ROI campagnes x3.",
        linkedin: "linkedin.com/in/camilledubois",
        website: "",
      },
      sections: [
        {
          id: "experience",
          type: "experience",
          visible: true,
          items: [
            {
              id: uid(),
              company: "AgenceDigitale",
              position: "Responsable Marketing Digital",
              startDate: "2021-09",
              endDate: "",
              current: true,
              description:
                "Pilotage de la strategie digitale pour 12 clients. Gestion d'un budget annuel de 500K. Augmentation du taux de conversion moyen de 35%.",
            },
            {
              id: uid(),
              company: "E-Commerce Plus",
              position: "Chef de projet SEO/SEA",
              startDate: "2019-03",
              endDate: "2021-08",
              current: false,
              description:
                "Gestion de campagnes Google Ads et Meta Ads. Strategie de contenu SEO. +150% de trafic organique en 18 mois.",
            },
          ],
        },
        {
          id: "education",
          type: "education",
          visible: true,
          items: [
            {
              id: uid(),
              institution: "ESSEC Business School",
              degree: "Master",
              field: "Marketing Digital",
              startDate: "2017",
              endDate: "2019",
              description: "",
            },
          ],
        },
        {
          id: "skills",
          type: "skills",
          visible: true,
          items: [
            { id: uid(), category: "Marketing", items: ["SEO", "SEA", "Google Analytics", "Content Marketing"] },
            { id: uid(), category: "Outils", items: ["HubSpot", "Semrush", "Meta Business Suite", "Canva"] },
            { id: uid(), category: "Competences", items: ["Gestion de projet", "Analyse de donnees", "Copywriting"] },
          ],
        },
        {
          id: "languages",
          type: "languages",
          visible: true,
          items: [
            { id: uid(), language: "Francais", level: "native" },
            { id: uid(), language: "Anglais", level: "fluent" },
            { id: uid(), language: "Espagnol", level: "intermediate" },
          ],
        },
        {
          id: "certifications",
          type: "certifications",
          visible: true,
          items: [
            { id: uid(), name: "Google Ads Certification", issuer: "Google", date: "2023", url: "" },
            { id: uid(), name: "HubSpot Inbound Marketing", issuer: "HubSpot", date: "2022", url: "" },
          ],
        },
      ],
      customization: {
        colors: { accent: "#e11d48" },
        font: "Inter",
        fontSize: 10,
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        lineSpacing: 1.15,
      },
    },
  },
  {
    id: "student",
    labelFr: "Etudiant",
    labelEn: "Student",
    descFr: "Stages, formation, associatif",
    descEn: "Internships, education, activities",
    data: {
      meta: { template: "minimal", title: "CV Etudiant" },
      profile: {
        firstName: "Jordan",
        lastName: "Petit",
        photo: "",
        jobTitle: "Etudiant en Commerce International",
        email: "jordan.petit@email.com",
        phone: "+33 7 11 22 33 44",
        location: "Bordeaux, France",
        summary:
          "Etudiant en 3e annee de Commerce International, a la recherche d'un stage de 6 mois. Motive, polyvalent et dote d'un excellent sens du relationnel.",
        linkedin: "linkedin.com/in/jordanpetit",
        website: "",
      },
      sections: [
        {
          id: "experience",
          type: "experience",
          visible: true,
          items: [
            {
              id: uid(),
              company: "Entreprise ABC",
              position: "Stage Assistant Commercial",
              startDate: "2024-06",
              endDate: "2024-08",
              current: false,
              description:
                "Prospection de nouveaux clients B2B. Preparation de propositions commerciales. Suivi CRM et reporting hebdomadaire.",
            },
          ],
        },
        {
          id: "education",
          type: "education",
          visible: true,
          items: [
            {
              id: uid(),
              institution: "KEDGE Business School",
              degree: "Bachelor",
              field: "Commerce International",
              startDate: "2022",
              endDate: "2025",
              description: "Specialisation en negociation internationale et supply chain.",
            },
            {
              id: uid(),
              institution: "Lycee Montaigne",
              degree: "Baccalaureat",
              field: "Filiere Generale (SES)",
              startDate: "2019",
              endDate: "2022",
              description: "Mention Bien",
            },
          ],
        },
        {
          id: "skills",
          type: "skills",
          visible: true,
          items: [
            { id: uid(), category: "Bureautique", items: ["Excel", "PowerPoint", "Word", "Google Workspace"] },
            { id: uid(), category: "Competences", items: ["Communication", "Travail d'equipe", "Adaptabilite"] },
          ],
        },
        {
          id: "languages",
          type: "languages",
          visible: true,
          items: [
            { id: uid(), language: "Francais", level: "native" },
            { id: uid(), language: "Anglais", level: "advanced" },
            { id: uid(), language: "Espagnol", level: "intermediate" },
          ],
        },
        {
          id: "volunteering",
          type: "volunteering",
          visible: true,
          items: [
            {
              id: uid(),
              organization: "Bureau des Etudiants",
              role: "Responsable evenementiel",
              startDate: "2023-09",
              endDate: "",
              current: true,
              description: "Organisation d'evenements pour 500+ etudiants. Gestion d'un budget de 8 000 euros.",
            },
          ],
        },
      ],
      customization: {
        colors: { accent: "#0891b2" },
        font: "Inter",
        fontSize: 10,
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        lineSpacing: 1.15,
      },
    },
  },
  {
    id: "designer",
    labelFr: "Designer",
    labelEn: "Designer",
    descFr: "Portfolio, UX/UI, outils creatifs",
    descEn: "Portfolio, UX/UI, creative tools",
    data: {
      meta: { template: "creative", title: "CV Designer" },
      profile: {
        firstName: "Lea",
        lastName: "Bernard",
        photo: "",
        jobTitle: "UX/UI Designer",
        email: "lea.bernard@email.com",
        phone: "+33 6 55 44 33 22",
        location: "Nantes, France",
        summary:
          "Designer UX/UI avec 3 ans d'experience. Centree utilisateur, passionnee par le design system et l'accessibilite. Portfolio : leabernard.design",
        linkedin: "linkedin.com/in/leabernard",
        website: "leabernard.design",
      },
      sections: [
        {
          id: "experience",
          type: "experience",
          visible: true,
          items: [
            {
              id: uid(),
              company: "Studio Creatif",
              position: "UX/UI Designer",
              startDate: "2022-01",
              endDate: "",
              current: true,
              description:
                "Conception d'interfaces pour apps mobile et web. Creation et maintenance du design system. Recherche utilisateur et tests d'utilisabilite.",
            },
            {
              id: uid(),
              company: "Freelance",
              position: "Graphiste & Web Designer",
              startDate: "2020-06",
              endDate: "2021-12",
              current: false,
              description:
                "Identite visuelle, sites web et supports de communication pour PME et startups. 20+ projets livres.",
            },
          ],
        },
        {
          id: "education",
          type: "education",
          visible: true,
          items: [
            {
              id: uid(),
              institution: "Ecole de Design Nantes",
              degree: "Master",
              field: "Design d'Interaction",
              startDate: "2018",
              endDate: "2020",
              description: "",
            },
          ],
        },
        {
          id: "skills",
          type: "skills",
          visible: true,
          items: [
            { id: uid(), category: "Design", items: ["Figma", "Sketch", "Adobe XD", "Principle"] },
            { id: uid(), category: "Graphisme", items: ["Photoshop", "Illustrator", "After Effects"] },
            { id: uid(), category: "Web", items: ["HTML/CSS", "Tailwind", "Framer", "Webflow"] },
          ],
        },
        {
          id: "languages",
          type: "languages",
          visible: true,
          items: [
            { id: uid(), language: "Francais", level: "native" },
            { id: uid(), language: "Anglais", level: "fluent" },
          ],
        },
      ],
      customization: {
        colors: { accent: "#8b5cf6" },
        font: "Inter",
        fontSize: 10,
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        lineSpacing: 1.15,
      },
    },
  },
];
