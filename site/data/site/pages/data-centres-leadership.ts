/**
 * Page-only copy for /portfolio/data-centres/leadership (DC leadership, client feedback round): the intro,
 * the data centre leaders (same card pattern as Our leadership, data/site/leaders.ts) and the contact band.
 * Team and bios from ESR's data centre leadership content (Oct 2026), CEO first.
 */
import type { ContactCtaBandProps } from "@/components/sections/forms/ContactCtaBand";
import type { Leader } from "@/data/site/leaders";

export const DC_LEAD_INTRO = {
  title: "Data centre leadership",
  body: "Our data centre team is led by a seasoned group of industry veterans.",
};

const GROUP = "Data centre management team";

export const DC_LEADERS: Leader[] = [
  {
    group: GROUP,
    name: "Dalmar Sheikh",
    title: "Chief Executive Officer, Data Centres",
    bio: "Responsible for the overall leadership, strategy and performance of ESR's global data centre platform, spanning investment, development, leasing and operations across all markets. Previously Chief Operating Officer at CtrlS Datacenters, with senior leadership roles at Actis, DataSphere Advisory and Amazon Web Services, including APAC Director and Regional Leader. More than 20 years of experience across data centres, digital infrastructure and technology.",
    hasAreaButton: false,
  },
  {
    group: GROUP,
    name: "Junseo Park",
    title: "Director of Data Centres, Korea",
    bio: "Responsible for the overall leadership of ESR's data centre platform in Korea, overseeing development and delivery and setting the strategic direction for the platform's growth. Previously Director at Digital Realty, responsible for its APAC expansion, site selection, market strategy, platform and asset acquisition, and strategic partnerships. More than 18 years of experience in infrastructure and real estate investments across diverse markets, including 7 years in the data centre industry.",
    hasAreaButton: false,
  },
  {
    group: GROUP,
    name: "Jon Schochet",
    title: "Chief Commercial Officer, Data Centres",
    bio: "Responsible for evaluating investment opportunities, negotiating third-party joint ventures and strategic planning for the data centre platform. Held various senior management positions before ESR, managing more than USD 3 billion of direct property investments, M&A and capital market initiatives. More than 25 years of experience in Japanese commercial real estate.",
    hasAreaButton: false,
  },
  {
    group: GROUP,
    name: "Toby Selman",
    title: "Chief Operating Officer, Data Centres",
    bio: "Responsible for operations, strategy planning and implementation, cross-functional coordination, culture and team management, financial and risk management, fund management and capital formation. Previously led global data centre and real estate investment strategy at NZ Superfund, with senior roles including COO of European logistics developer Delin, CEO of Africa Logistics Properties and founding member of the Raven Group, a Russia-focused logistics development platform that listed on the LSE in 2010. More than 25 years of experience across APAC, North America, Europe and Africa.",
    hasAreaButton: false,
  },
  {
    group: GROUP,
    name: "Scott Bales",
    title: "Chief Customer Officer, Data Centres",
    bio: "Responsible for leading ESR's data centre customer and partner engagement, building strategic relationships with hyperscalers and aligning customer demand with ESR's development and delivery across APAC. Previously led customer and partner programs across APAC with AWS, Huawei, Microsoft and Accenture, spanning hyperscaler go-to-market, metro and site selection, due diligence, authority engagement, utility infrastructure coordination and joint solution development. More than 20 years in technology, innovation and customer-led growth, with a recent focus on hyperscale cloud and data centre ecosystems in APAC.",
    hasAreaButton: false,
  },
  {
    group: GROUP,
    name: "Richard Mills",
    title: "Head of Design and Development, Data Centres",
    bio: "Responsible for supporting the data centre platform's growth by delivering assets that are commercially and operationally efficient. Previously worked for M+W, Keppel, NTT and Microsoft on a wide range of data centre projects in Asia and Europe. More than 30 years of experience in engineering and construction, delivering projects across APAC, including 13 years in data centres.",
    hasAreaButton: false,
  },
  {
    group: GROUP,
    name: "Frank Boyland",
    title: "Senior Director, Data Centres, Japan",
    bio: "Oversees all aspects of ESR's data centre strategy, development and delivery in Japan, including ESR's joint ventures. Previously led Fusion Systems Japan's IT infrastructure and managed services business, including multiple data centre projects across Asia, and served as Head of Asia for Trade and Investment for the Scottish Government. More than 35 years of experience in semiconductor design, engineering and business, 27 of them in APAC.",
    hasAreaButton: false,
  },
  {
    group: GROUP,
    name: "Lucy Guerin",
    title: "Director of Data Centres, Australia",
    bio: "Responsible for leading ESR's data centre business in Australia. Previously responsible for Microsoft's data centre metro and site-specific delivery strategies, site due diligence, engagement with authorities, utility infrastructure delivery, offsite works, permitting, planning and environmental work, delivering Microsoft data centres across APAC. More than 20 years of experience delivering infrastructure and large property portfolios across diverse markets, including 5 years in the data centre sector.",
    hasAreaButton: false,
  },
];

export const DC_LEAD_CONTACT_CTA: ContactCtaBandProps = {
  title: "Talk to our data centre team",
  body: "Tell us what you need and we'll put you in touch with the right people in your market.",
  cta: { label: "Contact us", href: "/contact" },
};
