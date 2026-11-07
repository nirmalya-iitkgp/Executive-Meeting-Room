import { describe, it, expect } from 'vitest';
import { EXECUTIVE_MEMBERS, validatePortalUrl } from '../executiveData.ts';

describe('Executive Steering Committee Portal Data & Layout', () => {
  it('contains exactly 8 executive members', () => {
    expect(EXECUTIVE_MEMBERS).toHaveLength(8);
  });

  it('correctly maps the 8 required executive roles and target URLs', () => {
    const expectedRoles = [
      'Brand Studio',
      'A/B Testing Suite',
      'CXO Planning Portal',
      'Price Pulse',
      'Meridian CEO Suite',
      'CFO Capital Allocation',
      'Carbon Management',
      'CTO Digital Transformation',
    ];

    const expectedUrls = [
      'https://nirmalya-iitkgp.github.io/Brand-Studio/',
      'https://nirmalya-iitkgp.github.io/A-B-testing-suite/',
      'https://nirmalya-iitkgp.github.io/CXO-Planning-Portal/',
      'https://nirmalya-iitkgp.github.io/Price-Pulse/',
      'https://nirmalya-iitkgp.github.io/Meridian-CEO-Decision-Suite/',
      'https://nirmalya-iitkgp.github.io/CFO-Capital-allocation/',
      'https://nirmalya-iitkgp.github.io/Carbon-Management/',
      'https://nirmalya-iitkgp.github.io/CTO-Digital-Transformation/',
    ];

    EXECUTIVE_MEMBERS.forEach((exec, idx) => {
      expect(exec.role).toBe(expectedRoles[idx]);
      expect(exec.url).toBe(expectedUrls[idx]);
      expect(exec.id).toBe(idx + 1);
    });
  });

  it('enforces seated arrangement for figurines 1 to 4 and standing for 5 to 8', () => {
    // 1 to 4 seated
    for (let i = 0; i < 4; i++) {
      expect(EXECUTIVE_MEMBERS[i].isStanding).toBe(false);
      expect(EXECUTIVE_MEMBERS[i].chairNeeded).toBe(true);
      expect(EXECUTIVE_MEMBERS[i].yOffset).toBe(0.0);
    }

    // 5 to 8 standing
    for (let i = 4; i < 8; i++) {
      expect(EXECUTIVE_MEMBERS[i].isStanding).toBe(true);
      expect(EXECUTIVE_MEMBERS[i].chairNeeded).toBe(false);
      expect(EXECUTIVE_MEMBERS[i].yOffset).toBeGreaterThan(0.3);
    }
  });

  it('verifies non-overlapping horizontal spacing along the X axis', () => {
    for (let i = 0; i < EXECUTIVE_MEMBERS.length - 1; i++) {
      const current = EXECUTIVE_MEMBERS[i];
      const next = EXECUTIVE_MEMBERS[i + 1];
      const distance = next.xPosition - current.xPosition;
      expect(distance).toBeGreaterThanOrEqual(1.2);
    }
  });
});

describe('Security Red-Pill / Blue-Pill URL Sanitization', () => {
  it('approves all 8 legitimate production executive URLs', () => {
    EXECUTIVE_MEMBERS.forEach((exec) => {
      const result = validatePortalUrl(exec.url);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedUrl).toBe(exec.url);
      expect(result.error).toBeUndefined();
    });
  });

  it('blocks Red-Pill malicious vector attacks (XSS, script injection, data URI)', () => {
    const maliciousPayloads = [
      'javascript:alert(document.cookie)',
      'JAVASCRIPT:fetch("https://attacker.com")',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:msgbox("pwnd")',
      'file:///etc/passwd',
      'about:blank',
    ];

    maliciousPayloads.forEach((payload) => {
      const result = validatePortalUrl(payload);
      expect(result.isValid).toBe(false);
      expect(result.sanitizedUrl).toBe('');
      expect(result.error).toBeDefined();
    });
  });

  it('blocks unencrypted HTTP and untrusted third-party phishing domains', () => {
    const insecureUrls = [
      'http://nirmalya-iitkgp.github.io/Brand-Studio/',
      'https://fake-phishing-login.com/steal-creds',
      'https://evil-executives.xyz/malware.exe',
      'not-a-valid-url',
      '',
    ];

    insecureUrls.forEach((url) => {
      const result = validatePortalUrl(url);
      expect(result.isValid).toBe(false);
    });
  });
});
