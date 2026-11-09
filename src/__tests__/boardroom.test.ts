import { describe, it, expect } from 'vitest';
import { EXECUTIVE_MEMBERS, validatePortalUrl } from '../executiveData.ts';

describe('Executive Steering Committee Portal Data & Layout', () => {
  it('contains exactly 8 executive members', () => {
    expect(EXECUTIVE_MEMBERS).toHaveLength(8);
  });

  it('correctly maps the 8 required executive positions and target URLs', () => {
    const expectedRoles = ['CTO', 'CFO', 'CEO', 'CMO', 'CPO', 'CSO', 'CCO', 'CSO-ESG'];
    const expectedUrls = [
      'https://nirmalya-iitkgp.github.io/CTO-Digital-Transformation/',
      'https://nirmalya-iitkgp.github.io/CFO-Capital-allocation/',
      'https://nirmalya-iitkgp.github.io/Meridian-CEO-Decision-Suite/',
      'https://nirmalya-iitkgp.github.io/Brand-Studio/',
      'https://nirmalya-iitkgp.github.io/A-B-testing-suite/',
      'https://nirmalya-iitkgp.github.io/CXO-Planning-Portal/',
      'https://nirmalya-iitkgp.github.io/Price-Pulse/',
      'https://nirmalya-iitkgp.github.io/Carbon-Management/',
    ];
    EXECUTIVE_MEMBERS.forEach((exec, idx) => {
      expect(exec.role).toBe(expectedRoles[idx]);
      expect(exec.url).toBe(expectedUrls[idx]);
      expect(exec.id).toBe(idx + 1);
    });
  });

  it('uses the same member data shape for every portal entry', () => {
    const fields = Object.keys(EXECUTIVE_MEMBERS[0]).sort();
    EXECUTIVE_MEMBERS.forEach((member) => {
      expect(Object.keys(member).sort()).toEqual(fields);
    });
  });

  it('verifies non-overlapping horizontal spacing along the X axis', () => {
    for (let i = 0; i < EXECUTIVE_MEMBERS.length - 1; i++) {
      const distance = EXECUTIVE_MEMBERS[i + 1].xPosition - EXECUTIVE_MEMBERS[i].xPosition;
      expect(distance).toBeGreaterThanOrEqual(1.2);
    }
  });
});

describe('Portal URL Sanitization', () => {
  it('approves all 8 legitimate production portal URLs', () => {
    EXECUTIVE_MEMBERS.forEach((exec) => {
      const result = validatePortalUrl(exec.url);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedUrl).toBe(exec.url);
      expect(result.error).toBeUndefined();
    });
  });

  it('blocks malicious URL schemes', () => {
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

  it('blocks unencrypted HTTP and untrusted third-party domains', () => {
    const insecureUrls = [
      'http://nirmalya-iitkgp.github.io/Brand-Studio/',
      'https://fake-phishing-login.com/steal-creds',
      'https://evil-executives.xyz/malware.exe',
      'not-a-valid-url',
      '',
    ];
    insecureUrls.forEach((url) => expect(validatePortalUrl(url).isValid).toBe(false));
  });
});
