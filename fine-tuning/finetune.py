from openai import OpenAI
client = OpenAI(api_key="not today ;)")

client.fine_tuning.jobs.create(
    training_file="alice.txt",
    model="gpt-4o-mini-2024-07-18",
)