export interface EstimateInput {
  baselineWeeks: number;
  riskPoints: number;
  unknownPoints: number;
}

export interface DeliveryEstimate {
  optimisticWeeks: number;
  likelyWeeks: number;
  contingencyWeeks: number;
  confidence: 'high' | 'moderate' | 'low';
}

export function estimateDeliveryRange(input: EstimateInput): DeliveryEstimate {
  const uncertainty = Math.max(0, input.riskPoints) + Math.max(0, input.unknownPoints);
  const likelyWeeks = Math.ceil(input.baselineWeeks + uncertainty / 2);
  const contingencyWeeks = Math.ceil(likelyWeeks + uncertainty);
  const confidence: DeliveryEstimate['confidence'] = uncertainty <= 1 ? 'high' : uncertainty <= 3 ? 'moderate' : 'low';
  return { optimisticWeeks: input.baselineWeeks, likelyWeeks, contingencyWeeks, confidence };
}
