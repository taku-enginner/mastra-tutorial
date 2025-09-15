import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

// 天気予報のスキー合定義。予報取得と行動計画の入力に使用。
const forecastSchema = z.object({
  date: z.string(),
  maxTemp: z.number(),
  minTemp: z.number(),
  precipitationChance: z.number(),
  condition: z.string(),
  location: z.string(),
});

// 天気コードと天気のマッピング
function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: '快晴',
    1: 'ほぼ快晴',
    2: '一部曇り',
    3: '曇り',
    45: '霧',
    48: '霧氷',
    51: '弱い霧雨',
    53: '適度な霧雨',
    55: '濃い霧雨',
    61: '弱い雨',
    63: '適度な雨',
    65: '強い雨',
    71: '弱い雪',
    73: '適度な雪',
    75: '強い雪',
    95: '雷雨',
  };
  return conditions[code] || 'Unknown';
}

// 天気予報取得ステップ
const fetchWeather = createStep({
  id: 'fetch-weather',
  description: '与えられた場所の天気予報を取得',
  inputSchema: z.object({
    city: z.string().describe('天気取得のための場所'),
  }),
  outputSchema: forecastSchema,
  // asyncは非同期関数。APIへのリクエストをawaitを使って実行する
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('場所の入力がありません');
    }

    // TODO:あとでenvファイルにする
    const API_KEY = "AIzaSyBIOxK-SgqILz1EdnDrpjVDYRlPN2NW96I";

    const geocodingUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=tokyo&key=' + API_KEY;

    const result = await fetch(geocodingUrl);

    const locationData = result[0];
    console.log(locationData);
    console.log("テストテストテスト");
    const geocodingData = {
      lautitude: locationData.geometry.location.lat,
      longitude: locationData.geometry.location.lng,
      name: locationData.address_components[0].long_name,
    };

    //if (!geocodingData.results?.[0]) {
      //throw new Error(`都市 '${geocodingData.name}' が見つかりません`);
    //};

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${geocodingData.lautitude}&longitude=${geocodingData.longitude}&current=precipitation,weathercode&timezone=auto,&hourly=precipitation_probability,temperature_2m`;
    const response = await fetch(weatherUrl);
    const data = (await response.json()) as {
      current: {
        time: string;
        precipitation: number;
        weathercode: number;
      };
      hourly: {
        precipitation_probability: number[];
        temperature_2m: number[];
      };
    };

    const forecast = {
      date: new Date().toISOString(),
      maxTemp: Math.max(...data.hourly.temperature_2m),
      minTemp: Math.min(...data.hourly.temperature_2m),
      condition: getWeatherCondition(data.current.weathercode),
      precipitationChance: data.hourly.precipitation_probability.reduce(
        (acc, curr) => Math.max(acc, curr),
        0,
      ),
      location: name,
    };

    return forecast;
  },
});

const planActivities = createStep({
  id: 'plan-activities',
  description: 'Suggests activities based on weather conditions',
  inputSchema: forecastSchema,
  outputSchema: z.object({
    activities: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const forecast = inputData;

    if (!forecast) {
      throw new Error('Forecast data not found');
    }

    const agent = mastra?.getAgent('weatherAgent');
    if (!agent) {
      throw new Error('Weather agent not found');
    }

    const prompt = `Based on the following weather forecast for ${forecast.location}, suggest appropriate activities:
      ${JSON.stringify(forecast, null, 2)}
      For each day in the forecast, structure your response exactly as follows:

      📅 [Day, Month Date, Year]
      ═══════════════════════════

      🌡️ WEATHER SUMMARY
      • Conditions: [brief description]
      • Temperature: [X°C/Y°F to A°C/B°F]
      • Precipitation: [X% chance]

      🌅 MORNING ACTIVITIES
      Outdoor:
      • [Activity Name] - [Brief description including specific location/route]
        Best timing: [specific time range]
        Note: [relevant weather consideration]

      🌞 AFTERNOON ACTIVITIES
      Outdoor:
      • [Activity Name] - [Brief description including specific location/route]
        Best timing: [specific time range]
        Note: [relevant weather consideration]

      🏠 INDOOR ALTERNATIVES
      • [Activity Name] - [Brief description including specific venue]
        Ideal for: [weather condition that would trigger this alternative]

      ⚠️ SPECIAL CONSIDERATIONS
      • [Any relevant weather warnings, UV index, wind conditions, etc.]

      Guidelines:
      - Suggest 2-3 time-specific outdoor activities per day
      - Include 1-2 indoor backup options
      - For precipitation >50%, lead with indoor activities
      - All activities must be specific to the location
      - Include specific venues, trails, or locations
      - Consider activity intensity based on temperature
      - Keep descriptions concise but informative

      Maintain this exact formatting for consistency, using the emoji and section headers as shown.`;

    const response = await agent.stream([
      {
        role: 'user',
        content: prompt,
      },
    ]);

    let activitiesText = '';

    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
      activitiesText += chunk;
    }

    return {
      activities: activitiesText,
    };
  },
});

const weatherWorkflow = createWorkflow({
  id: 'weather-workflow',
  inputSchema: z.object({
    city: z.string().describe('The city to get the weather for'),
  }),
  outputSchema: z.object({
    activities: z.string(),
  }),
})
  .then(fetchWeather)
  .then(planActivities);

weatherWorkflow.commit();

export { weatherWorkflow };
