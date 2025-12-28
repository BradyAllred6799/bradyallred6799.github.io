document.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generate-plan-btn');
  const addToCalendarBtn = document.getElementById('add-to-calendar-btn');
  const dimensionDialog = document.getElementById('dimension-dialog');
  const dialogTitle = document.getElementById('dialog-title');
  const dialogSuggestions = document.getElementById('dialog-suggestions');
  const saveCloseBtn = document.getElementById('save-close-btn');
  const addActivityBtn = document.getElementById('add-activity-btn');
  const activitiesList = document.getElementById('activities-list');

  // Dimension data with suggestions
  const dimensionsData = {
    Emotional: "Suggested Activities: Talk to someone, reflect, journal, read, do something artistic, listen to music, work out, take a walk, cry it out, hug someone, laugh, take a nap.",
    Environmental: "Suggested Activities: Take a walk somewhere nice, breathe fresh air, enjoy the sun, avoid littering, pick up litter, reduce waste, use reusable products, recycle, clean your house, redesign a room.",
    Financial: "Suggested Activities: Develop a financial plan, cut back on unnecessary purchases, avoid credit card debt, ask for a raise when appropriate.",
    Intellectual: "Suggested Activities: Read, listen to audiobooks, watch documentaries, complete puzzles, be mindful, try something new, tap into creativity, take a class.",
    Occupational: "Suggested Activities: Learn a trade, get your degree, train for a promotion, polish your resume, apply for a job of interest, take on a task you enjoy.",
    Physical: "Suggested Activities: Work out daily, take a walk, eat for wellbeing, get an annual checkup, see the dentist, take medications as prescribed, avoid drugs/alcohol, get 7-9 hours of sleep.",
    Social: "Suggested Activities: Meet up with friends/family, keep in contact with old friends, volunteer, go out, have fun, engage in healthy social media use.",
    Spiritual: "Suggested Activities: Meditate, pray, reflect, practice yoga, visit a meaningful site, be mindful, consider your higher purpose, help others in need."
  };

  /**
   * Data structure:
   * userActivities[dimension] = [
   *   { description: string, date: "YYYY-MM-DD", time: "HH:MM" },
   *   ...
   * ]
   */
  const userActivities = {
    Emotional: [],
    Environmental: [],
    Financial: [],
    Intellectual: [],
    Occupational: [],
    Physical: [],
    Social: [],
    Spiritual: []
  };

  let currentDimension = null;

  // Dimension boxes
  const dimensionBoxes = document.querySelectorAll('.dimension-box');
  dimensionBoxes.forEach(box => {
    box.addEventListener('click', () => {
      currentDimension = box.dataset.dimension;
      openDimensionDialog(currentDimension);
    });
  });

  // Open the dimension dialog
  function openDimensionDialog(dimension) {
    dialogTitle.textContent = `${dimension} Wellness`;
    dialogSuggestions.textContent = dimensionsData[dimension];
    dimensionDialog.showModal();

    // Clear existing activity rows
    activitiesList.innerHTML = '';

    // Populate existing data for that dimension
    const entries = userActivities[dimension];
    entries.forEach(entry => {
      createActivityRow(entry.description, entry.date, entry.time);
    });
  }

  // Create a new row of activity inputs
  function createActivityRow(description = '', date = '', time = '') {
    const row = document.createElement('div');
    row.classList.add('activity-row');

    // 1) Activity Description (full width)
    const descDiv = document.createElement('div');
    descDiv.classList.add('activity-description');
    const descLabel = document.createElement('label');
    descLabel.textContent = 'Activity:';
    const descInput = document.createElement('input');
    descInput.type = 'text';
    descInput.value = description;
    descDiv.appendChild(descLabel);
    descDiv.appendChild(descInput);

    // 2) A container for date/time below the description
    const scheduleDiv = document.createElement('div');
    scheduleDiv.classList.add('activity-schedule');

    // Date
    const dateDiv = document.createElement('div');
    dateDiv.classList.add('activity-input');
    const dateLabel = document.createElement('label');
    dateLabel.textContent = 'Date:';
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.value = date;
    dateDiv.appendChild(dateLabel);
    dateDiv.appendChild(dateInput);

    // Time
    const timeDiv = document.createElement('div');
    timeDiv.classList.add('activity-input');
    const timeLabel = document.createElement('label');
    timeLabel.textContent = 'Time:';
    const timeInput = document.createElement('input');
    timeInput.type = 'time';
    timeInput.value = time;
    timeDiv.appendChild(timeLabel);
    timeDiv.appendChild(timeInput);

    // Add date/time to scheduleDiv
    scheduleDiv.appendChild(dateDiv);
    scheduleDiv.appendChild(timeDiv);

    // 3) Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-activity');
    deleteBtn.textContent = 'X';
    deleteBtn.addEventListener('click', () => {
      row.remove();
    });

    // Assemble the row
    row.appendChild(descDiv);
    row.appendChild(scheduleDiv);
    row.appendChild(deleteBtn);

    // Add to the activitiesList container
    activitiesList.appendChild(row);
  }

  // "Add Activity" button => new blank row
  addActivityBtn.addEventListener('click', () => {
    createActivityRow('', '', '');
  });

  // Save & Close
  saveCloseBtn.addEventListener('click', () => {
    if (!currentDimension) return;

    // Gather data from all rows
    const rows = activitiesList.querySelectorAll('.activity-row');
    const tempArray = [];
    rows.forEach(row => {
      const inputs = row.querySelectorAll('input');
      const descValue = inputs[0].value.trim();
      const dateValue = inputs[1].value; // "YYYY-MM-DD"
      const timeValue = inputs[2].value; // "HH:MM"

      if (descValue) {
        tempArray.push({
          description: descValue,
          date: dateValue,
          time: timeValue
        });
      }
    });

    // Store in userActivities
    userActivities[currentDimension] = tempArray;
    dimensionDialog.close();
  });

  // Generate Plan (Print)
  generateBtn.addEventListener('click', () => {
    let hasActivities = false;
    let planHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>My Self-Care Plan</title>
        <style>
          body { font-family: 'Lato', sans-serif; color: #2d3b45; padding: 20px; }
          h2 { font-weight: 700; }
          h3 { margin-top: 1em; font-size: 1.25rem; font-weight: 700; }
          p { margin-bottom: 1em; }
          .activity-time { color: #666; font-size: 0.9rem; }
        </style>
        <script>
          window.onload = function() {
            window.print();
          };
          window.onafterprint = function() {
            window.close();
          };
        </script>
      </head>
      <body>
        <h2>My Self-Care Plan</h2>
    `;

    for (const dim in userActivities) {
      const entries = userActivities[dim];
      if (entries.length > 0) {
        hasActivities = true;
        planHtml += `<h3>${dim} Wellness</h3>`;
        entries.forEach(({ description, date, time }) => {
          planHtml += `<p>- ${description}`;
          if (date || time) {
            planHtml += `<br><span class="activity-time">(${formatDateTimePretty(date, time)})</span>`;
          }
          planHtml += `</p>`;
        });
      }
    }

    if (!hasActivities) {
      planHtml += `<p>You have not added any custom activities.</p>`;
    }

    planHtml += `
      </body>
      </html>
    `;

    // Open a new window and write the plan HTML
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (printWindow) { // Check if the window was successfully opened
      printWindow.document.open();
      printWindow.document.write(planHtml);
      printWindow.document.close();
    } else {
      alert('Pop-up blocked! Please allow pop-ups for this website to print your Self-Care Plan.');
    }
  });

  // Add to Calendar (Generate ICS)
  addToCalendarBtn.addEventListener('click', () => {
    // Build multi-event ICS file content
    const icsContent = generateICSFile(userActivities);

    // Create a Blob from the ICS content
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    // Create a temporary URL
    const url = URL.createObjectURL(blob);

    // Create a hidden link to download the ICS file
    const link = document.createElement('a');
    link.href = url;
    link.download = 'MySelfCareActivities.ics';
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });

  /**
   * Generate a multi-event ICS file
   * If date/time is provided, we use that as a 1-hour event.
   * Otherwise, it's all-day for "today".
   */
  function generateICSFile(activitiesObj) {
    const now = formatDateTimeUTC(new Date()); // DTSTAMP
    let icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SelfCareTool//EN'
    ];

    for (const dimension in activitiesObj) {
      const list = activitiesObj[dimension];
      list.forEach(item => {
        const { description, date, time } = item;
        if (!description) return; // skip empty
        const uid = generateUID();

        icsLines.push('BEGIN:VEVENT');
        icsLines.push(`UID:${uid}`);
        icsLines.push(`DTSTAMP:${now}`);

        // If date/time provided, 1-hour event
        // If missing, all-day event for "today"
        if (date && time) {
          const startDateObj = parseDateTime(date, time);
          const endDateObj = new Date(startDateObj.getTime() + 60 * 60 * 1000); // +1 hour
          icsLines.push(`DTSTART:${formatDateTimeUTC(startDateObj)}`);
          icsLines.push(`DTEND:${formatDateTimeUTC(endDateObj)}`);
        } else {
          const todayStr = formatDateOnlyUTC(new Date());
          const tomorrowStr = formatDateOnlyUTC(addDays(new Date(), 1));
          icsLines.push(`DTSTART;VALUE=DATE:${todayStr}`);
          icsLines.push(`DTEND;VALUE=DATE:${tomorrowStr}`);
        }

        const summary = `${dimension} - ${description}`;
        icsLines.push(`SUMMARY:${escapeICS(summary)}`);
        icsLines.push(
          `DESCRIPTION:${escapeICS(
            "Dimension: " + dimension + "\\n" + description
          )}`
        );
        icsLines.push('END:VEVENT');
      });
    }

    icsLines.push('END:VCALENDAR');
    return icsLines.join('\r\n');
  }

  // Convert a date/time string to a JS Date (local time)
  function parseDateTime(dateStr, timeStr) {
    // e.g. "2025-01-05", "07:30"
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute] = timeStr.split(':').map(Number);
    return new Date(year, month - 1, day, hour, minute, 0);
  }

  // Format Date for ICS as "YYYYMMDDTHHMMSSZ" (UTC)
  function formatDateTimeUTC(date) {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    const hh = String(date.getUTCHours()).padStart(2, '0');
    const mm = String(date.getUTCMinutes()).padStart(2, '0');
    const ss = String(date.getUTCSeconds()).padStart(2, '0');
    return `${y}${m}${d}T${hh}${mm}${ss}Z`;
  }

  // Format date as YYYYMMDD for all-day events
  function formatDateOnlyUTC(date) {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}${m}${d}`;
  }

  // Simple UID generator
  function generateUID() {
    return Date.now() + '@selfcaretool';
  }

  // Add days to a Date
  function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  // Escape ICS special characters
  function escapeICS(str) {
    return (str || '')
      .replace(/\\/g, '\\\\')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;')
      .replace(/\n/g, '\\n');
  }

  // Format date/time nicely for printing
  function formatDateTimePretty(dateStr, timeStr) {
    if (!dateStr && !timeStr) {
      return 'All Day (Today)';
    }
    if (dateStr) {
      const dateObj = parseDateTime(dateStr, timeStr || '00:00');
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      let formatted = dateObj.toLocaleDateString(undefined, options);
      if (timeStr) {
        // local time (HH:MM)
        const [hour, minute] = timeStr.split(':');
        const dateWithTime = new Date(dateObj);
        dateWithTime.setHours(hour, minute);
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        formatted += ` at ${dateWithTime.toLocaleTimeString(undefined, timeOptions)}`;
      }
      return formatted;
    }
    if (timeStr) {
      return `at ${timeStr}`;
    }
    return '';
  }
});
