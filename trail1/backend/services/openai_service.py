from openai import OpenAI

client = OpenAI(api_key="your_api_key")

def analyze_fitness(data):
    prompt = f"""
    Create a personalized fitness plan.

    Age: {data.age}
    Gender: {data.gender}
    Height: {data.height} cm
    Weight: {data.weight} kg
    Goal: {data.goal}
    Experience: {data.experience}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
    )

    return response.choices[0].message.content
