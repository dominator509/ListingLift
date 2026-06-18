#!/usr/bin/env python3
"""Normalize indentation in files with mixed 4-space headers and 2-space body."""
import os

TESTS_DIR = "/root/ListingLift/tests/e2e"

# Files that use `test.skip(` pattern (no describe wrapper) — body should be 2-space
simple_skip_files = [
    "admin-delivery-archive.spec.ts",
    "admin-job-queue.spec.ts",
    "admin-processing.spec.ts",
    "gumroad-intake.spec.ts",
    "image-provider-admin.spec.ts",
    "manual-invoices.spec.ts",
    "preset-manager.spec.ts",
    "reports-upsells.spec.ts",
    "shopify-workflow.spec.ts",
    "social-commerce-workflow.spec.ts",
    "task-notification-integrations.spec.ts",
    "upload-flow.spec.ts",
    "upwork-manual-contract.spec.ts",
]

for filename in simple_skip_files:
    filepath = os.path.join(TESTS_DIR, filename)
    with open(filepath) as f:
        content = f.read()
    
    # Replace 4-space indentation with 2-space for lines inside the test function
    lines = content.split('\n')
    new_lines = []
    in_test_body = False
    for line in lines:
        # Detect test function opening
        if 'async ({ page }) => {' in line:
            in_test_body = True
            new_lines.append(line)
            continue
        # Detect closing brace
        if in_test_body and line.strip() == '});':
            in_test_body = False
            new_lines.append(line)
            continue
        
        if in_test_body:
            # Convert 4-space indent to 2-space for lines inside the test body
            stripped = line
            if line.startswith('    '):
                stripped = line[4:]  # remove 4 spaces
                # But there might be content that needs 2-space indent instead
                if stripped and not stripped.startswith(' '):
                    stripped = '  ' + stripped
            new_lines.append(stripped)
        else:
            new_lines.append(line)
    
    new_content = '\n'.join(new_lines)
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"  FIXED indent: {filename}")
    else:
        print(f"  OK: {filename}")
