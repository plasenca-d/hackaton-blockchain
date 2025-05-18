from nearai.agents.environment import Environment
from PIL import Image
import io
import base64

MODEL = "fireworks::accounts/fireworks/models/llama4-scout-instruct-basic"

SYSTEM_PROMPT = """You're an image description validator. Analyze the image and user's description.
Your response MUST be valid JSON in this format: {"accurate": boolean, "explanation": "string"}

If the description is accurate, respond with: {"accurate": true, "explanation": "brief confirmation"}
If the description is inaccurate, respond with: {"accurate": false, "explanation": "concise explanation"}

Keep explanations under 100 words. Prioritize objective visual elements. 
IMPORTANT: Only return the JSON object, no additional text before or after."""

def load_image(bytes: bytes) -> Image.Image:
    try:
        img = Image.open(io.BytesIO(bytes))
        return img
    except Exception as e:
        raise ValueError(f"Invalid image: {str(e)}")

def process_message(env: Environment, message):
    images = []
    attachments = message.get('attachments', [])
    
    for attachment in attachments:
        if not hasattr(attachment, 'file_id'):
            continue
            
        file_bytes = env.read_file_by_id(attachment.file_id, decode=None)
        
        if not isinstance(file_bytes, bytes):
            continue
            
        try:
            images.append(load_image(file_bytes))
        except Exception as e:
            env.add_reply(f"⚠️ Error processing image: {str(e)}")
            return None

    if not images:
        env.add_reply("🖼️ Please attach an image to validate")
        return None

    return images

def build_content(images, user_text):
    content = []
    for img in images:
        max_size = (800, 800)
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        buffer = io.BytesIO()
        img_format = "JPEG"
        img.convert("RGB").save(buffer, format=img_format, quality=85)
        
        img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        content.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/{img_format.lower()};base64,{img_base64}"}
        })
    
    content.append({"type": "text", "text": user_text})
    return content

def run(env: Environment):
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    for message in env.list_messages():
        if message['role'] != 'user':
            continue
            
        images = process_message(env, message)

        if not images:
            continue
            
        user_text = message['content'] or "Is this description accurate?"
        content = build_content(images, user_text)
        
        messages.append({
            "role": "user",
            "content": content
        })
        
        try:
            response = env.completion(messages, model=MODEL)
            env.add_reply(response)
        except Exception as e:
            env.add_reply(f"🔧 Error processing request: {str(e)}")

run(env)
