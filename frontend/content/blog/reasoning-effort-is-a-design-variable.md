---
title: '추론 강도를 어디에 쓸까: 올리면 좋아진다는 가정이 깨지는 곳'
excerpt: 이제 거의 모든 모델 API에 추론 강도 파라미터가 있습니다. 올릴수록 똑똑해질 것 같지만, 에이전트 벤치마크에서는 최고 강도의 점수가 한 단계 아래보다 낮게 나오기도 합니다. 강도를 호출의 역할마다 따로 정하는 설계 변수로 보고, 높은 강도 한 번과 낮은 강도에 검사를 붙이는 방식을 비교해 봅니다.
tags:
- Reasoning Models
- LLM Architecture
- Cost
category: insight
read_time: 6
published_at: '2026-10-31T13:20:00Z'
---

> **한눈에 보기**
> - 추론 강도를 올린다고 늘 좋아지지는 않습니다. LangChain의 Terminal Bench 2.0 실험에서는 **xhigh(53.9%)가 high(63.6%)보다 낮았고**, 이유는 시간 제한이었습니다.
> - 에이전트에게 강도는 **단계 하나의 질과 밟을 수 있는 단계 수를 맞바꾸는 값**입니다.
> - 그래서 강도는 호출의 역할마다 따로 정하고, **검사로 잡히는 실패에는 강도 대신 검사를 붙이는 편**이 쌉니다. 토큰 수를 가정한 아래 예시에서는 비용이 높은 강도 한 번의 56%, 시간은 29% 수준이었습니다.

## 높을수록 좋은 다이얼처럼 보이지만

추론 강도는 이제 거의 모든 API의 기본 파라미터입니다.

