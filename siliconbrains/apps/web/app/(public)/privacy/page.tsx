import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & Policy",
  description:
    "How SiliconBrains collects, uses, stores, shares and protects personal data.",
};

// TODO before launch: replace these two placeholders (Section 16).
const OFFICER_NAME = "Mohit Shivankar";
const REGISTERED_ADDRESS = "Nagpur, India";

type Block = { type: "p"; text: string } | { type: "ul"; items: string[] };
type Section = { title: string; blocks: Block[] };

const p = (text: string): Block => ({ type: "p", text });
const ul = (...items: string[]): Block => ({ type: "ul", items });

const SECTIONS: Section[] = [
  {
    title: "Who We Are",
    blocks: [
      p(
        "SiliconBrains is an independent web engineering practice led by a Senior Web Engineer. For the purposes of applicable data protection law, we act as the Data Fiduciary / Data Controller of personal data collected through the Website."
      ),
      ul(
        "Business name: SiliconBrains (Silicon Brains)",
        "Website: www.siliconbrains.in",
        "Privacy contact: privacy@siliconbrains.in",
        "Location: Nagpur, India, 440034"
      ),
    ],
  },
  {
    title: "Information We Collect",
    blocks: [
      p("We collect only the information needed to operate the Website and deliver our services."),
      ul(
        "Information you provide: name, email address, phone number, company name, project details, budget and timeline, and any files or messages you send through contact forms, email or chat.",
        "Client project data: credentials, repository access, content, analytics or user data that you share with us while we deliver a project. This is handled under Section 8.",
        "Technical data collected automatically: IP address, browser type and version, device type, operating system, referring page, pages viewed, time spent, and approximate location derived from IP.",
        "Cookies and similar technologies: see Section 5.",
        "Communications: records of emails, calls and meetings relating to enquiries and engagements.",
        "Payment and billing data: invoicing details only. Card or bank details are processed by third-party payment providers and are not stored on our servers."
      ),
    ],
  },
  {
    title: "How We Use Your Information",
    blocks: [
      ul(
        "To respond to enquiries, prepare proposals and quotations, and deliver contracted services.",
        "To operate, secure, debug and improve the Website and its performance.",
        "To send project updates, invoices, and service-related notices.",
        "To send newsletters or marketing messages only where you have opted in; you can withdraw at any time.",
        "To analyse aggregated usage and understand how visitors use the Website.",
        "To detect, prevent and respond to fraud, abuse, spam and security incidents.",
        "To comply with legal, tax and accounting obligations and to enforce our agreements."
      ),
    ],
  },
  {
    title: "Legal Basis for Processing",
    blocks: [
      p(
        "Depending on your location, we process personal data on one or more of the following bases: your consent (including consent under the Digital Personal Data Protection Act, 2023 of India); performance of a contract or steps taken at your request before entering a contract; our legitimate interests in running and securing a professional services business; and compliance with legal obligations."
      ),
    ],
  },
  {
    title: "Cookies and Tracking Technologies",
    blocks: [
      p("Cookies are small text files stored on your device. We use the following categories:"),
      ul(
        "Strictly necessary: required for security, load balancing and core site functionality.",
        "Preferences: remember settings such as theme or language.",
        "Analytics: help us understand traffic and performance, using privacy-respecting configurations where possible.",
        "Marketing: used only with your consent."
      ),
      p(
        "You can control or delete cookies through your browser settings or our cookie banner. Blocking some cookies may affect how the Website works."
      ),
    ],
  },
  {
    title: "Third-Party Services",
    blocks: [
      p(
        "We rely on trusted providers to run the Website and our services. These may include hosting and CDN providers, analytics tools, email and form-handling services, code hosting platforms, error monitoring, scheduling tools and payment processors. They process data only on our instructions or under their own privacy terms, and only as needed to provide their service. We do not sell your personal data. The Website may link to external sites; we are not responsible for their privacy practices."
      ),
    ],
  },
  {
    title: "Sharing and Disclosure",
    blocks: [
      p(
        "We share personal data only: (a) with service providers described above; (b) with professional advisers such as accountants and lawyers under confidentiality; (c) where required by law, court order or government authority; (d) to protect our rights, safety or property; and (e) in connection with a business transfer, with notice to you where required."
      ),
    ],
  },
  {
    title: "Client Project Data and Confidentiality",
    blocks: [
      p(
        "When we work on a client's website or application, we may access source code, databases, credentials and end-user data belonging to the client. In that case the client remains responsible for the data and we act as a processor on its behalf. We will:"
      ),
      ul(
        "access only the data necessary to perform the agreed work;",
        "keep credentials in secure password managers and never commit them to public repositories;",
        "use production data for testing only when unavoidable, and anonymise it wherever possible;",
        "revoke access and delete project copies within a reasonable period after project completion, unless retention is agreed in writing;",
        "report any confirmed breach affecting client data without undue delay."
      ),
    ],
  },
  {
    title: "International Data Transfers",
    blocks: [
      p(
        "Our providers may store or process data in countries other than your own, including outside India. Where required, we use appropriate safeguards such as contractual protections to ensure your data receives an adequate level of protection."
      ),
    ],
  },
  {
    title: "Data Retention",
    blocks: [
      p(
        "We keep personal data only as long as necessary for the purposes described. Typical periods: enquiry and contact records up to 24 months after last contact; client engagement records for the duration of the contract and up to 8 years afterwards for tax and legal compliance; analytics data in aggregated or anonymised form; marketing subscriptions until you unsubscribe. We securely delete or anonymise data when it is no longer required."
      ),
    ],
  },
  {
    title: "Data Security",
    blocks: [
      p(
        "We apply reasonable technical and organisational measures, including HTTPS/TLS encryption in transit, access controls and least-privilege permissions, multi-factor authentication on key accounts, regular software updates and dependency patching, and backups. No method of transmission or storage is completely secure, so we cannot guarantee absolute security."
      ),
    ],
  },
  {
    title: "Your Rights",
    blocks: [
      p(
        "Subject to applicable law (including the DPDP Act 2023 in India, the GDPR/UK GDPR in Europe and the CCPA/CPRA in California), you may have the right to:"
      ),
      ul(
        "access the personal data we hold about you and obtain a summary of it;",
        "correct inaccurate or incomplete data and request erasure of data no longer needed;",
        "withdraw consent at any time, without affecting earlier lawful processing;",
        "object to or restrict certain processing, and request data portability;",
        "nominate another person to exercise your rights in the event of death or incapacity (India);",
        "lodge a grievance with us or a complaint with your local data protection authority."
      ),
      p(
        "To exercise any right, email privacy@siliconbrains.in. We may need to verify your identity and will respond within the period required by law, generally within 30 days."
      ),
    ],
  },
  {
    title: "Children's Privacy",
    blocks: [
      p(
        "The Website is intended for businesses and adults. We do not knowingly collect personal data from children under 18 without verifiable parental consent. If you believe a child has provided us data, contact us and we will delete it promptly."
      ),
    ],
  },
  {
    title: "Do Not Track and Marketing Choices",
    blocks: [
      p(
        "We aim to respect browser Do Not Track and Global Privacy Control signals where technically feasible. Every marketing email includes an unsubscribe link."
      ),
    ],
  },
  {
    title: "Changes to This Policy",
    blocks: [
      p(
        'We may update this Policy from time to time. The "Effective Date" at the top shows when it was last revised. Material changes will be highlighted on the Website or communicated by email. Continued use of the Website after an update means you accept the revised Policy.'
      ),
    ],
  },
  {
    title: "Grievance Officer and Contact",
    blocks: [
      p("For questions, requests or grievances about this Policy or your personal data, contact:"),
      ul(
        `Grievance / Privacy Officer: ${OFFICER_NAME}, Senior Web Engineer, SiliconBrains`,
        "Email: privacy@siliconbrains.in",
        `Address: ${REGISTERED_ADDRESS}, Nagpur, India, 440034`,
        "Response time: acknowledgement within 72 hours; resolution within 30 days"
      ),
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-24 text-on-surface">
      <header className="border-b border-outline pb-8">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-on-surface-variant">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Privacy & Policy</h1>
        <p className="mt-4 text-sm text-on-surface-variant">
          Effective date: 13 October 2026 · Document reference: SB-PP-0001
        </p>
        <p className="mt-6 leading-relaxed text-on-surface-variant">
          This Privacy & Policy explains how SiliconBrains (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) collects,
          uses, stores, shares and protects personal data when you visit www.siliconbrains.in (the &ldquo;Website&rdquo;),
          contact us, or engage us for web engineering services such as web application development, front-end and
          back-end engineering, API integration, performance optimisation, hosting and maintenance. By using the Website
          you acknowledge that you have read and understood this Policy.
        </p>
      </header>

      <nav aria-label="Contents" className="mt-8 rounded-lg border border-outline bg-surface-container p-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-on-surface-variant">Contents</p>
        <ol className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
          {SECTIONS.map((s, i) => (
            <li key={s.title}>
              <a href={`#section-${i + 1}`} className="text-on-surface-variant transition-colors hover:text-primary">
                {i + 1}. {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 space-y-10">
        {SECTIONS.map((s, i) => (
          <section key={s.title} id={`section-${i + 1}`} className="scroll-mt-28">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              {i + 1}. {s.title}
            </h2>
            <div className="mt-3 space-y-3 leading-relaxed text-on-surface-variant">
              {s.blocks.map((b, j) =>
                b.type === "p" ? (
                  <p key={j}>{b.text}</p>
                ) : (
                  <ul key={j} className="list-disc space-y-2 pl-5 marker:text-primary">
                    {b.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )
              )}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-14 border-t border-outline pt-6 text-xs text-on-surface-variant">
        Doc. Ref: SB-PP-0001 · SiliconBrains
      </footer>
    </main>
  );
}