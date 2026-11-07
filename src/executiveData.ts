/**
 * Executive Steering Committee Portal Data & Validation
 */

export interface ExecutiveMember {
  id: number;
  role: string;
  department: string;
  division: string;
  url: string;
  isStanding: boolean;
  xPosition: number;
  yOffset: number;
  chairNeeded: boolean;
  accentColor: string;
  description: string;
  initials: string;
  metrics: string;
}

export const EXECUTIVE_MEMBERS: ExecutiveMember[] = [
  {
    id: 1,
    role: "Brand Studio",
    department: "Chief Marketing Officer (CMO)",
    division: "Brand & Creative Systems",
    url: "https://nirmalya-iitkgp.github.io/Brand-Studio/",
    isStanding: false,
    xPosition: -5.25,
    yOffset: 0.0,
    chairNeeded: true,
    accentColor: "#ec4899",
    description: "Brand identity, creative direction & digital asset intelligence systems.",
    initials: "BS",
    metrics: "94% Global Brand Equity Index"
  },
  {
    id: 2,
    role: "A/B Testing Suite",
    department: "Head of Growth & Experimentation",
    division: "Growth & Product Optimization",
    url: "https://nirmalya-iitkgp.github.io/A-B-testing-suite/",
    isStanding: false,
    xPosition: -3.75,
    yOffset: 0.0,
    chairNeeded: true,
    accentColor: "#8b5cf6",
    description: "Statistical hypothesis evaluation, multivariate testing & conversion funnel telemetry.",
    initials: "AB",
    metrics: "+18.4% Mean Conversion Velocity"
  },
  {
    id: 3,
    role: "CXO Planning Portal",
    department: "Chief Strategy Officer (CSO)",
    division: "Strategic Initiatives & Roadmap",
    url: "https://nirmalya-iitkgp.github.io/CXO-Planning-Portal/",
    isStanding: false,
    xPosition: -2.25,
    yOffset: 0.0,
    chairNeeded: true,
    accentColor: "#3b82f6",
    description: "Long-range corporate roadmap, cross-functional OKR steering & board governance.",
    initials: "CX",
    metrics: "48 Enterprise Strategic Initiatives"
  },
  {
    id: 4,
    role: "Price Pulse",
    department: "Chief Commercial Officer (CCO)",
    division: "Revenue Management & Pricing",
    url: "https://nirmalya-iitkgp.github.io/Price-Pulse/",
    isStanding: false,
    xPosition: -0.75,
    yOffset: 0.0,
    chairNeeded: true,
    accentColor: "#06b6d4",
    description: "Real-time elasticity tracking, competitive market pulse & margin maximization.",
    initials: "PP",
    metrics: "99.8% Dynamic Price Synchronization"
  },
  {
    id: 5,
    role: "Meridian CEO Suite",
    department: "Chief Executive Officer (CEO)",
    division: "Executive Leadership & Board Command",
    url: "https://nirmalya-iitkgp.github.io/Meridian-CEO-Decision-Suite/",
    isStanding: true,
    xPosition: 0.75,
    yOffset: 0.52,
    chairNeeded: false,
    accentColor: "#eab308",
    description: "Executive command matrix, holistic enterprise performance & shareholder value.",
    initials: "MS",
    metrics: "$4.2B Consolidated Enterprise ARR"
  },
  {
    id: 6,
    role: "CFO Capital Allocation",
    department: "Chief Financial Officer (CFO)",
    division: "Treasury & Capital Markets",
    url: "https://nirmalya-iitkgp.github.io/CFO-Capital-allocation/",
    isStanding: true,
    xPosition: 2.25,
    yOffset: 0.52,
    chairNeeded: false,
    accentColor: "#10b981",
    description: "Capital deployment optimization, portfolio hurdle rates & liquidity management.",
    initials: "CF",
    metrics: "22.4% ROIC / Free Cash Flow"
  },
  {
    id: 7,
    role: "Carbon Management",
    department: "Chief Sustainability Officer (CSO)",
    division: "ESG & Decarbonization",
    url: "https://nirmalya-iitkgp.github.io/Carbon-Management/",
    isStanding: true,
    xPosition: 3.75,
    yOffset: 0.52,
    chairNeeded: false,
    accentColor: "#14b8a6",
    description: "Scope 1-3 greenhouse gas tracking, regulatory compliance & Net Zero trajectory.",
    initials: "CM",
    metrics: "-34% Carbon Intensity Reduction"
  },
  {
    id: 8,
    role: "CTO Digital Transformation",
    department: "Chief Technology Officer (CTO)",
    division: "Technology & AI Infrastructure",
    url: "https://nirmalya-iitkgp.github.io/CTO-Digital-Transformation/",
    isStanding: true,
    xPosition: 5.25,
    yOffset: 0.52,
    chairNeeded: false,
    accentColor: "#6366f1",
    description: "Cloud architecture modernization, cyber resilience & core digital platform scale.",
    initials: "DT",
    metrics: "99.995% Platform SLA & Microservices"
  }
];

/**
 * Validates a URL against strict security criteria (Red-pill / Blue-pill testing)
 * Ensures only trusted HTTPS URLs from authorized domains are launched.
 */
export function validatePortalUrl(rawUrl: string): { isValid: boolean; sanitizedUrl: string; error?: string } {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, sanitizedUrl: '', error: 'URL is required and must be a string' };
  }

  const trimmed = rawUrl.trim();

  // Red-pill check: Block dangerous schemes, javascript:, data:, vbscript:
  const dangerousPatterns = /^(javascript:|data:|vbscript:|file:|about:)/i;
  if (dangerousPatterns.test(trimmed)) {
    return { isValid: false, sanitizedUrl: '', error: 'Forbidden URL protocol' };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') {
      return { isValid: false, sanitizedUrl: '', error: 'Only HTTPS URLs are allowed' };
    }

    // Blue-pill check: Only authorized github.io host or trusted enterprise domains
    const isAllowedHost = parsed.hostname.endsWith('github.io') || parsed.hostname === 'localhost';
    if (!isAllowedHost) {
      return { isValid: false, sanitizedUrl: '', error: 'Host is outside authorized organization boundary' };
    }

    return { isValid: true, sanitizedUrl: parsed.toString() };
  } catch {
    return { isValid: false, sanitizedUrl: '', error: 'Malformed URL structure' };
  }
}

/**
 * Safely triggers opening a validated URL in a new window with strict opener isolation.
 */
export function safeOpenPortal(url: string): boolean {
  const check = validatePortalUrl(url);
  if (!check.isValid) {
    console.error(`Security check blocked URL: ${url} - ${check.error}`);
    return false;
  }
  // Safe opening with noopener and noreferrer to prevent tab-nabbing / reverse privilege escalation
  const newWin = window.open(check.sanitizedUrl, '_blank', 'noopener,noreferrer');
  if (newWin) {
    newWin.opener = null;
    return true;
  }
  return false;
}
