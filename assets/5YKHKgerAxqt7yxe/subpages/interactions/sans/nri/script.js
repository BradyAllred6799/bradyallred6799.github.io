document.addEventListener('DOMContentLoaded', () => {
  /********************************************
   * STEP NAVIGATION
   ********************************************/
  const form = document.getElementById('reviewForm');
  const formSteps = Array.from(document.querySelectorAll('.form-step'));
  const nextBtns = document.querySelectorAll('.next-btn');
  const prevBtns = document.querySelectorAll('.prev-btn');
  let currentStep = 0;

  // Show the first step
  formSteps[currentStep].classList.add('active');

  // Next Buttons
  nextBtns.forEach(button => {
    button.addEventListener('click', () => {
      if (currentStep < formSteps.length - 1) {
        formSteps[currentStep].classList.remove('active');
        currentStep++;
        formSteps[currentStep].classList.add('active');
      }
    });
  });

  // Prev Buttons
  prevBtns.forEach(button => {
    button.addEventListener('click', () => {
      if (currentStep > 0) {
        formSteps[currentStep].classList.remove('active');
        currentStep--;
        formSteps[currentStep].classList.add('active');
      }
    });
  });

  /********************************************
   * MULTI-FORMAT CHECKBOXES (STEP 1)
   ********************************************/
  const outlineCheck = document.getElementById('outlineCheck');
  const chartCheck = document.getElementById('chartCheck');
  const mindmapCheck = document.getElementById('mindmapCheck');

  const outlineContainer = document.getElementById('outlineContainer');
  const chartContainer = document.getElementById('chartContainer');
  const mindmapContainer = document.getElementById('mindmapContainer');

  outlineCheck.addEventListener('change', () => {
    if (outlineCheck.checked) {
      outlineContainer.classList.remove('hidden');
      outlineContainer.setAttribute('aria-hidden', 'false');
    } else {
      outlineContainer.classList.add('hidden');
      outlineContainer.setAttribute('aria-hidden', 'true');
    }
  });

  chartCheck.addEventListener('change', () => {
    if (chartCheck.checked) {
      chartContainer.classList.remove('hidden');
      chartContainer.setAttribute('aria-hidden', 'false');
    } else {
      chartContainer.classList.add('hidden');
      chartContainer.setAttribute('aria-hidden', 'true');
    }
  });

  mindmapCheck.addEventListener('change', () => {
    if (mindmapCheck.checked) {
      mindmapContainer.classList.remove('hidden');
      mindmapContainer.setAttribute('aria-hidden', 'false');
    } else {
      mindmapContainer.classList.add('hidden');
      mindmapContainer.setAttribute('aria-hidden', 'true');
    }
  });

  /********************************************
   * CHART LOGIC
   ********************************************/
  const dynamicChart = document.getElementById('dynamicChart');
  const addRowBtn = document.getElementById('addRowBtn');
  const addColBtn = document.getElementById('addColBtn');
  let chartData = [];

  function initChart() {
    chartData = [[""]]; // Start with a 1x1 table
    renderChart();
  }

  function renderChart() {
    dynamicChart.innerHTML = "";
    chartData.forEach((rowData, rowIndex) => {
      const rowElem = document.createElement("tr");
      rowData.forEach((cellData, colIndex) => {
        const cell = document.createElement("td");
        cell.contentEditable = "true";
        cell.textContent = cellData;
        cell.addEventListener('input', () => {
          chartData[rowIndex][colIndex] = cell.textContent;
          saveFormDataToLocalStorage();
        });
        rowElem.appendChild(cell);
      });
      dynamicChart.appendChild(rowElem);
    });
  }

  addRowBtn.addEventListener('click', () => {
    if (chartData.length === 0) {
      chartData.push([""]);
    } else {
      const cols = chartData[0].length;
      chartData.push(new Array(cols).fill(""));
    }
    renderChart();
    saveFormDataToLocalStorage();
  });

  addColBtn.addEventListener('click', () => {
    if (chartData.length === 0) {
      chartData = [[""]];
    } else {
      chartData.forEach(row => row.push(""));
    }
    renderChart();
    saveFormDataToLocalStorage();
  });

  initChart();

  /********************************************
   * MIND MAP LOGIC
   ********************************************/
  const mindmapCanvas = document.getElementById("mindmapCanvas");
  const ctx = mindmapCanvas.getContext("2d");
  const nodeNameInput = document.getElementById("nodeNameInput");
  const addNodeBtn = document.getElementById("addNodeBtn");
  const fromNodeSelect = document.getElementById("fromNodeSelect");
  const toNodeSelect = document.getElementById("toNodeSelect");
  const connectNodesBtn = document.getElementById("connectNodesBtn");

  let mindmapNodes = [];
  let mindmapEdges = [];
  const canvasWidth = mindmapCanvas.width;
  const canvasHeight = mindmapCanvas.height;
  let nodeCounter = 1;

  let isDragging = false;
  let draggedNode = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  function addNode(label) {
    const nodeId = nodeCounter++;
    const x = Math.floor(Math.random() * (canvasWidth - 100)) + 50;
    const y = Math.floor(Math.random() * (canvasHeight - 50)) + 25;

    mindmapNodes.push({ id: nodeId, label, x, y });
    updateSelectOptions(nodeId, label);
    drawMindmap();
    saveFormDataToLocalStorage();
  }

  function updateSelectOptions(nodeId, label) {
    const optionFrom = document.createElement("option");
    optionFrom.value = nodeId;
    optionFrom.textContent = label;
    fromNodeSelect.appendChild(optionFrom);

    const optionTo = document.createElement("option");
    optionTo.value = nodeId;
    optionTo.textContent = label;
    toNodeSelect.appendChild(optionTo);
  }

  function connectNodes(fromId, toId) {
    mindmapEdges.push({ fromId, toId });
    drawMindmap();
    saveFormDataToLocalStorage();
  }

  function drawMindmap() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw edges first
    mindmapEdges.forEach(edge => {
      const fromNode = mindmapNodes.find(n => n.id == edge.fromId);
      const toNode = mindmapNodes.find(n => n.id == edge.toId);
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = "#2d3b45";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw nodes on top
    mindmapNodes.forEach(node => {
      ctx.font = "14px Lato, sans-serif";
      const textWidth = ctx.measureText(node.label).width;
      const boxPadding = 10;
      const boxWidth = textWidth + (boxPadding * 2);
      const boxHeight = 30;
      const boxX = node.x - (boxWidth / 2);
      const boxY = node.y - (boxHeight / 2);

      node.bounds = { boxX, boxY, boxWidth, boxHeight };

      ctx.fillStyle = "#ed4869";
      ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x, node.y);
    });
  }

  addNodeBtn.addEventListener("click", () => {
    const label = nodeNameInput.value.trim();
    if (!label) {
      alert("Please enter a node label.");
      return;
    }
    addNode(label);
    nodeNameInput.value = "";
  });

  connectNodesBtn.addEventListener("click", () => {
    const fromVal = fromNodeSelect.value;
    const toVal = toNodeSelect.value;
    if (!fromVal || !toVal) {
      alert("Please select valid nodes to connect.");
      return;
    }
    if (fromVal === toVal) {
      alert("Cannot connect a node to itself.");
      return;
    }
    connectNodes(fromVal, toVal);
    fromNodeSelect.value = "";
    toNodeSelect.value = "";
  });

  // Dragging logic for nodes
  mindmapCanvas.addEventListener('mousedown', (e) => {
    const { offsetX, offsetY } = e;
    draggedNode = mindmapNodes.find(node => {
      const b = node.bounds;
      return (
        offsetX >= b.boxX &&
        offsetX <= b.boxX + b.boxWidth &&
        offsetY >= b.boxY &&
        offsetY <= b.boxY + b.boxHeight
      );
    });
    if (draggedNode) {
      isDragging = true;
      const b = draggedNode.bounds;
      dragOffsetX = offsetX - b.boxX;
      dragOffsetY = offsetY - b.boxY;
    }
  });

  mindmapCanvas.addEventListener('mousemove', (e) => {
    if (!isDragging || !draggedNode) return;
    const { offsetX, offsetY } = e;
    const b = draggedNode.bounds;
    const newBoxX = offsetX - dragOffsetX;
    const newBoxY = offsetY - dragOffsetY;

    draggedNode.x = newBoxX + (b.boxWidth / 2);
    draggedNode.y = newBoxY + (b.boxHeight / 2);

    drawMindmap();
  });

  mindmapCanvas.addEventListener('mouseup', () => {
    if (isDragging && draggedNode) {
      isDragging = false;
      draggedNode = null;
      saveFormDataToLocalStorage();
    }
  });

  mindmapCanvas.addEventListener('mouseleave', () => {
    if (isDragging && draggedNode) {
      isDragging = false;
      draggedNode = null;
      saveFormDataToLocalStorage();
    }
  });

  drawMindmap();

  /********************************************
   * FLASHCARDS
   ********************************************/
  const addCardBtn = document.getElementById('addCard');
  const flashcardsContainer = document.getElementById('flashcardsContainer');

  // Add a new flashcard
  addCardBtn.addEventListener('click', () => {
    const flashcard = document.createElement('div');
    flashcard.classList.add('flashcard');
    flashcard.innerHTML = `
      <input type="text" class="term" placeholder="Term" required aria-label="Term">
      <input type="text" class="definition" placeholder="Definition" required aria-label="Definition">
      <button type="button" class="remove-card">Remove</button>
    `;
    flashcardsContainer.appendChild(flashcard);

    // Attach remove event
    flashcard.querySelector('.remove-card').addEventListener('click', () => {
      flashcardsContainer.removeChild(flashcard);
      saveFormDataToLocalStorage();
    });
  });

  // Existing remove buttons (in the initial single card)
  document.querySelectorAll('.remove-card').forEach(button => {
    button.addEventListener('click', (e) => {
      const flashcard = e.target.parentElement;
      flashcardsContainer.removeChild(flashcard);
      saveFormDataToLocalStorage();
    });
  });

  /********************************************
   * FINAL SUBMISSION (STEP 3 -> SUMMARY)
   ********************************************/
  const displayOutlineSection = document.getElementById('displayOutlineSection');
  const displayOutline = document.getElementById('displayOutline');
  const displayChartSection = document.getElementById('displayChartSection');
  const displayChart = document.getElementById('displayChart');
  const displayMindmapSection = document.getElementById('displayMindmapSection');
  const displayMindmap = document.getElementById('displayMindmap');
  const displayMindmapImage = document.getElementById('displayMindmapImage');
  const printableFlashcards = document.getElementById('printableFlashcards');
  const printFlashcardsContainer = printableFlashcards.querySelector('.print-flashcards-container');

  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Which formats are selected?
    const isOutlineSelected = outlineCheck.checked;
    const isChartSelected = chartCheck.checked;
    const isMindmapSelected = mindmapCheck.checked;

    // Outline data
    const outlineValue = outlineContainer.querySelector('#outlineInput').value.trim();
    
    // Chart HTML
    const chartOutput = renderChartToHTML(chartData);
    
    // Mind Map HTML + Snapshot
    const mindmapOutput = renderMindmapToHTML(mindmapNodes, mindmapEdges);
    const mindmapImageData = mindmapCanvas.toDataURL("image/png");

    // Flashcards
    const flashcards = Array.from(document.querySelectorAll('.flashcard')).map(card => {
      const term = card.querySelector('.term').value.trim();
      const definition = card.querySelector('.definition').value.trim();
      return { term, definition };
    });

    // Minimal check: date/time
    const reviewDate = document.getElementById('reviewDate').value;
    const reviewTime = document.getElementById('reviewTime').value;
    if (!reviewDate || !reviewTime) {
      alert("Please select a valid date/time.");
      return;
    }

    // Loosened validation checks
    if (!isOutlineSelected && !isChartSelected && !isMindmapSelected) {
      alert("No formats selected. Proceeding anyway...");
    }
    if (isOutlineSelected && !outlineValue) {
      alert("Outline is empty, but proceeding anyway...");
    }
    if (isChartSelected && (chartData.length === 0 || chartData[0].length === 0)) {
      alert("Chart is empty, but proceeding anyway...");
    }
    const incompleteFlashcards = flashcards.some(fc => !fc.term || !fc.definition);
    if (incompleteFlashcards) {
      alert("One or more flashcards are missing a term or definition. Proceeding anyway...");
    }
    if (isMindmapSelected && mindmapNodes.length === 0) {
      alert("Mind map is empty, but proceeding anyway...");
    }

    // Display summary
    // Outline
    if (isOutlineSelected) {
      displayOutlineSection.classList.remove('hidden');
      displayOutline.textContent = outlineValue || "(No Outline Provided)";
    } else {
      displayOutlineSection.classList.add('hidden');
    }

    // Chart
    if (isChartSelected) {
      displayChartSection.classList.remove('hidden');
      displayChart.innerHTML = chartOutput || "<p>(No Chart Provided)</p>";
    } else {
      displayChartSection.classList.add('hidden');
    }

    // Mindmap
    if (isMindmapSelected) {
      displayMindmapSection.classList.remove('hidden');
      displayMindmap.innerHTML = mindmapOutput || "<p>(No Mind Map Provided)</p>";
      displayMindmapImage.src = mindmapImageData;
      displayMindmapImage.classList.remove('hidden');
    } else {
      displayMindmapSection.classList.add('hidden');
      displayMindmapImage.classList.add('hidden');
    }

    // Flashcards Summary
    const flashcardsList = document.getElementById('displayFlashcards');
    flashcardsList.innerHTML = '';
    flashcards.forEach(card => {
      const term = card.term || "(Term Empty)";
      const def = card.definition || "(Definition Empty)";
      const li = document.createElement('li');
      li.textContent = `${term} - ${def}`;
      flashcardsList.appendChild(li);
    });

    // Scheduled Review
    document.getElementById('displaySchedule').textContent = `${reviewDate} at ${reviewTime}`;

    // Prepare printable flashcards
    preparePrintableFlashcards(flashcards);

    // Save data to Local Storage
    const data = {
      isOutlineSelected, outlineValue,
      isChartSelected, chartData,
      isMindmapSelected, mindmapNodes, mindmapEdges,
      flashcards,
      reviewDate,
      reviewTime
    };
    localStorage.setItem('reviewDataNoStep1', JSON.stringify(data));

    // Calendar + Notification
    addCalendarButtons(reviewDate, reviewTime);
    scheduleNotification(reviewDate, reviewTime);

    // Hide form, show summary
    form.classList.add('hidden');
    document.getElementById('summaryOutput').classList.remove('hidden');
  });

  /********************************************
   * HELPER FUNCTIONS FOR SUMMARY
   ********************************************/
  function renderChartToHTML(data2D) {
    let html = '<table border="1" style="border-collapse: collapse;">';
    data2D.forEach(row => {
      html += "<tr>";
      row.forEach(cell => {
        html += `<td style="padding: 5px;">${cell}</td>`;
      });
      html += "</tr>";
    });
    html += "</table>";
    return html;
  }

  function renderMindmapToHTML(nodes, edges) {
    let html = "<ul>";
    nodes.forEach(node => {
      html += `<li><strong>${node.label}</strong> (ID: ${node.id}, x:${node.x}, y:${node.y})</li>`;
    });
    html += "</ul>";

    html += "<h4>Connections:</h4><ul>";
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id == edge.fromId);
      const toNode = nodes.find(n => n.id == edge.toId);
      if (fromNode && toNode) {
        html += `<li>${fromNode.label} -> ${toNode.label}</li>`;
      }
    });
    html += "</ul>";
    return html;
  }

  /********************************************
   * LOCAL STORAGE & AUTOSAVE
   ********************************************/
  form.addEventListener('input', saveFormDataToLocalStorage);

  function saveFormDataToLocalStorage() {
    const isOutlineSelected = outlineCheck.checked;
    const outlineValue = outlineContainer.querySelector('#outlineInput').value.trim();
    const isChartSelected = chartCheck.checked;
    const isMindmapSelected = mindmapCheck.checked;

    const flashcards = Array.from(document.querySelectorAll('.flashcard')).map(card => ({
      term: card.querySelector('.term').value.trim(),
      definition: card.querySelector('.definition').value.trim()
    }));

    const reviewDate = document.getElementById('reviewDate').value;
    const reviewTime = document.getElementById('reviewTime').value;

    const formData = {
      isOutlineSelected, outlineValue,
      isChartSelected, chartData,
      isMindmapSelected, mindmapNodes, mindmapEdges,
      flashcards,
      reviewDate,
      reviewTime
    };
    localStorage.setItem('reviewDataNoStep1', JSON.stringify(formData));
  }

  /********************************************
   * LOAD FROM LOCAL STORAGE ON PAGE LOAD
   ********************************************/
  const savedData = JSON.parse(localStorage.getItem('reviewDataNoStep1'));
  if (savedData) {
    // Outline
    outlineCheck.checked = !!savedData.isOutlineSelected;
    if (outlineCheck.checked) {
      outlineContainer.classList.remove('hidden');
      outlineContainer.setAttribute('aria-hidden', 'false');
    }
    document.getElementById('outlineInput').value = savedData.outlineValue || '';

    // Chart
    chartCheck.checked = !!savedData.isChartSelected;
    if (chartCheck.checked) {
      chartContainer.classList.remove('hidden');
      chartContainer.setAttribute('aria-hidden', 'false');
    }
    if (Array.isArray(savedData.chartData)) {
      chartData = savedData.chartData;
      renderChart();
    }

    // Mind Map
    mindmapCheck.checked = !!savedData.isMindmapSelected;
    if (mindmapCheck.checked) {
      mindmapContainer.classList.remove('hidden');
      mindmapContainer.setAttribute('aria-hidden', 'false');
    }
    if (Array.isArray(savedData.mindmapNodes)) {
      mindmapNodes = savedData.mindmapNodes;
      mindmapEdges = savedData.mindmapEdges || [];
      nodeCounter = mindmapNodes.length + 1;
      mindmapNodes.forEach(node => {
        updateSelectOptions(node.id, node.label);
      });
      drawMindmap();
    }

    // Date/Time
    document.getElementById('reviewDate').value = savedData.reviewDate || '';
    document.getElementById('reviewTime').value = savedData.reviewTime || '';

    // Load flashcards
    flashcardsContainer.innerHTML = '';
    if (savedData.flashcards) {
      savedData.flashcards.forEach(card => {
        const flashcard = document.createElement('div');
        flashcard.classList.add('flashcard');
        flashcard.innerHTML = `
          <input type="text" class="term" placeholder="Term" value="${card.term}" required aria-label="Term">
          <input type="text" class="definition" placeholder="Definition" value="${card.definition}" required aria-label="Definition">
          <button type="button" class="remove-card">Remove</button>
        `;
        flashcardsContainer.appendChild(flashcard);

        // Attach remove event to newly created card
        flashcard.querySelector('.remove-card').addEventListener('click', () => {
          flashcardsContainer.removeChild(flashcard);
          saveFormDataToLocalStorage();
        });
      });
    }
  }

  /********************************************
   * FLASHCARD REVIEW
   ********************************************/
  const summaryOutput = document.getElementById('summaryOutput');
  const flashcardReview = document.getElementById('flashcardReview');
  const flashcardFront = document.getElementById('flashcardFront');
  const flashcardBack = document.getElementById('flashcardBack');
  const prevFlashcardBtn = document.getElementById('prevFlashcard');
  const nextFlashcardBtn = document.getElementById('nextFlashcard');
  const flipFlashcardBtn = document.getElementById('flipFlashcard');
  const reviewButton = document.getElementById('reviewButton');
  const printButton = document.getElementById('printButton');

  let currentFlashcardIndex = 0;
  let isFront = true;
  let flashcardsArray = [];

  // Collect displayed flashcards from summary
  function collectDisplayedFlashcards() {
    flashcardsArray = [];
    const flashcardsListItems = document.querySelectorAll('#displayFlashcards li');
    flashcardsListItems.forEach(item => {
      const text = item.textContent;
      const [term, definition] = text.split(' - ');
      if (term && definition !== undefined) {
        flashcardsArray.push({
          term: term.trim(),
          definition: definition.trim()
        });
      }
    });
  }

  // Review flashcards button
  reviewButton.addEventListener('click', () => {
    collectDisplayedFlashcards();
    if (flashcardsArray.length > 0) {
      currentFlashcardIndex = 0;
      isFront = true;
      displayFlashcard();
      flashcardReview.classList.remove('hidden');
    } else {
      alert('No flashcards to review!');
    }
  });

  // Display the current flashcard
  function displayFlashcard() {
    if (flashcardsArray.length === 0) return;
    const currentCard = flashcardsArray[currentFlashcardIndex];
    flashcardFront.textContent = currentCard.term;
    flashcardBack.textContent = currentCard.definition;

    if (isFront) {
      flashcardFront.classList.add('active');
      flashcardBack.classList.remove('active');
    } else {
      flashcardBack.classList.add('active');
      flashcardFront.classList.remove('active');
    }
  }

  // Next/Prev/Flip
  nextFlashcardBtn.addEventListener('click', () => {
    if (currentFlashcardIndex < flashcardsArray.length - 1) {
      currentFlashcardIndex++;
      isFront = true;
      displayFlashcard();
    } else {
      alert('This is the last flashcard.');
    }
  });

  prevFlashcardBtn.addEventListener('click', () => {
    if (currentFlashcardIndex > 0) {
      currentFlashcardIndex--;
      isFront = true;
      displayFlashcard();
    } else {
      alert('This is the first flashcard.');
    }
  });

  flipFlashcardBtn.addEventListener('click', () => {
    isFront = !isFront;
    displayFlashcard();
  });

  // Print Summary Button
  printButton.addEventListener('click', () => {
    window.print();
  });

  /********************************************
   * NOTIFICATIONS / CALENDAR
   ********************************************/
  if ('Notification' in window) {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }

  function scheduleNotification(date, time) {
    const reviewDateTime = new Date(`${date}T${time}:00`);
    const now = new Date();
    const delay = reviewDateTime - now;
    if (delay > 0) {
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification('Time to review your notes!', {
            body: 'Remember to go over your outline, chart, mind map, and flashcards.',
          });
        }
      }, delay);
    }
  }

  function addCalendarButtons(date, time) {
    const schedule = document.getElementById('displaySchedule');
    const containerDiv = document.createElement('div');
    containerDiv.style.marginTop = "10px";

    const startDateTime = new Date(`${date}T${time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

    const gCalURL = buildGoogleCalURL(
      "Review Your Notes",
      "Remember to review your notes & flashcards.",
      startDateTime,
      endDateTime
    );
    const googleBtn = document.createElement('button');
    googleBtn.textContent = "Add to Google Calendar";
    googleBtn.addEventListener('click', () => {
      window.open(gCalURL, '_blank');
    });

    const outlookBtn = document.createElement('button');
    outlookBtn.textContent = "Add to Outlook";
    outlookBtn.addEventListener('click', () => {
      const icsContent = buildICS(
        "Review Your Notes",
        "Remember to review your notes & flashcards.",
        startDateTime,
        endDateTime
      );
      downloadICS(icsContent, "ReviewEvent.ics");
    });

    containerDiv.appendChild(googleBtn);
    containerDiv.appendChild(outlookBtn);
    schedule.appendChild(containerDiv);
  }

  function buildGoogleCalURL(title, details, start, end) {
    const startStr = formatDateToCal(start);
    const endStr = formatDateToCal(end);
    const gCalBase = "https://calendar.google.com/calendar/render?action=TEMPLATE";
    return `${gCalBase}&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&dates=${startStr}/${endStr}`;
  }

  function formatDateToCal(dateObj) {
    const y = dateObj.getUTCFullYear();
    const m = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getUTCDate()).padStart(2, '0');
    const hh = String(dateObj.getUTCHours()).padStart(2, '0');
    const mm = String(dateObj.getUTCMinutes()).padStart(2, '0');
    const ss = "00";
    return `${y}${m}${d}T${hh}${mm}${ss}Z`;
  }

  function buildICS(title, details, start, end) {
    const startStr = icsDateTime(start);
    const endStr = icsDateTime(end);
    const now = new Date();
    const nowStr = icsDateTime(now);

    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//NoStep1NoteReview//EN",
      "BEGIN:VEVENT",
      `UID:${now.getTime()}@nostep1notereview.com`,
      `DTSTAMP:${nowStr}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${details}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
  }

  function icsDateTime(dateObj) {
    const y = dateObj.getUTCFullYear();
    const m = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getUTCDate()).padStart(2, '0');
    const hh = String(dateObj.getUTCHours()).padStart(2, '0');
    const mm = String(dateObj.getUTCMinutes()).padStart(2, '0');
    const ss = "00";
    return `${y}${m}${d}T${hh}${mm}${ss}Z`;
  }

  function downloadICS(icsContent, filename) {
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /********************************************
   * PREPARE PRINTABLE FLASHCARDS
   ********************************************/
  function preparePrintableFlashcards(flashcards) {
    printFlashcardsContainer.innerHTML = ''; // Clear previous flashcards
    flashcards.forEach(card => {
      const flashcardDiv = document.createElement('div');
      flashcardDiv.classList.add('print-flashcard');

      const frontDiv = document.createElement('div');
      frontDiv.classList.add('front');
      frontDiv.textContent = card.term || "(Term Empty)";

      const backDiv = document.createElement('div');
      backDiv.classList.add('back');
      backDiv.textContent = card.definition || "(Definition Empty)";

      flashcardDiv.appendChild(frontDiv);
      flashcardDiv.appendChild(backDiv);

      printFlashcardsContainer.appendChild(flashcardDiv);
    });

    // Show printable flashcards so they appear during print
    printableFlashcards.classList.remove('hidden');
  }
});
