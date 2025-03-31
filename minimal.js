console.log('Minimal renderer starting');

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded');
  
  // Update system info with static content
  document.getElementById('system-info').innerHTML = 'CPU: Sample CPU';
  document.getElementById('memory-usage').innerHTML = 'Memory: 8GB';
  document.getElementById('disk-usage').innerHTML = 'Disk: 500GB';
  
  // Add tab switching
  document.querySelectorAll('.tab-btn').forEach(function(button) {
    button.addEventListener('click', function() {
      // Remove active class from all tabs and content
      document.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.classList.remove('active');
      });
      document.querySelectorAll('.tab-content').forEach(function(content) {
        content.classList.remove('active');
      });
      
      // Add active class to clicked tab and corresponding content
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
});