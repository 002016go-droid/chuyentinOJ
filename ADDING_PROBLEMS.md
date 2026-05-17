# Thêm bài mới vào ChuyenTinOJ

Tất cả các bài đều là file JSON tĩnh trong `public/data/problems/`. Có hai cách thêm:

## Cách 1 — qua `/admin` (đề xuất)

1. Đăng nhập rồi vào `/admin`.
2. Bấm **New problem** → mẫu JSON sẽ hiện trong editor.
3. Sửa các trường rồi bấm **Validate**. App sẽ chỉ ra lỗi schema.
4. Bấm **Download JSON** rồi đặt file vào `public/data/problems/<slug>.json`.
5. Thêm `slug` mới vào `public/data/problems/index.json`.
6. Commit & push hoặc reload — bài hiện ngay.

## Cách 2 — viết tay

Copy file mẫu sau, đặt vào `public/data/problems/<slug>.json`.

```jsonc
{
  "slug": "my-new-problem",
  "title": "Tên bài (VN)",
  "module": "contest",        // "roadmap" | "contest" | "entrance" | "learning" | "hidden"
  "contestId": "danang-hsg-2024-12",  // optional
  "difficulty": 4,            // 1..10
  "maxStars": 5.0,
  "tags": ["dp", "greedy"],
  "source": "ChuyenTin / HSG ...",
  "statement": "Markdown + KaTeX inline `$...$`.\n\n## Input\n...\n\n## Output\n...",
  "subtasks": [
    {
      "id": "st1",
      "label": "Subtask 1",
      "points": 30,
      "constraint": "$n \\le 100$",
      "hint": { "id": "h1", "content": "Gợi ý 1", "starCost": 0.3 }
    },
    { "id": "st2", "label": "Subtask 2", "points": 40, "constraint": "...", "hint": { "id": "h2", "content": "Gợi ý 2", "starCost": 0.4 } },
    { "id": "st3", "label": "Subtask 3", "points": 30, "constraint": "...", "hint": { "id": "h3", "content": "Gợi ý 3", "starCost": 0.5 } }
  ],
  "samples": [
    { "input": "3\n1 2 3\n", "output": "6\n", "explanation": "1+2+3 = 6" }
  ],
  "testCases": [
    { "id": 1, "subtaskId": "st1", "input": "3\n1 2 3\n", "output": "6\n" }
  ],
  "expectedAlgorithm": "...",
  "expectedComplexity": "O(N)",
  "whyThisAlgorithm": "...",
  "bruteForceSubtask": "Subtask 1",
  "optimizedSubtask": "Subtask 3",
  "editorial": "...",
  "referenceCpp": "#include <bits/stdc++.h>\n...",
  "timeLimitMs": 1000,
  "memoryLimitKB": 262144
}
```

Lưu ý:
- Mỗi test case bắt buộc có `subtaskId` khớp với một subtask.
- Toàn bộ field `statement` / `editorial` hỗ trợ Markdown + KaTeX (`$...$` và `$$...$$`).
- `referenceCpp` là code tham khảo cho bạn — không bị app chạy hay so sánh.
- `module: "hidden"` → bài chỉ hiện khi mở khoá easter egg.

Sau khi thêm file:
1. Mở `public/data/problems/index.json`, thêm slug vào mảng.
2. Reload trang. Bài xuất hiện trên Ranking + Dashboard search.

## Sinh test case bằng script

Có thể viết script Python sinh test rồi paste vào field `testCases`. Ví dụ:

```python
import json, random
testcases = []
for i in range(1, 11):
    n = random.randint(1, 100)
    a = [random.randint(-1000, 1000) for _ in range(n)]
    inp = f"{n}\n{' '.join(map(str, a))}\n"
    out = f"{sum(a)}\n"
    testcases.append({"id": i, "subtaskId": f"st{(i-1)//3 + 1}", "input": inp, "output": out})
print(json.dumps(testcases, indent=2, ensure_ascii=False))
```
