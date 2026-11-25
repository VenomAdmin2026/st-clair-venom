
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

    events: []

  });

  calendar.render();

  calendarStatus.textContent = "";

});
