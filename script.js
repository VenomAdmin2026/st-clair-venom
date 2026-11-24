// EDIT TEAM DATA HERE. Add or remove entries in the teams array.
// Current Venom age groups: 8U and 14U.
// Publish minor player details/photos only with parent/guardian permission.
const teams = [
 {id:'venom-8u',age:'8U',name:'Venom 8U',season:'Team details coming soon',coaches:['Coach details coming soon'],players:[]},
 {id:'venom-14u',age:'14U',name:'Venom 14U',season:'Team details coming soon',coaches:['Coach details coming soon'],players:[]}
];
// Organization-wide events: add teamId to associate an event with a team.
const events = [
 {date:'TBD',title:'Upcoming Tournament',location:'Details to be announced',teamId:'venom-14u',status:'DETAILS SOON'},
 {date:'TBD',title:'Organization Event',location:'Date and location to be confirmed',teamId:null,status:'DETAILS SOON'}
];
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const teamById=id=>teams.find(t=>t.id===id);

const teamCards = document.getElementById('teamCards');

if (teamCards) {
  teamCards.innerHTML = teams.map(t => `
    <article class="team-card">
      <div class="team-monogram">V</div>
      <p class="eyebrow">${escapeHTML(t.age)} BASEBALL</p>
      <h3>${escapeHTML(t.name)}</h3>
      <p class="muted">${escapeHTML(t.season)}</p>
      <button class="team-button" data-team="${escapeHTML(t.id)}">
        VIEW TEAM ↗
      </button>
    </article>
  `).join('');
}

const detail = document.getElementById('teamDetails');
function showTeam(id){
  if (!detail) return;
  const t=teamById(id);if(!t)return;const te=events.filter(e=>e.teamId===id);detail.innerHTML=`<div class="section-head"><div><p class="eyebrow">TEAM PROFILE</p><h2>${escapeHTML(t.name)}</h2></div><button class="team-button" id="closeTeam">CLOSE ×</button></div><div class="team-info"><div><h3>COACHES</h3>${t.coaches.map(c=>`<p>${escapeHTML(c)}</p>`).join('')}</div><div><h3>ROSTER</h3>${t.players.length?t.players.map(pl=>`<p>#${escapeHTML(pl.number)} · ${escapeHTML(pl.name)} · ${escapeHTML(pl.position)}</p>`).join(''):'<p class="muted">Roster information coming soon.</p>'}</div><div><h3>UPCOMING EVENTS</h3>${te.length?te.map(e=>`<p>${escapeHTML(e.date)} · ${escapeHTML(e.title)}</p>`).join(''):'<p class="muted">Schedule coming soon.</p>'}</div></div>`;document.getElementById('closeTeam').addEventListener('click',()=>{detail.innerHTML='<p class="muted">Choose a team above to see its details.</p>'});detail.scrollIntoView({behavior:'smooth',block:'start'});}
document.querySelectorAll('[data-team]').forEach(b=>b.addEventListener('click',()=>showTeam(b.dataset.team)));

const eventsContainer = document.getElementById('events');

if (eventsContainer) {
  eventsContainer.innerHTML = events.map(e => `
    <article class="event">
      <div class="date">${escapeHTML(e.date)}</div>
      <div>
        <h3>${escapeHTML(e.title)}</h3>
        <p>
          ${escapeHTML(e.location)} ·
          ${escapeHTML(teamById(e.teamId)?.name || 'All teams')}
        </p>
      </div>
      <span class="tag">${escapeHTML(e.status)}</span>
    </article>
  `).join('');
}

const yearElement = document.getElementById('year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const menu = document.getElementById('menu');
const nav = document.getElementById('nav');

if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    });
  });
}


// TEAM HUB CONFIGURATION: Replace examples with real approved team information.
// For privacy, use a private, moderated platform for messaging, not public comments.
const hubEvents = [
 {teamId:'venom-8u',type:'Practice',date:'TBD',title:'Team practice',location:'Location to be confirmed'},
 {teamId:'venom-14u',type:'Practice',date:'TBD',title:'Team practice',location:'Location to be confirmed'},
 {teamId:'venom-14u',type:'Workout',date:'TBD',title:'Strength and mobility session',location:'Coach will announce details'},
 {teamId:'venom-14u',type:'Tournament',date:'TBD',title:'Upcoming tournament',location:'Details coming soon'}
];
const hubResources = [
 {teamId:'all',category:'Hitting',title:'Coach-selected hitting video (add link)',url:''},
 {teamId:'all',category:'Conditioning',title:'Coach-selected workout routine (add link)',url:''}
];
const teamServices = {
 // 'venom-14u': {gamechanger:'https://...',usssa:'https://...',venmo:'https://venmo.com/u/USERNAME',qr:'images/venmo-14u.png'}
};
const safeURL=(url,hosts)=>{try{const u=new URL(url);return u.protocol==='https:'&&hosts.some(h=>u.hostname===h||u.hostname.endsWith('.'+h))?u.href:null}catch{return null}};
const hubTeam=document.getElementById('hubTeam');const paymentTeam=document.getElementById('paymentTeam');

