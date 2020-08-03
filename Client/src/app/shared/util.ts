export function ordinalSuffix(i: number): string {
  const singles = i % 10;
  const tensAndSingles = i % 100;
  if (singles === 1 && tensAndSingles !== 11) {
    return 'st';
  }
  if (singles === 2 && tensAndSingles !== 12) {
    return 'nd';
  }
  if (singles === 3 && tensAndSingles !== 13) {
    return 'rd';
  }
  return 'th';
}
