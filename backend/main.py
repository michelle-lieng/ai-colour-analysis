from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv

# Optional: Load API key from .env file
load_dotenv()
client = OpenAI(
            api_key=os.getenv("GOOGLE_API_KEY"),
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )

# Define Gemini model
app = FastAPI()

# Allow CORS so frontend (localhost) can call this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or use ["http://localhost:5500"] etc.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ColourRequest(BaseModel):
    eye: str
    hair: str
    skin: str

@app.post("/analyse")
async def analyse_colors(colours: ColourRequest):
    prompt = f"""
            You are a professional color consultant. Based on the client's features:

            - Eye color hex: {colours.eye}
            - Hair color hex: {colours.hair}
            - Skin tone hex: {colours.skin}

            Determine the most likely seasonal color type (e.g. Soft Autumn, Cool Winter, etc.), and explain:
            - Why that season fits
            - What clothing or makeup colors will suit them best
            Keep the explanation human-friendly and warm.
            """

    try:
        messages = [
                {"role": "user", "content": prompt}
            ]
        
        completion = client.chat.completions.create(
            model="gemini-2.0-flash",
            messages=messages,
            response_format={"type": "text"},
            temperature=0.7
            )
        raw_analysis = completion.choices[0].message.content.strip()
        
        # Split the response into paragraphs
        paragraphs = raw_analysis.split("\n\n")
        return {"analysis": paragraphs}
    except Exception as e:
        return {"error": str(e)}

# uvicorn backend.main:app --reload