// Software Updates Module
document.addEventListener("DOMContentLoaded", () => {
  console.log("Software Updates module initializing")
  initSoftwareUpdates()
})

/**
 * Software Updates Module
 */
function initSoftwareUpdates() {
  const softwareUpdatesContent = document.getElementById("software-updates-content")
  const checkUpdatesBtn = document.getElementById("check-updates-btn")

  // Set up check updates button
  if (checkUpdatesBtn) {
    checkUpdatesBtn.addEventListener("click", checkForUpdates)
  }

  // Function to check for software updates
  async function checkForUpdates() {
    try {
      if (softwareUpdatesContent) {
        softwareUpdatesContent.innerHTML = `
          <div class="alert alert-info">
            <p>Checking for software updates... <div class="spinner-border spinner-border-sm" role="status"></div></p>
          </div>
        `
      }

      if (checkUpdatesBtn) {
        checkUpdatesBtn.disabled = true
        checkUpdatesBtn.innerHTML =
          '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Checking...'
      }

      // Check if API is available
      if (!window.api || !window.api.checkSoftwareUpdates) {
        console.error("API or checkSoftwareUpdates method not available")
        if (softwareUpdatesContent) {
          softwareUpdatesContent.innerHTML = `
            <div class="alert alert-danger">
              <p>Error: Software updates API not available.</p>
              <p>This could be due to a configuration issue with the application.</p>
            </div>
          `
        }
        if (checkUpdatesBtn) {
          checkUpdatesBtn.disabled = false
          checkUpdatesBtn.textContent = "Check for Updates"
        }
        return
      }

      // Call the API
      const response = await window.api.checkSoftwareUpdates()

      if (response.success) {
        displaySoftwareUpdates(response.data)
      } else {
        if (softwareUpdatesContent) {
          softwareUpdatesContent.innerHTML = `
            <div class="alert alert-danger">
              <p>Error: ${response.error || "Unknown error occurred"}</p>
            </div>
          `
        }
      }
    } catch (error) {
      console.error("Error checking for software updates:", error)
      if (softwareUpdatesContent) {
        softwareUpdatesContent.innerHTML = `
          <div class="alert alert-danger">
            <p>Error checking for software updates: ${error.message || "Unknown error"}</p>
          </div>
        `
      }
    } finally {
      if (checkUpdatesBtn) {
        checkUpdatesBtn.disabled = false
        checkUpdatesBtn.textContent = "Check for Updates"
      }
    }
  }

  function displaySoftwareUpdates(updates) {
    if (!softwareUpdatesContent) return

    if (!updates || updates.length === 0) {
      softwareUpdatesContent.innerHTML = `
        <div class="alert alert-success">
          <p>All software is up to date!</p>
        </div>
      `
      return
    }

    let html = `<h5>Available Software Updates (${updates.length})</h5>`

    // Group updates by type
    const systemUpdates = updates.filter((update) => update.type === "system")
    const appUpdates = updates.filter((update) => update.type === "application")

    // System updates section
    if (systemUpdates.length > 0) {
      html += `
        <div class="card mb-4">
          <div class="card-header bg-primary text-white">
            System Updates
          </div>
          <div class="card-body">
            <div class="list-group">
      `

      for (const update of systemUpdates) {
        html += `
          <div class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6>${update.name}</h6>
                <p class="mb-1">${update.description}</p>
                <small class="text-muted">Version: ${update.version} | Size: ${update.size || "Unknown"}</small>
              </div>
              <button class="btn btn-sm btn-primary install-update-btn" data-id="${update.id}">Install</button>
            </div>
          </div>
        `
      }

      html += `
            </div>
          </div>
        </div>
      `
    }

    // Application updates section
    if (appUpdates.length > 0) {
      html += `
        <div class="card">
          <div class="card-header bg-info text-white">
            Application Updates
          </div>
          <div class="card-body">
            <div class="list-group">
      `

      for (const update of appUpdates) {
        html += `
          <div class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6>${update.name}</h6>
                <p class="mb-1">${update.description}</p>
                <small class="text-muted">Version: ${update.version} | Size: ${update.size || "Unknown"}</small>
              </div>
              <button class="btn btn-sm btn-info install-update-btn" data-id="${update.id}">Install</button>
            </div>
          </div>
        `
      }

      html += `
            </div>
          </div>
        </div>
      `
    }

    softwareUpdatesContent.innerHTML = html

    // Add event listeners to install buttons
    document.querySelectorAll(".install-update-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const updateId = event.target.getAttribute("data-id")
        await installUpdate(updateId)
      })
    })
  }

  async function installUpdate(updateId) {
    try {
      const button = document.querySelector(`.install-update-btn[data-id="${updateId}"]`)
      if (button) {
        button.disabled = true
        button.innerHTML =
          '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Installing...'
      }

      const response = await window.api.installSoftwareUpdate(updateId)

      if (response.success) {
        showNotification(`Update ${response.data.name} installed successfully`, "success")
        // Refresh the updates list
        checkForUpdates()
      } else {
        showNotification(`Error installing update: ${response.error}`, "error")
        if (button) {
          button.disabled = false
          button.textContent = "Install"
        }
      }
    } catch (error) {
      console.error(`Error installing update ${updateId}:`, error)
      showNotification(`Error installing update: ${error.message}`, "error")
      const button = document.querySelector(`.install-update-btn[data-id="${updateId}"]`)
      if (button) {
        button.disabled = false
        button.textContent = "Install"
      }
    }
  }

  function showNotification(message, type) {
    const notificationDiv = document.createElement("div")
    notificationDiv.classList.add("alert", `alert-${type}`, "mt-2")
    notificationDiv.textContent = message

    softwareUpdatesContent.prepend(notificationDiv)

    setTimeout(() => {
      notificationDiv.remove()
    }, 5000)
  }
}

