from nearai.agents.environment import Environment
import base64

MODEL = "fireworks::accounts/fireworks/models/llama4-scout-instruct-basic"

SYSTEM_PROMPT = """You're an image description validator. Analyze the image and user's description.
Your response MUST be valid JSON in this format: {"accurate": boolean, "explanation": "string"}

If the description is accurate, respond with: {"accurate": true, "explanation": "brief confirmation"}
If the description is inaccurate, respond with: {"accurate": false, "explanation": "concise explanation"}

Keep explanations under 100 words. Prioritize objective visual elements. 
IMPORTANT: Only return the JSON object, no additional text before or after."""

def process_message(env: Environment, message):
    try:
        content = message.get('content', '')
        if not content:
            env.add_reply("⚠️ No content provided")
            return None, None
            
        import json
        try:
            data = json.loads(content)
        except json.JSONDecodeError:
            env.add_reply("⚠️ Invalid JSON format. Please send in format: {\"image\": \"base64_string\", \"review\": \"text\"}")
            return None, None
        
        base64_image = data.get('image')
        review_text = data.get('review', 'Is this description accurate?')
        
        if not base64_image:
            env.add_reply("🖼️ No image provided in the request")
            return None, None
            
        if ',' in base64_image:
            base64_image = base64_image.split(',', 1)[1]
            
        return base64_image, review_text
            
    except Exception as e:
        env.add_reply(f"⚠️ Error processing request: {str(e)}")
        return None, None

def build_content(base64_image, user_text):
    content = []
    
    content.append({
        "type": "image_url",
        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}
    })
    
    content.append({"type": "text", "text": user_text})
    return content

def run(env: Environment):
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    for message in env.list_messages():
        if message['role'] != 'user':
            continue
            
        base64_image, review_text = process_message(env, message)

        if not base64_image:
            continue
            
        content = build_content(base64_image, review_text)
        
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
