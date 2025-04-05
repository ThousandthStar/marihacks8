## HackGen / Alice in Climateland

![HackGen Logo](/media/hackgen.png)

![Alice in Climateland](/media/alice.png)

### Submission for MariHacks 8.0.

This is a two-part project:
- **HackGen** is a hackathon idea generator that generates 5 hackathon project ideas based on a challenge prompt.
- **Alice in Climateland** is web app that generates bedtime short stories for children in order to raise climate awareness. 

_The idea for **Alice in Climateland** came from a HackGen run._

### Full Feature List

#### HackGen

- Either paste a challenge prompt or upload a PDF with the challenge.
- Generates 5 hackathon ideas based on the challenge prompt, with a...
    - name
    - short description of the idea
    - list of 5 key features
    - list of 3 pros and 3 cons
- Has a "kickstart" feature, where the AI will set up a NextJS/React project with your idea name automatically.

#### Alice in Climateland

- Provide a theme for your short story (better if related to climate change)
- Generates a bedtime short story for a child using a fine-tuned GPT-3.5 Turbo model.
- Takes into account the user's location when generating in order to make the story more relatable.
