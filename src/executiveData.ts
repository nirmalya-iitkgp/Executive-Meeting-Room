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
    role: "CTO",
    department: "Chief Technology Officer",
    division: "Digital Transformation & Technology",
    url: "https://nirmalya-iitkgp.github.io/CTO-Digital-Transformation/",
    isStanding: false,
    xPosition: -5.25,
    yOffset: 0.0,
    chairNeeded: true,
    accentColor: "#6366f1",
    description: "Cloud architecture modernization, cyber resilience & core digital platform scale.",
    initials: "CTO",
    metrics: "99.995% Platform SLA & Microservices"
  },
  {
    id: 2,
    role: "CFO",
    department: "Chief Financial Officer",
    division: "Capital Allocation & Treasury",
    url: "https://nirmalya-iitkgp.github.io/CFO-Capital-allocation/",
    isStanding: false,
    xPosition: -3.75,
    yOffset: 0.0,
    chairNeeded: true,
    accentColor: "#10b981",
    description: "Capital deployment optimization, portfolio hurdle rates & liquidity management.",
    initials: "CFO",
    metrics: "22.4% ROIC / Free Cash Flow"
  },
  {
    id: 3,
    role: "CoS",
    department: "Chief of Staff",
    division: "Leads execution for MDs Office",
    url: "https://nirmalya-iitkgp.github.io/Meridian-CEO-Decision-Suite/",
    isStanding: false,
    xPosition: -2.25,
    yOffset: 0.0,
    chairNeeded: true,
    accentColor: "#eab308",
    description: "Executive command matrix, holistic enterprise performance & shareholder value.",
    initials: "CoS",
    metrics: "$4.2B Consolidated Enterprise ARR"
  },
  {
    id: 4,
    role: "CMO",
    department: "Chief Marketing Officer",
    division: "Brand Studio & Creative Systems",
    url: "https://nirmalya-iitkgp.github.io/Brand-Studio/",
    isStanding: false,
    xPosition: -0.75,
    yOffset: 0.0,
    chairNeeded: true,
    accentColor: "#ec4899",
    description: "Brand identity, creative direction & digital asset intelligence systems.",
    initials: "CMO",
    metrics: "94% Global Brand Equity Index"
  },
  {
    id: 5,
    role: "CPO",
    department: "Chief Product Officer",
    division: "Growth, Product Optimization & Experimentation",
    url: "https://nirmalya-iitkgp.github.io/A-B-testing-suite/",
    isStanding: true,
    xPosition: 0.75,
    yOffset: 0.52,
    chairNeeded: false,
    accentColor: "#8b5cf6",
    description: "Statistical hypothesis evaluation, multivariate testing & conversion funnel telemetry.",
    initials: "CPO",
    metrics: "+18.4% Mean Conversion Velocity"
  },
  {
    id: 6,
    role: "CSO",
    department: "Chief Strategy Officer",
    division: "CXO Planning & Corporate Roadmap",
    url: "https://nirmalya-iitkgp.github.io/CXO-Planning-Portal/",
    isStanding: true,
    xPosition: 2.25,
    yOffset: 0.52,
    chairNeeded: false,
    accentColor: "#3b82f6",
    description: "Long-range corporate roadmap, cross-functional OKR steering & board governance.",
    initials: "CSO",
    metrics: "48 Enterprise Strategic Initiatives"
  },
  {
    id: 7,
    role: "CCO",
    department: "Chief Commercial Officer",
    division: "Revenue Management & Price Pulse",
    url: "https://nirmalya-iitkgp.github.io/Price-Pulse/",
    isStanding: true,
    xPosition: 3.75,
    yOffset: 0.52,
    chairNeeded: false,
    accentColor: "#06b6d4",
    description: "Real-time elasticity tracking, competitive market pulse & margin maximization.",
    initials: "CCO",
    metrics: "99.8% Dynamic Price Synchronization"
  },
  {
    id: 8,
    role: "CSO-ESG",
    department: "Chief Sustainability Officer",
    division: "Carbon Management & Net Zero Trajectory",
    url: "https://nirmalya-iitkgp.github.io/Carbon-Management/",
    isStanding: true,
    xPosition: 5.25,
    yOffset: 0.52,
    chairNeeded: false,
    accentColor: "#14b8a6",
    description: "Scope 1-3 greenhouse gas tracking, regulatory compliance & Net Zero trajectory.",
    initials: "ESG",
    metrics: "-34% Carbon Intensity Reduction"
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
