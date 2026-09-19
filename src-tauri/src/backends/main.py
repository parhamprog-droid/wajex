import argostranslate.package
import argostranslate.translate
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# فعال‌سازی CORS برای اینکه Next.js بتواند با این سرور ارتباط برقرار کند
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # برای محیط توسعه. در نسخه نهایی باید محدودتر شود
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranslationRequest(BaseModel):
    text: str
    from_lang: str
    to_lang: str

# این تابع سعی می‌کند زبان مورد نظر را پیدا کرده و ترجمه کند
def translate_text(text: str, from_lang: str, to_lang: str) -> str:
    # پیدا کردن زبان مبدأ و مقصد
    from_lang_obj = None
    to_lang_obj = None
    
    # Argos از کدهای زبانی مثل 'fa' و 'en' استفاده می‌کند
    for lang in argostranslate.translate.get_installed_languages():
        if lang.code == from_lang:
            from_lang_obj = lang
        if lang.code == to_lang:
            to_lang_obj = lang
            
    if not from_lang_obj or not to_lang_obj:
        raise HTTPException(status_code=400, detail=f"One of the languages ({from_lang} -> {to_lang}) is not installed.")
    
    # پیدا کردن پکیج ترجمه بین دو زبان
    translation = from_lang_obj.get_translation(to_lang_obj)
    if not translation:
        raise HTTPException(status_code=400, detail=f"No translation package found for {from_lang} to {to_lang}.")
        
    return translation.translate(text)

@app.post("/translate")
async def translate(req: TranslationRequest):
    try:
        translated_text = translate_text(req.text, req.from_lang, req.to_lang)
        return {"translated_text": translated_text}
    except Exception as e:
        print(f"Error: {e}") # برای دیباگ در کنسول
        raise HTTPException(status_code=500, detail=str(e))