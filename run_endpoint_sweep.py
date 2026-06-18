#!/usr/bin/env python3
"""Q8 Phase 4 — Breadth-First Endpoint Sweep"""

import subprocess
import os
import json
import time
from collections import defaultdict

BASE_DIR = "/root/ListingLift"
PORT = 3099
BASE_URL = f"http://localhost:{PORT}"

def discover_routes():
    """Scan src/app/ for route.ts and page.tsx files, convert to URL paths."""
    api_routes = []
    page_routes = []
    
    for root, dirs, files in os.walk(os.path.join(BASE_DIR, "src/app")):
        for f in files:
            if f == "route.ts":
                rel = os.path.relpath(os.path.join(root, f), os.path.join(BASE_DIR, "src/app"))
                # Convert to URL path
                parts = rel.replace("\\", "/").split("/")
                # Remove 'route.ts'
                parts = parts[:-1]
                # Handle dynamic segments [param] -> :param style? No, Next.js uses [param] but the actual URL uses the literal
                # For dynamic routes, we need to test with a placeholder value
                url_parts = []
                for p in parts:
                    if p.startswith("[") and p.endswith("]"):
                        # Dynamic segment — use a placeholder
                        url_parts.append("test-placeholder")
                    else:
                        url_parts.append(p)
                route_path = "/" + "/".join(url_parts)
                
                # Also skip Next.js internals
                if "_next" in route_path:
                    continue
                
                api_routes.append(route_path)
            
            elif f == "page.tsx":
                rel = os.path.relpath(os.path.join(root, f), os.path.join(BASE_DIR, "src/app"))
                parts = rel.replace("\\", "/").split("/")
                # Remove 'page.tsx'
                parts = parts[:-1]
                url_parts = []
                for p in parts:
                    if p.startswith("[") and p.endswith("]"):
                        url_parts.append("test-placeholder")
                    else:
                        url_parts.append(p)
                route_path = "/" + "/".join(url_parts)
                if route_path == "/":
                    route_path = "/"
                if "_next" in route_path:
                    continue
                page_routes.append(route_path)
    
    return sorted(set(api_routes)), sorted(set(page_routes))

def test_endpoint(url, timeout=8):
    """Fire GET against endpoint, return status code and optional error/snippet."""
    try:
        result = subprocess.run(
            ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", url],
            capture_output=True, text=True, timeout=timeout
        )
        code = result.stdout.strip()
        if code and code.isdigit():
            return int(code), ""
        return 0, "No response / malformed"
    except subprocess.TimeoutExpired:
        return 0, "Timeout"
    except Exception as e:
        return 0, str(e)

def capture_body(url, timeout=8):
    """Get first 500 chars of response body."""
    try:
        result = subprocess.run(
            ["curl", "-s", "--max-time", str(timeout), url],
            capture_output=True, text=True, timeout=timeout + 2
        )
        return result.stdout[:600]
    except:
        return "[capture failed]"

