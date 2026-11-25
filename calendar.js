
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
    dateClick: async function(info) {

  if (await checkCalendarAdmin()) {
    openCreateEvent(info.dateStr.slice(0, 10));
  }

},

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
  
const eventDialog =
  document.getElementById("calendarEventDialog");

const eventForm =
  document.getElementById("calendarEventForm");

function updateEventTimeFields() {

  const allDay =
    document.getElementById("eventAllDay").checked;

  document.getElementById("eventStartTimeGroup").hidden = allDay;

  document.getElementById("eventEndTimeGroup").hidden = allDay;

  document.getElementById("eventStartTime").required = !allDay;

}

function openCreateEvent(selectedDate) {

  eventForm.reset();

  document.getElementById("calendarEventId").value = "";

  document.getElementById("calendarFormTitle").textContent =
    "CREATE EVENT";

  document.getElementById("calendarFormMessage").textContent = "";

  document.getElementById("calendarFormMessage").className = "";

  document.getElementById("deleteCalendarEvent").hidden = true;

  const defaultDate = selectedDate ||
    luxon.DateTime.now()
      .setZone("America/Chicago")
      .toISODate();

  document.getElementById("eventStartDate").value = defaultDate;

  document.getElementById("eventEndDate").value = defaultDate;

  const selectedTeam =
    document.getElementById("calendarTeam").value;

  document.getElementById("eventTeam").value =
    selectedTeam === "all"
      ? "Organization"
      : selectedTeam;

  document.getElementById("eventStatus").value = "Scheduled";

  updateEventTimeFields();

  if (!eventDialog.open) {
    eventDialog.showModal();
  }

}

