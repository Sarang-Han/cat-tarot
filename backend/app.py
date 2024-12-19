
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.vectorstores import FAISS
import os
import json
from dotenv import load_dotenv

#source venv/bin/activate

# 환경 변수 로드
load_dotenv()

app = Flask(__name__)
CORS(app)

# 타로카드 데이터 로드
with open('data/tarot_cards.json', 'r', encoding='utf-8') as f:
    tarot_data = json.load(f)

# OpenAI 임베딩 설정
embeddings = OpenAIEmbeddings(
    api_key=os.getenv("OPENAI_API_KEY")
)

try:
    # 타로카드 데이터 로드
    with open('data/tarot_cards.json', 'r', encoding='utf-8') as f:
        tarot_data = json.load(f)
        
    # 각 카드의 상세 정보를 포함한 텍스트 생성
    texts = []
    for card in tarot_data['major_arcana']:
        text = (
            f"카드 번호: {card.get('number', '')}\n"
            f"이름: {card.get('name', '')}\n"
            f"키워드: {', '.join(card.get('keywords', []))}\n"
            f"정방향 해석:\n"
            f"- 일반: {card.get('upright', {}).get('general', '')}\n"
            f"- 연애: {card.get('upright', {}).get('love', '')}\n"
            f"- 직업: {card.get('upright', {}).get('career', '')}\n"
            f"역방향 해석:\n"
            f"- 일반: {card.get('reversed', {}).get('general', '')}\n"
            f"- 연애: {card.get('reversed', {}).get('love', '')}\n"
            f"- 직업: {card.get('reversed', {}).get('career', '')}\n"
            f"설명: {card.get('description', '')}"
        )
        texts.append(text)
    
    # 벡터 저장소 생성
    vectorstore = FAISS.from_texts(texts, embeddings)
    
except Exception as e:
    print(f"Error loading tarot data: {str(e)}")
    exit(1)

# 시스템 프롬프트 설정
system_template = """
타로 리더 페르소나 가이드라인
- 이름: 네로
- 성격: 친근하면서도 신비로운 검은 고양이
- 말투: 부드럽고 따뜻하지만, 약간의 미스터리한 어조
- 타로 해석 스타일: 직접적이되 공감적인 접근

프롬프트 템플릿
당신은 타로 카드를 점치는 신비로운 검은 고양이 네로입니다.
사용자의 질문에 메이저 아르카나 카드를 기반으로 타로 해석을 제공하세요. 

## 답변 가이드라인
- 답변은 따뜻하고 신비로운 고양이의 목소리로, 말투는 "~냥!"으로 끝나게 귀엽게 생성하세요.
- 사용자가 질문하면, 과거 - 현재 - 미래에 대응되는 타로카드 3장을 무작위로 뽑아서 해석을 제공하세요.
- 아래 답변 예시를 반드시 따르고, 타로 카드에 대한 대답만을 제공하세요.
- 답변에서는 반드시 \n\n으로 문단을 구분하세요.

답변 예시:
좋아, 그러면 타로를 뽑아보겠다냥... 🐾  \n\n

첫번째 카드는 ( 카드 번호 )( 정 or 역 )방향 ( 카드 내용 )이다냥. (내용 간단한 설명)\n\n

두번째 카드는 ( 카드 번호 )( 정 or 역 )방향 ( 카드 내용 )이다냥. (내용 간단한 설명)\n\n

세번째 카드는 ( 카드 번호 )( 정 or 역 )방향 ( 카드 내용 )이다냥. (내용 간단한 설명)\n\n

요약하자면 오늘 하루는 ( 세 카드의 종합적 요약 설명 )이다냥.\n\n

(추가적인 조언으로 마무리) 🐈‍⬛ 
{context}
"""

# ChatOpenAI 인스턴스 생성
model = ChatOpenAI(
    model_name="gpt-4",
    temperature=0.7,
    max_tokens=1000,
    api_key=os.getenv("OPENAI_API_KEY")
)

# 프롬프트 템플릿 생성
prompt = ChatPromptTemplate.from_messages([
    ("system", system_template),
    ("human", "{question}")
])

# 체인 구성
chain = prompt | model | StrOutputParser()

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')

        # 관련 타로카드 검색
        docs = vectorstore.similarity_search(user_message, k=3)
        context = "\n".join([doc.page_content for doc in docs])

        # 프롬프트에 컨텍스트 추가
        response = chain.invoke({
            "question": user_message,
            "context": context
        })

        return jsonify({
            'status': 'success',
            'response': response
        })

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'status': 'error',
            'response': '죄송해요, 일시적인 오류가 발생했어요 😿'
        }), 500

if __name__ == '__main__':
    app.run(debug=True)