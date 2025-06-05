import {
  DemographicsResult,
  Gender,
  AgeGroup,
  Emotion,
  EthnicGroup,
} from "@/types";

export function aggregateDemographicsData(results: DemographicsResult[]) {
  if (!Array.isArray(results) || results.length === 0) {
    return {
      total: 0,
      gender: Object.values(Gender).reduce(
        (acc, g) => ({ ...acc, [g]: 0 }),
        {} as Record<Gender, number>
      ),
      age: Object.values(AgeGroup).reduce(
        (acc, a) => ({ ...acc, [a]: 0 }),
        {} as Record<AgeGroup, number>
      ),
      emotion: Object.values(Emotion).reduce(
        (acc, e) => ({ ...acc, [e]: 0 }),
        {} as Record<Emotion, number>
      ),
      ethnicity: Object.values(EthnicGroup).reduce(
        (acc, e) => ({ ...acc, [e]: 0 }),
        {} as Record<EthnicGroup, number>
      ),
    };
  }

  const total = results.length;

  const genderCounts = Object.values(Gender).reduce((acc, gender) => {
    acc[gender] = results.filter((r) => r.gender === gender).length;
    return acc;
  }, {} as Record<Gender, number>);

  const ageCounts = Object.values(AgeGroup).reduce((acc, age) => {
    acc[age] = results.filter((r) => r.age === age).length;
    return acc;
  }, {} as Record<AgeGroup, number>);

  const emotionCounts = Object.values(Emotion).reduce((acc, emotion) => {
    acc[emotion] = results.filter((r) => r.emotion === emotion).length;
    return acc;
  }, {} as Record<Emotion, number>);

  const ethnicityCounts = Object.values(EthnicGroup).reduce(
    (acc, ethnicity) => {
      acc[ethnicity] = results.filter((r) => r.ethnicity === ethnicity).length;
      return acc;
    },
    {} as Record<EthnicGroup, number>
  );

  return {
    total,
    gender: genderCounts,
    age: ageCounts,
    emotion: emotionCounts,
    ethnicity: ethnicityCounts,
  };
}

export function prepareChartData<T extends string>(
  data: Record<T, number>,
  labelFormatter?: (key: T) => string
) {
  return Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: labelFormatter ? labelFormatter(key as T) : key,
      value: value as number,
    }));
}

export function prepareTimeSeriesData(results: DemographicsResult[]) {
  if (!Array.isArray(results) || results.length === 0) {
    return [];
  }

  const groupedByDate = results.reduce((acc, result) => {
    const date = new Date(result.timestamp).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(result);
    return acc;
  }, {} as Record<string, DemographicsResult[]>);

  return Object.entries(groupedByDate)
    .map(([date, dayResults]) => {
      const aggregated = aggregateDemographicsData(dayResults);
      return {
        timestamp: date,
        total: dayResults.length,
        male: aggregated.gender.male || 0,
        female: aggregated.gender.female || 0,
      };
    })
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}
