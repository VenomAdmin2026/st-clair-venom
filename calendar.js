
import { createClient } from
  "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://fywijrfymmhctxfvawnv.supabase.co";

const SUPABASE_KEY = "sb_publishable_SD1rKRGdb7kX0XLTe7ilwg_-enZFxzb";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

console.log("Venom calendar Supabase client initialized");

async function testCalendarConnection() {

  const { data, error } = await supabase
    .from("venom_calendar_events")
    .select("id", { count: "exact" })
    .limit(1);

  if (error) {
    console.error("Calendar database connection failed:", error.message);
    return;
  }

  console.log("Calendar database connection successful");
  console.log("Calendar test results:", data);

}

testCalendarConnection();

async function checkCalendarAdmin() {

  const adminControls =
    document.getElementById("calendarAdminControls");

  adminControls.hidden = true;

  const { data: { user }, error: authError } =
    await supabase.auth.getUser();

  if (authError || !user) {
    console.log("Calendar access: Public visitor");
    return false;
  }

  const { data: profile, error } = await supabase
    .from("venom_profiles")
    .select("role, approved")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) {
    console.log("Calendar access: Public viewing only");
    return false;
  }

  const isAdmin =
    profile.approved === true &&
    profile.role === "admin";

  adminControls.hidden = !isAdmin;

  console.log(
    isAdmin
      ? "Calendar access: Authorized administrator"
      : "Calendar access: Read only"
  );

  return isAdmin;

}



document.addEventListener("DOMContentLoaded", () => {

  const calendarEl = document.getElementById("venomCalendar");
  const calendarStatus = document.getElementById("calendarStatus");

  if (!calendarEl) return;

  if (typeof FullCalendar === "undefined") {
    calendarStatus.textContent = "Unable to load the calendar.";
    return;
  }

  const calendar = new FullCalendar.Calendar(calendarEl, {

    initialView: "dayGridMonth",

timeZone: "America/Chicago",

    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,listMonth"
    },

    buttonText: {
      today: "Today",
      month: "Month",
      week: "Week",
      list: "List"
    },

    firstDay: 0,

    height: "auto",

    fixedWeekCount: false,

    showNonCurrentDates: true,

    nowIndicator: true,

    dayMaxEvents: true,

    editable: false,

    selectable: false,

    displayEventTime: true,

    eventTimeFormat: {
      hour: "numeric",
      minute: "2-digit",
      meridiem: "short"
    },

    noEventsContent: "No scheduled events.",

    
events: async function(fetchInfo, successCallback, failureCallback) {

  const { data, error } = await supabase
    .from("venom_calendar_events")
    .select("*")
    .order("start_at", { ascending: true });

  if (error) {
    console.error("Unable to load calendar events:", error.message);
    calendarStatus.textContent = "Unable to load calendar events.";
    failureCallback(error);
    return;
  }

  const selectedTeam =
  document.getElementById("calendarTeam").value;

const filteredEvents = data.filter(event =>
  selectedTeam === "all" ||
  event.team === selectedTeam ||
  event.team === "Organization"
);

const calendarEvents = filteredEvents.map(event => ({

    id: event.id,

    title: event.title,
  
backgroundColor:
  event.team === "8U" ? "#9333ea" :
  event.team === "14U" ? "#a3e635" :
  "#6b7280",

borderColor:
  event.team === "8U" ? "#c084fc" :
  event.team === "14U" ? "#84cc16" :
  "#9ca3af",

textColor:
  event.team === "14U" ? "#101015" :
  "#ffffff",


    start: event.all_day
      ? event.start_at.slice(0, 10)
      : event.start_at,

    end: event.end_at
      ? (event.all_day
        ? event.end_at.slice(0, 10)
        : event.end_at)
      : undefined,

    allDay: event.all_day,

    extendedProps: {
      team: event.team,
      eventType: event.event_type,
      location: event.location,
      description: event.description,
      status: event.status
    }

  }));

  console.log("Venom calendar events loaded:", calendarEvents.length);

  calendarStatus.textContent = "";

  successCallback(calendarEvents);

}


  });

  calendar.render();
  checkCalendarAdmin();
  document.getElementById("calendarTeam")
  .addEventListener("change", () => {
    calendar.refetchEvents();
  });

  calendarStatus.textContent = "";

});
