# St. Clair Venom — hybrid organization website

This is a working, responsive **public website**. It is not a hosted login system. Private discussions are handled through an external invitation-only platform. Coaches can manage live calendars and submit changes for admin approval without touching code.

## Setup (under $50/year)

1. Upload `index.html`, `style.css`, and `script.js` to a public GitHub repository. In Settings > Pages, deploy from `main` / root. Free GitHub Pages is for a **public** site; do not upload sensitive player data or private documents.
2. Test the free `github.io` URL first. Optionally buy a domain (typical .com roughly $12–25/year, check renewal price) and configure it in GitHub Pages. No domain is required.
3. Edit the `teams`, `events`, `hubEvents`, `hubResources`, and `teamServices` data in `script.js` for real teams. The site is configured for 8U and 14U only. Use parent/guardian permission for player names/photos.
4. Create one Google Calendar per team, plus an optional organization calendar. Give coaches **Make changes to events** permission on their own calendar only. For events meant to appear on the public site, configure a **public calendar** and copy its Google Calendar embed URL into `hybridSettings.teamCalendars` (or `organizationCalendar`). Do NOT put private player information, addresses, or family details in public calendar events. If you need private scheduling, share calendars directly with approved families instead of embedding them here.
5. Create a Google Form for coach updates (team, update type, title, URL, proposed date, notes). Limit editing of the response spreadsheet to administrators. Paste the *respondent* URL into `hybridSettings.coachSubmissionForm`. The administrator reviews submissions and posts approved video links/announcements in `script.js`. Form submission **does not automatically publish**.
6. Create one organization-wide announcements Google Group (admin-only posting), and **two invitation-only Google Groups per team**: a family discussion group and a coaches-only planning group. Add URLs to `hybridSettings.organizationGroup`, `hybridSettings.teamGroups`, and `hybridSettings.coachGroups`. Configure membership, message visibility, and posting permissions **inside Google Groups**. Coaches-only groups must allow only assigned coaches and authorized organization administrators; disable public joining and use invitation/approval. Never put private messages or confidential player information on the public website. The public Coaches Hub link does not itself grant access. For youth players, prefer parent/guardian-managed communication.
7. For payments, verify each recipient directly with the coach and put their approved Venmo URL in `teamServices`. Add a QR image under `images/` and its relative path to the `qr` field if desired. Use a dedicated organization account when possible; Venmo may impose age/account restrictions and payment fees. Never post bank credentials. Confirm what fees and business account requirements apply.
8. Add each team's official GameChanger and USSSA URL in `teamServices`.

## Division of responsibility

- **Organization admin:** Owns GitHub repo/domain; controls public branding, rosters, sponsors, tryouts, payment recipient/QR, and approves submitted videos or announcements.
- **Coaches:** Edit only their assigned Google Calendars, submit video/announcement suggestions through Google Forms, and moderate their team discussion groups.
- **Parents/players:** Read public schedules, access approved development resources, and participate in invitation-only discussions if permitted. No public player logins are created by this site.

## Important limitations

- Public GitHub Pages cannot securely store passwords, private messages, or confidential player records. The website links to Google Groups; it does **not** implement an in-site message board or login dashboard.
- Public Google Calendar embeds expose event details to everyone. Use non-sensitive event data only.
- Google Forms submissions are not automatically reflected on the site. Admin approval/editing is required.
- This site is mobile responsive but not yet an installable offline PWA or native mobile app.
- Verify Google Groups and Google Calendar availability, service terms, Venmo account suitability, and domain prices before launch.
