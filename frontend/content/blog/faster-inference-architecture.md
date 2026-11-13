---
title: 추론이 2.5배 빨라지면 구조의 어디가 바뀌나
excerpt: 올해 주요 API마다 돈을 더 내면 더 빨리 뽑아 주는 등급이 생겼습니다. 그런데 빨라지는 건 대부분 토큰을 뽑는 속도이고, 첫 토큰이 나오기까지의 시간이나 호출 사이의 대기는 그대로입니다. 응답 시간을 쪼개 계산해 보고, 아낀 시간을 사용자에게 돌려줄지 검증 단계에 다시 쓸지 따져 봅니다.
tags:
- Inference
- Latency
- LLM Architecture
category: insight
read_time: 7
published_at: '2026-10-24T09:30:00Z'
---

> **한눈에 보기**
> - 유료 고속 등급(가격은 표준의 2배, 속도는 최대 2.5배)이 줄여 주는 건 주로 **토큰을 생성하는 시간**입니다. 첫 토큰 대기와 도구 실행 시간은 그대로입니다.
> - 그래서 설명용 숫자로 응답 시간을 계산하면 긴 답 하나를 쓰는 구조는 **−54%**, 짧은 호출 네 개를 잇는 구조는 **−32%에 그칩니다**.
> - 아낀 시간은 사용자에게 돌려줄 수도 있고, **"쓰고 확인하기" 같은 검증 단계**에 다시 쓸 수도 있습니다.
> - 사람이 기다리지 않는 경로는 반대로 Batch로 보내 **단가를 절반**으로 낮춥니다.

올해 속도가 돈 주고 사는 옵션이 됐습니다.

