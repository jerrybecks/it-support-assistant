// Log Analyzer Module
document.addEventListener("DOMContentLoaded", () => {
  console.log("Log Analyzer module initializing")
  initLogAnalyzer()
})

/**
 * Log Analyzer Module
 */
function initLogAnalyzer() {
  const logAnalyzerContent = document.getElementById("log-analyzer-content")
  const analyzeLogsBtn = document.getElementById("analyze-logs-btn")
  const logTypeSelect = document.getElementById("log-type-select")
  const logLevelSelect = document.getElementById("log-level-select")
  const logSearchInput = document.getElementById("log-search-input")
  const logDateRangeStart = document.getElementById("log-date-range-start")
  const logDateRangeEnd = document.getElementById("log-date-range-end")

  // Set up analyze logs button
  if (analyzeLogsBtn) {
    analyzeLogsBtn.addEventListener("click", analyzeLogs)
  }

  // Set default date range (last 24 hours)
  if (logDateRangeEnd) {
    const now = new Date()
    logDateRangeEnd.valueAsDate = now

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    if (logDateRangeStart) {
      logDateRangeStart.valueAsDate = yesterday
    }
  }

  // Function to analyze logs
  async function analyzeLogs() {
    try {
      if (logAnalyzerContent) {
        logAnalyzerContent.innerHTML = `
          <div class="alert alert-info">
            <p>Analyzing logs... <div class="spinner-border spinner-border-sm" role="status"></div></p>
          </div>
        `
      }

      if (analyzeLogsBtn) {
        analyzeLogsBtn.disabled = true
        analyzeLogsBtn.innerHTML =
          '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Analyzing...'
      }

      // Check if API is available
      if (!window.api || !window.api.analyzeLogs) {
        console.error("API or analyzeLogs method not available")
        if (logAnalyzerContent) {
          logAnalyzerContent.innerHTML = `
            <div class="alert alert-danger">
              <p>Error: Log analyzer API not available.</p>
              <p>This could be due to a configuration issue with the application.</p>
            </div>
          `
        }
        if (analyzeLogsBtn) {
          analyzeLogsBtn.disabled = false
          analyzeLogsBtn.textContent = "Analyze Logs"
        }
        return
      }

      // Get filter values
      const filters = {
        logType: logTypeSelect ? logTypeSelect.value : "system",
        logLevel: logLevelSelect ? logLevelSelect.value : "warning",
        searchTerm: logSearchInput ? logSearchInput.value : "",
        startDate: logDateRangeStart ? logDateRangeStart.valueAsDate?.getTime() : undefined,
        endDate: logDateRangeEnd ? logDateRangeEnd.valueAsDate?.getTime() : undefined,
      }

      // Call the API
      const response = await window.api.analyzeLogs(filters)

      if (response.success) {
        displayLogAnalysis(response.data)
      } else {
        if (logAnalyzerContent) {
          logAnalyzerContent.innerHTML = `
            <div class="alert alert-danger">
              <p>Error: ${response.error || "Unknown error occurred"}</p>
            </div>
          `
        }
      }
    } catch (error) {
      console.error("Error analyzing logs:", error)
      if (logAnalyzerContent) {
        logAnalyzerContent.innerHTML = `
          <div class="alert alert-danger">
            <p>Error analyzing logs: ${error.message || "Unknown error"}</p>
          </div>
        `
      }
    } finally {
      if (analyzeLogsBtn) {
        analyzeLogsBtn.disabled = false
        analyzeLogsBtn.textContent = "Analyze Logs"
      }
    }
  }

  function displayLogAnalysis(logData) {
    if (!logAnalyzerContent) return

    if (!logData || !logData.entries || logData.entries.length === 0) {
      logAnalyzerContent.innerHTML = `
        <div class="alert alert-info">
          <p>No log entries found matching your criteria.</p>
        </div>
      `
      return
    }

    let html = `
      <div class="mb-4">
        <div class="d-flex justify-content-between align-items-center">
          <h5>Log Analysis Results (${logData.entries.length} entries)</h5>
          <button id="export-logs-btn" class="btn btn-sm btn-outline-primary">Export Results</button>
        </div>
        <p class="text-muted">Source: ${logData.source}</p>
      </div>
    `

    // Summary section
    if (logData.summary) {
      html += `
        <div class="card mb-4">
          <div class="card-header">
            Summary
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h6>Log Entries by Level</h6>
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Level</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
      `

      for (const [level, count] of Object.entries(logData.summary.levelCounts)) {
        let badgeClass = "bg-secondary"
        if (level === "error") {
          badgeClass = "bg-danger"
        } else if (level === "warning") {
          badgeClass = "bg-warning"
        } else if (level === "info") {
          badgeClass = "bg-info"
        }

        html += `
          <tr>
            <td><span class="badge ${badgeClass}">${level}</span></td>
            <td>${count}</td>
          </tr>
        `
      }

      html += `
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="col-md-6">
                <h6>Common Issues</h6>
                <ul class="list-group">
      `

      if (logData.summary.commonIssues && logData.summary.commonIssues.length > 0) {
        for (const issue of logData.summary.commonIssues) {
          html += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
              ${issue.description}
              <span class="badge bg-primary rounded-pill">${issue.count}</span>
            </li>
          `
        }
      } else {
        html += `<li class="list-group-item">No common issues identified</li>`
      }

      html += `
                </ul>
              </div>
            </div>
          </div>
        </div>
      `
    }

    // Log entries table
    html += `
      <div class="card">
        <div class="card-header">
          Log Entries
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-sm table-striped">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Level</th>
                  <th>Process</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
    `

    for (const entry of logData.entries) {
      let levelBadgeClass = "bg-secondary"
      if (entry.level === "error") {
        levelBadgeClass = "bg-danger"
      } else if (entry.level === "warning") {
        levelBadgeClass = "bg-warning"
      } else if (entry.level === "info") {
        levelBadgeClass = "bg-info"
      }

      html += `
        <tr>
          <td>${new Date(entry.timestamp).toLocaleString()}</td>
          <td><span class="badge ${levelBadgeClass}">${entry.level}</span></td>
          <td>${entry.process}</td>
          <td>${entry.message}</td>
        </tr>
      `
    }

    html += `
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `

    logAnalyzerContent.innerHTML = html

    // Add event listener to export button
    const exportLogsBtn = document.getElementById("export-logs-btn")
    if (exportLogsBtn) {
      exportLogsBtn.addEventListener("click", () => {
        exportLogResults(logData)
      })
    }
  }

  async function exportLogResults(logData) {
    try {
      const result = await window.api.exportLogResults(logData)
      if (result.success) {
        showNotification(`Log results exported to ${result.filePath}`, "success")
      } else {
        showNotification(`Error exporting log results: ${result.error}`, "error")
      }
    } catch (error) {
      console.error("Error exporting log results:", error)
      showNotification(`Error exporting log results: ${error.message}`, "error")
    }
  }

  function showNotification(message, type) {
    const notificationDiv = document.createElement("div")
    notificationDiv.classList.add("alert", `alert-${type}`, "alert-dismissible", "fade", "show")
    notificationDiv.setAttribute("role", "alert")
    notificationDiv.textContent = message

    const closeButton = document.createElement("button")
    closeButton.setAttribute("type", "button")
    closeButton.classList.add("btn-close")
    closeButton.setAttribute("data-bs-dismiss", "alert")
    closeButton.setAttribute("aria-label", "Close")
    notificationDiv.appendChild(closeButton)

    document.body.appendChild(notificationDiv)

    // Automatically remove the notification after a few seconds
    setTimeout(() => {
      notificationDiv.remove()
    }, 5000)
  }
}

