function closeToast(button) {
  // Find the parent toast element of the clicked button
  var toast = button.closest('.toast');
  
  if (toast) {
      // Hide the specific toast
      toast.style.display = 'none';
  }
}
