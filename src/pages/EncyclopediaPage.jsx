import { useState } from 'react';
import { generateCropProfile } from '../services/geminiApi';

const commonCrops = [
  { name: 'Rice', category: 'Cereal' },
  { name: 'Wheat', category: 'Cereal' },
  { name: 'Corn (Maize)', category: 'Cereal' },
  { name: 'Tomato', category: 'Vegetable' },
  { name: 'Potato', category: 'Vegetable' },
  { name: 'Onion', category: 'Vegetable' },
  { name: 'Cotton', category: 'Cash Crop' },
  { name: 'Sugarcane', category: 'Cash Crop' },
  { name: 'Soybean', category: 'Legume' },
  { name: 'Chickpea', category: 'Legume' },
  { name: 'Mango', category: 'Fruit' },
  { name: 'Banana', category: 'Fruit' },
  { name: 'Apple', category: 'Fruit' },
  { name: 'Grape', category: 'Fruit' },
  { name: 'Chili Pepper', category: 'Spice' },
  { name: 'Turmeric', category: 'Spice' },
  { name: 'Tea', category: 'Beverage' },
  { name: 'Coffee', category: 'Beverage' },
  { name: 'Sunflower', category: 'Oilseed' },
  { name: 'Groundnut', category: 'Oilseed' },
  { name: 'Cabbage', category: 'Vegetable' },
  { name: 'Carrot', category: 'Vegetable' },
  { name: 'Cucumber', category: 'Vegetable' },
  { name: 'Okra (Lady Finger)', category: 'Vegetable' },
];