- **OpenAI:** [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna)는 none부터 max까지 여섯 단계가 있고 기본값은 medium입니다.
- **Anthropic:** [Opus 5.5](https://platform.claude.com/docs/en/models/opus-5-5/whats-new-opus-5-5)와 Fable 5.1은 생각을 아예 끌 수 없어서, effort(Anthropic API의 추론 강도 파라미터)가 생각의 양을 조절하는 유일한 손잡이입니다.

손잡이가 하나뿐이고 눈금이 매겨져 있으면 높을수록 좋은 다이얼처럼 보입니다. 실제 숫자는 그렇지 않았습니다.

| 출처 | 낮은 쪽 | 한 단계 위 | 왜 |
|---|---|---|---|
| LangChain [하네스 개선 기록](https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering) (2월, Terminal Bench 2.0) | high 63.6% | xhigh 53.9% | 단계마다 오래 생각하다 시간 제한에 걸림 |
| OpenAI GPT-6 Luna 출시 차트 ([정리된 표](https://kingy.ai/blog/gpt-6-sol-luna-specs-benchmarks-pricing-comparison/), AutomationBench) | high 14.5% | xhigh 12.6% | 설명 없음 |

## 강도는 단계의 질과 단계의 수를 맞바꾼다

Artificial Analysis가 10월 27일 새로 낸 [지수(v5)](https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v5)로 매긴 [비교](https://artificialanalysis.ai/models/comparisons/gpt-6-luna-low-vs-gpt-6-luna)를 보면, 같은 GPT-6 Luna라도 강도에 따라 다른 모델처럼 움직입니다.

| GPT-6 Luna | low | max | 차이 |
|---|---|---|---|
| 종합 지수 | 10 | 28 | 약 3배 |
| Terminal-Bench 4.0 | 0.0% | 12.6% | |
| 첫 토큰까지 | 2.54초 | 71.56초 | 약 28배 |
| 지수 전체 실행 비용 | $9 | $136 | 약 15배 |

표의 값은 10월 말에 본 측정값입니다. 비교 페이지는 측정을 계속 갱신하기 때문에 지금 열어 보면 숫자가 조금 다를 수 있습니다.

단발 질문이라면 이 표를 보고 예산에 맞는 칸을 고르면 됩니다. 에이전트라면 사정이 다릅니다. 에이전트는 정해진 시간이나 토큰 예산 안에서 여러 단계를 밟습니다. 강도를 올리면 단계 하나하나의 판단은 좋아지지만, **같은 예산으로 밟을 수 있는 단계 수가 줄어듭니다.** LangChain의 xhigh가 진 이유가 이것입니다.

> **제 해석**
>
> 그래서 저는 추론 강도를 **예산 배분의 문제**로 봅니다. 어떤 강도가 최선인지는 과제만으로 정해지지 않고, 그 과제에 주어진 시간과 토큰 예산까지 같이 봐야 정해집니다. 예산이 넉넉한 밤사이 배치 작업과 사용자가 기다리는 채팅에서는 같은 과제라도 맞는 강도가 다를 수 있습니다.

## 호출마다 맞는 강도가 다르다

LangChain이 결국 쓴 것도 계획과 검증에는 xhigh, 그 사이 구현에는 high를 주는 "**reasoning sandwich**"였습니다. Terminal Bench 2.0 최종 점수 66.5%는 이 배분과 다른 하네스 개선을 모두 합친 결과이고, 강도 배분을 이리저리 바꿔 본 시험들 사이에 큰 차이는 없었다고도 적었습니다. 샌드위치가 정답이라기보다, 한 에이전트 안에서도 단계마다 강도를 달리 줄 수 있다는 예로 보는 편이 맞겠습니다.

이걸 일반적인 LLM 앱 구조로 옮기면 호출을 역할별로 나눠 볼 수 있습니다.

| 호출 역할 | 시작할 강도 | 이유 |
|---|---|---|
| 요청 분류, 경로 선택 | none 또는 low | 출력이 짧고 뒤의 모든 단계가 이 결과를 기다림. 판단 근거도 대개 입력에 드러나 있음 |
| 사용자에게 보일 답 | 기본값 근처 | OpenAI GPT-5.6 가이드는 지금 강도와 [한 단계 낮은 강도를 같이 시험](https://developers.openai.com/api/docs/guides/latest-model/gpt-5.6.md)하라고 권함 |
| 계획, 결과 검증 | 높게 | 계획이 틀리면 뒤 단계가 전부 헛돌고, 검증이 놓치면 오류가 그대로 나감 |

Opus 5.5는 메시지마다 effort를 바꾸는 기능도 [베타로 지원합니다](https://platform.claude.com/docs/en/models/opus-5-5/whats-new-opus-5-5). 한 대화 안에서도 단계에 따라 강도를 바꾸는 쓰임을 염두에 둔 것으로 읽힙니다.

## 높은 강도 한 번, 낮은 강도에 검사 한 번

지난주 [속도에 관한 글](/blog/faster-inference-architecture)에서 빨라진 시간을 "쓰고 확인하기"에 다시 쓰는 이야기를 했는데, 추론 강도에서도 같은 선택이 나옵니다. 같은 과제를 두 가지로 푸는 경우를 계산해 보겠습니다. GPT-6 Luna 단가(입력 $0.10, 출력 $0.50, 100만 토큰당)를 쓰고 생성 속도는 초당 100토큰으로 가정했고, 토큰 수는 설명을 위해 정한 값입니다.

```
A. 높은 강도로 한 번
   입력 3,000 · 출력 4,500(사고 4,000 + 답 500)
   시간 4,500/100 = 45초
   비용 3,000 × 0.10/1M + 4,500 × 0.50/1M = $0.00255

B. 낮은 강도로 쓰고, 다른 호출로 검사
   생성: 입력 3,000 · 출력 800(사고 300 + 답 500)  → 8초,  $0.00070
   검사: 입력 3,500 · 출력 300                     → 3초,  $0.00050
   답의 20%가 검사에 걸려 생성과 검사를 한 번 더 돈다고 하면
   기대 시간 11 + 0.2 × 11 = 13.2초
   기대 비용 $0.00120 + 0.2 × $0.00120 = $0.00144
```

B는 **비용이 A의 56%, 시간은 29% 수준**입니다. 숫자만 보면 B가 이깁니다. 하지만 이 비교에는 조건이 하나 숨어 있습니다. B의 품질은 **검사가 그 오류를 잡을 수 있느냐**에 달려 있습니다.

| | 검사로 잡히는 오류 | 검사로 잡기 어려운 오류 |
|---|---|---|
| 예 | 스키마에 안 맞는 형식, 근거 데이터와 다른 숫자, 테스트 실패, 빠진 항목 | 추론 중간의 미묘한 논리 실수, 엉뚱한 방향의 계획, 그럴듯하지만 틀린 해석 |
| 왜 | 낮은 강도의 검사 호출이나 아예 코드로도 잡힘 | 검사하는 쪽도 같은 깊이로 생각해야 보이고, 같은 모델이면 같은 착각을 할 수 있음 |
| 맞는 방식 | B: 낮은 강도로 쓰고 검사 | A: 강도를 올려 처음부터 덜 틀리게 |

> **제 해석**
>
> 강도를 정하기 전에 먼저 할 일은 **지금 생기는 실패를 이 두 종류로 나눠 보는 것**입니다. 검사로 잡히는 실패에는 검사를 붙이고, 그렇지 않은 실패가 생기는 자리에만 강도를 씁니다.

## 눈에 잘 안 띄는 비용

- **추론이 다음 턴으로 따라옵니다.** GPT-5.6부터는 이전 턴의 추론 내용이 기본으로 다음 턴에 이어집니다. GPT-5.6 가이드에 따르면 이 설정의 기본값이 이전 모델의 current_turn에서 all_turns로 바뀌었습니다. 대화가 길어질수록 앞선 생각들이 입력으로 따라오니, 강도를 올린 대가가 뒤의 턴에서도 조금씩 청구됩니다. 캐시가 상당 부분을 덜어 주겠지만 0은 아닙니다.
- **같은 이름의 강도가 모델마다 다릅니다.** [모델 교체 글](/blog/model-swap-is-not-one-line)에서도 썼듯, 모델을 바꿀 때 강도 설정은 그대로 옮겨지지 않습니다. Opus 5.5는 기본 effort가 Opus 5의 high에서 medium으로 내려갔는데, 같은 effort에서 더 많이 생각하는 경향이 있다고 [문서](https://platform.claude.com/docs/en/models/opus-5-5/whats-new-opus-5-5)에 적혀 있습니다. 같은 "medium"이 모델마다 다른 양의 생각을 뜻하니, 모델을 바꾸면 강도 설정도 다시 재야 합니다.

## 아직 모르는 것

호출마다 맞는 강도를 찾으려면 결국 역할별로 평가 세트를 두고 강도를 바꿔 가며 돌려야 합니다. 그런데 높은 강도로 평가를 돌리는 것 자체가 비쌉니다. Artificial Analysis가 GPT-6 Luna의 지수를 max로 한 번 돌리는 데 $136이 들었습니다. 평가 비용을 아끼려고 표본을 줄이면 강도 사이의 차이가 잡음에 묻힙니다. 어느 정도 크기의 평가 세트면 강도 한 단계 차이를 믿을 만하게 구분할 수 있는지는 아직 감이 없습니다.

## 출처

- OpenAI, [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna)
- Anthropic, [What's new in Claude Opus 5.5](https://platform.claude.com/docs/en/models/opus-5-5/whats-new-opus-5-5)
- LangChain, [Improving Deep Agents with harness engineering](https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering), 2026-02-17
- Kingy AI, [GPT-6 Sol vs Luna: Specs, Pricing & Benchmarks](https://kingy.ai/blog/gpt-6-sol-luna-specs-benchmarks-pricing-comparison/), 2026-09-22
- Artificial Analysis, [Artificial Analysis Intelligence Index v5](https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v5), 2026-10-27
- Artificial Analysis, [GPT-6 Luna (Low) vs. GPT-6 Luna (Max)](https://artificialanalysis.ai/models/comparisons/gpt-6-luna-low-vs-gpt-6-luna)
- OpenAI, [Using GPT-5.6](https://developers.openai.com/api/docs/guides/latest-model/gpt-5.6.md)
