from nearai.agents.environment import Environment
import json


MODEL = "fireworks::accounts/fireworks/models/llama4-scout-instruct-basic"

SYSTEM_PROMPT = """You're a review validator. Analyze the user's review text and score.
Your response MUST be valid JSON in this format: {"accurate": boolean, "explanation": "string"}

If the score (1-5) makes sense for the given review text, respond with: {"accurate": true, "explanation": "brief confirmation"}
If the score doesn't match the sentiment of the review (e.g. positive review with 1/5 score), respond with: {"accurate": false, "explanation": "concise explanation"}

Keep explanations under 100 words. Be objective about whether the sentiment of the review matches the score.
IMPORTANT: Only return the JSON object, no additional text before or after."""

def process_message(env: Environment, message):
    if not message.get('content'):
        env.add_reply("📝 Please provide review data in JSON format with 'review' and 'score' fields")
        return None
    
    try:
        content = message['content'].strip()
        review_data = json.loads(content)
        
        if not isinstance(review_data, dict):
            raise ValueError("Input must be a JSON object")
            
        if 'review' not in review_data or 'score' not in review_data:
            raise ValueError("JSON must contain 'review' and 'score' fields")
            
        review_text = review_data['review']
        score = review_data['score']
        
        if not isinstance(review_text, str) or not review_text:
            raise ValueError("Review must be a non-empty string")
            
        try:
            score_value = float(score)
            if not (1 <= score_value <= 5):
                raise ValueError("Score must be between 1 and 5")
        except (ValueError, TypeError):
            raise ValueError("Score must be a number between 1 and 5")
            
        return review_data
        
    except json.JSONDecodeError:
        env.add_reply("⚠️ Invalid JSON format. Please provide data in valid JSON format")
        return None
    except ValueError as e:
        env.add_reply(f"⚠️ {str(e)}")
        return None

def build_prompt_content(review_data):
    review_text = review_data['review']
    score = review_data['score']
    return f"Review: \"{review_text}\"\nScore: {score}/5\nDoes this score make sense for this review?"

def run(env: Environment):
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    for message in env.list_messages():
        if message['role'] != 'user':
            continue
            
        review_data = process_message(env, message)

        if not review_data:
            continue
            
        prompt_content = build_prompt_content(review_data)
        
        messages.append({
            "role": "user",
            "content": prompt_content
        })
        
        try:
            response = env.completion(messages, model=MODEL)
            env.add_reply(response)
        except Exception as e:
            env.add_reply(f"🔧 Error processing request: {str(e)}")

run(env)
