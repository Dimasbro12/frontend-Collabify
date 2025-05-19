from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai

# Konfigurasi API Key
genai.configure(api_key="AIzaSyDTyck_t2v4xD-7QBP43iYX7wid3b520hY")

# Konfigurasi model
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 2048,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-2.5-pro-preview-03-25",
    generation_config=generation_config,
)

chat_session = model.start_chat(history=[])

app = FastAPI()

# Izinkan akses dari frontend (port 3000 React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Ganti dengan http://localhost:3000 di production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.post("/ask-ai")
async def ask_ai(req: ChatRequest):
    user_input = req.message.strip()

    if not user_input:
        return {"response": "Pertanyaan kosong."}

    # Prompt builder
    def generate_prompt(user_input):
        if "error" in user_input.lower() or "exception" in user_input.lower():
            return f"""
Jelaskan error berikut secara jelas dan berikan solusi jika ada:
---
{user_input}
---
Jika memungkinkan, berikan contoh perbaikan kode."""
        elif "function" in user_input or ";" in user_input or "{" in user_input:
            return f"""
Berdasarkan potongan kode berikut, carikan referensi repository GitHub open-source yang relevan, 
dan berikan sedikit penjelasan:
---
{user_input}
---
Format balasan:
- Penjelasan singkat
- Daftar repository dengan nama & link"""
        else:
            return f"Bantu jawab atau beri respon yang relevan untuk pesan ini: {user_input}"

    try:
        prompt = generate_prompt(user_input)
        response = chat_session.send_message(prompt)
        return {"response": response.text}
    except Exception as e:
        return {"response": f"⚠️ Gagal menghubungi AI: {e}"}
