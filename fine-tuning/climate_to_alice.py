import openai
import time
import json
import random

client = openai.OpenAI(api_key="not today ;)")  # replace with your key

custom_model = "gpt-4o-mini"  # replace with your model name

topics = [
    "rising sea levels", "plastic pollution", "air quality", "renewable energy",
    "composting", "ocean acidification", "clean transportation", "solar power",
    "wind energy", "climate activism"
]

def generate_story(topic):
    messages = [
        {"role": "user", "content": f"Tell a children's story about {topic}."}
    ]
    response = client.chat.completions.create(
        model=custom_model,
        messages=messages,
        temperature=0.8
    )
    return topic, response.choices[0].message.content.strip()

with open("extra_alice_data.jsonl", "w") as f:
    selected = random.sample(topics, 10)
    for topic in selected:
        try:
            topic, story = generate_story(topic)
            json.dump({
                "messages": [
                    {"role": "user", "content": f"Tell a children's story about {topic}."},
                    {"role": "assistant", "content": story}
                ]
            }, f)
            f.write("\n")
            print(f"✅ Generated: {topic}")
            time.sleep(1)
        except Exception as e:
            print(f"❌ Failed for {topic}: {e}")

