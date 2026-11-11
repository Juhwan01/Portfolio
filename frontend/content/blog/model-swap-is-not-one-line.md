---
title: 모델 ID 한 줄 바꾸기의 실제 비용
excerpt: 9월 22일 하루에 GPT-6 Luna와 Claude Opus 5.5가 함께 나왔고, 둘 다 값이 내려갔습니다. 그런데 마이그레이션 문서를 끝까지 읽으면 가격 말고도 캐시가 맞는 자리, 추론 기본값, 도구 호출 규칙, 대화 기록을 다루는 방식이 같이 바뀌었습니다. 모델 교체를 한 줄 변경으로 보면 놓치는 것들을 계산과 함께 정리했습니다.
tags:
- LLM
- Prompt Caching
- Model Migration
category: insight
read_time: 9
published_at: '2026-10-08T12:10:00Z'
---

> **한눈에 보기**
> - 토큰 단가가 절반이 됐다고 **작업 비용이 절반이 되지는 않습니다.** 사고 토큰을 포함한 출력량과 추론 강도가 실제 비용을 정합니다.
> - GPT-5.6부터 OpenAI 캐시는 **쓰기에 1.25배 값**이 붙고, **메시지 경계에서만** 맞춰 봅니다. 프롬프트 배치를 다시 봐야 합니다.
> - Opus 5.5에서는 생각 끄기, 도구 강제, 대화 앞부분 고쳐 쓰기가 **400 에러**가 됩니다.
> - 이전 모델을 위해 넣어 둔 반복 지시와 우회책은 **지울 후보**입니다.

