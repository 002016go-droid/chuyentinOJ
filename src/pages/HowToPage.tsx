import { Link } from 'react-router-dom'
import {
  BookOpen,
  Calendar,
  Compass,
  Layers,
  FileText,
  Code2,
  Trophy,
  HelpCircle,
  Sparkles,
  Wrench,
  Keyboard,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'

interface StepProps {
  icon: LucideIcon
  title: string
  children: React.ReactNode
  to?: string
  toLabel?: string
}

function Step({ icon: Icon, title, children, to, toLabel }: StepProps) {
  return (
    <section className="card mb-4 p-5">
      <h2 className="mb-3 flex items-center gap-2 font-display text-xl text-[var(--text-primary)]">
        <span
          className="grid h-9 w-9 place-items-center rounded-lg"
          style={{
            background: 'var(--accent-glow)',
            color: 'var(--accent-primary)',
          }}
        >
          <Icon size={18} />
        </span>
        {title}
      </h2>
      <div className="space-y-2 text-sm leading-relaxed text-[var(--text-primary)]">{children}</div>
      {to && (
        <Link
          to={to}
          className="btn btn-primary mt-3 inline-flex"
          style={{ textDecoration: 'none' }}
        >
          {toLabel ?? `Mở ${title} →`}
        </Link>
      )}
    </section>
  )
}

export function HowToPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl">
        <div className="card mb-6 p-6">
          <div className="flex items-center gap-3">
            <span
              className="grid h-12 w-12 place-items-center rounded-xl"
              style={{
                background: 'var(--accent-glow)',
                color: 'var(--accent-primary)',
              }}
            >
              <Compass size={24} />
            </span>
            <div>
              <h1 className="font-display text-3xl text-[var(--text-primary)]">
                Hướng dẫn sử dụng ChuyenTinOJ
              </h1>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                30 ngày luyện thi HSG Tin lớp 9 và tuyển sinh chuyên Tin 10. Mỗi trang phục vụ một
                phần khác nhau của lộ trình — đây là cách bạn nên đi qua chúng.
              </p>
            </div>
          </div>
        </div>

        <Step
          icon={Calendar}
          title="1. Bắt đầu với Lộ trình 30 ngày"
          to="/roadmap"
          toLabel="Mở Lộ trình →"
        >
          <p>
            Lộ trình gồm 30 node, mỗi node tương ứng <strong>một ngày học</strong> (2–3h). Click vào
            một node để xem mô tả ngắn và bài luyện. Click <strong>"Mở trang lý thuyết →"</strong>{' '}
            để vào trang lý thuyết đầy đủ với mục tiêu, code mẫu, và bài tham khảo.
          </p>
          <ul className="ml-5 list-disc text-[var(--text-secondary)]">
            <li>Tuần 1 — Day 1..7: Cú pháp C++, mảng, xâu, sắp xếp.</li>
            <li>Tuần 2 — Day 8..14: Greedy, hai con trỏ, prefix, binary search, đệ quy.</li>
            <li>Tuần 3 — Day 15..21: Stack/Queue, STL, DSU, BFS, DFS, shortest path.</li>
            <li>Tuần 4 — Day 22..28: DP intro, knapsack, LIS/LCS, grid DP, number theory, tree.</li>
            <li>Day 29..30: Dijkstra + Thi thử HSG TP/Tỉnh.</li>
          </ul>
        </Step>

        <Step
          icon={BookOpen}
          title="2. Trang lý thuyết của từng chủ đề"
          to="/topic/io-complexity"
          toLabel="Xem ví dụ trang lý thuyết →"
        >
          <p>
            Mỗi node trong roadmap có trang lý thuyết riêng tại <code>/topic/&lt;slug&gt;</code> với
            đầy đủ:
          </p>
          <ul className="ml-5 list-disc text-[var(--text-secondary)]">
            <li>
              <strong>Mục tiêu</strong> — bạn sẽ học được gì sau ngày này.
            </li>
            <li>
              <strong>Yêu cầu</strong> — kiến thức cần biết trước.
            </li>
            <li>
              <strong>Cách học</strong> — phương pháp khuyến nghị, không bỏ qua.
            </li>
            <li>
              <strong>Lý thuyết đầy đủ</strong> — tổng hợp từ VNOI Wiki, USACO Guide, CP-Algorithms,
              GeeksforGeeks (có chú thích nguồn cuối mỗi mục).
            </li>
            <li>
              <strong>Code mẫu</strong> — snippet C++ cô đọng có comment tiếng Việt.
            </li>
            <li>
              <strong>15–20 bài tham khảo</strong> — link trực tiếp tới CSES, Codeforces, AtCoder,
              VNOJ.
            </li>
            <li>
              <strong>Bài luyện nội bộ</strong> — có sẵn editorial, hint, subtask, chấm bởi Judge0.
            </li>
          </ul>
        </Step>

        <Step
          icon={FileText}
          title="3. Đề HSG lớp 9 + Tuyển sinh chuyên Tin"
        >
          <p>
            Sau khi nắm chắc lý thuyết, vào hai trang đề thi để luyện form đề thật:
          </p>
          <ul className="ml-5 list-disc text-[var(--text-secondary)]">
            <li>
              <Link to="/contests">/contests</Link> — 12+ đề HSG <strong>lớp 9</strong> cấp
              thành phố/tỉnh (Đà Nẵng, Quảng Nam, Hà Nội, TP.HCM, …) các năm 2018–2024.
            </li>
            <li>
              <Link to="/entrance">/entrance</Link> — 17+ đề tuyển sinh <strong>lớp 10 chuyên
              Tin</strong> (Nguyễn Bỉnh Khiêm, KHTN, LHP, LQĐ, Phổ thông Năng khiếu, …).
            </li>
          </ul>
          <p className="text-[var(--text-secondary)]">
            Mỗi đề bấm vào để xem danh sách bài. Đề internal chấm bằng Judge0; đề external có link
            tới VNOJ/trường để bạn nộp.
          </p>
        </Step>

        <Step
          icon={Layers}
          title="4. 80% kiến thức — luyện sâu các kỹ thuật"
          to="/learning"
          toLabel="Mở 80% kiến thức →"
        >
          <p>
            Trang <code>/learning</code> chứa 23+ bài "deep dive" (theo tuần, Day 1–7 trở đi) cho
            các kỹ thuật trọng tâm: STL deep, hash, sieve, modular arithmetic, bitmask DP, segment
            tree intro, … Mỗi bài có code C++ kèm chú thích.
          </p>
        </Step>

        <Step
          icon={Wrench}
          title="5. Kỹ thuật B1..B14"
          to="/techniques"
          toLabel="Mở Kỹ thuật →"
        >
          <p>
            <code>/techniques</code> là bảng 127 micro-techniques chia theo 14 nhóm B1..B14 (Bitmask,
            Two pointers, Sliding window, Binary search trên đáp án, …). Mỗi technique có 1 dòng mô
            tả + 1 ví dụ code 5–10 dòng, filter được theo tag.
          </p>
        </Step>

        <Step icon={Sparkles} title="6. Nguồn học tập gốc" to="/sources" toLabel="Mở Nguồn →">
          <p>
            <code>/sources</code> tổng hợp link trực tiếp tới VNOI Wiki, USACO Guide, CSES Problem
            Set, CP-Algorithms, GeeksforGeeks. Toàn bộ nội dung lý thuyết trong app được tổng hợp từ
            các nguồn này (có ghi rõ).
          </p>
        </Step>

        <Step
          icon={Code2}
          title="7. Làm bài & nộp"
          to="/problem/io-fast"
          toLabel="Thử một bài internal →"
        >
          <p>
            Khi mở một bài nội bộ:
          </p>
          <ul className="ml-5 list-disc text-[var(--text-secondary)]">
            <li>
              <strong>Đề bài</strong> bên trái, <strong>Monaco editor</strong> bên phải với template
              C++ sẵn.
            </li>
            <li>
              <kbd>Ctrl + Enter</kbd> để nộp. Verdict hiện theo từng subtask (AC/WA/TLE/MLE/RE/CE).
            </li>
            <li>Hint mở từng cái một, mỗi hint trừ sao theo độ khó.</li>
            <li>
              Sau khi AC bạn được điểm sao đầy đủ. Mọi tiến trình lưu trong{' '}
              <strong>IndexedDB</strong> của trình duyệt — không cần đăng ký.
            </li>
          </ul>
        </Step>

        <Step icon={Settings} title="8. Bật Judge0 để chấm bài" to="/settings" toLabel="Mở Cài đặt →">
          <p>Có 2 lựa chọn:</p>
          <ul className="ml-5 list-disc text-[var(--text-secondary)]">
            <li>
              <strong>RapidAPI Judge0 (khuyến nghị)</strong>: vào <Link to="/settings">/settings</Link>,
              dán API key từ{' '}
              <a
                href="https://rapidapi.com/judge0-official/api/judge0-ce"
                target="_blank"
                rel="noopener noreferrer"
              >
                rapidapi.com/judge0-official/api/judge0-ce
              </a>
              . Free tier 50 lần/ngày là đủ luyện.
            </li>
            <li>
              <strong>Local Docker</strong>: clone repo, chạy{' '}
              <code>docker compose up -d</code>. Judge0 chạy ở <code>localhost:2358</code>. Đổi mode
              ở Settings sang "Local".
            </li>
          </ul>
          <p className="text-[var(--text-secondary)]">
            Trạng thái judge hiện ở góc phải navbar — chấm xanh = online.
          </p>
        </Step>

        <Step icon={Trophy} title="9. Theo dõi tiến độ" to="/profile">
          <p>
            <Link to="/profile">/profile</Link> hiển thị heatmap 6 tháng (như GitHub), streak ngày
            liên tục, tổng sao đã đạt, badges. Có nút <strong>Export JSON</strong> để backup toàn bộ
            tiến trình (đề phòng đổi máy/đổi trình duyệt).
          </p>
        </Step>

        <Step icon={Keyboard} title="10. Phím tắt">
          <ul className="ml-5 list-disc text-[var(--text-secondary)]">
            <li>
              <kbd>Ctrl + K</kbd> — mở Tìm kiếm bài toàn cục.
            </li>
            <li>
              <kbd>Ctrl + Enter</kbd> — nộp bài (trong trang problem).
            </li>
            <li>
              <kbd>?</kbd> — mở bảng phím tắt đầy đủ.
            </li>
            <li>
              <kbd>[</kbd> / <kbd>]</kbd> — bài trước / bài sau trong cùng chuyên đề.
            </li>
          </ul>
        </Step>

        <section className="card border-l-4 border-[var(--accent-primary)] p-5">
          <h2 className="mb-2 flex items-center gap-2 font-display text-lg">
            <HelpCircle size={18} className="text-[var(--accent-primary)]" />
            Lộ trình đề xuất 30 ngày
          </h2>
          <ol className="ml-5 list-decimal space-y-1 text-sm text-[var(--text-primary)]">
            <li>
              Sáng (1h): đọc <Link to="/roadmap">trang lý thuyết</Link> của ngày hôm đó. Gõ lại code
              mẫu, không copy.
            </li>
            <li>
              Trưa (1h): làm 3–5 bài "internal" trên ChuyenTinOJ, có hint khi cần.
            </li>
            <li>
              Tối (1h): làm 2 bài "reference" (CSES / Codeforces / VNOJ) đã link trong trang lý
              thuyết.
            </li>
            <li>
              Cuối tuần: vào <Link to="/contests">/contests</Link>, làm 1 đề HSG lớp 9 90'.
            </li>
            <li>
              Tuần 4: bắt đầu xen <Link to="/entrance">/entrance</Link> — 1 đề chuyên Tin / tuần.
            </li>
          </ol>
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            Lộ trình này được thiết kế cho mục tiêu HSG Tin lớp 9 cấp thành phố/tỉnh và tuyển sinh
            10 chuyên Tin. Không phải cho HSG Quốc gia — phần đó sẽ là roadmap riêng sau này.
          </p>
        </section>
      </div>
    </PageTransition>
  )
}
