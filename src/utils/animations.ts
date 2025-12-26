export const animateNumber = (
  element: HTMLElement,
  start: number,
  end: number,
  duration: number = 1000,
  callback?: (value: number) => string
): void => {
  const startTime = performance.now();
  const difference = end - start;

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = start + (difference * easeOut);

    if (callback) {
      element.textContent = callback(current);
    } else {
      element.textContent = Math.round(current).toString();
    }

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

export const triggerScreenShake = (element: HTMLElement): void => {
  element.classList.add('screen-shake');
  setTimeout(() => {
    element.classList.remove('screen-shake');
  }, 500);
};

export const triggerButtonPress = (element: HTMLElement): void => {
  element.classList.add('button-press');
  setTimeout(() => {
    element.classList.remove('button-press');
  }, 200);
};

