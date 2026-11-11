---
title: '하네스 엔지니어링: 글로 쓴 규칙은 얼마나 일하나'
excerpt: OpenAI의 하네스 엔지니어링 글이 나온 지 한 달 반이 지났습니다. 원문과 그 주변 글을 읽어 보면, 널리 퍼진 "세 기둥" 분류는 원문에 없는 말이고, AGENTS.md 같은 지시 파일의 효과를 두고는 반대되는 연구도 나와 있습니다. 하네스를 알려 주는 장치와 확인하는 장치로 나눠 다시 봅니다.
tags:
- Harness Engineering
- AI Agent
- Context Engineering
category: insight
read_time: 9
published_at: '2026-03-28T07:47:59.832142Z'
---

> **한눈에 보기**
> - 널리 퍼진 하네스의 **"세 기둥" 분류는 OpenAI 원문이 아니라** Böckeler의 해석입니다.
> - AGENTS.md 같은 지시 파일은 **모델이 혼자 알 수 없는 것만** 적을 때 일합니다. 저장소 개요를 적은 파일은 성공률을 못 올리고 추론 비용만 20% 넘게 늘렸습니다.
> - 하네스를 **알려 주는 장치**와 **확인하는 장치**로 나누면, 효과가 컸던 사례는 대부분 확인하는 쪽이고, 모델이 좋아질 때 낡는 쪽은 알려 주는 쪽입니다.

OpenAI의 하네스 엔지니어링 글에서 제가 가장 오래 붙잡고 있던 문장은 숫자들이 나오는 대목에서 한참 내려간 곳에 있습니다. 팀이 한때 **매주 금요일, 그러니까 일주일의 20%를 에이전트가 만든 "AI slop"을 치우는 데 썼다**는 고백입니다.

그 문장을 기준으로 다시 읽으면, 이 글은 코드를 한 줄도 직접 쓰지 않고 제품을 만들었다는 자랑이라기보다 에이전트가 쌓는 엔트로피를 어떻게 다스렸는지에 관한 기록에 가깝습니다. 글이 나오고 한 달 반 동안 "하네스"라는 말은 빠르게 퍼졌고, 그사이 원문과 다르게 전해지는 부분도 생겼습니다. 원문이 말한 것, 주변 글이 말한 것, 제가 읽은 것을 나눠 정리해 둡니다.

## 원문이 실제로 한 이야기