9월 22일, OpenAI는 GPT-6 Sol과 GPT-6 Luna를, Anthropic은 Claude Opus 5.5를 같은 날 [내놨습니다](https://techcrunch.com/2026/09/22/anthropic-releases-opus-5.5-with-lower-prices-and-fable-level-performance/). 가격표만 보면 반가운 날이었습니다.

| 모델 (100만 토큰당) | 입력 | 출력 |
|---|---|---|
| [GPT-5.6 Luna → GPT-6 Luna](https://kingy.ai/blog/gpt-6-sol-luna-specs-benchmarks-pricing-comparison/) | $0.20 → $0.10 | $1.20 → $0.50 |
| [Opus 5 → Opus 5.5](https://platform.claude.com/docs/en/models/opus-5-5/whats-new-opus-5-5) | $5 → $4 | $25 → $20 |

이런 날은 모델 ID 한 줄을 바꾸고 청구서가 반으로 줄기를 기대하게 됩니다. 그런데 두 회사의 마이그레이션 문서를 끝까지 읽어 보니 바뀐 건 가격만이 아니었습니다. 그 문서들에서 "한 줄 교체"를 깨뜨리는 대목을 골라, 기존 구조에 대입하면 어디서 비용과 시간이 새는지 따져 봤습니다.

## 토큰 단가가 절반이면 작업 단가도 절반일까

입력 3,000토큰, 출력 500토큰짜리 호출 하나로 계산해 보겠습니다. 캐시는 일단 뺐습니다.

```
GPT-5.6 Luna:  3,000 × $0.20/1M + 500 × $1.20/1M = $0.00060 + $0.00060 = $0.00120
GPT-6 Luna:    3,000 × $0.10/1M + 500 × $0.50/1M = $0.00030 + $0.00025 = $0.00055
```

같은 토큰을 쓰면 54% 쌉니다. 문제는 새 모델이 같은 일에 **같은 토큰을 쓴다는 보장이 없다**는 데 있습니다. 추론 모델의 출력에는 보이지 않는 사고 토큰이 섞여 있고, 그 양은 모델마다 다릅니다. GPT-6 Luna의 출력이 얼마까지 늘어야 이전 모델과 비용이 같아지는지 풀어 보면 이렇습니다.

```
$0.00030 + 출력 × $0.50/1M = $0.00120   →   출력 = 1,800토큰
```

출력이 3.6배로 늘어도 손해는 아닙니다. 비용만 보면 여유가 꽤 있습니다.

> **제 해석**
>
> 비용 여유가 크다는 게 오히려 함정입니다. 출력 토큰은 **응답 시간도 같이 정합니다.** 출력이 1.5배가 되면 비용은 여전히 크게 줄지만, 초당 생성 속도가 같다면 생성 시간은 1.5배가 됩니다. "싸졌는데 느려졌다"는 결과는 이렇게 나옵니다. 그래서 새 모델을 평가할 때는 같은 과제 묶음을 돌려 **출력 토큰 수부터** 세야 합니다.

어떤 추론 강도로 쓰느냐도 같이 봐야 합니다.

- **OpenAI:** 출시 때 공개한 차트를 정리한 [표](https://kingy.ai/blog/gpt-6-sol-luna-specs-benchmarks-pricing-comparison/)를 보면, GPT-6 Luna의 코딩 에이전트 벤치마크 DeepSWE 점수는 low에서 2.4%, max에서 66.6%입니다. low로 돌리면 에이전트 일은 거의 못 하고, 쓸 만한 점수를 내려면 강도를 올려야 하는데 그만큼 사고 토큰이 늘어납니다. 회사가 직접 낸 숫자라 자기 과제로 다시 재 봐야 합니다.
- **Anthropic:** Opus 5.5는 effort를 적지 않으면 [medium으로 돕니다](https://platform.claude.com/docs/en/models/opus-5-5/whats-new-opus-5-5). Opus 5에서는 high였습니다. 그런데 같은 effort라도 Opus 5.5가 한 턴에 더 많이 생각하는 경향이 있다고 같은 문서에 적혀 있습니다. 기본값은 내려갔는데 같은 값에서의 생각은 늘었으니, 둘이 어떻게 상쇄될지는 재 보기 전에는 알 수 없습니다. 문서가 "Re-run your effort sweep rather than carrying a setting over"라고 쓴 이유입니다.

## 캐시가 맞는 자리가 바뀌었다

제가 가장 오래 들여다본 건 OpenAI의 [프롬프트 캐시 문서](https://developers.openai.com/api/docs/guides/prompt-caching)였습니다. GPT-5.6부터 두 가지가 바뀌었습니다. 위 예시처럼 GPT-5.6 Luna에서 옮겨 가는 경우에는 해당하지 않지만, **GPT-5.5 이하에서 넘어오는 구조라면 바로 걸립니다.**

| | GPT-5.5 이하 | GPT-5.6 이후 |
|---|---|---|
| 캐시 쓰기 | 추가 비용 없음 | 입력 단가의 1.25배 (30분 보관) · 2.5배 (12시간 보관). 읽기는 0.1배 |
| 맞춰 보는 자리 | 일정한 토큰 간격 (GPT-5.5는 2,048토큰) | 메시지 끝 같은 정해진 경계 |
| 메시지 중간에서 끝나는 접두부 | 간격 단위로 떨어지는 만큼 적중 | 명시적 경계가 없으면 재사용 안 됨 |

### 1. 캐시 쓰기에 값이 붙었습니다

따로 켜는 명시적 캐시뿐 아니라 자동 캐시에도 해당합니다. 캐시된 접두부 토큰 중 새로 쓰는 비율을 w라고 하면, 캐시가 이득인 조건은 이렇게 됩니다.

```
1.25w + 0.1(1 − w) < 1   →   w < 약 78%
```

- 같은 접두부가 다섯 번 쓰이면 쓰기 한 번에 읽기 네 번이라 w는 20%입니다. 넉넉하게 이득입니다.
- 손해가 나려면 새로 쓴 토큰이 평균 0.28번도 다시 읽히지 않아야 합니다. 접두부가 매번 조금씩 달라져서 한 번 쓰고 다시 읽히지 않는 경우가 대부분인 구조가 여기에 해당합니다.
- 12시간 보관(2.5배)을 고르면 기준은 w < 37.5%로 훨씬 빡빡해집니다.

### 2. 캐시를 맞춰 보는 자리가 바뀌었습니다

자동 모드에서는 가장 최근의 "eligible message" 끝에 경계를 하나 둡니다. 사용자 메시지나 연달아 온 도구 응답의 마지막 같은 자리입니다. 여기에 명시적으로 찍은 경계와 그보다 앞선 메시지 끝 몇 곳을 더해 긴 것부터 확인합니다.

> **제 해석**
>
> 한 메시지 안에 고정된 지시문과 매번 바뀌는 내용(검색 결과, 오늘 날짜, 사용자 상태)을 이어 붙여 둔 프롬프트는, 이전 모델에서는 고정된 앞부분 중 간격 단위로 떨어지는 만큼은 캐시가 맞았습니다. 새 모델에서는 그 지점이 메시지 경계가 아니라서 **통째로 놓칠 수 있습니다.** 바뀌는 내용을 별도 메시지로 떼어 고정된 부분이 메시지 경계에서 끝나게 하거나, 그 자리에 명시적 경계를 찍어야 합니다. 모델을 바꾸는데 프롬프트 배치까지 손봐야 하는 셈입니다.

Anthropic도 [비슷한 경고](https://claude.com/blog/harnessing-claudes-intelligence)를 합니다. "Caches are model-specific; switching breaks them." 모델을 바꾼 직후에는 캐시가 비어 있어서, 그때 잰 비용과 지연은 실제보다 나쁘게 나옵니다. 두 모델을 비교한다면 **캐시가 다시 찬 뒤의 값**으로 봐야 합니다.

## 어제까지 되던 요청이 400을 받는 지점

비용과 속도는 나빠져도 일단 돌아갑니다. 더 곤란한 건 되던 요청이 거절되기 시작하는 경우입니다.

| 모델 | 바뀐 규칙 | 이렇게 쓰던 코드가 깨집니다 | 문서가 권하는 대안 |
|---|---|---|---|
| GPT-6 Luna | Chat Completions에서 도구 호출은 추론 강도 none일 때만 | Chat Completions로 도구를 부르며 추론도 켬 | Responses API로 이전 |
| Opus 5.5 | 생각을 끌 수 없음 | thinking을 disabled로 보냄 | effort로 생각의 양을 조절 |
| Opus 5.5 | 도구 강제(tool_choice any·tool) 불가 | 도구 호출을 강제해 JSON 형식을 받음 | strict tool use, structured outputs |
| Opus 5.5 | 사고 블록이 대화 앞부분에 묶임 | 시스템 프롬프트를 턴마다 고쳐 쓰거나, 앞 턴을 요약해 덮어씀 | 대화 중간 시스템 메시지, 공식 compaction |

몇 가지 덧붙이면 이렇습니다.

- **GPT-6 Luna:** [모델 페이지](https://developers.openai.com/api/docs/models/gpt-6-luna) 문구는 "Chat Completions supports function calling only with reasoning_effort set to none"입니다. 이 모델은 강도를 낮추면 에이전트 성능이 크게 떨어지니, 사실상 API를 옮기라는 이야기입니다.
- **Opus 5.5 사고 블록:** 앞부분이 바뀐 뒤 그 블록을 다시 보내면 8월 31일 이후 만든 계정에서는 400을 받습니다. 그 전에 만든 계정은 기본으로는 에러가 나지 않고, 베타 헤더로 문제가 되는 블록만 버리게 하는 방법도 있습니다. 문서의 권고는 "Keep the conversation append-only"입니다.
- **에러 없이 바뀌는 것도 있습니다.** Opus 5.5에서는 도구 호출 사이에 모델이 남기던 짧은 진행 메모가 text 블록이 아니라 thinking 블록으로 오고, 기본 설정에서는 내용이 비어 있습니다. 그 메모를 진행 상황으로 보여 주던 앱은 에러 하나 없이 조용해집니다.

> **제 해석**
>
> 사고 블록 규칙은 에러를 피해 가는 우회로가 있지만, **앞부분을 고쳐 쓰는 컨텍스트 관리 방식 자체를 다시 보라**는 신호로 읽힙니다.

## 반대로, 걷어낼 수 있는 것

마이그레이션 문서에는 지우라는 이야기도 있습니다.

- OpenAI의 [GPT-5.6 가이드](https://developers.openai.com/api/docs/guides/latest-model/gpt-5.6.md): "Removing repeated instructions and examples and simplifying tool descriptions can improve task performance and token efficiency." 지시는 한 번만 하고, 도구는 그 작업에 필요한 것만 보여 주라고 권합니다.
- Anthropic: Opus 5.5가 차트와 스크린샷을 훨씬 정확히 읽게 됐으니, 이전 모델을 위해 넣어 둔 시각 입력 우회책이 필요 없을 수 있다고 적었습니다.

이전 모델의 약점을 메우려고 넣어 둔 반복 지시, 예시, 우회 로직은 새 모델에서는 비용이고 때로는 성능을 깎습니다. 모델 교체 작업에는 **깨진 것을 고치는 일과 필요 없어진 것을 지우는 일**이 함께 있습니다. 지울 후보는 에러로 드러나지 않으니, 각 지시와 우회책이 원래 어떤 실패를 막으려고 들어갔는지 기록이 남아 있어야 찾을 수 있습니다.

## 교체할 때 재야 할 것

1. **작업 하나를 끝내는 비용.** 같은 과제 묶음을 돌려 사고 토큰까지 포함한 출력 토큰을 셉니다.
2. **p50과 p90 응답 시간.** 평균만 보면 길어진 꼬리가 묻힙니다.
3. **캐시 적중률과 쓰기 비율.** 캐시가 다시 찬 뒤에 잽니다. GPT-5.6 이후라면 쓰기 비율도 봅니다.
4. **추론 강도.** 기존 값을 기준으로 한 단계 낮은 값까지 같이 잽니다. OpenAI 가이드가 권하는 방법이고, Anthropic도 설정을 그대로 옮기지 말라고 합니다.
5. **거절될 요청 형태.** 추론과 도구를 같이 쓰는지, 도구를 강제하는지, 대화 앞부분을 고쳐 쓰는지 확인합니다.
6. **지울 수 있는 지시와 예시.** 지우고 나서 다시 잽니다.

## 아직 정하지 못한 것

새 모델은 두 달에 한 번꼴로 나오는데(Opus 5에서 Opus 5.5까지도 두 달이었습니다), 이 측정을 매번 처음부터 하기는 어렵습니다. 결국 같은 과제 묶음과 측정 스크립트를 코드처럼 관리하고, 모델 ID와 추론 강도만 바꿔 돌릴 수 있게 만들어 두는 수밖에 없다고 생각합니다. 다만 그 묶음이 어떤 작업을 얼마나 담아야 대표성이 생기는지, 몇 개면 충분한지에 대한 기준은 아직 찾지 못했습니다.

## 출처

- TechCrunch, [Anthropic releases Opus 5.5 with lower prices and Fable-level performance](https://techcrunch.com/2026/09/22/anthropic-releases-opus-5.5-with-lower-prices-and-fable-level-performance/), 2026-09-22
- Kingy AI, [GPT-6 Sol vs Luna: Specs, Pricing & Benchmarks](https://kingy.ai/blog/gpt-6-sol-luna-specs-benchmarks-pricing-comparison/), 2026-09-22
- Anthropic, [What's new in Claude Opus 5.5](https://platform.claude.com/docs/en/models/opus-5-5/whats-new-opus-5-5)
- OpenAI, [Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching)
- Anthropic, [Agent Harness Design: 3 Patterns for Harnessing Claude's Intelligence](https://claude.com/blog/harnessing-claudes-intelligence), 2026-04-02
- OpenAI, [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna)
- OpenAI, [Using GPT-5.6](https://developers.openai.com/api/docs/guides/latest-model/gpt-5.6.md)
