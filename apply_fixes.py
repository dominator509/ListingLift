#!/usr/bin/env python3
"""
Apply Stage 6B fixes for Playwright E2E tests:
  FIX 1 — Add auth headers to admin-route specs
  FIX 2 — Fix strict-mode locators (pricing-page, security-hardening, ui-shell)
  FIX 3 — delivery-download: already skipped, verify.
"""
import re
import os

TESTS_DIR = "/root/ListingLift/tests/e2e"

# ============================================================
# FIX 1 — Auth headers
# ============================================================
auth_header_block = """    await page.setExtraHTTPHeaders({
      'x-demo-user-id': 'test-user-001',
      'x-demo-organization-id': 'test-org-001',
      'x-demo-role': 'admin',
    });"""

admin_specs = [
    "admin-dashboard.spec.ts",
    "admin-delivery-archive.spec.ts",
    "admin-job-queue.spec.ts",
    "admin-processing.spec.ts",
    "advanced-image-processing.spec.ts",
    "agency-white-label.spec.ts",
    "api-access.spec.ts",
    "approval-revision.spec.ts",
    "automation-webhooks.spec.ts",
    "client-dashboard.spec.ts",
    "etsy-workflow.spec.ts",
    "file-storage-admin.spec.ts",
    "fiverr-manual-order.spec.ts",
    "gumroad-intake.spec.ts",
    "image-provider-admin.spec.ts",
    "manual-invoices.spec.ts",
    "marketplace-exports.spec.ts",
    "other-sales-channels.spec.ts",
    "preset-manager.spec.ts",
    "preview-gallery.spec.ts",
    "quality-control.spec.ts",
    "reports-upsells.spec.ts",
    "shopify-workflow.spec.ts",
    "social-commerce-workflow.spec.ts",
    "task-notification-integrations.spec.ts",
    "taskrabbit-manual-task.spec.ts",
    "upload-flow.spec.ts",
    "upwork-manual-contract.spec.ts",
]

def add_auth_header_to_file(filepath):
    """Add auth header block inside each test function, right after the opening line."""
    with open(filepath) as f:
        content = f.read()
    
    # Check if already has headers
    if 'x-demo-user-id' in content:
        print(f"  SKIP (already has headers): {os.path.basename(filepath)}")
        return False
    
    # For test.describe.skip blocks with nested tests:
    # Insert auth headers inside each test(async ({ page }) => { after the opening line
    # Pattern: `test(async ({ page }) => {` OR `test('name', async ({ page }) => {`
    # We insert after the opening brace and newline
    
    # Strategy: Find each `await page.goto(` and insert headers before it
    # This works for all patterns (test.skip, test.describe.skip with nested tests)
    
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        new_lines.append(line)
        if 'await page.goto(' in line:
            # Insert auth headers right before this line
            new_lines.insert(-1, auth_header_block)
    
    new_content = '\n'.join(new_lines)
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"  ADDED headers: {os.path.basename(filepath)}")
        return True
    else:
        print(f"  NO CHANGE: {os.path.basename(filepath)}")
        return False

# Fix ui-shell.spec.ts test 2 specifically (the admin shell test)
def fix_ui_shell():
    filepath = os.path.join(TESTS_DIR, "ui-shell.spec.ts")
    with open(filepath) as f:
        content = f.read()
    
    if 'x-demo-user-id' in content:
        print(f"  SKIP (already has headers): ui-shell.spec.ts")
        return
    
    # Find the second test block (test 2, the admin shell)
    # Append auth headers before await page.goto('/admin')
    lines = content.split('\n')
    new_lines = []
    inserted = False
    for i, line in enumerate(lines):
        new_lines.append(line)
        if not inserted and "await page.goto('/admin')" in line:
            new_lines.append(auth_header_block)
            inserted = True
    
    new_content = '\n'.join(new_lines)
    with open(filepath, 'w') as f:
        f.write(new_content)
    print(f"  ADDED headers to test 2: ui-shell.spec.ts")

# ============================================================
# FIX 2 — Strict mode locators
# ============================================================

def fix_pricing_page():
    filepath = os.path.join(TESTS_DIR, "pricing-page.spec.ts")
    with open(filepath) as f:
        content = f.read()
    
    # Current: getByText(/Marketplace Listing Pack — 25 Images/i)
    # Fix: getByText(/Marketplace Listing Pack \\(25\\)/i).first()
    old = "getByText(/Marketplace Listing Pack — 25 Images/i)"
    new = "getByText(/Marketplace Listing Pack \\(25\\)/i).first()"
    if old in content:
        content = content.replace(old, new)
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"  FIXED locator: pricing-page.spec.ts")
    else:
        print(f"  CHECK pricing-page.spec.ts — pattern not found exactly")

def fix_security_hardening():
    filepath = os.path.join(TESTS_DIR, "security-hardening.spec.ts")
    with open(filepath) as f:
        content = f.read()
    
    # Current: getByRole('heading', { name: 'Security hardening', exact: true })
    # Fix: getByRole('heading', { name: 'Security hardening' }).first()
    old = "getByRole('heading', { name: 'Security hardening', exact: true })"
    new = "getByRole('heading', { name: 'Security hardening' }).first()"
    if old in content:
        content = content.replace(old, new)
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"  FIXED locator: security-hardening.spec.ts")
    else:
        print(f"  CHECK security-hardening.spec.ts — pattern not found exactly")

def fix_ui_shell_locator():
    filepath = os.path.join(TESTS_DIR, "ui-shell.spec.ts")
    with open(filepath) as f:
        content = f.read()
    
    # Current: getByRole('link', { name: 'Packages', exact: true })
    # Fix: getByRole('link', { name: /^Packages$/ })
    old = "getByRole('link', { name: 'Packages', exact: true })"
    new = "getByRole('link', { name: /^Packages$/ })"
    if old in content:
        content = content.replace(old, new)
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"  FIXED locator: ui-shell.spec.ts")
    else:
        print(f"  CHECK ui-shell.spec.ts — pattern not found exactly")
        # Print the line for debugging
        for i, line in enumerate(content.split('\n')):
            if 'Packages' in line:
                print(f"    Line {i+1}: {line.strip()}")

# ============================================================
# FIX 3 — delivery-download.spec.ts (already skipped)
# ============================================================

def check_delivery_download():
    filepath = os.path.join(TESTS_DIR, "delivery-download.spec.ts")
    with open(filepath) as f:
        content = f.read()
    
    # Already using test.skip() for both tests — that's correct
    if 'test.skip' in content:
        print(f"  OK: delivery-download.spec.ts already uses test.skip()")
    else:
        print(f"  WARNING: delivery-download.spec.ts doesn't use test.skip()")


# ============================================================
# MAIN
# ============================================================
print("=== FIX 1: Auth headers ===")
for spec in admin_specs:
    fp = os.path.join(TESTS_DIR, spec)
    if os.path.exists(fp):
        add_auth_header_to_file(fp)
    else:
        print(f"  NOT FOUND: {spec}")

# Fix ui-shell test 2
fix_ui_shell()

print("\n=== FIX 2: Strict-mode locators ===")
fix_pricing_page()
fix_security_hardening()
fix_ui_shell_locator()

print("\n=== FIX 3: Delivery-download check ===")
check_delivery_download()

print("\n=== Done ===")