function openEditEvent(calendarEvent) {

  eventForm.reset();

  const field = id =>
    document.getElementById(id);

  const props = calendarEvent.extendedProps;
  const DateTime = luxon.DateTime;
  const zone = "America/Chicago";

  field("calendarEventId").value = calendarEvent.id;

  field("calendarFormTitle").textContent =
    "EDIT EVENT";

  field("calendarFormMessage").textContent = "";
  field("calendarFormMessage").className = "";

  field("eventTitle").value = calendarEvent.title;
  field("eventTeam").value = props.team;
  field("eventType").value = props.eventType;
  field("eventAllDay").checked = calendarEvent.allDay;

  field("eventLocation").value = props.location || "";
  field("eventDescription").value = props.description || "";
  field("eventStatus").value = props.status || "Scheduled";

  if (calendarEvent.allDay) {

    const start = DateTime.fromISO(
      calendarEvent.startStr,
      { zone }
    );

    const end = calendarEvent.endStr
      ? DateTime.fromISO(
          calendarEvent.endStr,
          { zone }
        ).minus({ days: 1 })
      : start;

    field("eventStartDate").value = start.toISODate();
    field("eventEndDate").value = end.toISODate();

    field("eventStartTime").value = "";
    field("eventEndTime").value = "";

  } else {

    const start = DateTime.fromJSDate(
      calendarEvent.start,
      { zone }
    );

    const end = calendarEvent.end
      ? DateTime.fromJSDate(
          calendarEvent.end,
          { zone }
        )
      : start.plus({ hours: 1 });

    field("eventStartDate").value = start.toISODate();
    field("eventStartTime").value = start.toFormat("HH:mm");

    field("eventEndDate").value = end.toISODate();
    field("eventEndTime").value = end.toFormat("HH:mm");

  }

  field("deleteCalendarEvent").hidden = false;

  updateEventTimeFields();

  if (!eventDialog.open) {
    eventDialog.showModal();
  }

}
calendar.on("eventClick", async info => {

  if (await checkCalendarAdmin()) {

    openEditEvent(info.event);

  }

});
  document.getElementById("deleteCalendarEvent")
  .addEventListener("click", async () => {

    if (!(await checkCalendarAdmin())) {
      return;
    }

    const eventId =
      document.getElementById("calendarEventId").value;

    if (!eventId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this event? " +
      "This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    const deleteButton =
      document.getElementById("deleteCalendarEvent");

    deleteButton.disabled = true;

    try {
      const { error } = await supabase
        .from("venom_calendar_events")
        .delete()
        .eq("id", eventId)
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      eventDialog.close();
      calendar.refetchEvents();

    } catch (error) {
      console.error("Calendar deletion failed:", error);
      alert("Unable to delete event: " + error.message);

    } finally {
      deleteButton.disabled = false;
    }

  });
document.getElementById("addCalendarEvent")
  .addEventListener("click", async () => {

    if (await checkCalendarAdmin()) {
      openCreateEvent();
    }

  });

document.getElementById("closeCalendarEvent")
  .addEventListener("click", () => {

    eventDialog.close();

  });

document.getElementById("eventAllDay")
  .addEventListener("change", updateEventTimeFields);

document.getElementById("eventStartDate")
  .addEventListener("change", () => {

    const startDate =
      document.getElementById("eventStartDate").value;

    const endDate =
      document.getElementById("eventEndDate");

    if (!endDate.value || endDate.value < startDate) {
      endDate.value = startDate;
    }

  });


eventForm.addEventListener("submit", async event => {

  event.preventDefault();

  const message =
    document.getElementById("calendarFormMessage");

  const saveButton =
    document.getElementById("saveCalendarEvent");

  const value = id =>
    document.getElementById(id).value;

  saveButton.disabled = true;
  message.textContent = "Saving event...";

  try {

    if (!(await checkCalendarAdmin())) {
      throw new Error("Administrator access required.");
    }

    const eventId = value("calendarEventId");

    const allDay =
      document.getElementById("eventAllDay").checked;

    const startDate = value("eventStartDate");
    const endDate = value("eventEndDate") || startDate;

    const DateTime = luxon.DateTime;
    const zone = "America/Chicago";

    let start;
    let end;

    if (allDay) {

      start = DateTime.fromISO(startDate, { zone });

      end = DateTime.fromISO(endDate, { zone })
        .plus({ days: 1 });

    } else {

      const startTime = value("eventStartTime");
      const endTime = value("eventEndTime");

      if (!startTime) {
        throw new Error("Please enter a start time.");
      }

      start = DateTime.fromISO(
        startDate + "T" + startTime,
        { zone }
      );

      end = endTime
        ? DateTime.fromISO(
            endDate + "T" + endTime,
            { zone }
          )
        : start.plus({ hours: 1 });

    }

    if (!start.isValid || !end.isValid) {
      throw new Error("Please enter valid event dates.");
    }

    if (end <= start) {
      throw new Error("End must be after start.");
    }

    const title = value("eventTitle").trim();

    if (!title) {
      throw new Error("Please enter an event title.");
    }

    const eventData = {
      title: title,
      team: value("eventTeam"),
      event_type: value("eventType"),
      start_at: start.toUTC().toISO(),
      end_at: end.toUTC().toISO(),
      all_day: allDay,
      location: value("eventLocation").trim(),
      description: value("eventDescription").trim(),
      status: value("eventStatus")
    };

    const { error } = eventId
  ? await supabase
      .from("venom_calendar_events")
      .update(eventData)
      .eq("id", eventId)
      .select("id")
      .single()
  : await supabase
      .from("venom_calendar_events")
      .insert(eventData);

    if (error) {
      throw error;
    }

    message.textContent = "Event saved successfully.";

    eventDialog.close();
    calendar.refetchEvents();

  } catch (error) {

    console.error("Calendar save error:", error);

    message.textContent =
      error.message || "Unable to save event.";

  } finally {

    saveButton.disabled = false;

  }

});


  document.getElementById("calendarTeam")
  .addEventListener("change", () => {
    calendar.refetchEvents();
  });

  calendarStatus.textContent = "";

});

async function testRegistrationEmail() {

  const { data: isAdmin, error: adminError } =
    await supabase.rpc("venom_is_admin");

  if (adminError || isAdmin !== true) {
    return;
  }

  const testButton = document.createElement("button");

  testButton.textContent = "Test Registration Email";
  testButton.style.margin = "15px";
  testButton.style.padding = "10px";

  testButton.addEventListener("click", async () => {

    testButton.disabled = true;

    try {

      const { data, error } =
        await supabase.functions.invoke(
          "venom-registration",
          { body: { test: true } }
        );

      if (error) {
        throw error;
      }

      alert(data.message || "Test completed.");

    } catch (error) {

      alert("Email test failed: " + error.message);

    } finally {

      testButton.disabled = false;

    }

  });

  document.getElementById("calendarAdminControls")
    .appendChild(testButton);

}

testRegistrationEmail();
