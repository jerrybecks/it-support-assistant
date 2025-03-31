// Disk Analyzer Module
document.addEventListener("DOMContentLoaded", () => {
  console.log("Disk Analyzer module initializing")
  initDiskAnalyzer()
})

/**
 * Disk Analyzer Module
 */
function initDiskAnalyzer() {
  const diskHealthContent = document.getElementById("disk-health-content")
  const diskSpaceContent = document.getElementById("disk-space-content")
  const largeFilesContent = document.getElementById("large-files-content")
  const checkDiskHealthBtn = document.getElementById("check-disk-health-btn")
  const analyzeDiskSpaceBtn = document.getElementById("analyze-disk-space-btn")
  const findLargeFilesBtn = document.getElementById("find-large-files-btn")

  // Set up check disk health button
  if (checkDiskHealthBtn) {
    checkDiskHealthBtn.addEventListener("click", checkDiskHealth)
  }

  // Set up analyze disk space button
  if (analyzeDiskSpaceBtn) {
    analyzeDiskSpaceBtn.addEventListener("click", analyzeDiskSpace)
  }

  // Set up find large files button
  if (findLargeFilesBtn) {
    findLargeFilesBtn.addEventListener("click", findLargeFiles)
  }

  // Function to check disk health
  async function checkDiskHealth() {
    try {
      if (diskHealthContent) {
        diskHealthContent.innerHTML = `
          <div class="alert alert-info">
            <p>Checking disk health... <div class="spinner-border spinner-border-sm" role="status"></div></p>
          </div>
        `
      }

      if (checkDiskHealthBtn) {
        checkDiskHealthBtn.disabled = true
        checkDiskHealthBtn.innerHTML =
          '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Checking...'
      }

      // Check if API is available
      if (!window.api || !window.api.checkDiskHealth) {
        console.error("API or checkDiskHealth method not available")
        if (diskHealthContent) {
          diskHealthContent.innerHTML = `
            <div class="alert alert-danger">
              <p>Error: Disk health API not available.</p>
              <p>This could be due to a configuration issue with the application.</p>
            </div>
          `
        }
        if (checkDiskHealthBtn) {
          checkDiskHealthBtn.disabled = false
          checkDiskHealthBtn.textContent = "Check Disk Health"
        }
        return
      }

      // Call the API
      const response = await window.api.checkDiskHealth()

      if (response.success) {
        displayDiskHealth(response.data)
      } else {
        if (diskHealthContent) {
          diskHealthContent.innerHTML = `
            <div class="alert alert-danger">
              <p>Error: ${response.error || "Unknown error occurred"}</p>
            </div>
          `
        }
      }
    } catch (error) {
      console.error("Error checking disk health:", error)
      if (diskHealthContent) {
        diskHealthContent.innerHTML = `
          <div class="alert alert-danger">
            <p>Error checking disk health: ${error.message || "Unknown error"}</p>
          </div>
        `
      }
    } finally {
      if (checkDiskHealthBtn) {
        checkDiskHealthBtn.disabled = false
        checkDiskHealthBtn.textContent = "Check Disk Health"
      }
    }
  }

  // Function to analyze disk space
  async function analyzeDiskSpace() {
    try {
      if (diskSpaceContent) {
        diskSpaceContent.innerHTML = `
          <div class="alert alert-info">
            <p>Analyzing disk space... <div class="spinner-border spinner-border-sm" role="status"></div></p>
          </div>
        `
      }

      if (analyzeDiskSpaceBtn) {
        analyzeDiskSpaceBtn.disabled = true
        analyzeDiskSpaceBtn.innerHTML =
          '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Analyzing...'
      }

      // Check if API is available
      if (!window.api || !window.api.analyzeDiskSpace) {
        console.error("API or analyzeDiskSpace method not available")
        if (diskSpaceContent) {
          diskSpaceContent.innerHTML = `
            <div class="alert alert-danger">
              <p>Error: Disk space analysis API not available.</p>
              <p>This could be due to a configuration issue with the application.</p>
            </div>
          `
        }
        if (analyzeDiskSpaceBtn) {
          analyzeDiskSpaceBtn.disabled = false
          analyzeDiskSpaceBtn.textContent = "Analyze Disk Space"
        }
        return
      }

      // Call the API
      const response = await window.api.analyzeDiskSpace()

      if (response.success) {
        displayDiskSpace(response.data)
      } else {
        if (diskSpaceContent) {
          diskSpaceContent.innerHTML = `
            <div class="alert alert-danger">
              <p>Error: ${response.error || "Unknown error occurred"}</p>
            </div>
          `
        }
      }
    } catch (error) {
      console.error("Error analyzing disk space:", error)
      if (diskSpaceContent) {
        diskSpaceContent.innerHTML = `
          <div class="alert alert-danger">
            <p>Error analyzing disk space: ${error.message || "Unknown error"}</p>
          </div>
        `
      }
    } finally {
      if (analyzeDiskSpaceBtn) {
        analyzeDiskSpaceBtn.disabled = false
        analyzeDiskSpaceBtn.textContent = "Analyze Disk Space"
      }
    }
  }

  // Function to find large files
  async function findLargeFiles() {
    try {
      if (largeFilesContent) {
        largeFilesContent.innerHTML = `
          <div class="alert alert-info">
            <p>Finding large files... <div class="spinner-border spinner-border-sm" role="status"></div></p>
          </div>
        `
      }

      if (findLargeFilesBtn) {
        findLargeFilesBtn.disabled = true
        findLargeFilesBtn.innerHTML =
          '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Finding...'
      }

      // Check if API is available
      if (!window.api || !window.api.findLargeFiles) {
        console.error("API or findLargeFiles method not available")
        if (largeFilesContent) {
          largeFilesContent.innerHTML = `
            <div class="alert alert-danger">
              <p>Error: Find large files API not available.</p>
              <p>This could be due to a configuration issue with the application.</p>
            </div>
          `
        }
        if (findLargeFilesBtn) {
          findLargeFilesBtn.disabled = false
          findLargeFilesBtn.textContent = "Find Large Files"
        }
        return
      }

      // Call the API
      const response = await window.api.findLargeFiles()

      if (response.success) {
        displayLargeFiles(response.data)
      } else {
        if (largeFilesContent) {
          largeFilesContent.innerHTML = `
            <div class="alert alert-danger">
              <p>Error: ${response.error || "Unknown error occurred"}</p>
            </div>
          `
        }
      }
    } catch (error) {
      console.error("Error finding large files:", error)
      if (largeFilesContent) {
        largeFilesContent.innerHTML = `
          <div class="alert alert-danger">
            <p>Error finding large files: ${error.message || "Unknown error"}</p>
          </div>
        `
      }
    } finally {
      if (findLargeFilesBtn) {
        findLargeFilesBtn.disabled = false
        findLargeFilesBtn.textContent = "Find Large Files"
      }
    }
  }

  function displayDiskHealth(healthData) {
    if (!diskHealthContent) return

    let html = '<div class="card">'
    html += '<div class="card-body">'

    // SMART status
    const smartStatusClass = healthData.smartStatus === "Verified" ? "text-success" : "text-danger"
    html += `
      <div class="mb-4">
        <h5>SMART Status</h5>
        <div class="d-flex align-items-center">
          <div class="display-4 ${smartStatusClass} me-3">
            ${healthData.smartStatus === "Verified" ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-triangle"></i>'}
          </div>
          <div>
            <h4 class="${smartStatusClass}">${healthData.smartStatus}</h4>
            <p>${healthData.smartStatus === "Verified" ? "Your disk is healthy" : "Your disk may have issues"}</p>
          </div>
        </div>
      </div>
    `

    // Disk information
    html += `
      <div class="mb-4">
        <h5>Disk Information</h5>
        <div class="row">
          <div class="col-md-6">
            <p><strong>Model:</strong> ${healthData.model}</p>
            <p><strong>Serial Number:</strong> ${healthData.serialNumber}</p>
            <p><strong>Firmware:</strong> ${healthData.firmware}</p>
          </div>
          <div class="col-md-6">
            <p><strong>Capacity:</strong> ${healthData.capacity}</p>
            <p><strong>Interface:</strong> ${healthData.interface}</p>
            <p><strong>Power On Hours:</strong> ${healthData.powerOnHours || "N/A"}</p>
          </div>
        </div>
      </div>
    `

    // SMART attributes if available
    if (healthData.attributes && healthData.attributes.length > 0) {
      html += `
        <div>
          <h5>SMART Attributes</h5>
          <div class="table-responsive">
            <table class="table table-sm table-striped">
              <thead>
                <tr>
                  <th>Attribute</th>
                  <th>Value</th>
                  <th>Threshold</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
      `

      for (const attr of healthData.attributes) {
        const statusClass = attr.status === "OK" ? "text-success" : "text-danger"
        html += `
          <tr>
            <td>${attr.name}</td>
            <td>${attr.value}</td>
            <td>${attr.threshold}</td>
            <td class="${statusClass}">${attr.status}</td>
          </tr>
        `
      }

      html += `
              </tbody>
            </table>
          </div>
        </div>
      `
    }

    html += "</div></div>"
    diskHealthContent.innerHTML = html
  }

  function displayDiskSpace(spaceData) {
    if (!diskSpaceContent) return

    let html = '<div class="row">'

    // Overview card
    html += `
      <div class="col-md-6 mb-4">
        <div class="card h-100">
          <div class="card-header">
            Disk Space Overview
          </div>
          <div class="card-body">
            <div class="mb-3">
              <h5>${spaceData.name}</h5>
              <p class="text-muted">${spaceData.mountPoint}</p>
            </div>
            <div class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span>Used Space</span>
                <span>${spaceData.usedPercentage}%</span>
              </div>
              <div class="progress">
                <div class="progress-bar ${spaceData.usedPercentage > 90 ? "bg-danger" : spaceData.usedPercentage > 70 ? "bg-warning" : "bg-success"}" 
                  role="progressbar" style="width: ${spaceData.usedPercentage}%;" 
                  aria-valuenow="${spaceData.usedPercentage}" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
            <div>
              <p><strong>Total:</strong> ${spaceData.total}</p>
              <p><strong>Used:</strong> ${spaceData.used} (${spaceData.usedPercentage}%)</p>
              <p><strong>Free:</strong> ${spaceData.free} (${100 - spaceData.usedPercentage}%)</p>
            </div>
          </div>
        </div>
      </div>
    `

    // Space by category card
    if (spaceData.categories && spaceData.categories.length > 0) {
      html += `
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-header">
              Space Usage by Category
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Size</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
      `

      for (const category of spaceData.categories) {
        html += `
          <tr>
            <td>${category.name}</td>
            <td>${category.size}</td>
            <td>
              <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: ${category.percentage}%;" 
                  aria-valuenow="${category.percentage}" aria-valuemin="0" aria-valuemax="100">
                  ${category.percentage}%
                </div>
              </div>
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
        </div>
      `
    }

    html += "</div>"
    diskSpaceContent.innerHTML = html
  }

  // Function to show notification
  function showNotification(message, type = "info") {
    const notificationDiv = document.createElement("div")
    notificationDiv.className = `alert alert-${type} alert-dismissible fade show`
    notificationDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `

    document.body.appendChild(notificationDiv)

    // Automatically remove the notification after 5 seconds
    setTimeout(() => {
      notificationDiv.remove()
    }, 5000)
  }

  function displayLargeFiles(files) {
    if (!largeFilesContent) return

    if (!files || files.length === 0) {
      largeFilesContent.innerHTML = `
        <div class="alert alert-info">
          <p>No large files found.</p>
        </div>
      `
      return
    }

    let html = `<h5>Large Files (${files.length})</h5>`
    html += '<div class="table-responsive">'
    html += '<table class="table table-sm table-striped">'
    html += "<thead><tr><th>File</th><th>Size</th><th>Modified</th><th>Actions</th></tr></thead>"
    html += "<tbody>"

    for (const file of files) {
      html += `
        <tr>
          <td>${file.path}</td>
          <td>${file.size}</td>
          <td>${new Date(file.modified).toLocaleString()}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-1 open-file-btn" data-path="${file.path}">Open</button>
            <button class="btn btn-sm btn-outline-danger delete-file-btn" data-path="${file.path}">Delete</button>
          </td>
        </tr>
      `
    }

    html += "</tbody></table></div>"
    largeFilesContent.innerHTML = html

    // Add event listeners to buttons
    document.querySelectorAll(".open-file-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const filePath = event.target.getAttribute("data-path")
        await window.api.openFile(filePath)
      })
    })

    document.querySelectorAll(".delete-file-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const filePath = event.target.getAttribute("data-path")
        if (confirm(`Are you sure you want to delete ${filePath}?`)) {
          try {
            const result = await window.api.deleteFile(filePath)
            if (result.success) {
              showNotification("File deleted successfully", "success")
              findLargeFiles() // Refresh the list
            } else {
              showNotification(`Error deleting file: ${result.error}`, "error")
            }
          } catch (error) {
            showNotification(`Error deleting file: ${error.message}`, "error")
          }
        }
      })
    })
  }
}