for (const t of teams) {
  for (const select of [hubTeam, paymentTeam]) {
    if (!select) continue;

    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = t.name;
    select.append(opt);
  }
}

function renderHub(){if (!hubTeam) return;const id=hubTeam.value;const filtered=hubEvents.filter(e=>id==='all'||e.teamId===id);document.getElementById('hubSchedules').innerHTML=filtered.length?filtered.map(e=>`<div class="hub-entry"><strong>${escapeHTML(e.type)} · ${escapeHTML(e.date)}</strong><p>${escapeHTML(e.title)} — ${escapeHTML(e.location)}</p></div>`).join(''):'<p class="muted">No events posted yet.</p>';
const vids=hubResources.filter(v=>v.teamId==='all'||id==='all'||v.teamId===id);document.getElementById('hubVideos').innerHTML=vids.map(v=>{const url=safeURL(v.url,['youtube.com','youtu.be']);return `<div class="hub-entry"><strong>${escapeHTML(v.category)}</strong><p>${url?`<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(v.title)} ↗</a>`:escapeHTML(v.title)}</p></div>`}).join('')||'<p class="muted">No videos posted yet.</p>';
const ids=id==='all'?teams.map(t=>t.id):[id];document.getElementById('hubLinks').innerHTML=ids.map(k=>{const t=teamById(k),s=teamServices[k]||{};return `<div class="hub-entry"><strong>${escapeHTML(t.name)}</strong><p>${[['GameChanger',safeURL(s.gamechanger,['gc.com','gamechanger.io'])],['USSSA',safeURL(s.usssa,['usssa.com'])]].map(([name,url])=>url?`<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${name} ↗</a>`:`${name}: link coming soon`).join(' · ')}</p></div>`}).join('')}
function renderPayment(){if (!paymentTeam) return;const id=paymentTeam.value;if(!id){document.getElementById('paymentDetails').innerHTML='<p class="muted">Select a team.</p>';return}const t=teamById(id),s=teamServices[id]||{},url=safeURL(s.venmo,['venmo.com']);const qr=s.qr&&/^images\/[a-zA-Z0-9_-]+\.(png|jpg|webp)$/.test(s.qr)?s.qr:null;document.getElementById('paymentDetails').innerHTML=`<h3>${escapeHTML(t.name)}</h3>${url?`<p><a class="btn" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">OPEN APPROVED VENMO ↗</a></p>${qr?`<img class="payment-qr" src="${escapeHTML(qr)}" alt="Approved Venmo payment QR code for ${escapeHTML(t.name)}">`:''}`:'<p class="muted">Venmo payment details have not been configured. Contact your coach for the verified payment information.</p>'}`}

if (hubTeam) {
  hubTeam.addEventListener('change', renderHub);
}

if (paymentTeam) {
  paymentTeam.addEventListener('change', renderPayment);
}

renderHub();
renderPayment();



// HYBRID ADMIN / COACH INTEGRATIONS
// Admin edits these settings in GitHub. Coaches edit their own Google Calendars
// and submit content through an admin-reviewed Google Form. No logins or
// private messaging are hosted on GitHub Pages.
const hybridSettings = {
  coachSubmissionForm: '', // Public-facing form URL (not an edit link)
  organizationCalendar: '', // Public Google Calendar embed URL, if approved
  organizationGroup: '', // Invite/request-access URL for moderated private group
  teamCalendars: {
    // 'venom-14u': 'https://calendar.google.com/calendar/embed?src=...'
  },
  teamGroups: {
    // 'venom-14u': 'https://groups.google.com/g/YOUR-FAMILY-GROUP'
  },
  coachGroups: {
    // 'venom-14u': 'https://groups.google.com/g/YOUR-COACHES-ONLY-GROUP'
  }
};
function verifiedExternal(url, hosts) { return safeURL(url, hosts); }
function renderHybrid() {  if (!hubTeam) return;
  const id = hubTeam.value;
  const cal = id === 'all' ? hybridSettings.organizationCalendar : hybridSettings.teamCalendars[id];
  const calUrl = verifiedExternal(cal, ['calendar.google.com']);
  const live = document.getElementById('liveCalendar');
  live.replaceChildren();
  if (calUrl && new URL(calUrl).pathname.includes('/calendar/embed')) {
    const frame = document.createElement('iframe');
    frame.src = calUrl;
    frame.title = 'Venom team calendar';
    frame.loading = 'lazy';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.style.cssText = 'width:100%;height:420px;border:0;border-radius:12px;background:#fff';
    live.append(frame);
  } else {
    live.textContent = 'Live calendar not connected yet. Check the schedule listings for current announcements.';
    live.className = 'muted';
  }
  const form = verifiedExternal(hybridSettings.coachSubmissionForm, ['docs.google.com','forms.gle']);
  document.getElementById('coachUpdates').innerHTML = form
    ? `<a class="btn outline" href="${escapeHTML(form)}" target="_blank" rel="noopener noreferrer">SUBMIT COACH UPDATE ↗</a>`
    : '<p class="muted">Coach submission form will appear once the administrator configures it.</p>';
  const community = document.getElementById('communityAccess');
  const organization = verifiedExternal(hybridSettings.organizationGroup, ['groups.google.com']);
  const family = verifiedExternal(hybridSettings.teamGroups[id], ['groups.google.com']);
  const coaches = verifiedExternal(hybridSettings.coachGroups[id], ['groups.google.com']);
  const link = (url, label) => url
    ? `<p><a class="btn outline" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${label} ↗</a></p>`
    : `<p class="muted">${label}: invitation and link available from the organization administrator.</p>`;
  community.innerHTML = id === 'all'
    ? `<h4>Organization announcements</h4>${link(organization, 'OPEN ORGANIZATION ANNOUNCEMENTS')}<p class="muted">Choose a team above for family and coaches-only groups.</p>`
    : `<h4>Organization announcements</h4>${link(organization, 'OPEN ORGANIZATION ANNOUNCEMENTS')}<h4>Team family discussion</h4>${link(family, 'OPEN FAMILY DISCUSSION')}<h4>Coaches-only planning</h4>${link(coaches, 'OPEN COACHES HUB')}<p class="muted">Coaches Hub access is restricted by the group's membership settings. A visible link does not grant access.</p>`;
}
if (hubTeam) {
  hubTeam.addEventListener('change', renderHybrid);
}
renderHybrid();

async function loadVenomData() {
  try {
    const response = await fetch("./venom-data.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Unable to load Venom data");
    }

    const data = await response.json();

    console.log("Venom website data loaded:", data);

    return data;
  } catch (error) {
    console.error("Venom data error:", error);
    return null;
  }
}

