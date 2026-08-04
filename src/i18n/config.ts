import en from "../../messages/en.json";
import ko from "../../messages/ko.json";
import zh from "../../messages/zh.json";
import ja from "../../messages/ja.json";
import de from "../../messages/de.json";
import fr from "../../messages/fr.json";
import pt from "../../messages/pt.json";
import es from "../../messages/es.json";
import vi from "../../messages/vi.json";
import ar from "../../messages/ar.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";
import it from "../../messages/it.json";
import hi from "../../messages/hi.json";
import id from "../../messages/id.json";

export const locales = ["ko", "en", "zh", "ja", "de", "fr", "pt", "es", "vi", "ar", "ru", "tr", "it", "hi", "id"] as const;
export type Locale = (typeof locales)[number];
export type Messages = Record<string, unknown>;

export const defaultLocale: Locale = "en";
export const messages: Record<Locale, Messages> = { ko, en, zh, ja, de, fr, pt, es, vi, ar, ru, tr, it, hi, id };

const communityCopy: Record<"en" | "ko", Record<string, string>> = {
  en: { title: "Community", description: "Share game analysis and AI betting opinions freely—no account required.", all: "All", free: "General", gameAnalysis: "Game Analysis", aiDiscussion: "AI Discussion", category: "Category", postTitle: "Title", content: "Content", nickname: "Nickname", password: "Password", passwordHint: "4 or more characters", passwordNotice: "This password is required to edit or delete your post. It is stored only as a secure hash.", passwordToEdit: "Enter the password used when this post was created.", passwordToDelete: "Enter the post password.", passwordToDeleteComment: "Enter the comment password.", deleteConfirm: "Delete this post and all its comments?", write: "Write a post", writeDescription: "Choose a nickname and password. No registration is required.", publish: "Publish", saving: "Saving…", update: "Update", cancel: "Cancel", edit: "Edit", delete: "Delete", editPost: "Edit post", postedAt: "Posted", comments: "Comments", addComment: "Add comment", commentPlaceholder: "Write a comment", noComments: "No comments yet.", backToList: "Back to list", error: "Something went wrong. Please try again.", empty: "No posts yet.", emptyDesc: "Be the first to start a conversation.", operatorBadge: "Operator", pinnedBadge: "Pinned" },
  ko: { title: "커뮤니티", description: "회원가입 없이 경기 분석과 AI 베팅 의견을 자유롭게 나누세요.", all: "전체", free: "자유", gameAnalysis: "경기분석", aiDiscussion: "AI 토론", category: "카테고리", postTitle: "제목", content: "내용", nickname: "닉네임", password: "비밀번호", passwordHint: "4자리 이상 문자 또는 숫자", passwordNotice: "작성 시 입력한 비밀번호는 수정·삭제에 필요하며 안전한 해시로만 저장됩니다.", passwordToEdit: "게시글 작성 시 입력한 비밀번호를 입력하세요.", passwordToDelete: "게시글 비밀번호를 입력하세요.", passwordToDeleteComment: "댓글 비밀번호를 입력하세요.", deleteConfirm: "게시글과 댓글을 모두 삭제할까요?", write: "글쓰기", writeDescription: "닉네임과 비밀번호만 입력하면 회원가입 없이 작성할 수 있습니다.", publish: "등록", saving: "저장 중…", update: "수정 완료", cancel: "취소", edit: "수정", delete: "삭제", editPost: "게시글 수정", postedAt: "작성", comments: "댓글", addComment: "댓글 등록", commentPlaceholder: "댓글을 입력하세요", noComments: "아직 댓글이 없습니다.", backToList: "목록으로", error: "처리 중 오류가 발생했습니다. 다시 시도해주세요.", empty: "등록된 게시글이 없습니다.", emptyDesc: "첫 번째 이야기를 남겨보세요.", operatorBadge: "운영자", pinnedBadge: "공지" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function getMessage(locale: Locale, key: string, values?: Record<string, string | number>) {
  const communityKey = key.startsWith("community.") ? key.slice("community.".length) : "";
  const communityValue = communityKey ? communityCopy[locale === "ko" ? "ko" : "en"][communityKey] : undefined;
  const value = key.split(".").reduce<unknown>((current, part) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[part];
  }, messages[locale]);
  const fallback = key.split(".").reduce<unknown>((current, part) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[part];
  }, messages.en);
  const text = communityValue ?? (typeof value === "string" ? value : typeof fallback === "string" ? fallback : key);
  return Object.entries(values ?? {}).reduce((result, [name, replacement]) => result.replaceAll(`{${name}}`, String(replacement)), text);
}

export function localizeSport(locale: Locale, sport: string) {
  const keys: Record<string, string> = { "축구": "sports.soccer", "야구": "sports.baseball", "농구": "sports.basketball", "E스포츠": "sports.esports", "e스포츠": "sports.esports", "배구": "sports.volleyball", "아이스하키": "sports.hockey", "미식축구": "sports.football" };
  return keys[sport] ? getMessage(locale, keys[sport]) : sport;
}

export function localizeMarket(locale: Locale, market: string) {
  const normalized = market.toLowerCase();
  if (market === "핸디캡" || normalized === "spread") return getMessage(locale, "markets.spread");
  if (market === "언더오버" || normalized === "total") return getMessage(locale, "markets.total");
  if (market === "승무패" || normalized === "moneyline") return getMessage(locale, "markets.moneyline");
  return market;
}
