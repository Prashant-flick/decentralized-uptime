import React, { useState, useEffect } from 'react';
import { Activity, Plus, ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Website {
  id: string;
  url: string;
  name: string;
  status: ('initializing' | 'up' | 'down')[];
}

function Dashboard() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWebsite, setNewWebsite] = useState({ name: '', url: '' });

  const addWebsite = () => {
    if (newWebsite.name && newWebsite.url) {
      const website: Website = {
        id: Date.now().toString(),
        ...newWebsite,
        status: Array(10).fill('initializing')
      };
      setWebsites([...websites, website]);
      setNewWebsite({ name: '', url: '' });
      setShowAddModal(false);

      // Simulate status updates
      let index = 0;
      const interval = setInterval(() => {
        if (index < 10) {
          setWebsites(prev => {
            const websiteIndex = prev.findIndex(w => w.id === website.id);
            if (websiteIndex === -1) return prev;

            const newWebsites = [...prev];
            const newStatus = [...newWebsites[websiteIndex].status];
            newStatus[index] = Math.random() > 0.2 ? 'up' : 'down';
            newWebsites[websiteIndex] = { ...newWebsites[websiteIndex], status: newStatus };
            return newWebsites;
          });
          index++;
        } else {
          clearInterval(interval);
        }
      }, 3000);
    }
  };

  const getStatusColor = (status: 'initializing' | 'up' | 'down') => {
    switch (status) {
      case 'up':
        return 'bg-emerald-500';
      case 'down':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              <div className="flex items-center space-x-2">
                <Activity className="w-6 h-6 text-emerald-400" />
                <span className="text-xl font-bold">DeUptime Dashboard</span>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Website</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {websites.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">No websites monitored yet</h2>
            <p className="text-gray-400 mb-8">Add your first website to start monitoring its uptime</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-lg transition-colors"
            >
              Add Your First Website
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {websites.map(website => (
              <div key={website.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{website.name}</h3>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <ExternalLink className="w-4 h-4" />
                      <a href={website.url} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">
                        {website.url}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {website.status.map((status, index) => (
                      <div
                        key={index}
                        className={`w-3 h-8 rounded-sm ${getStatusColor(status)}`}
                        title={`Status ${index + 1}: ${status}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Website Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Website</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Website Name</label>
                <input
                  type="text"
                  value={newWebsite.name}
                  onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                  placeholder="My Website"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Website URL</label>
                <input
                  type="url"
                  value={newWebsite.url}
                  onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addWebsite}
                  className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Add Website
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;