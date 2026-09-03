/**
 * Triggers a subtle water-drop expanding ripple effect inside any clicked button or interactive container.
 */
export function triggerMicroRipple(event: React.MouseEvent<HTMLElement>, isDark: boolean = false) {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();

  const circle = document.createElement("span");
  const diameter = Math.max(rect.width, rect.height);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.classList.add(isDark ? "ripple-wave-dark" : "ripple-wave");

  const existingRipple = button.getElementsByClassName(isDark ? "ripple-wave-dark" : "ripple-wave")[0];
  if (existingRipple) {
    existingRipple.remove();
  }

  button.appendChild(circle);
  setTimeout(() => {
    circle.remove();
  }, 650);
}
