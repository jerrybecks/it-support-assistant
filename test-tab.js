// Test Tab Functionality
document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing Test Tab...")

  const testSystemInfoBtn = document.getElementById("test-system-info")
  const testNetworkInfoBtn = document.getElementById("test-network-info")
  const testPerformanceBtn = document.getElementById("test-performance")
  const testCacheBtn = document.getElementById("test-cache")
  const testResultDiv = document.getElementById("test-result")

  if (!testResultDiv) {
    console.error("Test result div not found!")
    return
  }

  if (testSystemInfoBtn) {
    console.log("Test system info button found")
    testSystemInfoBtn.addEventListener("click", async () => {
      console.log("Testing system info...")
      testResultDiv.innerHTML = "<p>Testing System Info...</p>"
      try {
        const systemInfo = await window.api.getSystemInfo()
        console.log("System info result:", systemInfo)
        testResultDiv.innerHTML = "<pre>" + JSON.stringify(systemInfo, null, 2) + "</pre>"
      } catch (error) {
        console.error("Error testing system info:", error)
        testResultDiv.innerHTML = '<p class="text-danger">Error: ' + error.message + "</p>"
      }
    })
  } else {
    console.error("Test system info button not found!")
  }

  if (testNetworkInfoBtn) {
    console.log("Test network info button found")
    testNetworkInfoBtn.addEventListener("click", async () => {
      console.log("Testing network info...")
      testResultDiv.innerHTML = "<p>Testing Network Info...</p>"
      try {
        const networkInfo = await window.api.getNetworkInfo()
        console.log("Network info result:", networkInfo)
        testResultDiv.innerHTML = "<pre>" + JSON.stringify(networkInfo, null, 2) + "</pre>"
      } catch (error) {
        console.error("Error testing network info:", error)
        testResultDiv.innerHTML = '<p class="text-danger">Error: ' + error.message + "</p>"
      }
    })
  } else {
    console.error("Test network info button not found!")
  }

  if (testPerformanceBtn) {
    console.log("Test performance button found")
    testPerformanceBtn.addEventListener("click", async () => {
      console.log("Testing performance...")
      testResultDiv.innerHTML = "<p>Testing Performance...</p>"
      try {
        const performanceMetrics = await window.api.getPerformanceMetrics()
        console.log("Performance metrics result:", performanceMetrics)
        testResultDiv.innerHTML = "<pre>" + JSON.stringify(performanceMetrics, null, 2) + "</pre>"
      } catch (error) {
        console.error("Error testing performance:", error)
        testResultDiv.innerHTML = '<p class="text-danger">Error: ' + error.message + "</p>"
      }
    })
  } else {
    console.error("Test performance button not found!")
  }

  if (testCacheBtn) {
    console.log("Test cache button found")
    testCacheBtn.addEventListener("click", async () => {
      console.log("Testing cache...")
      testResultDiv.innerHTML = "<p>Testing Cache...</p>"
      try {
        const cacheSize = await window.api.scanCache()
        console.log("Cache size result:", cacheSize)
        testResultDiv.innerHTML = "<pre>" + JSON.stringify(cacheSize, null, 2) + "</pre>"
      } catch (error) {
        console.error("Error testing cache:", error)
        testResultDiv.innerHTML = '<p class="text-danger">Error: ' + error.message + "</p>"
      }
    })
  } else {
    console.error("Test cache button not found!")
  }

  console.log("Test Tab initialization complete")
})

