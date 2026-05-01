// backend/utils/urgencyDetector.js
export const detectUrgency = (description, category, peopleCount) => { // [cite: 107]
  let score = 0; // [cite: 108]
  const text = description.toLowerCase(); // [cite: 109]
  
  if (category === "medical" || category === "blood") score += 5; // [cite: 110]
  if (category === "food") score += 3; // [cite: 111]
  
  if (peopleCount >= 10) score += 3; // [cite: 112]
  if (peopleCount >= 50) score += 5; // [cite: 113]
  
  if (text.includes("urgent") || text.includes("emergency")) score += 5; // [cite: 114]
  if (text.includes("critical") || text.includes("dying")) score += 6; // [cite: 115]
  if (text.includes("hungry") || text.includes("no food")) score += 3; // [cite: 116]
  
  if (score >= 8) return "high"; // [cite: 117]
  if (score >= 4) return "medium"; // [cite: 118]
  return "low"; // [cite: 119]
}; // [cite: 120]