function CropProfileDisplay({ profile }) {
  if (!profile) return null;

  return (
    <div className="page-transition space-y-4">
      {/* Header */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold text-stone-900 mb-0.5">{profile.crop_name}</h2>
        <p className="text-sm text-stone-500 italic mb-3">{profile.scientific_name}</p>
        <p className="text-sm text-stone-700 leading-relaxed">{profile.description}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {[
          { label: 'Season', value: profile.growing_season },
          { label: 'Temperature', value: profile.ideal_temperature },
          { label: 'Soil', value: profile.soil_type },
          { label: 'Water Needs', value: profile.water_needs },
          { label: 'Sunlight', value: profile.sunlight },
          { label: 'Spacing', value: profile.spacing },
          { label: 'Germination', value: profile.germination_time },
          { label: 'Harvest', value: profile.harvest_time },
        ].map((stat) => (
          <div key={stat.label} className="glass-card glass-card-hover p-4">
            <p className="text-xs font-medium text-stone-500 mb-1">{stat.label}</p>
            <p className="text-sm text-stone-800 font-medium leading-snug">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Yield */}
      {profile.yield_estimate && (
        <div className="glass-card p-5 gradient-subtle border border-forest-200">
          <h3 className="font-semibold text-stone-800 mb-1">Expected Yield</h3>
          <p className="text-sm text-stone-700">{profile.yield_estimate}</p>
        </div>
      )}

      {/* Diseases */}
      {profile.common_diseases?.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="section-title mb-4">Common Diseases</h3>
          <div className="space-y-3">
            {profile.common_diseases.map((disease, i) => (
              <div key={i} className="bg-danger-50/30 border border-danger-100 rounded-xl p-4">
                <h4 className="font-semibold text-danger-800 text-sm mb-1">{disease.name}</h4>
                <p className="text-xs text-stone-600 mb-1">
                  <span className="font-medium">Symptoms:</span> {disease.symptoms}
                </p>
                <p className="text-xs text-forest-700">
                  <span className="font-medium">Prevention:</span> {disease.prevention}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pests & Companions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {profile.common_pests?.length > 0 && (
          <div className="glass-card p-5">
            <h3 className="font-semibold text-stone-800 mb-3">Common Pests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.common_pests.map((pest, i) => (
                <span key={i} className="badge badge-yellow text-[11px]">{pest}</span>
              ))}
            </div>
          </div>
        )}
        {profile.companion_plants?.length > 0 && (
          <div className="glass-card p-5">
            <h3 className="font-semibold text-stone-800 mb-3">Companion Plants</h3>
            <div className="flex flex-wrap gap-2">
              {profile.companion_plants.map((plant, i) => (
                <span key={i} className="badge badge-green text-[11px]">{plant}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Nutrition */}
      {profile.nutritional_needs && (
        <div className="glass-card p-6">
          <h3 className="font-semibold text-stone-800 mb-2">Nutritional Needs</h3>
          <p className="text-sm text-stone-700 leading-relaxed">{profile.nutritional_needs}</p>
        </div>
      )}

      {/* Care Tips */}
      {profile.care_tips?.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="font-semibold text-stone-800 mb-3">Care Tips</h3>
          <div className="space-y-2">
            {profile.care_tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-stone-700">
                <span className="text-forest-500 flex-shrink-0 font-bold">›</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EncyclopediaPage() {
  const [search, setSearch] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filteredCrops = commonCrops.filter(
    crop => crop.name.toLowerCase().includes(search.toLowerCase()) ||
            crop.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(filteredCrops.map(c => c.category))];

  const handleCropSelect = async (crop) => {
    setSelectedCrop(crop);
    setLoading(true);
    setError(null);
    setProfile(null);

    try {
      const result = await generateCropProfile(crop.name);
      setProfile(result);
    } catch (err) {
      setError('Failed to generate crop profile. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedCrop(null);
    setProfile(null);
    setError(null);
  };

  return (
    <div className="page-transition pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-stone-900">Crop Encyclopedia</h1>
        <p className="text-sm text-stone-500 mt-1">
          Search crops and get AI-generated growing guides
        </p>
      </div>

      {selectedCrop && (
        <button
          onClick={handleBack}
          className="text-sm font-medium text-forest-600 hover:text-forest-800 mb-4 inline-flex items-center gap-1 transition-colors bg-transparent border-none cursor-pointer"
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
            <path d="M10 4l-4 4 4 4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to crops
        </button>
      )}

      {!selectedCrop && (
        <>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" stroke="currentColor" strokeWidth="2">
                <circle cx="7" cy="7" r="5"/>
                <path d="M11 11l3 3" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                id="crop-search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search crops by name or category..."
                className="input-field pl-11"
              />
            </div>
          </div>

          {/* Crop Grid by Category */}
          {categories.map(category => (
            <div key={category} className="mb-6">
              <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                {category}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filteredCrops
                  .filter(c => c.category === category)
                  .map((crop) => (
                    <button
                      key={crop.name}
                      onClick={() => handleCropSelect(crop)}
                      className="glass-card glass-card-hover p-4 text-center cursor-pointer border-none bg-transparent group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center mx-auto mb-2 group-hover:bg-forest-100 transition-colors">
                        <span className="text-sm font-bold text-forest-600">
                          {crop.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-stone-800">{crop.name}</span>
                    </button>
                  ))}
              </div>
            </div>
          ))}

          {filteredCrops.length === 0 && (
            <div className="text-center py-12">
              <p className="text-stone-500 text-sm">No crops found matching "{search}"</p>
              <p className="text-xs text-stone-400 mt-1">Try a different search term</p>
            </div>
          )}
        </>
      )}

      {loading && (
        <div className="glass-card p-12 text-center">
          <div className="inline-block w-10 h-10 border-3 border-forest-200 border-t-forest-600 rounded-full animate-spin mb-4" />
          <p className="text-stone-600 font-medium text-sm">
            Generating profile for {selectedCrop?.name}...
          </p>
        </div>
      )}

      {error && (
        <div className="glass-card p-6 border border-danger-200 bg-danger-50/50">
          <p className="text-sm text-danger-700 flex items-center gap-2">
            <span className="status-dot status-dot-red" /> {error}
          </p>
          <button
            onClick={() => handleCropSelect(selectedCrop)}
            className="mt-3 text-sm font-medium text-danger-600 hover:text-danger-800 underline bg-transparent border-none cursor-pointer"
          >
            Try again
          </button>
        </div>
      )}

      {profile && <CropProfileDisplay profile={profile} />}
    </div>
  );
}
