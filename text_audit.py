#!/usr/bin/env python3
"""
Melodyfire v3 - Text audit script
Fixes dangerous text/border/bg patterns in light/dark mode
"""

import re
import os

BASE = '/home/user/workspace/melodyfire-v3/client/src'
FILES = [
    'pages/AboutPage.tsx',
    'pages/AIToolsPage.tsx',
    'pages/BlogPage.tsx',
    'pages/ChildrensArtPage.tsx',
    'pages/GenerativeArtPage.tsx',
    'pages/HomePage.tsx',
    'pages/PortfolioPage.tsx',
    'pages/RegenerativePage.tsx',
    'pages/ReversePromptPage.tsx',
    'pages/ServicesPage.tsx',
    'pages/ShopPage.tsx',
    'components/Nav.tsx',
    'components/Footer.tsx',
]

changes_report = []

for rel_path in FILES:
    path = os.path.join(BASE, rel_path)
    if not os.path.exists(path):
        changes_report.append(f'SKIP (not found): {rel_path}')
        continue

    with open(path, 'r') as f:
        original = f.read()

    content = original

    file_changes = []

    # PATTERN 1: text-[hsl(var(--foreground)/... or text-[hsl(var(--muted-foreground)/...
    # These have opacity slash like text-[hsl(var(--muted-foreground)/0.7)]
    # Replace with text-[hsl(var(--muted-foreground))]
    p1a = re.compile(r'text-\[hsl\(var\(--muted-foreground\)/[0-9.]+\)\]')
    matches1a = p1a.findall(content)
    if matches1a:
        content = p1a.sub('text-[hsl(var(--muted-foreground))]', content)
        file_changes.append(f'  Pattern 1a (muted-foreground opacity slash): {len(matches1a)} replacements')

    p1b = re.compile(r'text-\[hsl\(var\(--foreground\)/[0-9.]+\)\]')
    matches1b = p1b.findall(content)
    if matches1b:
        content = p1b.sub('text-[hsl(var(--foreground))]', content)
        file_changes.append(f'  Pattern 1b (foreground opacity slash): {len(matches1b)} replacements')

    # PATTERN 3: border-[hsl(var(--border)/0.X)] → border-[hsl(var(--border))]
    p3 = re.compile(r'border-\[hsl\(var\(--border\)/[0-9.]+\)\]')
    matches3 = p3.findall(content)
    if matches3:
        content = p3.sub('border-[hsl(var(--border))]', content)
        file_changes.append(f'  Pattern 3 (border opacity): {len(matches3)} replacements')

    # PATTERN 4: bg-[hsl(var(--muted)/0.X)] → bg-[hsl(var(--muted))] 
    # Keep the decimal variant: hsl(var(--muted)/0.X) inline style is OK; Tailwind class is not
    p4 = re.compile(r"bg-\[hsl\(var\(--muted\)/[0-9.]+\)\]")
    matches4 = p4.findall(content)
    if matches4:
        content = p4.sub('bg-[hsl(var(--card))]', content)
        file_changes.append(f'  Pattern 4 (bg-muted opacity): {len(matches4)} replacements')

    # TASK 3: Image fit audit - add aspectRatio before maxHeight if not already present
    # Find style={{ maxHeight: without aspectRatio already being on that style object
    # We need to look for: style={{ maxHeight: ... }} (without aspectRatio already in same style block)
    # Simple approach: find `style={{ maxHeight:` and insert `aspectRatio: '4/3', ` before it
    # But we need to be careful not to double-add
    p_img = re.compile(r"style=\{\{(?![^}]*aspectRatio)\s*(maxHeight:)")
    matches_img = p_img.findall(content)
    if matches_img:
        content = p_img.sub(r"style={{ aspectRatio: '4/3', \1", content)
        file_changes.append(f'  Task 3 (aspectRatio before maxHeight): {len(matches_img)} replacements')

    if content != original:
        with open(path, 'w') as f:
            f.write(content)
        changes_report.append(f'MODIFIED: {rel_path}')
        for c in file_changes:
            changes_report.append(c)
    else:
        changes_report.append(f'NO CHANGES: {rel_path}')

print('\n'.join(changes_report))
print('\nDone.')
