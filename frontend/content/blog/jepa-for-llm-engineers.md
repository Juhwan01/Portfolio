---
title: 'JEPA를 LLM 엔지니어의 눈으로 읽기: 판단은 의미로, 문장은 필요할 때만'
excerpt: Yann LeCun이 Meta를 떠나 세운 AMI Labs가 10억 3천만 달러를 모았고, 그 중심에 JEPA가 있습니다. 로봇과 영상 이야기처럼 들리지만, 토큰 대신 의미를 예측하고 필요할 때만 문장으로 풀어내는 VL-JEPA의 설계는 LLM 앱의 비용·지연 문제와 가깝습니다. JEPA를 소개하고, 그 아이디어를 앱 구조로 옮겨 읽어 봅니다.
tags:
- JEPA
- World Model
- Embedding
category: insight
read_time: 8
published_at: '2026-11-04T10:50:00Z'
---

> **한눈에 보기**
> - JEPA는 토큰이나 픽셀 대신 **의미(임베딩)를 예측**하는 구조입니다. LeCun의 AMI Labs가 이 방향으로 10억 3천만 달러를 모았지만, 아직 제품은 없습니다.
> - VL-JEPA는 답의 임베딩을 예측하고 **뜻이 바뀔 때만 문장으로 풀어**, 디코더 호출을 약 2.85분의 1로 줄였습니다. 영상 캡션 과제 하나에서 센 호출 횟수입니다.
> - LLM 앱으로 옮기면 "**판단은 임베딩으로, 문장은 필요할 때만**"입니다. 다만 범용 임베딩은 "가능"과 "불가" 같은 결정적인 변화를 놓칠 수 있습니다.

