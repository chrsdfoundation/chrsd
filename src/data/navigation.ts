// =====================================================================
// CHRSD navigation + site configuration
// Encodes the Phase 2 "Immutable Architecture Block" mega-menu matrix.
// Editing nav here updates the header, mobile menu, and footer at once.
// =====================================================================

export interface NavLink {
  label: string;
  url: string;
  external?: boolean;
}

export interface NavGroup {
  group: string;
  items: NavLink[];
}

export interface NavPillar {
  label: string;
  url: string;
  groups: NavGroup[];
}

export const site = {
  name: 'CHRSD',
  legalName: 'Centre for Humanitarian Research and Social Development Foundation',
  shortName: 'CHRS Development',
  founded: 2023,
  tagline: "There's always a way",
  url: 'https://www.chrsd.org',
  donateUrl: '/donate/',
  careersUrl: 'https://careers.chrsd.org/',
  tenderUrl: 'https://tender.chrsd.org/',
  email: 'info@chrsd.org',
  phone: '+880-2-47122566',
  address: '29 Toyenbee Circular Road (5th Floor), Motijheel C/A, Dhaka-1000',
  regNo: 'S-14480/2026',
  social: {
    facebook: 'https://www.facebook.com/chrsd.foundation',
    x: 'https://x.com/chrsdfbd',
    instagram: 'https://www.instagram.com/chrs.df',
    youtube: 'https://www.youtube.com/@CHRSD-org',
    linkedin: 'https://www.linkedin.com/company/chrsdfoundation',
  },
};

// ---- Primary navigation — 4 top-level buckets ----
export const navigation: NavPillar[] = [
  {
    label: 'About',
    url: '/about-us/',
    groups: [
      {
        group: 'Our Identity',
        items: [
          { label: 'About CHRSD', url: '/about-us/about_chrsd/' },
          { label: "Executive Director's Message", url: '/about-us/executive-directors-message/' },
          { label: 'Our History & Milestones', url: '/about-us/our-history/' },
          { label: 'Awards and Recognitions', url: '/about-us/chrsd-awards-and-recognitions/' },
        ],
      },
      {
        group: 'Governance & Transparency',
        items: [
          { label: 'Advisory Board', url: '/about-us/advisory-board/' },
          { label: 'Our Team', url: '/about-us/team/' },
          { label: 'Institutional Organogram', url: '/about-us/organogram/' },
        ],
      },
      {
        group: 'Accountability Hub',
        items: [
          { label: 'Partners', url: '/about-us/governance-and-good-practices/partners/' },
          { label: 'Financial Audits & External Reports', url: '/about-us/governance-and-good-practices/financials-and-external-audit/' },
          { label: 'Policy', url: '/about-us/governance-and-good-practices/policy/' },
        ],
      },
    ],
  },
  {
    label: 'Our Work',
    url: '/our-work/',
    groups: [
      {
        group: 'Environmental Sustainability',
        items: [
          { label: 'Community Tree Planting & Sapling Distribution', url: '/our-work/tree-planting/' },
          { label: 'Climate Resilience & Adaptation', url: '/our-work/climate-action/' },
        ],
      },
      {
        group: 'Social Development',
        items: [
          { label: 'Socio-Economic Research', url: '/our-work/socio-economic-research/' },
          { label: 'Community Welfare Projects', url: '/our-work/community-welfare/' },
          { label: 'Human Rights Advocacy', url: '/our-work/human-rights/' },
        ],
      },
      {
        group: 'Geography & Programs',
        items: [
          { label: 'Programs Overview', url: '/our-work/programs-overview/' },
          { label: 'Where We Work', url: '/where-we-work/' },
        ],
      },
    ],
  },
  {
    label: 'Impact & Evidence',
    url: '/impact/',
    groups: [
      {
        group: 'Data & Research',
        items: [
          { label: 'Live Impact Counters', url: '/impact/live-impact-counters/' },
          { label: 'GIS Tree Tracking Maps', url: '/impact/gis-maps/' },
          { label: 'Institutional Case Studies', url: '/impact/case-studies/' },
          { label: 'Annual Progress Reports', url: '/impact/annual-reports/' },
          { label: 'Research Papers', url: '/impact/research-papers/' },
          { label: 'Policy Briefings', url: '/impact/policy-briefings/' },
        ],
      },
      {
        group: 'News & Media',
        items: [
          { label: 'Latest News', url: '/stay-informed/news/' },
          { label: 'Blog', url: '/stay-informed/blog/' },
          { label: 'Events', url: '/stay-informed/events/' },
          { label: 'Gallery', url: '/stay-informed/gallery/' },
          // TODO: add /stay-informed/press-releases/ when page is created
        ],
      },
    ],
  },
  {
    label: 'Get Involved',
    url: '/get-involved/',
    groups: [
      {
        group: 'Take Action',
        items: [
          { label: 'Jobs & Internships', url: '/get-involved/jobs-and-internships/' },
          { label: 'Become a Volunteer', url: '/get-involved/volunteer/' },
          { label: 'Partner With Us', url: '/get-involved/partnership/' },
          { label: 'Become a Member', url: '/get-involved/become-a-member/' },
          { label: 'Procurement & E-Tender', url: '/get-involved/procurement/' },
          { label: 'Contact Us', url: '/get-involved/contact-us/' },
        ],
      },
      {
        group: 'Resources & Learning',
        items: [
          { label: 'Online Courses', url: '/resources/online-courses/' },
          { label: 'Training Programs', url: '/resources/training-programs/' },
          { label: 'Resource Library', url: '/resources/library/' },
        ],
      },
    ],
  },
];

// ---- Footer columns (Phase 3, block 8) ----
export const footerColumns = [
  {
    title: 'Get Involved',
    links: [
      { label: 'Donate', url: site.donateUrl },
      { label: 'Volunteer', url: '/get-involved/volunteer/' },
      { label: 'Partner With Us', url: '/get-involved/partnership/' },
      { label: 'Careers', url: site.careersUrl, external: true },
      { label: 'Procurement & E-Tender', url: site.tenderUrl, external: true },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Our Work', url: '/our-work/' },
      { label: 'Impact & Evidence', url: '/impact/' },
      { label: 'Annual Reports', url: '/impact/annual-reports/' },
      { label: 'Blog', url: '/stay-informed/blog/' },
      { label: 'News', url: '/stay-informed/news/' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'Contact Us', url: '/get-involved/contact-us/' },
      { label: 'Financial Audits', url: '/about-us/governance-and-good-practices/financials-and-external-audit/' },
      { label: 'Privacy Policy', url: '/privacy-policy/' },
      { label: 'Accessibility', url: '/accessibility/' },
    ],
  },
];
