from transformers import GPT2LMHeadModel, GPT2Tokenizer

# Load model and tokenizer
model = GPT2LMHeadModel.from_pretrained("gpt2")
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
tokenizer.pad_token = tokenizer.eos_token  # GPT-2 doesn't have a pad token

# Prompt
prompt = "Rewrite the following in the whimsical style of Alice in Wonderland: `Once upon a time, the animals of the forest gathered to stop the rising heat that was drying up their streams...`"

# Tokenize with attention mask
inputs = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True)
input_ids = inputs["input_ids"]
attention_mask = inputs["attention_mask"]

# Generate
output = model.generate(
    input_ids=input_ids,
    attention_mask=attention_mask,
    max_length=100,
    do_sample=True,
    temperature=0.8,
    top_k=50,
    top_p=0.95,
    repetition_penalty=1.2
)

# Decode and print result
generated_text = tokenizer.decode(output[0], skip_special_tokens=True)
print(generated_text)
