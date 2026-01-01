import csv
import re

input_file = 'project-topic.csv'
output_file = 'project-topic.csv'

print("Reading file...")

# Read file preserving tabs
with open(input_file, 'rb') as f:
    raw = f.read()

text = raw.decode('utf-8')
lines = text.splitlines()

# Header
header_line = lines[0]
if '\t' in header_line:
    header = header_line.split('\t')
else:
    header = header_line.split(',')

header = [h.strip() for h in header]
print(f"Header ({len(header)} cols): {header}")

# Keep columns (remove Co-SuperVisior and Total Preference)
keep_indices = []
new_header = []
for idx, col in enumerate(header):
    col_clean = col.strip().strip('"').strip("'")
    if col_clean not in ['Co-SuperVisior', 'Total Preference']:
        keep_indices.append(idx)
        new_header.append(col_clean)

print(f"New header ({len(new_header)} cols): {new_header}")

# Process rows
cleaned_rows = [new_header]
pending_title = None
i = 1

while i < len(lines):
    line = lines[i]
    
    if not line.strip():
        i += 1
        continue
    
    # Split by tab
    if '\t' in line:
        parts = line.split('\t')
    else:
        parts = line.split(',')
    
    parts = [p.strip() for p in parts]
    
    # Check if complete row
    has_data = len(parts) >= 4 and any(p for p in parts[1:min(5, len(parts))] if p)
    
    if not has_data and parts[0]:
        # Title line
        title = parts[0].strip().strip('"').strip("'")
        if pending_title:
            pending_title = (pending_title + ' ' + title).strip()
        else:
            pending_title = title
        i += 1
        continue
    
    # Complete row
    if len(parts) >= len(header) or has_data:
        row = []
        for idx in keep_indices:
            if idx < len(parts):
                cell = parts[idx].strip().strip('"').strip("'")
                cell = re.sub(r'\s+', ' ', cell)
                row.append(cell)
            else:
                row.append('')
        
        if pending_title:
            row[0] = pending_title
            pending_title = None
        
        if row[0]:
            cleaned_rows.append(row)
    elif parts[0]:
        title = parts[0].strip().strip('"').strip("'")
        if pending_title:
            pending_title = (pending_title + ' ' + title).strip()
        else:
            pending_title = title
    
    i += 1

if pending_title:
    row = [pending_title] + [''] * (len(new_header) - 1)
    cleaned_rows.append(row)

# Write CSV
with open(output_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    for row in cleaned_rows:
        writer.writerow(row)

print(f"\n✓ Done! {len(cleaned_rows)} rows written")
print(f"✓ Removed: Co-SuperVisior, Total Preference")
print(f"✓ Fixed spacing and merged titles")









