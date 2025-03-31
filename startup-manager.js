// Startup Manager Module
document.addEventListener("DOMContentLoaded", () => {
  console.log("Startup Manager module initializing")
  initStartupManager()
})

/**
 * Startup Manager Module
 */
function initStartupManager() {
  const startupItemsContent = document.getElementById("startup-items-content")
  const refreshStartupItemsBtn = document.getElementById("refresh-startup-items-btn")
  const addStartupItemBtn = document.getElementById("add-startup-item-btn")
  const startupItemNameInput = document.getElementById("startup-item-name")
  const startupItemPathInput = document.getElementById("startup-item-path")
  const startupItemTypeSelect = document.getElementById("startup-item-type")

  // Set up refresh button
  if (refreshStartupItemsBtn) {
    refreshStartupItemsBtn.addEventListener("click", loadStartupItems)
  }

  // Set up add startup item button
  if (addStartupItemBtn) {
    addStartupItemBtn.addEventListener("click", addStartupItem)
  }

  // Load startup items on page load
  loadStartupItems()

  // Function to load startup items
  async function loadStartupItems() {
    try {
      if (startupItemsContent) {
        startupItemsContent.innerHTML = `
          <div class="alert alert-info">
            <p>Loading startup items... <div class="spinner-border spinner-border-sm" role="status"></div></p>
          </div>
        `
      }

      if (refreshStartupItemsBtn) {
        refreshStartupItemsBtn.disabled = true
      }

      // Check if API is available
      if (!window.api || !window.api.getStartupItems) {
        console.error("API or getStartupItems method not available")
        if (startupItemsContent) {
          startupItemsContent.innerHTML = `
            <div class="alert alert-danger">
              <p>Error: Startup manager API not available.</p>
              <p>This could be due to a configuration issue with the application.</p>
            </div>
          `
        }
        if (refreshStartupItemsBtn) {
          refreshStartupItemsBtn.disabled = false
        }
        return
      }

      // Call the API
      const response = await window.api.getStartupItems()

      if (response.success) {
        displayStartupItems(response.data)
      } else {
        if (startupItemsContent) {
          startupItemsContent.innerHTML = `
            <div class="alert alert-danger">
              <p>Error: ${response.error || "Unknown error occurred"}</p>
            </div>
          `
        }
      }
    } catch (error) {
      console.error("Error loading startup items:", error)
      if (startupItemsContent) {
        startupItemsContent.innerHTML = `
          <div class="alert alert-danger">
            <p>Error loading startup items: ${error.message || "Unknown error"}</p>
          </div>
        `
      }
    } finally {
      if (refreshStartupItemsBtn) {
        refreshStartupItemsBtn.disabled = false
      }
    }
  }

  // Function to add a startup item
  async function addStartupItem() {
    try {
      if (!startupItemNameInput || !startupItemPathInput || !startupItemTypeSelect) {
        showNotification("Missing input fields", "error")
        return
      }

      const name = startupItemNameInput.value.trim()
      const path = startupItemPathInput.value.trim()
      const type = startupItemTypeSelect.value

      if (!name || !path) {
        showNotification("Name and path are required", "error")
        return
      }

      if (addStartupItemBtn) {
        addStartupItemBtn.disabled = true
        addStartupItemBtn.innerHTML =
          '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding...'
      }

      // Check if API is available
      if (!window.api || !window.api.addStartupItem) {
        console.error("API or addStartupItem method not available")
        showNotification("Startup manager API not available", "error")
        if (addStartupItemBtn) {
          addStartupItemBtn.disabled = false
          addStartupItemBtn.textContent = "Add Startup Item"
        }
        return
      }

      // Call the API
      const response = await window.api.addStartupItem({ name, path, type })

      if (response.success) {
        showNotification("Startup item added successfully", "success")
        // Clear inputs
        startupItemNameInput.value = ""
        startupItemPathInput.value = ""
        // Refresh the list
        loadStartupItems()
      } else {
        showNotification(`Error adding startup item: ${response.error}`, "error")
      }
    } catch (error) {
      console.error("Error adding startup item:", error)
      showNotification(`Error adding startup item: ${error.message}`, "error")
    } finally {
      if (addStartupItemBtn) {
        addStartupItemBtn.disabled = false
        addStartupItemBtn.textContent = "Add Startup Item"
      }
    }
  }

  function displayStartupItems(items) {
    if (!startupItemsContent) return

    if (!items || items.length === 0) {
      startupItemsContent.innerHTML = `
        <div class="alert alert-info">
          <p>No startup items found.</p>
        </div>
      `
      return
    }

    // Group items by type
    const groupedItems = {}
    for (const item of items) {
      if (!groupedItems[item.type]) {
        groupedItems[item.type] = []
      }
      groupedItems[item.type].push(item)
    }

    let html = `<h5>Startup Items (${items.length})</h5>`

    // Create a card for each type
    for (const [type, typeItems] of Object.entries(groupedItems)) {
      html += `
        <div class="card mb-4">
          <div class="card-header">
            ${type}
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-sm table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Path</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
      `

      for (const item of typeItems) {
        const statusBadgeClass = item.enabled ? "bg-success" : "bg-secondary"
        const statusText = item.enabled ? "Enabled" : "Disabled"

        html += `
          <tr>
            <td>${item.name}</td>
            <td>${item.path}</td>
            <td><span class="badge ${statusBadgeClass}">${statusText}</span></td>
            <td>
              <button class="btn btn-sm btn-outline-${item.enabled ? "warning" : "success"} me-1 toggle-startup-btn" 
                data-id="${item.id}" data-enabled="${item.enabled}">
                ${item.enabled ? "Disable" : "Enable"}
              </button>
              <button class="btn btn-sm btn-outline-danger delete-startup-btn" data-id="${item.id}">Remove</button>
            </td>
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
    }

    startupItemsContent.innerHTML = html

    // Add event listeners to buttons
    document.querySelectorAll(".toggle-startup-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const id = event.target.getAttribute("data-id")
        const enabled = event.target.getAttribute("data-enabled") === "true"
        await toggleStartupItem(id, !enabled)
      })
    })

    document.querySelectorAll(".delete-startup-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const id = event.target.getAttribute("data-id")
        await removeStartupItem(id)
      })
    })
  }

  async function toggleStartupItem(id, enable) {
    try {
      const response = await window.api.toggleStartupItem(id, enable)
      if (response.success) {
        showNotification(`Startup item ${enable ? "enabled" : "disabled"} successfully`, "success")
        loadStartupItems()
      } else {
        showNotification(`Error ${enable ? "enabling" : "disabling"} startup item: ${response.error}`, "error")
      }
    } catch (error) {
      console.error(`Error toggling startup item:`, error)
      showNotification(`Error toggling startup item: ${error.message}`, "error")
    }
  }

  async function removeStartupItem(id) {
    try {
      if (confirm("Are you sure you want to remove this startup item?")) {
        const response = await window.api.removeStartupItem(id)
        if (response.success) {
          showNotification("Startup item removed successfully", "success")
          loadStartupItems()
        } else {
          showNotification(`Error removing startup item: ${response.error}`, "error")
        }
      }
    } catch (error) {
      console.error("Error removing startup item:", error)
      showNotification(`Error removing startup item: ${error.message}`, "error")
    }
  }

  // Mock showNotification function (replace with your actual implementation)
  function showNotification(message, type) {
    console.log(`Notification: ${message} (Type: ${type})`)
    // In a real application, you would use a proper notification system here.
  }
}