def main():
    print("=== Q8 Phase 4 — Endpoint Sweep ===")
    
    # Discover routes
    api_routes, page_routes = discover_routes()
    all_routes = api_routes + page_routes
    
    print(f"\nDiscovered: {len(api_routes)} API routes + {len(page_routes)} page routes = {len(all_routes)} total")
    
    results = []
    failures = []
    status_counts = {"2xx": 0, "3xx": 0, "4xx": 0, "5xx": 0, "timeout": 0, "error": 0}
    status_detail = defaultdict(list)
    
    # Test static assets
    static_paths = ["/favicon.ico"]
    
    print("\n--- Sweeping API Routes ---")
    for i, route in enumerate(api_routes):
        url = f"{BASE_URL}{route}"
        code, err = test_endpoint(url)
        category = "error"
        if code >= 200 and code < 300:
            category = "2xx"
        elif code >= 300 and code < 400:
            category = "3xx"
        elif code >= 400 and code < 500:
            category = "4xx"
        elif code >= 500 and code < 600:
            category = "5xx"
        elif code == 0:
            category = "timeout"
        
        status_counts[category] += 1
        status_detail[category].append(route)
        
        if category == "5xx":
            # Capture error body for 5xx
            body = capture_body(url)
            failures.append((route, code, body))
            print(f"  FAIL [{code}] {route}")
        elif category == "timeout" or category == "error":
            failures.append((route, code, err))
            print(f"  FAIL [{code}] {route} - {err}")
        
        if (i + 1) % 50 == 0:
            print(f"  ... {i+1}/{len(api_routes)} API routes tested")
    
    print(f"\n--- Sweeping Page Routes ---")
    for i, route in enumerate(page_routes):
        url = f"{BASE_URL}{route}"
        code, err = test_endpoint(url)
        category = "error"
        if code >= 200 and code < 300:
            category = "2xx"
        elif code >= 300 and code < 400:
            category = "3xx"
        elif code >= 400 and code < 500:
            category = "4xx"
        elif code >= 500 and code < 600:
            category = "5xx"
        elif code == 0:
            category = "timeout"
        
        status_counts[category] += 1
        status_detail[category].append(route)
        
        if category == "5xx":
            body = capture_body(url)
            failures.append((route, code, body))
            print(f"  FAIL [{code}] {route}")
        elif category == "timeout" or category == "error":
            failures.append((route, code, err))
            print(f"  FAIL [{code}] {route} - {err}")
        
        if (i + 1) % 50 == 0:
            print(f"  ... {i+1}/{len(page_routes)} page routes tested")
    
    print(f"\n--- Testing Static Assets ---")
    for sp in static_paths:
        url = f"{BASE_URL}{sp}"
        code, err = test_endpoint(url)
        print(f"  {sp} -> {code}")
    
    # Generate report
    total_tested = sum(status_counts.values())
    total_fail = len(failures)
    total_pass = total_tested - total_fail
    
    report = []
    report.append("# ENDPOINT_SWEEP_REPORT.md")
    report.append("")
    report.append(f"## Summary")
    report.append(f"- **Total routes discovered:** {len(all_routes)}")
    report.append(f"- **Total routes tested:** {total_tested}")
    report.append(f"- **Pass:** {total_pass} ({total_pass/max(total_tested,1)*100:.1f}%)")
    report.append(f"- **Fail:** {total_fail}")
    report.append("")
    report.append(f"## Status Code Breakdown")
    report.append(f"- **2xx (OK):** {status_counts['2xx']}")
    report.append(f"- **3xx (Redirect):** {status_counts['3xx']}")
    report.append(f"- **4xx (Client Error):** {status_counts['4xx']}")
    report.append(f"- **5xx (Server Error):** {status_counts['5xx']} **← FAILURES**")
    report.append(f"- **Timeout:** {status_counts['timeout']} **← FAILURES**")
    report.append(f"- **Connection Error:** {status_counts['error']} **← FAILURES**")
    report.append("")
    
    if failures:
        report.append(f"## Failure Details ({len(failures)} routes)")
        report.append("")
        for route, code, details in failures:
            report.append(f"### {route}")
            report.append(f"- **HTTP Code:** {code}")
            if details:
                report.append(f"- **Error/Body snippet:** `{details[:300]}`")
            report.append("")
    
    if status_counts["5xx"] == 0 and status_counts["timeout"] == 0 and status_counts["error"] == 0:
        report.append("## Result: **PASS** ✅")
        report.append("")
        report.append("Zero 5xx, zero timeouts, zero connection errors. All routes respond.")
    else:
        report.append("## Result: **BLOCKED** ❌")
        report.append("")
        report.append(f"{status_counts['5xx']} route(s) returned 5xx, {status_counts['timeout']} timed out, {status_counts['error']} had connection errors.")
        report.append("These must be resolved before advancing.")
    
    report.append("")
    report.append("---")
    report.append(f"*Route sweep completed: {len(all_routes)} routes discovered, {total_tested} tested*")
    
    report_text = "\n".join(report)
    
    # Write report
    report_path = os.path.join(BASE_DIR, "ENDPOINT_SWEEP_REPORT.md")
    with open(report_path, "w") as f:
        f.write(report_text)
    
    print(f"\nReport written to {report_path}")
    print(f"\nFinal tally: {total_pass} pass, {total_fail} fail")
    
    # Also save structured data for potential reuse
    sweep_data = {
        "total_routes": len(all_routes),
        "routes_tested": total_tested,
        "pass": total_pass,
        "fail": total_fail,
        "status_counts": dict(status_counts),
        "failures": [(r, c, d[:200]) for r, c, d in failures],
        "verdict": "PASS" if (status_counts["5xx"] == 0 and status_counts["timeout"] == 0 and status_counts["error"] == 0) else "BLOCKED"
    }
    
    data_path = os.path.join(BASE_DIR, "sweep_results.json")
    with open(data_path, "w") as f:
        json.dump(sweep_data, f, indent=2)
    
    print(f"Structured data written to {data_path}")
    return sweep_data

if __name__ == "__main__":
    data = main()
    # Exit with error code if blocked
    if data["verdict"] == "BLOCKED":
        exit(1)
    exit(0)