2025년 11월 19일, Yann LeCun이 12년 만에 Meta를 떠난다고 [발표했습니다](https://www.engadget.com/ai/metas-chief-ai-scientist-is-leaving-the-company-after-12-years-224325268.html). 넉 달 뒤인 2026년 3월 10일, 그가 이끄는 AMI Labs(Advanced Machine Intelligence)가 10억 3천만 달러를 모아 [공식 출범했습니다](https://amilabs.xyz/updates).

- 파리, 뉴욕, 몬트리올, 싱가포르에 사람을 두고, 현실 세계를 이해하고 기억하고 계획하는 world model(행동하면 세상이 어떻게 바뀔지 미리 그려 보는 모델)을 만들겠다고 합니다.
- LeCun은 팔 수 있는 제품이 나오기까지 5년쯤 걸릴 수도 있다고 [말했습니다](https://www.artificialintelligence-news.com/news/the-billion-dollar-startup-with-a-different-idea-for-ai-ami-labs-yann-lecun/).
- 11월 현재 AMI가 낸 제품이나 모델은 없습니다. 나오는 건 논문뿐입니다.

LLM으로 서비스를 만드는 입장에서 이 회사가 밀고 있는 JEPA를 읽다 보면, 핵심 아이디어 하나가 LLM 앱의 비용·지연 문제와 닿아 있는 게 보입니다. **토큰을 생성하기 전에 의미 공간에서 먼저 판단한다**는 생각입니다. 토큰은 LLM이 글을 잘게 쪼개 읽고 쓰는 단위입니다.

## JEPA는 무엇을 예측하나

먼저 임베딩부터 짚고 가겠습니다. 임베딩은 글이나 이미지의 뜻을 숫자 목록으로 바꾼 것이고, 예를 들어 "환불해 주세요"와 "돈 돌려받고 싶어요"는 글자는 달라도 서로 가까운 숫자 목록이 됩니다.

JEPA(Joint Embedding Predictive Architecture)는 입력에서 보이는 부분을 인코더(입력을 임베딩으로 바꾸는 부분)로 임베딩하고, **가려진 부분의 임베딩**이 무엇일지 맞히도록 예측기를 학습시킵니다. 맞혀야 할 정답도 원본 픽셀이나 토큰이 아니라 인코더가 만든 임베딩입니다. 빈칸 채우기에 비유하면, 들어갈 단어를 정확히 맞히는 대신 "이런 뜻의 말이 들어간다"까지만 맞히는 연습입니다.

| | 다음 토큰·픽셀을 예측하는 모델 | JEPA |
|---|---|---|
| 맞히는 것 | 다음 토큰, 다음 프레임의 픽셀 | 가려진 부분의 임베딩 |
| 공이 굴러가는 영상이라면 | 그림자 모양, 잔디 결, 조명까지 | "공이 오른쪽으로 계속 굴러간다"에 해당하는 표현만 |

픽셀을 예측하는 모델이 맞혀야 하는 정보의 대부분은 예측할 수 없거나 예측할 필요가 없는 것들입니다. Meta는 V-JEPA를 소개하면서 이 구조가 "has the flexibility to discard unpredictable information"(예측할 수 없는 정보는 버릴 수 있다)이라고 [썼습니다](https://ai.meta.com/blog/v-jepa-yann-lecun-ai-model-video-joint-embedding-predictive-architecture/).

계보는 짧습니다.

| 시기 | 이름 | 내용 |
|---|---|---|
| 2022 | LeCun [입장문](https://openreview.net/forum?id=BZ5a1r-kVsf) | 방향 제시 |
| 2023 | [I-JEPA](https://arxiv.org/abs/2301.08243) | 이미지 |
| 2024 | V-JEPA | 영상 |
| 2025.06 | [V-JEPA 2](https://arxiv.org/abs/2506.09985) | 인터넷 영상 100만 시간 넘게 사전학습. 로봇 영상은 62시간 미만만 더 학습하고, 처음 보는 실험실의 로봇 팔로 물건을 옮김. 컵 과제 성공률은 두 실험실 평균 80% |
| 2025.12 | [VL-JEPA](https://arxiv.org/abs/2512.10942) | 답 문장의 임베딩을 예측하고, 필요할 때만 문장으로 풀어냄 |
| 2026.10 | [RoboJEPA](https://arxiv.org/abs/2610.10515) (Meta FAIR) | 로봇 영상 1만 5천 시간으로 학습, 체크포인트(학습된 모델 파일)와 코드 공개 |

V-JEPA 2를 NVIDIA Cosmos와 같은 계획 방식으로 견줬을 때, 행동 하나(로봇 팔을 다음에 어떻게 움직일지)를 정하는 데 V-JEPA 2는 **16초**, Cosmos는 **약 4분**이 걸렸습니다.

## LLM 엔지니어가 볼 대목, VL-JEPA

여기까지는 로봇과 영상 이야기입니다. 제가 주목한 건 VL-JEPA입니다. 이미지나 영상을 보고 질문에 답하는 모델인데, 보통의 VLM(비전-언어 모델)처럼 답을 토큰 하나씩 생성하지 않고 **답 문장의 임베딩을 예측**합니다. 글자로 된 답이 필요할 때만 가벼운 디코더가 그 임베딩을 문장으로 풀어냅니다.

논문이 보인 결과는 두 가지입니다.

- **같은 조건에서 더 적은 파라미터로 더 좋은 캡션.** 비전 인코더와 학습 데이터를 같게 두고, 사전학습에서 같은 양(샘플 1,500만 개)을 학습한 시점에 견줬습니다. 임베딩을 예측하는 0.5B(학습으로 정해지는 모델 안의 숫자인 파라미터가 5억 개) 예측기가 다음 토큰을 예측하는 1B(10억 개) LLM보다 캡션 품질이 높았습니다(CIDEr 14.8 대 7.1). CIDEr는 모델이 쓴 캡션이 사람이 쓴 정답 캡션과 얼마나 겹치는지 매기는 점수로, 높을수록 좋습니다.
- **뜻이 바뀔 때만 말하기(selective decoding).** 영상을 실시간으로 설명하는 과제에서 예측한 임베딩이 크게 바뀔 때만 디코더를 불렀습니다. 1초에 한 번(1Hz) 꼬박꼬박 문장을 만드는 방식과 평균 품질이 같으면서, 디코딩은 평균 0.35Hz(1초에 0.35번)로만 했습니다. 논문은 이를 디코딩 횟수가 약 2.85분의 1로 줄었다고 적었습니다.

두 번째 결과는 스포츠 중계에 비유할 수 있습니다. 1초마다 꼬박꼬박 한마디씩 하는 해설자 대신, 골이나 반칙처럼 상황이 바뀔 때만 말하는 해설자입니다. 100초 동안 100번 말하던 것을 35번쯤만 말하는 셈입니다.

이 숫자는 조심해서 읽어야 합니다.

- 2.85분의 1은 영상 캡션 과제 하나(EgoExo4D)에서 **디코더 호출 횟수**로 센 값이고, 실제 응답 시간이나 비용을 잰 값이 아닙니다.
- 저자들도 이 모델이 VLM을 대체한다고 주장하지 않습니다. 추론, 도구 사용, 에이전트 행동처럼 토큰을 생성하는 지금의 모델이 잘하는 영역은 더 넓게 평가해 봐야 한다는 [단서](https://arxiv.org/html/2512.10942v2)를 직접 달아 두었습니다.
- 공식 코드와 가중치도 아직 찾지 못했습니다.

## 앱 구조로 옮겨 읽기

> **제 해석**
>
> 이 설계에서 가져올 생각은 **판단하는 일과 말하는 일을 분리한다**는 것입니다. LLM 앱의 생성 호출 중 적지 않은 수가 사실 문장이 필요 없는 일을 합니다. 결과는 라벨 하나나 예·아니오 하나인데, 그걸 얻으려고 모델이 JSON 수십 토큰과 때로는 사고 토큰(답하기 전에 생각하며 쓰는 토큰) 수백 개를 생성합니다. 이런 호출에서 걸리는 시간은 대부분 생성하는 시간입니다.

문장이 필요 없는 생성 호출의 예는 이렇습니다.

- 요청을 어느 경로로 보낼지 정하는 **라우터**
- 새로 들어온 문서가 이미 본 것과 같은지 보는 **중복 판정**
- 지켜보는 대상의 상태가 바뀌었는지 보는 **변화 감지**

VL-JEPA의 selective decoding을 앱 패턴으로 바꾸면, 상태를 싸게 임베딩해 두고 직전 상태와 비교해서 **의미 있게 달라졌을 때만 생성 모델을 부르는** 방식이 됩니다.

회의나 로그 스트림을 30초마다 요약하는 기능을 예로 들어 계산해 보겠습니다. 한 시간이면 120번 호출합니다. 내용이 실제로 바뀌는 순간에만 부르고, 호출이 줄어드는 비율이 VL-JEPA와 같다(약 2.85분의 1)고 가정하면 약 42번(120 ÷ 2.85)이 됩니다. 단가는 GPT-6 Luna의 [공개 가격](https://developers.openai.com/api/docs/models/gpt-6-luna)으로 잡았습니다.

```
요약 1회 (GPT-6 Luna, 입력 4,000토큰 · 출력 300토큰으로 가정)
  4,000 × $0.10/1M + 300 × $0.50/1M = $0.00055

스트림 하나, 한 시간
  30초마다:      120 × $0.00055 = $0.066
  바뀔 때만:      42 × $0.00055 = $0.023

동시에 도는 스트림 1만 개, 한 시간
  $660  →  $231
```

스트림 하나로는 작은 돈이지만 규모가 커지면 차이가 납니다. 돈보다 더 큰 이득은 바뀐 게 없는데 요약이 계속 새로 쓰이며 생기는 **잡음이 줄어드는 쪽**일 수도 있습니다.

다만 지금의 범용 텍스트 임베딩으로는 JEPA와 같은 결과를 기대하기 어렵습니다.

- JEPA의 예측기는 다음에 올 의미를 맞히도록 학습됐고, 범용 임베딩은 두 문장이 비슷한지를 재도록 학습됐습니다.
- "환불 가능"과 "환불 불가"는 임베딩 공간에서 가까울 수 있지만 사용자에게는 가장 중요한 변화입니다.
- 그래서 "달라졌다"고 볼 임계값을 실제 데이터로 맞추고, 부정이나 숫자 변화처럼 임베딩이 놓치기 쉬운 변화는 규칙으로 따로 잡아야 합니다.

## 비판도 같이 읽어야 한다

JEPA에 대한 반론도 꾸준합니다.

- **장난감 환경 위주라는 지적.** 올해 6월 개정된 [Critique of World Model](https://arxiv.org/html/2507.05169v5)은 JEPA 연구가 주로 장난감 수준의 환경에서 시연됐고, 잠재 공간(임베딩이 놓이는 숫자 공간)에서 반복해 예측하는 것도 결국 자기회귀적이고(LLM이 토큰을 이어 쓰듯 앞의 예측을 받아 다음을 예측하고) 생성적이라고 지적합니다. 예측을 한 점으로만, 곧 답 하나로만 내놓아 불확실성을 표현하지 못한다는 비판도 같은 글에 있습니다.
- **스스로 밝힌 한계.** V-JEPA 2 논문은 카메라 위치에 민감하고, 목표를 이미지로만 줄 수 있고 말로는 줄 수 없다고 적었습니다.
- **학습 불안정.** 올해 3월 나온 [LeWorldModel](https://arxiv.org/abs/2603.19312)은 이전 JEPA들이 표현 붕괴(서로 다른 입력이 같은 임베딩으로 쏠리는 현상)를 막으려고 여러 항의 손실(학습 중 모델이 얼마나 틀렸는지 재는 값)과 보조 장치에 기대 왔다고 정리했습니다.

JEPA 쪽에 힘을 싣는 주장도 있습니다.

- AMI 소속 연구자들이 10월 말에 올린 [프리프린트](https://arxiv.org/abs/2610.39302)는 다음 토큰 예측도 "나쁜 뷰를 쓰는 JEPA"(뷰는 같은 데이터를 일부 가리거나 잘라 보여 준 모습)로 볼 수 있다고 주장합니다. 또 1억 9백만 파라미터짜리 텍스트 JEPA가 720억 파라미터까지의 언어 모델보다 이미지 인코더와 더 잘 정렬된다고, 곧 같은 대상을 두고 만든 임베딩의 짜임이 더 비슷하다고 보고했습니다. 아직 동료 평가 전이라 결론으로 쓰기는 이르지만, 텍스트 쪽에서도 JEPA가 움직이고 있다는 신호로는 읽힙니다.
- 2025년 9월에 나온 [LLM-JEPA](https://arxiv.org/abs/2509.14252)는 LLM 학습에 JEPA식 임베딩 예측 손실을 더해 GSM8K(초등 수학 문장제), Spider(자연어 질문을 SQL로 바꾸기) 같은 과제에서 성능을 올렸습니다. 학습 비용은 두 배쯤 들지만 추론 비용은 늘지 않습니다.

## 그래서 저는

당장 제가 쓰는 스택에서 LLM을 JEPA로 바꿀 일은 없습니다. AMI의 첫 제품은 아직 나오지 않았고, JEPA가 도구를 쓰고 여러 단계를 계획하는 에이전트 일을 할 수 있다는 증거도 아직 없습니다.

대신 두 가지는 지켜볼 생각입니다.

1. JEPA 방식으로 학습한 텍스트 인코더가 지금의 범용 임베딩보다 **나은 라우팅·검색용 임베딩**으로 나올지. 위 프리프린트의 주장이 맞다면 그럴 여지가 있습니다.
2. RoboJEPA처럼 공개된 체크포인트로 물리 세계를 다루는 에이전트가 **얼마나 빨리 쓸 만한 수준**에 오는지.

> **제 해석**
>
> 당장 가져다 쓸 수 있는 습관이 하나 있습니다. 생성 호출을 하나 볼 때마다, 이 호출이 **정말 문장을 만들어야 하는지 아니면 의미 공간에서 판단만 하면 되는지** 묻는 것입니다. 판단만 하면 되는 호출은 임베딩 비교나 작은 분류기로 내리고, 말이 필요한 순간에만 생성 모델을 부릅니다. LeCun이 픽셀 예측을 두고 한 비판을 앱 수준으로 줄이면, 쓸모없는 디테일을 생성하느라 쓰는 시간과 돈을 줄이자는 이야기가 된다고 봅니다.

## 아직 모르는 것

의미 공간에서 판단하는 방식이 어디까지 갈 수 있는지는 모릅니다. 라우팅처럼 단순한 판단은 되겠지만, 여러 조건을 함께 따져야 하는 판단까지 임베딩 비교로 될지는 의문입니다. VL-JEPA 저자들의 단서처럼, 추론과 도구 사용이 필요한 일에서는 아직 토큰을 생성하는 모델 말고 대안이 없습니다. JEPA 쪽이 그 경계를 얼마나 밀어낼지는 AMI의 첫 제품에서 어느 정도 드러날 것 같습니다.

## 출처

- Engadget, [Meta's Chief AI Scientist is leaving the company after 12 years](https://www.engadget.com/ai/metas-chief-ai-scientist-is-leaving-the-company-after-12-years-224325268.html), 2025-11-19
- AMI Labs, [Official launch](https://amilabs.xyz/updates), 2026-03-10
- AI News, [The billion-dollar startup with a different idea for AI](https://www.artificialintelligence-news.com/news/the-billion-dollar-startup-with-a-different-idea-for-ai-ami-labs-yann-lecun/), 2026-04-23
- Meta, [V-JEPA: The next step toward Yann LeCun's vision of advanced machine intelligence (AMI)](https://ai.meta.com/blog/v-jepa-yann-lecun-ai-model-video-joint-embedding-predictive-architecture/), 2024-02-15
- OpenReview, [A Path Towards Autonomous Machine Intelligence](https://openreview.net/forum?id=BZ5a1r-kVsf)
- arXiv, [Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture](https://arxiv.org/abs/2301.08243), 2023-01-19
- arXiv, [V-JEPA 2: Self-Supervised Video Models Enable Understanding, Prediction and Planning](https://arxiv.org/abs/2506.09985), 2025-06-11
- arXiv, [VL-JEPA: Joint Embedding Predictive Architecture for Vision-language](https://arxiv.org/abs/2512.10942), 2025-12-11
- arXiv, [RoboJEPA: Scaling Robotic Latent World Models](https://arxiv.org/abs/2610.10515), 2026-10-07
- arXiv, [VL-JEPA: Joint Embedding Predictive Architecture for Vision-language (v2)](https://arxiv.org/html/2512.10942v2), 2026-02-02
- OpenAI, [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna)
- arXiv, [Critique of World Model](https://arxiv.org/html/2507.05169v5), 2026-06-17
- arXiv, [LeWorldModel: Stable End-to-End Joint-Embedding Predictive Architecture from Pixels](https://arxiv.org/abs/2603.19312), 2026-03-13
- arXiv, [Proving and Improving the Platonic Representation Hypothesis with JEPAs](https://arxiv.org/abs/2610.39302), 2026-10-29
- arXiv, [LLM-JEPA: Large Language Models Meet Joint Embedding Predictive Architectures](https://arxiv.org/abs/2509.14252), 2025-09-11
