/**
 * Executive Steering Committee Portal Data & Validation
 */

export interface ExecutiveMember {
  id: number;
  role: string;
  department: string;
  division: string;
  url: string;
  xPosition: number;
  accentColor: string;
  description: string;
  initials: string;
  metrics: string;
}

export const EXECUTIVE_MEMBERS: ExecutiveMember[] = [
  { id: 1, role: "CTO", department: "Chief Technology Officer", division: "Digital Transformation & Technology", url: "https://nirmalya-iitkgp.github.io/CTO-Digital-Transformation/", xPosition: -5.25, accentColor: "#6366f1", description: "Cloud architecture modernization, cyber resilience & core digital platform scale.", initials: "CTO", metrics: "99.995% Platform SLA & Microservices" },
  { id: 2, role: "CFO", department: "Chief Financial Officer", division: "Capital Allocation & Treasury", url: "https://nirmalya-iitkgp.github.io/CFO-Capital-allocation/", xPosition: -3.75, accentColor: "#10b981", description: "Capital deployment optimization, portfolio hurdle rates & liquidity management.", initials: "CFO", metrics: "22.4% ROIC / Free Cash Flow" },
  { id: 3, role: "CoS", department: "Chief of Staff", division: "Leads execution for MDs Office", url: "https://nirmalya-iitkgp.github.io/Meridian-CEO-Decision-Suite/", xPosition: -2.25, accentColor: "#eab308", description: "Executive command matrix, holistic enterprise performance & shareholder value.", initials: "CoS", metrics: "$4.2B Consolidated Enterprise ARR" },
  { id: 4, role: "CMO", department: "Chief Marketing Officer", division: "Brand Studio & Creative Systems", url: "https://nirmalya-iitkgp.github.io/Brand-Studio/", xPosition: -0.75, accentColor: "#ec4899", description: "Brand identity, creative direction & digital asset intelligence systems.", initials: "CMO", metrics: "94% Global Brand Equity Index" },
  { id: 5, role: "CPO", department: "Chief Product Officer", division: "Growth, Product Optimization & Experimentation", url: "https://nirmalya-iitkgp.github.io/A-B-testing-suite/", xPosition: 0.75, accentColor: "#8b5cf6", description: "Statistical hypothesis evaluation, multivariate testing & conversion funnel telemetry.", initials: "CPO", metrics: "+18.4% Mean Conversion Velocity" },
  { id: 6, role: "CSO", department: "Chief Strategy Officer", division: "CXO Planning & Corporate Roadmap", url: "https://nirmalya-iitkgp.github.io/CXO-Planning-Portal/", xPosition: 2.25, accentColor: "#3b82f6", description: "Long-range corporate roadmap, cross-functional OKR steering & board governance.", initials: "CSO", metrics: "48 Enterprise Strategic Initiatives" },
  { id: 7, role: "CCO", department: "Chief Commercial Officer", division: "Revenue Management & Price Pulse", url: "https://nirmalya-iitkgp.github.io/Price-Pulse/", xPosition: 3.75, accentColor: "#06b6d4", description: "Real-time elasticity tracking, competitive market pulse & margin maximization.", initials: "CCO", metrics: "99.8% Dynamic Price Synchronization" },
  { id: 8, role: "CSO-ESG", department: "Chief Sustainability Officer", division: "Carbon Management & Net Zero Trajectory", url: "https://nirmalya-iitkgp.github.io/Carbon-Management/", xPosition: 5.25, accentColor: "#14b8a6", description: "Scope 1-3 greenhouse gas tracking, regulatory compliance & Net Zero trajectory.", initials: "ESG", metrics: "-34% Carbon Intensity Reduction" }
];

/** Validates that a portal URL uses HTTPS and an authorized host. */
export function validatePortalUrl(rawUrl: string): { isValid: boolean; sanitizedUrl: string; error?: string } {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, sanitizedUrl: '', error: 'URL is required and must be a string' };
  }

  const trimmed = rawUrl.trim();
  const dangerousPatterns = /^(javascript:|data:|vbscript:|file:|about:)/i;
  if (dangerousPatterns.test(trimmed)) {
    return { isValid: false, sanitizedUrl: '', error: 'Forbidden URL protocol' };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') {
      return { isValid: false, sanitizedUrl: '', error: 'Only HTTPS URLs are allowed' };
    }
    const isAllowedHost = parsed.hostname.endsWith('github.io') || parsed.hostname === 'localhost';
    if (!isAllowedHost) {
      return { isValid: false, sanitizedUrl: '', error: 'Host is outside authorized organization boundary' };
    }
    return { isValid: true, sanitizedUrl: parsed.toString() };
  } catch {
    return { isValid: false, sanitizedUrl: '', error: 'Malformed URL structure' };
  }
}

/** Opens a validated portal URL in a new window with opener isolation. */
export function safeOpenPortal(url: string): boolean {
  const check = validatePortalUrl(url);
  if (!check.isValid) {
    console.error(`Security check blocked URL: ${url} - ${check.error}`);
    return false;
  }
  const newWin = window.open(check.sanitizedUrl, '_blank', 'noopener,noreferrer');
  if (newWin) {
    newWin.opener = null;
    return true;
  }
  return false;
}
