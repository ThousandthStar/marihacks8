import json

# Read the full text
with open("alice.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Option 1: Split by paragraphs (assuming paragraphs are separated by two newlines)
paragraphs = [p.strip() for p in text.split("\n\n") if len(p.strip()) > 50]

# Option 2: Or split into fixed-size chunks (here, character-based splitting)
chunk_size = 1024  # adjust based on your model's max sequence length
chunks = [text[i:i+chunk_size].strip() for i in range(0, len(text), chunk_size) if len(text[i:i+chunk_size].strip()) > 50]

# Choose which segmentation to use:
segments = paragraphs  # or segments = chunks

# Create JSONL file
with open("alice_finetune2.jsonl", "w", encoding="utf-8") as outfile:
    for segment in segments:
        example = {
            "messages": [
                {"role": "system", "content": ""},
                {"role": "user", "content": ""},
                {"role": "assistant", "content": segment + "\n"}
            ]
        }
        outfile.write(json.dumps(example) + "\n")
