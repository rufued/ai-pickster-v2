import type { Sport } from "@/lib/types";

export type LeagueParticipant = {
  rank: number;
  name: string;
  kind: "AI" | "인간";
  accuracy: number;
  roi: number;
  record: string;
  recent10: string;
  asset: number;
  trend: string;
  sportRoi: Record<"전체" | "축구" | "야구" | "농구" | "e스포츠", number>;
};

export type LeaguePick = {
  id: string;
  date: string;
  participant: string;
  kind: "AI" | "인간";
  sport: Sport;
  match: string;
  pick: string;
  result: string;
  hit: boolean;
  confidence: number;
};

export const seasonRankings: LeagueParticipant[] = [
  { rank: 1, name: "GPT", kind: "AI", accuracy: 67, roi: 34.5, record: "102승 50패", recent10: "7승 3패", asset: 134500, trend: "최근 10경기 7승", sportRoi: { 전체: 34.5, 축구: 30.4, 야구: 38.2, 농구: 27.8, e스포츠: 33.1 } },
  { rank: 2, name: "축구도사", kind: "인간", accuracy: 66, roi: 31.2, record: "99승 51패", recent10: "8승 2패", asset: 131200, trend: "EPL 5연속 적중", sportRoi: { 전체: 31.2, 축구: 39.4, 야구: 18.3, 농구: 21.5, e스포츠: 17.2 } },
  { rank: 3, name: "Gemini", kind: "AI", accuracy: 65, roi: 28.0, record: "98승 52패", recent10: "6승 4패", asset: 128000, trend: "변수 경기 강세", sportRoi: { 전체: 28.0, 축구: 24.7, 야구: 29.6, 농구: 31.4, e스포츠: 26.0 } },
  { rank: 4, name: "토토왕", kind: "인간", accuracy: 64, roi: 24.3, record: "96승 54패", recent10: "7승 3패", asset: 124300, trend: "KBO 적중률 70%", sportRoi: { 전체: 24.3, 축구: 20.6, 야구: 34.9, 농구: 19.1, e스포츠: 15.8 } },
  { rank: 5, name: "Grok", kind: "AI", accuracy: 63, roi: 21.0, record: "94승 55패", recent10: "6승 4패", asset: 121000, trend: "라인업 뉴스 반영", sportRoi: { 전체: 21.0, 축구: 22.3, 야구: 19.4, 농구: 18.8, e스포츠: 29.6 } },
  { rank: 6, name: "Claude", kind: "AI", accuracy: 62, roi: 18.5, record: "92승 57패", recent10: "6승 4패", asset: 118500, trend: "저득점 경기 안정", sportRoi: { 전체: 18.5, 축구: 20.1, 야구: 16.8, 농구: 22.6, e스포츠: 17.9 } },
  { rank: 7, name: "DeepSeek", kind: "AI", accuracy: 61, roi: 16.8, record: "90승 58패", recent10: "5승 5패", asset: 116800, trend: "확률 모델 안정권", sportRoi: { 전체: 16.8, 축구: 23.4, 야구: 18.7, 농구: 14.0, e스포츠: 21.2 } },
  { rank: 8, name: "야구고수", kind: "인간", accuracy: 60, roi: 14.6, record: "88승 59패", recent10: "6승 4패", asset: 114600, trend: "선발 매치업 강점", sportRoi: { 전체: 14.6, 축구: 9.4, 야구: 28.8, 농구: 10.7, e스포츠: 8.5 } },
  { rank: 9, name: "농구황제", kind: "인간", accuracy: 59, roi: 12.4, record: "84승 58패", recent10: "5승 5패", asset: 112400, trend: "KBL 언더 강세", sportRoi: { 전체: 12.4, 축구: 8.2, 야구: 11.5, 농구: 27.3, e스포츠: 9.1 } },
];

export const getRoiRankings = (sport: keyof LeagueParticipant["sportRoi"] = "전체") =>
  [...seasonRankings]
    .map((participant) => ({ ...participant, roi: participant.sportRoi[sport] }))
    .sort((a, b) => b.roi - a.roi || b.asset - a.asset || b.accuracy - a.accuracy)
    .map((participant, index) => ({ ...participant, rank: index + 1 }));

export const getLeagueTotalAsset = () => seasonRankings.reduce((total, participant) => total + participant.asset, 0);

export const todayPredictions = [
  { name: "GPT", kind: "AI" as const, match: "맨시티 vs 리버풀", pick: "맨시티 승", confidence: 68 },
  { name: "Gemini", kind: "AI" as const, match: "맨시티 vs 리버풀", pick: "무승부", confidence: 64 },
  { name: "Grok", kind: "AI" as const, match: "T1 vs Gen.G", pick: "Gen.G 승", confidence: 63 },
  { name: "Claude", kind: "AI" as const, match: "서울 SK vs 부산 KCC", pick: "서울 SK 승", confidence: 61 },
  { name: "DeepSeek", kind: "AI" as const, match: "한화 이글스 vs 롯데 자이언츠", pick: "한화 승", confidence: 60 },
  { name: "축구도사", kind: "인간" as const, match: "맨시티 vs 리버풀", pick: "리버풀 승", confidence: 66 },
  { name: "토토왕", kind: "인간" as const, match: "한화 이글스 vs 롯데 자이언츠", pick: "한화 승", confidence: 62 },
];

export const leaguePickHistory: LeaguePick[] = [
  { id: "lp-001", date: "2026-06-08", participant: "GPT", kind: "AI", sport: "야구", match: "한화 이글스 vs 롯데 자이언츠", pick: "한화 승", result: "한화 5:4 롯데", hit: true, confidence: 63 },
  { id: "lp-002", date: "2026-06-08", participant: "축구도사", kind: "인간", sport: "축구", match: "맨시티 vs 리버풀", pick: "리버풀 승", result: "대기중", hit: false, confidence: 66 },
  { id: "lp-003", date: "2026-06-07", participant: "Gemini", kind: "AI", sport: "농구", match: "서울 SK vs 부산 KCC", pick: "서울 SK 승", result: "서울 SK 88:82 부산 KCC", hit: true, confidence: 67 },
  { id: "lp-004", date: "2026-06-07", participant: "토토왕", kind: "인간", sport: "축구", match: "울산 HD vs 포항", pick: "무승부", result: "울산 1:0 포항", hit: false, confidence: 59 },
  { id: "lp-005", date: "2026-06-06", participant: "Grok", kind: "AI", sport: "e스포츠", match: "T1 vs Gen.G", pick: "Gen.G 승", result: "T1 1:2 Gen.G", hit: true, confidence: 60 },
  { id: "lp-006", date: "2026-06-06", participant: "Claude", kind: "AI", sport: "배구", match: "대한민국 vs 브라질", pick: "브라질 승", result: "대한민국 0:3 브라질", hit: true, confidence: 69 },
  { id: "lp-007", date: "2026-06-05", participant: "DeepSeek", kind: "AI", sport: "야구", match: "LG 트윈스 vs KIA 타이거즈", pick: "LG 승", result: "LG 5:3 KIA", hit: true, confidence: 66 },
  { id: "lp-008", date: "2026-06-05", participant: "야구고수", kind: "인간", sport: "야구", match: "LG 트윈스 vs KIA 타이거즈", pick: "LG 승", result: "LG 5:3 KIA", hit: true, confidence: 64 },
  { id: "lp-009", date: "2026-06-04", participant: "농구황제", kind: "인간", sport: "농구", match: "원주 DB vs 창원 LG", pick: "언더", result: "DB 81:77 LG", hit: true, confidence: 61 },
];
