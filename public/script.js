document.addEventListener('DOMContentLoaded', () => {
    const exerciseForm = document.getElementById('exercise-form');
  
    exerciseForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const userId = document.getElementById('uid').value;
      const description = document.getElementById('desc').value;
      const duration = document.getElementById('dur').value;
      const date = document.getElementById('date').value;
  
      const response = await fetch(`/api/users/${userId}/exercises`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ description, duration, date }),
      });
  
      const data = await response.json();
      console.log(data);
    });
  });
  