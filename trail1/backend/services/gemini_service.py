import google.generativeai as genai
import json
import re

genai.configure(api_key="API_KEY")
model = genai.GenerativeModel("models/gemini-2.5-flash")

def generate_exercise_guidance(analysis_text):
    prompt = """
    Generate 3 exercises strictly in JSON format.

    [
      {
        "name": "Exercise name",
        "steps": ["Step 1", "Step 2"],
        "video_query": "exercise tutorial"
      }
    ]
    """

    response = model.generate_content(prompt)
    text = re.sub(r"```json|```", "", response.text).strip()

    try:
        return json.loads(text)
    except Exception as e:
        print("Gemini JSON parse error:", e)
        print("RAW:", text)
        return []