| 등급 · 모델 | 무엇이 빨라지나 | 가격 |
|---|---|---|
| OpenAI [Fast mode](https://developers.openai.com/api/docs/guides/fast-mode) (7월 30일 Priority processing에서 이름 변경) | 최대 2.5배 | 표준의 2배 |
| OpenAI Ultrafast (8월 [미리 공개](https://the-decoder.com/gpt-5-6-sol-goes-14x-faster-as-openai-launches-ultrafast-mode-powered-by-cerebras/), Cerebras 칩) | GPT-5.6 Sol을 초당 최대 750토큰 | [가격표](https://developers.openai.com/api/docs/pricing) 기준 GPT-6.1 Sol 표준의 6배 |
| Anthropic [fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode) (Opus 5.5) | 초당 출력 토큰 최대 2.5배 | [가격표](https://platform.claude.com/docs/en/about-claude/pricing) 기준 표준의 2배 |
| Inception [Mercury 3](https://www.inceptionlabs.ai/models) (10월 [출시](https://thenextweb.com/news/inception-mercury-3-diffusion-llm), 확산 방식 모델) | 초당 1,068토큰 (회사 발표, 독립 측정 없음) | 별도 유료 등급 없음 (모델 자체가 빠름) |

이렇게 되면 묻는 방식도 달라져야 합니다. 더 빠른 모델을 기다리기보다, 지금 구조에서 **어느 구간이 두 배 가격을 낼 만한지**를 먼저 따져야 합니다. 아래는 그 계산입니다.

## 빨라지는 건 어느 부분인가

Anthropic 문서는 fast mode의 이득이 초당 출력 토큰 수(OTPS)에 몰려 있고, 첫 토큰이 나오기까지의 시간(TTFT)에는 해당하지 않는다고 적어 두었습니다. OpenAI 문서는 "up to 2.5× faster speeds and more consistent latency"라고만 쓰고 어느 부분이 빨라지는지는 밝히지 않았습니다.

LLM을 쓰는 요청 하나의 응답 시간은 대략 이렇게 나뉩니다.

```
응답 시간 ≈ 첫 토큰까지 시간 + (출력 토큰 수 ÷ 초당 출력 토큰) + 모델 밖에서 쓰는 시간
```

모델 밖에서 쓰는 시간은 검색, DB 조회, 도구 실행, 네트워크 왕복입니다. Anthropic 문서대로라면 fast 등급이 줄여 주는 건 **가운데 항뿐**입니다. 그래서 같은 2.5배라도 구조에 따라 체감이 크게 다릅니다.

설명을 위해 숫자를 정해 두 구조를 비교해 보겠습니다. 2.5배는 문서가 밝힌 최대치라서 아래 결과도 가장 좋은 경우입니다.

| | 구조 A | 구조 B |
|---|---|---|
| 모양 | 긴 답을 한 번에 쓰는 호출 1개 | 짧게 답하는 호출 4개를 차례로 (분류 → 조회 조건 → 답 → 형식 검사) |
| 가정 | 첫 토큰 1.5초 · 출력 800토큰 | 호출마다 첫 토큰 1.2초 · 출력 100토큰, 도구 실행 합계 1초 |
| 표준 (초당 60토큰) | 1.5 + 800/60 = **14.8초** | 4 × (1.2 + 100/60) + 1.0 = **12.5초** |
| 2.5배 (초당 150토큰) | 1.5 + 800/150 = **6.8초 (−54%)** | 4 × (1.2 + 100/150) + 1.0 = **8.5초 (−32%)** |

B는 두 배 가격을 내도 응답 시간이 3분의 1밖에 줄지 않습니다. 12.5초 중 첫 토큰 대기 4.8초와 도구 시간 1초는 그대로 남기 때문입니다.

> **제 해석**
>
> B 같은 구조라면 같은 돈으로 속도를 사기보다 **호출 하나를 없애는 편**이 낫습니다. 호출 하나가 사라지면 표준 속도 기준 2.87초(1.2 + 100/60)가 통째로 빠집니다. 서로 기다릴 필요가 없는 호출을 병렬로 돌리는 것도 방법입니다.

추론 모델이라면 계산이 하나 더 붙습니다. 사고 토큰도 출력 토큰이라, 생각을 길게 하는 호출일수록 응답 시간에서 초당 출력 토큰 수가 좌우하는 몫이 커집니다. Artificial Analysis의 [측정](https://artificialanalysis.ai/models/comparisons/gpt-6-luna-low-vs-gpt-6-luna)에서 GPT-6 Luna가 생각을 마치고 답의 첫 토큰을 내기까지 걸린 시간은 추론 강도 low에서 몇 초인데, max에서는 1분을 넘깁니다. 이런 호출에서는 "첫 토큰까지"의 대부분이 사실상 생각을 생성하는 시간입니다.

## 아낀 시간을 어디에 쓸까

속도를 샀다면 아낀 시간을 쓸 곳은 크게 둘입니다.

1. **사용자에게 돌려줍니다.** 채팅처럼 사람이 화면 앞에서 기다리는 경로라면 14.8초와 6.8초의 차이는 바로 체감됩니다.
2. **같은 시간 예산 안에서 단계를 늘립니다.** 제가 더 흥미롭게 보는 쪽입니다.

응답 예산이 15초라고 해 보겠습니다. 초당 60토큰이면 800토큰짜리 답 하나를 쓰는 데 예산을 다 씁니다. 검토 단계를 넣을 자리가 없습니다. 같은 모델이 Ultrafast의 최대치인 초당 750토큰으로 돈다면 계산이 바뀝니다.

```
초안 800토큰:  1.5 + 800/750 = 2.57초
검토 200토큰:  1.0 + 200/750 = 1.27초
수정 800토큰:  1.5 + 800/750 = 2.57초
합계                         = 6.4초
```

초안을 쓰고, 다른 호출로 검토하고, 고쳐 쓰는 세 단계가 예전 답 하나 쓰는 시간의 절반 안에 들어갑니다. 예전에는 "한 번에 잘 쓰기"밖에 선택지가 없던 경로에 "**쓰고 확인하기**"가 들어올 수 있게 됩니다.

> **제 해석**
>
> 스트리밍은 생성이 느려서 생긴 장치이기도 합니다. 다 만들어질 때까지 기다리게 할 수 없으니 만들어지는 대로 보여 주고, 그 대가로 **검사하기 전의 글이 사용자에게 먼저 나갑니다.** 전체 답이 1~2초 안에 나온다면, 일부 경로에서는 다 만든 뒤 형식, 숫자, 정책을 검사하고 나서 보여 주는 방식이 현실적인 선택지가 됩니다. 저는 이게 속도 향상이 구조에 주는 가장 큰 변화라고 봅니다.

## 아무도 기다리지 않는 경로는 반대로 간다

같은 서비스 안에서도 사람이 기다리지 않는 경로가 있습니다. 이런 경로는 속도를 살 이유가 없습니다.

| 경로 | 예 | 맞는 등급 | 표준 대비 단가 |
|---|---|---|---|
| 사람이 기다림 | 채팅, 검색 답변 | 표준, 필요하면 fast | 1배 ~ 2배 |
| 아무도 안 기다림 | 밤사이 요약, 월간 리포트, 쌓인 데이터 분류 | Batch (OpenAI는 Flex도 같은 단가) | 0.5배 |

[OpenAI](https://developers.openai.com/api/docs/pricing)와 [Anthropic](https://platform.claude.com/docs/en/build-with-claude/batch-processing) 모두 Batch로 보내면 50%를 깎아 줍니다. Anthropic은 fast mode를 Batch와 같이 쓸 수 없다고 문서에 적어 두었습니다.

같은 모델을 쓰더라도 사용자 앞 경로는 표준의 두 배 단가로, 뒤에서 도는 경로는 절반 단가로 돌릴 수 있습니다. **네 배 차이**입니다. 그러니 구조도를 그릴 때 각 경로에 "사람이 이 결과를 기다리는가"를 표시해 두는 것이 비용 설계의 출발점이 됩니다.

## 계산에 넣어야 할 함정

- **Anthropic은 속도별로 캐시가 따로입니다.** 문서 표현으로는 "Requests at different speeds do not share cached prefixes."입니다. fast 등급 용량이 차서 429 오류를 받고 표준으로 내려가면, 그 요청은 캐시 적중 없이 접두부 전체 값을 다시 냅니다. 시스템 프롬프트와 도구 정의가 수만 토큰인 에이전트라면 대체 경로가 생각보다 비쌉니다.
- **OpenAI는 한도를 같이 쓰고, 늘리는 속도에 제한이 있습니다.** Fast mode와 표준이 요청 한도를 함께 쓰고 캐시 할인도 그대로 받습니다. 대신 사용량을 얼마나 빨리 늘릴지에 대한 권고가 있습니다. 분당 입력이 100만 토큰을 넘는 트래픽이라면, Fast mode 사용량을 15분마다 50%보다 많이 늘리지 말라는 내용입니다. 출시 첫날 전체 트래픽을 한 번에 옮기는 계획은 이 조건에 걸립니다.
- **발표된 속도는 자기 트래픽으로 다시 재야 합니다.** 확산 모델 쪽은 특히 그렇습니다. Google은 DiffusionGemma를 공개하면서 품질이 Gemma 4보다 낮고, 대량 서비스에서는 이득이 줄고 오히려 비용이 늘 수 있다고 직접 [적었습니다](https://blog.google/innovation-and-ai/technology/developers-tools/diffusion-gemma-faster-text-generation/). 벤치마크의 초당 토큰 수는 배치 크기, 문맥 길이, 동시 요청 수에 따라 크게 달라집니다.

## 아직 모르는 것

- **14.8초를 6.8초로 줄이는 게 두 배 값어치가 있는가.** 응답 시간과 만족도, 재방문 사이의 관계는 서비스마다 다르고, 직접 A/B로 재 보기 전에는 감으로 말할 수밖에 없습니다.
- **빨라진 시간을 검증에 다시 쓰면 품질이 정말 오르는가.** 검토 호출이 잡아낼 수 있는 종류의 오류라면 효과가 있겠지만, 검토하는 모델도 같은 착각을 한다면 시간만 씁니다. 어떤 오류가 검사로 잡히고 어떤 오류는 안 잡히는지부터 나눠 봐야 답할 수 있을 것 같습니다.

## 출처

- OpenAI, [Fast mode](https://developers.openai.com/api/docs/guides/fast-mode)
- The Decoder, [GPT-5.6 Sol goes 14x faster as OpenAI launches Ultrafast mode powered by Cerebras](https://the-decoder.com/gpt-5-6-sol-goes-14x-faster-as-openai-launches-ultrafast-mode-powered-by-cerebras/), 2026-08-14
- OpenAI, [Pricing](https://developers.openai.com/api/docs/pricing)
- Anthropic, [Fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode)
- Anthropic, [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- Inception, [Our Models](https://www.inceptionlabs.ai/models)
- The Next Web, [Inception says its Mercury 3 model beats GPT-6 Luna and runs far faster](https://thenextweb.com/news/inception-mercury-3-diffusion-llm), 2026-10-20
- Artificial Analysis, [GPT-6 Luna (Low) vs. GPT-6 Luna (Max)](https://artificialanalysis.ai/models/comparisons/gpt-6-luna-low-vs-gpt-6-luna)
- Anthropic, [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
- Google, [DiffusionGemma: 4x faster text generation](https://blog.google/innovation-and-ai/technology/developers-tools/diffusion-gemma-faster-text-generation/), 2026-06-10
