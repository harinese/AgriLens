const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;

export async function getAgricultureNews() {
  const keywords = 'agriculture OR farming OR pesticide OR crop OR harvest';
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(keywords)}&lang=en&max=10&apikey=${GNEWS_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('News fetch error:', error);
    // Return fallback curated news if API fails
    return getFallbackNews();
  }
}

function getFallbackNews() {
  return [
    {
      title: 'New Bio-Pesticide Approved for Organic Farming',
      description: 'A groundbreaking bio-pesticide derived from neem extract has been approved for use in organic farming, offering effective pest control without harmful chemicals.',
      url: '#',
      image: null,
      publishedAt: new Date().toISOString(),
      source: { name: 'AgriNews', url: '#' }
    },
    {
      title: 'Government Launches New Crop Insurance Scheme',
      description: 'A comprehensive crop insurance scheme has been launched to protect farmers against natural calamities, pests, and diseases affecting their harvest.',
      url: '#',
      image: null,
      publishedAt: new Date().toISOString(),
      source: { name: 'FarmPolicy', url: '#' }
    },
    {
      title: 'Drip Irrigation Saves 40% Water in Summer Crops',
      description: 'Studies show that drip irrigation systems can save up to 40% water compared to flood irrigation, while increasing crop yields by 20-30%.',
      url: '#',
      image: null,
      publishedAt: new Date().toISOString(),
      source: { name: 'WaterWise', url: '#' }
    },
    {
      title: 'Rising Demand for Organic Vegetables in Urban Markets',
      description: 'Urban consumers are increasingly seeking organic vegetables, creating new market opportunities for farmers who adopt organic farming practices.',
      url: '#',
      image: null,
      publishedAt: new Date().toISOString(),
      source: { name: 'MarketWatch', url: '#' }
    },
    {
      title: 'AI-Powered Crop Monitoring Gains Traction',
      description: 'Artificial intelligence is revolutionizing agriculture with smart crop monitoring systems that can detect diseases early and optimize irrigation schedules.',
      url: '#',
      image: null,
      publishedAt: new Date().toISOString(),
      source: { name: 'TechFarm', url: '#' }
    },
    {
      title: 'Best Practices for Soil Health Management',
      description: 'Experts recommend crop rotation, cover cropping, and minimal tillage to maintain soil health and improve long-term agricultural productivity.',
      url: '#',
      image: null,
      publishedAt: new Date().toISOString(),
      source: { name: 'SoilScience', url: '#' }
    }
  ];
}
