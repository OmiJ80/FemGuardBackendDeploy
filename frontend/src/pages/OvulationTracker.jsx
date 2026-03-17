import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const OvulationTracker = () => {
  const [cycles, setCycles] = useState([]);
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCycles();
  }, []);

  const fetchCycles = async () => {
    try {
      const res = await api.get('/tracker');
      setCycles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/tracker', {
        lastPeriodDate,
        cycleLength: parseInt(cycleLength, 10)
      });
      setSuccess('Cycle logged successfully!');
      fetchCycles();
      setLastPeriodDate('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log cycle.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Logger Form */}
        <div className="md:col-span-1 glass-panel p-6 h-fit">
          <h2 className="text-2xl font-bold text-secondary mb-6">Log Cycle</h2>
          
          {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
          {success && <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">{success}</div>}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Day of Last Period</label>
              <input 
                type="date" 
                required
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Average Cycle Length (Days)</label>
              <input 
                type="number" 
                min="20"
                max="45"
                required
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            
            <button type="submit" disabled={loading} className="btn-primary bg-gradient-to-r from-secondary to-pink-400 mt-4">
              {loading ? 'Saving...' : 'Calculate & Save'}
            </button>
          </form>
        </div>

        {/* Calendar / Results View */}
        <div className="md:col-span-2 glass-panel p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Cycle Predictions</h2>
          
          {cycles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="text-5xl block mb-4">📅</span>
              <p>No cycles logged yet. Log your last period to see predictions.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Latest Prediction Card */}
              <div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-6 border border-pink-100 shadow-sm relative overflow-hidden">
                <div className="absolute -right-10 -top-10 text-9xl opacity-10">🌺</div>
                
                <h3 className="text-xl font-bold text-primary mb-4">Current Cycle</h3>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-50 text-center">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Next Period</p>
                    <p className="text-lg font-bold text-red-500">{new Date(cycles[0].next_period_date).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-50 text-center flex flex-col justify-center border-b-4 border-b-purple-400">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Ovulation</p>
                    <p className="text-lg font-bold text-purple-600">{new Date(cycles[0].ovulation_date).toLocaleDateString()}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-50 text-center col-span-2 flex flex-col justify-center border-b-4 border-b-green-400">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Fertile Window</p>
                    <p className="text-lg font-bold text-green-600">
                      {new Date(cycles[0].fertile_window_start).toLocaleDateString()} - {new Date(cycles[0].fertile_window_end).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* History List */}
              <div className="mt-8">
                <h3 className="font-bold text-gray-700 mb-4">Cycle History</h3>
                <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="p-4 font-semibold text-gray-600">Last Period</th>
                        <th className="p-4 font-semibold text-gray-600">Length</th>
                        <th className="p-4 font-semibold text-gray-600">Next Predicted</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {cycles.slice(1).map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50">
                          <td className="p-4">{new Date(c.last_period_date).toLocaleDateString()}</td>
                          <td className="p-4">{c.average_cycle_length} days</td>
                          <td className="p-4 text-gray-500">{new Date(c.next_period_date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {cycles.length <= 1 && (
                        <tr>
                          <td colSpan="3" className="p-8 text-center text-gray-400">No past history available.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OvulationTracker;
