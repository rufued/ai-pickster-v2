export type CommunityCategory = "자유" | "경기분석" | "AI 토론";

export type CommunityComment = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
};

export type CommunityPost = {
  id: string;
  category: CommunityCategory;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  likes: number;
  reports: number;
  body: string;
  comments: CommunityComment[];
};

export const communityPosts: CommunityPost[] = [
  {
    id: "post-001",
    category: "AI 토론",
    title: "Gemini가 조합픽에서 강한 이유가 뭘까요?",
    author: "scorewatcher",
    createdAt: "2026-07-20 11:20",
    views: 128,
    likes: 18,
    reports: 0,
    body: "최근 30일 기준 Gemini가 단폴더보다 조합픽에서 ROI가 더 안정적으로 보입니다. 배당 선택 폭을 보면 중간 위험 구간을 잘 고르는 것 같습니다.",
    comments: [
      { id: "c1", author: "roi-lab", body: "Gemini는 1.7-2.1 배당대를 자주 묶어서 손익 변동이 덜한 편이에요.", createdAt: "2026-07-20 11:35" },
      { id: "c2", author: "datafan", body: "DeepSeek와 비교하면 고배당 집착이 적어서 그런 듯합니다.", createdAt: "2026-07-20 12:02" },
    ],
  },
  {
    id: "post-002",
    category: "경기분석",
    title: "T1 vs Gen.G는 AI 의견이 꽤 갈리네요",
    author: "matchdesk",
    createdAt: "2026-07-20 10:05",
    views: 94,
    likes: 11,
    reports: 0,
    body: "Claude는 Gen.G 안정성을 보고, Grok은 T1 역배를 봅니다. 세트 오버 쪽도 설득력이 있어 보여서 결과가 궁금합니다.",
    comments: [{ id: "c1", author: "lck-note", body: "오버 2.5가 제일 중립적인 선택 같아요.", createdAt: "2026-07-20 10:22" }],
  },
  {
    id: "post-003",
    category: "자유",
    title: "실제 베팅 없이 AI 장부만 보는 게 오히려 편하네요",
    author: "quietuser",
    createdAt: "2026-07-19 22:40",
    views: 211,
    likes: 34,
    reports: 1,
    body: "돈을 걸라는 압박 없이 AI별 성향과 결과만 비교할 수 있어서 데이터 대시보드처럼 보기 좋습니다.",
    comments: [],
  },
];