loadVenomData().then(data => {
  if (!data || !Array.isArray(data.teams)) return;

  for (const item of data.teams) {
    const team = teams.find(t => t.age === item.ageGroup);
    if (!team) continue;

    if (typeof item.name === "string" && item.name.trim()) {
      team.name = item.name;
    }

    if (typeof item.description === "string" &&
        item.description.trim()) {
      team.season = item.description;
    }

    if (typeof item.headCoach === "string" &&
        item.headCoach.trim()) {
      team.coaches = [item.headCoach];
    }
  }

  // Refresh the existing team cards with the JSON data.
  const teamCardElements = document.querySelectorAll(
  "#teamCards .team-card"
);

teamCardElements.forEach((card, index) => {
      const team = teams[index];
      if (!team) return;

      const heading = card.querySelector("h3");
      const description = card.querySelector(".muted");

      if (heading) heading.textContent = team.name;
      if (description) description.textContent = team.season;
    });

  // Refresh team names in the existing dropdowns.
  for (const select of [hubTeam, paymentTeam]) {if (!select) continue;
    for (const option of select.options) {
      const team = teamById(option.value);
      if (team) option.textContent = team.name;
    }
  }

  // Refresh the existing schedule and hub displays.
  document.querySelectorAll("#events .event").forEach((element, index) => {
    const event = events[index];
    if (!event) return;

    const description = element.querySelector("p");
    if (description) {
      description.textContent =
        event.location + " · " +
        (teamById(event.teamId)?.name || "All teams");
    }
  });

  renderHub();
  renderPayment();
  renderHybrid();

  console.log("Venom team cards updated successfully!");
});

/* St. Clair Venom 14U Photo Gallery */

const venom14uPhotos = [
  "Cancer awareness1.JPG",
  "Carson Ranger.jpeg",
  "Casey hit.JPG",
  "Go Go PowerRanger.jpeg",
  "Hayden pitch.JPG",
  "Hudson Hit.PNG",
  "Walking with Dale.PNG"
];

const venomGallery = document.getElementById("venom14uGallery");
const venomPhotoGrid = document.getElementById("venom14uPhotos");

if (venomGallery && venomPhotoGrid) {
  venomPhotoGrid.innerHTML = venom14uPhotos.map((filename, index) => {
    const photoURL = encodeURIComponent(filename);

    return `
      <a href="${photoURL}" target="_blank" rel="noopener noreferrer"
         aria-label="Open 14U team photo ${index + 1}">
        <img src="${photoURL}"
             alt="St. Clair Venom 14U team photo ${index + 1}"
             loading="lazy">
      </a>
    `;
  }).join("");

  // Display the gallery when a visitor selects a team.
  document.querySelectorAll('[data-team]').forEach(button => {
    button.addEventListener("click", () => {
      venomGallery.hidden = button.dataset.team !== "venom-14u";
    });
  });

  // Hide the gallery when the team details are closed.
  document.getElementById("teamDetails")?.addEventListener("click", event => {
    if (event.target.closest("#closeTeam")) {
      venomGallery.hidden = true;
    }
  });
}


