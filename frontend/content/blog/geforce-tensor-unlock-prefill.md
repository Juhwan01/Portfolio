---
title: 'GeForce 텐서 제한 해제: LLM 앱에선 어디가 빨라지나'
excerpt: 10월에 공개된 오픈소스 gpu-unlock이 GeForce의 FP32 누적 텐서 연산을 절반 속도로 묶어 두던 제한을 풉니다. 행렬곱은 최대 두 배까지 빨라지지만, LLM에서 빨라지는 건 프롬프트를 읽는 prefill이고 토큰을 뽑는 decode는 그대로입니다. 응답 시간 식에 넣어 호출 모양별로 얼마나 줄어드는지 계산해 봅니다.
tags:
- GPU
- Inference
- Local LLM
category: insight
read_time: 10
published_at: '2026-11-11T05:00:00Z'
---

> **한눈에 보기**
> - 10월 18일 공개된 [gpu-unlock](https://github.com/Zagitta/gpu-unlock)은 GeForce RTX 20·30·40 시리즈의 텐서 연산 제한을 풀어 BF16 행렬곱을 **+65~100%** 올립니다. 사용자들이 올린 측정을 모은 숫자이고, 100%는 README가 "peak MMA rate"(행렬곱 최고 속도)라고 단 RTX 4090의 최대치입니다.
> - 이 제한은 NVIDIA 백서에 처음부터 적혀 있었습니다. RTX 3090의 FP32 누적 텐서 연산은 **71 TFLOPS**, 같은 GA102 칩을 쓴 RTX A6000은 **154.8 TFLOPS**입니다.
> - LLM 추론에서 빨라지는 건 입력을 읽는 **prefill**(+25~55%)입니다. 토큰을 하나씩 뽑는 decode는 그대로이고, llama.cpp용 GGUF 양자화 모델은 이득이 15% 이하입니다.
> - 그래서 같은 해제라도 응답 시간은 출력이 긴 채팅에서 **약 1%**, 출력이 거의 없는 채점·임베딩 작업에서 **20~29%** 줄어듭니다(아래 가정 기준).

10월 18일 GitHub에 올라온 저장소 하나가 3주 남짓 만에 별 1만 8천 개를 넘겼습니다(11월 11일 기준 약 18,600개). README 맨 위 문구는 이렇습니다.

> Your GeForce runs AI at half speed. This fixes it.

GeForce가 AI를 절반 속도로 돌리고 있으니 이 저장소로 고치라는 말입니다.

API 모델로 에이전트를 만드는 입장에서는 게임용 그래픽카드 소식이 보통 멀게 느껴집니다. 그런데 이 저장소의 성능표는 지난번 [추론 속도 글](/blog/faster-inference-architecture)에서 쓴 응답 시간 식에 그대로 대입할 수 있는 숫자들이었습니다. 이번에는 같은 식의 **다른 항**이 줄어듭니다(식은 아래에 다시 적습니다).

## 저장소가 말하는 것

README의 첫 문단은 이렇습니다.

> NVIDIA ships GeForce cards with their tensor cores capped to half speed for FP16, BF16 and TF32 math with FP32 accumulation, which is what nearly all AI training and unquantized inference uses.

AI 학습과 양자화하지 않은 추론이 거의 다 쓰는 연산을 NVIDIA가 GeForce에서 절반 속도로 묶어 두었다는 내용입니다. 양자화는 모델의 숫자를 더 적은 비트로 줄여 담는 방법입니다.

행렬곱은 숫자 표끼리 곱하는 계산으로 LLM 계산의 대부분을 차지하고, 텐서 코어는 GPU 안에서 이 계산을 빠르게 처리하는 전용 부품입니다. TFLOPS는 1초에 하는 소수 계산 횟수를 조 단위로 센 값입니다.

FP16·BF16·TF32·FP32는 소수를 담는 형식이고, FP16과 BF16은 숫자 하나를 16비트에, FP32는 32비트에 담아 FP32가 더 정밀합니다. 행렬곱은 곱한 값을 수없이 더하는데, 짧은 자리로 계속 더하면 오차가 쌓이니 그 중간 합만큼은 FP32로 들고 가는 것이 FP32 누적입니다.

정리하면 이렇습니다.

- **무엇을 푸나:** FP16·BF16·TF32 행렬 연산에서 중간 합을 FP32로 누적할 때 걸린 절반 속도 제한입니다. 같은 칩을 쓰는 프로용 카드(RTX A 시리즈 등)에는 이 제한이 없습니다.
- **어떻게 푸나:** 리눅스 커널 모듈(운영체제 가장 안쪽에 끼워 넣는 작은 프로그램)이 부팅 중 NVIDIA 드라이버보다 먼저 올라와 속도 선택 레지스터(GPU 안의 설정 스위치)를 바꾸고 GPU를 리셋한 뒤, 손대지 않은 드라이버에 카드를 넘깁니다. 채굴 전용 CMP 카드의 제한을 풀던 기존 기법을 가져왔다고 적혀 있습니다.
- **지원 범위:** RTX 30은 "안정"(사용자 보고 100건 이상), RTX 20과 40은 "실험", RTX 50은 지원하지 않습니다.
- **결과:** "Outputs are bit-identical before and after; only the speed changes." 해제 전후의 출력은 비트 하나까지 같고 속도만 바뀐다는 뜻입니다.

저장소가 모은 행렬곱 측정은 이렇습니다(BF16, FP32 누적, 기본 전력 제한, 차이는 README 표기 그대로).

| 카드 | 해제 전 | 해제 후 | 차이 |
|---|---|---|---|
| RTX 3060 12GB | 27 TFLOPS | 51 TFLOPS | +87% |
| RTX 3090 | 75 TFLOPS | 125 TFLOPS | +65% |
| RTX 4090 | 165 TFLOPS | 329 TFLOPS | +100% (최대치) |

RTX 4090은 텐서 코어보다 전력 한도에 먼저 걸려서, 큰 행렬곱에서는 이 최대치보다 훨씬 덜 오른다고 README가 직접 적어 두었습니다. 이 숫자들은 사용자들이 이슈로 올린 호환성 보고를 모은 것이고, 통제된 환경에서 따로 잰 값은 아닙니다.

README에는 실제 작업별 향상을 모은 표("Real workloads")도 있습니다. 이 글에서 쓰는 줄만 옮기면 이렇습니다.

| 작업 | 보통의 향상 |
|---|---|
| LLM prefill·프롬프트 처리 (FP16·BF16 또는 AWQ·GPTQ, vLLM·PyTorch·Transformers) | +25~55% |
| 첫 토큰 시간 | 25~30% 감소 |
| BF16 LoRA·전체 미세조정 | +25~50% |
| llama.cpp·Ollama의 GGUF 양자화 모델 | 0~15%, 주로 긴 문맥에서 |
| LLM decode·토큰 생성 (메모리 대역폭에 묶임) | No change |
| INT8·FP8·INT4 모델 | No change |

표의 llama.cpp와 Ollama는 개인 PC용 LLM 실행 프로그램이고, GGUF는 이들이 쓰는 모델 파일 형식입니다.

[Notebookcheck](https://www.notebookcheck.net/Nvidia-RTX-3090-performance-nearly-doubles-with-free-GPU-unlock-but-there-s-a-catch.1432805.0.html)도 RTX 3090 사용자 한 명의 보고를 인용해, 긴 문맥 프롬프트 처리는 16% 빨라졌지만 토큰 생성은 "practically unchanged"(사실상 그대로)였다고 전했습니다. 어떤 프로그램으로 잰 값인지는 기사에 없고, NVIDIA의 입장도 없었습니다.

## 제한은 스펙표에 적혀 있었다

더 흥미로웠던 건 이 제한이 숨겨진 게 아니었다는 점입니다. NVIDIA의 아키텍처 백서는 텐서 연산 속도를 누적 정밀도별로 나눠 적습니다.

| 카드 (칩) | FP16 텐서, FP16 누적 | FP16 텐서, FP32 누적 |
|---|---|---|
| GeForce RTX 3090 (GA102) | 142 TFLOPS | **71 TFLOPS** |
| RTX A6000 (GA102) | 154.8 TFLOPS | **154.8 TFLOPS** |
| GeForce RTX 4090 (AD102) | 330.3 TFLOPS | **165.2 TFLOPS** |

희소성 기능을 쓰지 않은 값이고, [Ampere GA102 백서](https://images.nvidia.com/aem-dam/en-zz/Solutions/geforce/ampere/pdf/NVIDIA-ampere-GA102-GPU-Architecture-Whitepaper-V1.pdf)의 표 3·표 9와 [Ada 백서](https://images.nvidia.com/aem-dam/Solutions/geforce/ada/nvidia-ada-gpu-architecture.pdf) 부록 A에서 옮겼습니다. 같은 칩인데 GeForce만 FP32 누적 값이 절반입니다. 같은 백서 표 3의 데이터센터용 A40(GA102)도 두 값이 149.7 TFLOPS로 같습니다. 백서 값은 기준 부스트 클럭으로 계산한 최대치라, 실제 카드에서 잰 앞의 표(RTX 3090 75 TFLOPS)와는 조금 다릅니다.

그럼 실제 학습과 추론은 둘 중 어느 쪽을 쓸까요. [PyTorch 문서](https://docs.pytorch.org/docs/stable/notes/numerical_accuracy.html)는 "Half-precision GEMM operations are typically done with intermediate accumulations (reduction) in single-precision"이라고 적습니다. 정확도와 오버플로 때문에 FP32로 누적하는 쪽이 기본이라는 뜻입니다.

백서에서 RTX 3090의 INT8(8비트 정수로 하는 계산) 텐서 연산은 284 TOPS(TFLOPS의 정수 계산판)로 이 제한을 받지 않았습니다. README 작업별 표에서 INT8·FP8·INT4로 계산하는 모델이 "No change"인 것과 맞아떨어집니다. 가중치(모델이 학습으로 얻은 숫자들)만 4비트로 줄이고 계산은 FP16으로 하는 AWQ·GPTQ 모델은 prefill 이득을 받는 쪽으로 따로 적혀 있습니다.

> **제 해석**
>
> 로컬 장비로 처리량을 어림할 때 GeForce 스펙표의 큰 숫자(FP16 누적)를 쓰면 **두 배 높게** 잡게 됩니다. 이번 해제는 없던 성능을 만든 게 아니라, GeForce의 FP32 누적 값을 표에 이미 적힌 FP16 누적 값 수준으로 맞춘 것에 가깝습니다. 차로 치면 같은 엔진을 얹은 두 모델 중 일반 모델에만 달아 둔 속도 제한기를 떼어 낸 셈입니다.
>
> 스펙표를 볼 때는 "내 프레임워크가 어느 정밀도로 누적하나"를 먼저 확인하는 게 맞습니다.

## 응답 시간 식에서 줄어드는 항

지난 글에서 쓴 식입니다.

```
응답 시간 ≈ 첫 토큰까지 시간                 ← prefill
          + 출력 토큰 수 ÷ 초당 출력 토큰     ← decode
          + 모델 밖에서 쓰는 시간
```

API의 유료 fast 등급은 가운데 decode 항을 줄였습니다. 이번 해제는 반대로 **첫 항**(prefill)을 줄입니다. 이유는 두 단계가 막히는 곳이 다르기 때문입니다.

- **prefill:** 입력 토큰 전체를 한꺼번에 큰 행렬곱으로 처리합니다. 연산 속도에 묶여 있어서 텐서 코어가 빨라지면 같이 빨라집니다.
- **decode:** 토큰 하나를 만들 때마다 모델 가중치 전체를 메모리에서 다시 읽습니다. 메모리 대역폭에 묶여 있어서 텐서 코어가 두 배가 돼도 거의 그대로입니다.

비유하면 decode는 토큰(모델이 글을 잘게 쪼개 세는 단위) 하나를 쓸 때마다 가중치라는 두꺼운 책을 처음부터 다시 훑는 일입니다. 계산하는 손이 두 배 빨라져도 책장 넘기는 속도인 메모리 대역폭(1초에 메모리에서 읽어 오는 양)이 그대로면 빨라지지 않습니다. prefill은 책을 한 번 훑으며 입력 토큰 전체를 한꺼번에 계산하는 일이라, 손이 빨라지면 같이 빨라집니다.

decode의 상한은 계산으로 바로 나옵니다. 80억 파라미터 BF16 모델을 RTX 3090(메모리 대역폭 936GB/s, 백서 표 9)에서 한 요청씩 돌린다고 하면 이렇습니다.

```
가중치 크기     = 8B × 2바이트 = 16GB
초당 토큰 상한  ≈ 936GB/s ÷ 16GB ≈ 58토큰 (텐서 연산 속도와 무관)
```

BF16은 숫자 하나가 2바이트라 80억 개면 16GB이고, 토큰마다 이걸 다 읽어야 하니 1초에 58토큰 남짓이 한계입니다.

이제 호출 모양별로 넣어 보겠습니다. 설명을 위해 정한 가정은 셋입니다.

- 해제 전 prefill: 초당 3,000토큰
- 해제 전 decode: 초당 45토큰 (위 상한 58토큰보다 낮게 잡음)
- 해제 뒤 prefill: 1.4배. README 작업별 표의 "첫 토큰 시간 25~30% 감소"와 맞춘 값입니다(1 ÷ 1.4 ≈ 0.71).

| 호출 모양 | 입력 / 출력 토큰 | 해제 전 | 해제 후 | 차이 |
|---|---|---|---|---|
| 채팅 답변 | 1,500 / 800 | 0.50 + 17.78 = 18.3초 | 0.36 + 17.78 = 18.1초 | −1% |
| 에이전트 한 턴 (매번 전체 문맥) | 20,000 / 300 | 6.67 + 6.67 = 13.3초 | 4.76 + 6.67 = 11.4초 | −14% |
| 에이전트 한 턴 (접두부 캐시) | 새 입력 2,000 / 300 | 0.67 + 6.67 = 7.3초 | 0.48 + 6.67 = 7.1초 | −3% |
| LLM 채점 | 8,000 / 50 | 2.67 + 1.11 = 3.8초 | 1.90 + 1.11 = 3.0초 | −20% |
| 임베딩·재순위 | 입력만 | 입력 처리 시간 T | T ÷ 1.4 = 0.71T | −29% |

각 칸은 "입력 ÷ prefill 속도 + 출력 ÷ decode 속도"입니다. 채팅 답변 줄이라면 입력 1,500토큰을 읽는 데 0.50초, 출력 800토큰을 쓰는 데 17.78초가 걸리고, 해제로 줄어드는 건 앞의 0.50초가 0.36초가 되는 부분뿐입니다. 출력이 길수록 decode 항이 시간을 다 차지해서 해제의 몫이 사라집니다.

표에서 접두부 캐시 줄은 앞 턴에서 이미 읽은 앞부분을 기억해 두고 새로 붙은 2,000토큰만 읽는 경우입니다. 임베딩은 글의 뜻을 숫자 목록으로 바꾸는 작업이고, 재순위는 검색으로 찾은 문서를 질문에 맞는 순서로 다시 매기는 작업입니다.

> **제 해석**
>
> 에이전트는 입력이 길고 출력이 짧아서 이득을 볼 것 같지만, 실제로는 **접두부 캐시가 줄이는 항과 같은 항**을 줄이기 때문에 두 이득이 서로 겹쳐 더해지지 않습니다. [vLLM 문서](https://docs.vllm.ai/en/latest/features/automatic_prefix_caching.html)도 자동 접두부 캐시가 "only reduces the time of processing the queries (the prefilling phase)"라고 적습니다. 시스템 프롬프트와 도구 정의, 이전 대화를 캐시로 재사용하고 있다면 다시 읽는 토큰이 이미 적어서, 해제가 줄일 몫도 거의 남지 않습니다(위 표의 −14%가 −3%로).

## API로 에이전트를 만드는 입장에서

운영 경로는 이 일과 거의 상관이 없습니다. 앞의 백서 표처럼 프로용·데이터센터용 카드에는 이 제한이 없고, GeForce 드라이버 [라이선스](https://www.nvidia.com/en-us/drivers/geforce-license/)는 2.8항에서 "is not licensed for datacenter deployment"라고 못박고 있습니다. API 모델을 부른다면 애초에 GPU를 고를 일도 없습니다.

GeForce가 쓰이는 곳은 책상 위의 개발 단계입니다. 그리고 위 표에서 이득이 큰 줄이 마침 그 단계의 일들입니다.

- **평가셋 돌리기:** 문항마다 프롬프트가 달라 캐시가 잘 안 맞고, 채점 모델은 긴 대화 기록을 읽고 점수 몇 토큰만 냅니다. 표의 "LLM 채점" 줄입니다.
- **임베딩 색인과 재순위:** decode가 아예 없는 작업이라 prefill이 빨라진 만큼 거의 그대로 줄어듭니다. 문서 수십만 건을 다시 색인하는 일이 대표적입니다.
- **LoRA 실험:** LoRA는 작은 추가 부품만 학습시켜 모델을 내 데이터에 맞추는 가벼운 미세조정 방법입니다. README 작업별 표 기준 BF16 미세조정 속도가 +25~50%입니다. 같은 밤에 돌릴 수 있는 설정 조합이 그만큼 늘어납니다.

> **제 해석**
>
> 정리하면 이 해제는 사용자 앞 응답 시간을 거의 바꾸지 않고, 엔지니어의 **실험 한 바퀴**를 짧게 만듭니다. 평가를 자주 돌릴수록 [모델 교체](/blog/model-swap-is-not-one-line)나 프롬프트 변경을 더 작은 단위로 확인할 수 있으니, 제 쪽에서 보면 응답 속도보다 이쪽이 더 쓸모 있는 변화입니다. 다만 운영과 같은 결과를 기대하고 로컬 채점을 쓰려면 "출력이 비트 단위로 같다"는 주장을 해제 전후 같은 평가셋으로 먼저 확인해야 합니다.

## 쓰기 전에 볼 것

- **실험 단계인 세대가 있습니다.** RTX 30만 "안정"이고 20과 40은 "실험"입니다. 노트북은 외장 GPU 전원이 한 번이라도 꺼지면 해제가 풀리고, 절전에서 깨어날 때는 모듈이 다시 해제하느라 약 1초가 더 걸립니다. 최대 절전(hibernation)은 이 재해제가 다루지 않는다고 README에 적혀 있습니다.
- **설치 경로를 확인해야 합니다.** README의 FAQ는 이 프로젝트와 관련 없는 웹사이트, 코인, 설치 프로그램이 돈다고 경고합니다. 이 프로젝트 자체는 리눅스 전용이고, FAQ는 다른 사람이 만든 윈도 포트를 소개하면서 돌아다니는 윈도용 설치 프로그램은 "very careful"하게 대하라고 적었습니다. 별이 많이 붙은 저장소는 가짜 배포본이 따라붙기 쉽습니다. 원 저장소에서 직접 빌드하는 게 안전합니다.
- **공식 지원이 아닙니다.** 부팅 단계에서 카드 레지스터를 바꾸는 커널 모듈이고, 제가 찾아본 범위에서는 NVIDIA가 낸 입장이 없습니다. README는 GPU가 상할 가능성은 "very unlikely"라고 하면서도, 연산이 늘어난 만큼 온도가 조금 오를 수 있다고 적었습니다.

## 아직 모르는 것

- **여러 요청을 묶어 돌릴 때.** 동시 요청을 많이 묶으면 decode도 행렬곱이 커져서 연산 쪽으로 기웁니다. 그러면 decode에서도 이득이 생길 수 있는데, README 작업별 표는 decode를 "No change"로만 적었고 동시 요청 수에 따라 달라지는지는 밝히지 않았습니다.
- **NVIDIA가 다음 드라이버나 펌웨어에서 막을지.** README는 드라이버를 새로 받아도 다시 할 일이 없다고 하지만, 앞으로의 드라이버나 펌웨어에서 막힐지는 아무도 모릅니다. RTX 50 지원도 "unlikely to happen"이라고 했으니, 지금 이 해제를 전제로 장비를 사는 건 이른 판단 같습니다.
- **독립 측정.** 지금 숫자는 사용자 보고를 모은 것이라 카드 상태, 전력 설정, 프레임워크 버전이 제각각입니다. 같은 조건에서 해제 전후를 잰 결과가 나와야 위 표의 1.4배 가정도 고칠 수 있습니다.

## 출처

- Zagitta, [Zagitta/gpu-unlock](https://github.com/Zagitta/gpu-unlock)
- Notebookcheck, [Nvidia RTX 3090 performance nearly doubles with free GPU unlock, but there's a catch](https://www.notebookcheck.net/Nvidia-RTX-3090-performance-nearly-doubles-with-free-GPU-unlock-but-there-s-a-catch.1432805.0.html), 2026-10-24
- NVIDIA, [NVIDIA Ampere GA102 GPU Architecture](https://images.nvidia.com/aem-dam/en-zz/Solutions/geforce/ampere/pdf/NVIDIA-ampere-GA102-GPU-Architecture-Whitepaper-V1.pdf)
- NVIDIA, [NVIDIA Ada GPU Architecture](https://images.nvidia.com/aem-dam/Solutions/geforce/ada/nvidia-ada-gpu-architecture.pdf)
- PyTorch, [Numerical accuracy](https://docs.pytorch.org/docs/stable/notes/numerical_accuracy.html)
- vLLM, [Automatic Prefix Caching](https://docs.vllm.ai/en/latest/features/automatic_prefix_caching.html)
- NVIDIA, [License For Customer Use of NVIDIA GeForce Software](https://www.nvidia.com/en-us/drivers/geforce-license/)
