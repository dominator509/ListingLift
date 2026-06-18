#!/usr/bin/env python3
"""Remove duplicate setExtraHTTPHeaders calls from multi-goto test files."""
import os

TESTS_DIR = "/root/ListingLift/tests/e2e"

files_to_clean = {
    "agency-white-label.spec.ts",
    "api-access.spec.ts",
    "automation-webhooks.spec.ts",
    "etsy-workflow.spec.ts",
    "taskrabbit-manual-task.spec.ts",
    "social-commerce-workflow.spec.ts",
    "reports-upsells.spec.ts",
    "upwork-manual-contract.spec.ts",
}

HEADER_BLOCK = """    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });"""

for filename in sorted(files_to_clean):
    filepath = os.path.join(TESTS_DIR, filename)
    with open(filepath) as f:
        content = f.read()
    
    count_before = content.count('setExtraHTTPHeaders')
    
    if count_before <= 1:
        print(f"  OK {filename}: {count_before} header call(s)")
        continue
    
    # Keep first occurrence, remove the rest
    first_idx = content.index(HEADER_BLOCK)
    rest = content[first_idx + len(HEADER_BLOCK):]
    rest = rest.replace(HEADER_BLOCK, '')
    new_content = content[:first_idx + len(HEADER_BLOCK)] + rest
    
    count_after = new_content.count('setExtraHTTPHeaders')
    with open(filepath, 'w') as f:
        f.write(new_content)
    print(f"  CLEANED {filename}: {count_before} -> {count_after} header calls")