[OpenAI 글](https://openai.com/index/harness-engineering/)은 2월 11일에 Ryan Lopopolo의 이름으로 나왔습니다.

| 항목 | 내용 |
|---|---|
| 기간 | 2025년 8월 말 빈 저장소에 첫 커밋, 다섯 달 뒤 |
| 결과물 | 코드 약 100만 줄, 머지된 PR 약 1,500개 |
| 사람 | 엔지니어 셋으로 시작해 글을 쓸 무렵 일곱 |
| 속도 | 셋이던 시기 기준 한 사람이 하루 평균 PR 3.5개, 손으로 짰을 때의 약 10분의 1 시간 (추정) |
| 직접 쓴 코드 | 없음. 첫 AGENTS.md조차 Codex가 씀 |

숫자보다 눈에 들어온 건 목차였습니다. 소제목에 이런 것들이 차례로 나옵니다.

- 저장소의 지식을 기록 원본으로
- 에이전트가 읽을 수 있게
- 아키텍처와 취향을 강제하기
- 엔트로피와 가비지 컬렉션

AGENTS.md는 100줄 남짓으로 짧게 두고 목차로만 씁니다. 많이 인용되는 "give Codex a map, not a 1,000-page instruction manual"이라는 구절이 이 대목에서 나옵니다.

금요일 이야기로 돌아가면, 그들은 이 일을 계속 사람 손으로 하지 않았습니다.

- 지켜야 할 원칙을 "**golden principles**"로 정리하고, 그 원칙에 어긋난 곳을 찾아 리팩터링 PR을 여는 Codex 작업을 백그라운드에서 주기적으로 돌렸습니다.
- 문서와 코드가 어긋난 곳을 고치는 에이전트도 따로 있었습니다.
- 아키텍처와 취향은 별도 절에서 직접 만든 **린터와 구조 테스트**로 강제했습니다.

사람이 치우던 일을 정해진 주기로 도는 검사와 수리 작업으로 바꾼 것입니다.

## "세 기둥"과 "하네스"는 누구의 말인가

- **세 기둥:** 하네스를 컨텍스트 엔지니어링, 아키텍처 제약, 가비지 컬렉션의 세 기둥으로 설명하는 분류는 원문에 없습니다. Thoughtworks의 Birgitta Böckeler가 2월 17일 [메모](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering-memo.html)에서 OpenAI 글을 읽고 묶은 것이고, 그는 옆에 "(grouping based on my interpretation)"이라고 분명히 적었습니다. 쓸 만한 정리지만 OpenAI의 주장으로 옮기면 안 됩니다. 같은 메모에서 그는 OpenAI 글 본문에 "harness"라는 단어가 한 번밖에 나오지 않는다는 점도 짚었습니다.
- **harness engineering이라는 말:** 엿새 먼저 나온 Ghostty 개발자 Mitchell Hashimoto의 [글](https://mitchellh.com/writing/my-ai-adoption-journey)에 이미 있었습니다. 그는 업계에서 통하는 이름이 따로 있는지는 모르겠다면서 "I've grown to calling this 'harness engineering'"이라고 썼습니다.
- **하네스의 정의:** 3월 4일 같은 사이트에 실린 Kief Morris의 [글](https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html)에 있는 문장이 가장 정확하다고 봅니다. "The collection of specifications, quality checks, and workflow guidance that control different levels of loops inside the how loop is the agent's harness." 명세, 품질 검사, 작업 지침. 모델에게 알려 주는 것과 결과를 확인하는 것이 한 문장에 같이 들어 있습니다.

## 지시 파일은 얼마나 일하나

두 자료가 반대처럼 보이는 결과를 냈습니다.

| 자료 | 무엇을 봤나 | 결과 |
|---|---|---|
| Hashimoto의 AGENTS.md (2월) | 줄 하나하나를 실제로 본 실패에 대한 답으로 적음 | "Each line in that file is based on a bad agent behavior, and it almost completely resolved them all" |
| ETH Zurich·LogicStar [AGENTS.md 평가 연구](https://arxiv.org/abs/2602.11988v1) (2월) | 여러 저장소에서 컨텍스트 파일의 효과를 잼 | 성공률은 대체로 오르지 않고, 추론 비용은 20% 넘게 늘어남. 저장소 개요는 도움이 안 됐고, 그 저장소만의 비표준 관행을 적은 부분만 쓸모 있었음 |

> **제 해석**
>
> 둘의 차이는 **파일에 무엇을 적었느냐**에 있습니다. ETH 연구에서 효과가 없던 건 모델이 코드를 읽기만 해도 알아낼 저장소 개요였고, 쓸모 있었다는 "비표준 관행"이 사실상 Hashimoto가 적은 종류의 줄입니다. 모델이 혼자서는 알 수 없는 것만 짧게 적으면 일을 하고, 이미 아는 걸 되풀이하면 토큰만 먹습니다. OpenAI가 AGENTS.md를 100줄짜리 목차로 줄인 것도 같은 방향입니다.

## 확인하는 쪽에서 나온 숫자들

Böckeler의 메모에는 이런 문장도 있습니다. "What I am missing in the write-up is verification of functionality and behaviour." OpenAI 글에도 Codex가 버그를 재현하고, Chrome DevTools로 앱을 띄워 고친 결과를 확인하는 대목이 있기는 합니다. 다만 Böckeler가 보기에 그 비중은 구조와 취향을 지키는 장치에 비해 작았습니다. 그런데 비슷한 시기에 나온 다른 사례들은 바로 그 **확인하는 쪽**에서 큰 숫자를 냈습니다.

| 사례 | 바꾼 것 | 결과 |
|---|---|---|
| [LangChain](https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering) (2월) | 모델(gpt-5.2-codex)은 그대로, 자기 검증과 트레이싱 추가 | Terminal Bench 2.0 52.8% → 66.5% |
| [Vercel](https://vercel.com/blog/we-removed-80-percent-of-our-agents-tools) (2025년 12월) | 사내 텍스트-SQL 에이전트의 도구 17개를 명령 실행·SQL 실행 2개로 | 274.8초 → 77.4초, 토큰 약 37% 감소 |
| [Anthropic](https://www.anthropic.com/engineering/harness-design-long-running-apps) (3월 24일) | 일하는 에이전트와 평가하는 에이전트를 분리, 평가자는 Playwright로 앱을 직접 눌러 봄 | "a strong lever" |

사례마다 덧붙일 점이 있습니다.

- **LangChain:** 그들이 효과가 컸다고 꼽은 건 자기 검증과 트레이싱이었고("self-verification & tracing help a lot"), 에이전트가 끝내려는 순간 붙잡아 과제 명세와 대조하는 검증을 한 번 더 돌게 하는 미들웨어가 그중 하나입니다. 추론 강도를 xhigh로만 돌리면 시간 제한에 걸려 53.9%에 그쳤고 high로는 63.6%였습니다. 그들이 쓴 건 계획과 검증에는 xhigh, 그 사이 구현에는 high를 쓰는 "reasoning sandwich"였는데, 강도 배분을 바꿔 본 시험들 사이에 큰 차이는 없었다고 합니다. 저는 이 결과를 **강도보다 검증 단계를 두었느냐가 더 컸던** 사례로 읽습니다.
- **Vercel:** 정확도가 80%에서 100%가 됐다는 숫자도 있는데, 질문 다섯 개로 잰 값(4/5에서 5/5)이라 크게 기대지는 않으려 합니다. 제가 가져가는 건 에이전트가 할 수 있는 일의 범위를 좁혔더니 시간과 토큰이 같이 줄었다는 쪽입니다.
- **Anthropic:** 평가자도 LLM이라 LLM이 만든 결과물에 너그러운 경향이 있었고, 초기에는 문제를 제대로 찾아 놓고도 별일 아니라고 스스로 설득한 뒤 통과시키는 일이 있었다고 합니다.

## 알려 주는 장치와 확인하는 장치

여기까지 읽고 저는 하네스를 두 종류로 나눠 보게 됐습니다.

| | 알려 주는 장치 | 확인하는 장치 |
|---|---|---|
| 예 | 시스템 프롬프트, AGENTS.md, 스킬·도구 설명, 컨텍스트 리셋, 작업 분해 | 타입 검사, 린터, 테스트, CI, 평가 에이전트 |
| 위 자료에서 | 개요를 적은 지시 파일은 성공률을 못 올림. 효과는 구체적인 실패를 막는 줄에서만 나옴 | 끝에 확인을 붙인 LangChain·Anthropic, 범위를 좁힌 Vercel, 취향을 검사로 바꾼 OpenAI가 큰 숫자를 냄 |
| 모델이 좋아지면 | 낡음 | 결정론적인 검사는 그대로 남음 |

## 모델이 좋아지면 무엇이 낡는가

Anthropic 글에서 가장 오래 남는 문장은 이것입니다. "every component in a harness encodes an assumption about what the model can't do on its own." 그리고 그 가정들은 "worth stress testing"이라고 덧붙입니다.

글에는 실제로 가정이 무너진 사례가 나옵니다.

- **컨텍스트 리셋:** Sonnet 4.5는 컨텍스트 한도에 가까워졌다고 느끼면 일을 서둘러 마무리하려는 "context anxiety"가 강해서, 하네스가 컨텍스트를 주기적으로 리셋해 줘야 했습니다. Opus 4.5가 그 버릇을 스스로 거의 없애자("largely removed that behavior on its own") 리셋을 통째로 걷어냈습니다.
- **스프린트 분해:** Opus 4.6에서는 일을 스프린트로 쪼개 주던 구조도 뺐습니다. 모델이 그런 분해 없이도 일을 해낼 수 있었기 때문입니다.
- **평가 에이전트:** Opus 4.6에서는 생성 쪽 능력의 경계에 있는 부분에만 남겼다고 합니다.

> **제 해석**
>
> 알려 주는 장치와 확인하는 장치는 **유통기한이 다릅니다.** 컨텍스트 리셋이나 스프린트 분해, "파일을 고치기 전에 테스트 위치를 먼저 확인하라" 같은 지시는 모델의 약점을 메우려고 넣은 것이라 모델이 바뀌면 낡습니다. 테스트와 린터는 결과물에 대한 약속이라 모델이 바뀌어도 같은 것을 검사합니다. 모델이 좋아질수록 하네스가 얇아져야 한다는 생각과 하네스가 경쟁력이라는 생각도 이렇게 보면 함께 성립합니다. 얇아지는 쪽은 알려 주는 장치이고, 결정론적인 검사는 남아서 쌓입니다.

Anthropic 글의 결론도 비슷한 방향입니다. "the space of interesting harness combinations doesn't shrink as models improve. Instead, it moves." 하네스가 사라지는 게 아니라 하네스가 할 일이 옮겨 갑니다.

## 지시 파일을 볼 때 물어볼 것

지시 파일의 줄마다 이렇게 물어볼 만합니다.

1. **모델이 이 실수를 그만두면 알아챌 수 있는가?** 알아챌 방법이 없으면 그 줄은 검증되지 않은 문장입니다. 효과가 있는지 모르고, 언제 지워야 하는지도 모릅니다.
2. **검사로 바꿀 수 있는가?** 가능하면 그 줄을 린터나 테스트로 옮깁니다.
3. **못 바꾼다면, 어떤 실패에서 나왔는지 적어 뒀는가?** 그래야 새 모델이 나왔을 때 그 실패를 다시 재현해 보고, Anthropic이 컨텍스트 리셋을 걷어냈듯 지울지 정할 수 있습니다.

## 아직 모르는 것

- **LLM이 판정하는 검사도 남는가.** 확인하는 장치가 모델이 바뀌어도 남는다고 썼지만, 평가 에이전트처럼 LLM이 판정하는 검사는 예외일 수 있습니다. Anthropic의 평가자가 LLM 결과물에 너그러웠던 것처럼, 이런 검사는 판정하는 모델의 성향을 그대로 물려받고 모델이 바뀌면 같이 흔들립니다. 결정론적인 검사와 LLM 판정 검사를 어떤 비율로 둘지에 대해서는 아직 제 기준이 없습니다.
- **하네스 자체는 어떻게 테스트하나.** 지시 파일과 훅과 평가자가 의도대로 일하는지 확인하는 장치가 또 필요한데, 그걸 어디서 멈춰야 하는지는 아직 감이 없습니다. OpenAI 글도 몇 년이 지나면 아키텍처의 일관성이 어떻게 변할지는 아직 모른다는 말로 끝납니다.

## 출처

- OpenAI, [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/), 2026-02-11
- martinfowler.com, [Harness Engineering - first thoughts](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering-memo.html), 2026-02-17
- Mitchell Hashimoto, [My AI Adoption Journey](https://mitchellh.com/writing/my-ai-adoption-journey), 2026-02-05
- martinfowler.com, [Humans and Agents in Software Engineering Loops](https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html), 2026-03-04
- arXiv, [Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?](https://arxiv.org/abs/2602.11988v1), 2026-02-12
- LangChain, [Improving Deep Agents with harness engineering](https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering), 2026-02-17
- Vercel, [We removed 80% of our agent’s tools](https://vercel.com/blog/we-removed-80-percent-of-our-agents-tools), 2025-12-22
- Anthropic, [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps), 2026-03-24
