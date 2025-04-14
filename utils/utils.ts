export function usernameGenerator(): string {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `user${randomNumber}`;
}

export function shuffleArray(array: any[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function randomAds() {
  return Math.floor(Math.random() * 2);
}
