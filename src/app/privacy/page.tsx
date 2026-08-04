import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument, LegalLabel, LegalList } from "@/components/legal/LegalDocument";

export const metadata: Metadata = { title: "Privacy Policy — ScoreHub" };

const LAST_UPDATED = "2026-08-04";

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      eyebrow="Legal"
      lastUpdated={LAST_UPDATED}
      intro={
        <p>
          This Privacy Policy explains how ScoreHub (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) collects, uses, and protects information
          when you use our website.
        </p>
      }
      sections={[
        {
          heading: "1. Information We Collect",
          body: (
            <>
              <LegalLabel>Automatically collected:</LegalLabel>
              <LegalList
                items={[
                  "Locale/language preference (stored via cookie, valid for 1 year)",
                  "General location signals used only to suggest a default language (e.g., country-level IP geolocation); we do not store precise location data",
                  "Standard web server logs (may include IP address, browser type, pages visited) retained by our hosting provider (Vercel) per their standard practices",
                ]}
              />
              <LegalLabel>Community board:</LegalLabel>
              <LegalList
                items={[
                  <>
                    If you post on the Community board, we store your chosen nickname and a{" "}
                    <strong className="font-black text-slate-900">hashed</strong> (not plaintext) version of your password, used only to verify
                    edits/deletions of your own posts
                  </>,
                  <>
                    Your IP address is stored in <strong className="font-black text-slate-900">hashed form</strong> (not the raw address) to
                    apply basic spam-prevention rate limiting; it is not linked to your posts publicly
                  </>,
                ]}
              />
              <LegalLabel>We do not collect:</LegalLabel>
              <LegalList
                items={[
                  "Real names, email addresses, phone numbers, or payment information (ScoreHub does not process any real-money transactions)",
                  "Precise/real-time location data",
                ]}
              />
            </>
          ),
        },
        {
          heading: "2. How We Use Information",
          body: (
            <LegalList
              items={[
                "To remember your language preference across visits",
                "To let you manage (edit/delete) your own community posts",
                "To prevent spam and abuse on the community board",
                "To operate, maintain, and improve the Site",
              ]}
            />
          ),
        },
        {
          heading: "3. Third-Party Services",
          body: (
            <>
              <p>ScoreHub relies on the following third-party services, each with their own privacy practices:</p>
              <LegalList
                items={[
                  <><strong className="font-black text-slate-900">Vercel</strong> (hosting)</>,
                  <><strong className="font-black text-slate-900">Supabase</strong> (database)</>,
                  <><strong className="font-black text-slate-900">TheSportsDB</strong> (team/league logos)</>,
                  <><strong className="font-black text-slate-900">The Odds API</strong> and <strong className="font-black text-slate-900">OddsPapi</strong> (sports odds data)</>,
                  <><strong className="font-black text-slate-900">OpenAI, Google (Gemini), Anthropic (Claude)</strong> (AI-generated content — API usage only, not user data sharing)</>,
                ]}
              />
              <p>We do not sell your data to third parties.</p>
            </>
          ),
        },
        {
          heading: "4. Cookies",
          body: (
            <>
              <p>We use a small number of cookies:</p>
              <LegalList
                items={[
                  <><strong className="font-black text-slate-900">Locale cookie</strong>: remembers your selected display language (1-year expiry)</>,
                  <><strong className="font-black text-slate-900">Admin session cookie</strong>: used only for site administrators to access the admin console (httpOnly, not accessible to regular visitors)</>,
                ]}
              />
              <p>
                We do not use third-party advertising or tracking cookies at this time. If advertising is introduced in the future, this policy
                will be updated accordingly.
              </p>
            </>
          ),
        },
        {
          heading: "5. Data Retention",
          body: <p>Community post content and hashed identifiers are retained until the post is deleted by its author or removed by an administrator.</p>,
        },
        {
          heading: "6. Your Rights",
          body: (
            <p>
              Depending on your jurisdiction, you may have rights to access, correct, or request deletion of information we hold about you.
              Since ScoreHub does not require account registration, most interactions are pseudonymous by design. For community post deletion
              requests, please use the password-protected delete function on your post.
            </p>
          ),
        },
        {
          heading: "7. Children's Privacy",
          body: <p>ScoreHub is not directed at children under 18 and we do not knowingly collect information from users under that age.</p>,
        },
        {
          heading: "8. Changes to This Policy",
          body: <p>We may update this Privacy Policy periodically. Material changes will be reflected with an updated &quot;Last updated&quot; date.</p>,
        },
        {
          heading: "9. Contact",
          body: (
            <p>
              For privacy-related questions, please reach out through the{" "}
              <Link href="/community" className="font-bold text-blue-700 underline">
                Community board
              </Link>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
