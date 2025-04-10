import { useEffect, useState } from 'react';
import { Activity, Plus, ArrowLeft, ExternalLink, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { conf } from '../conf/config';
import { useAuth } from '../context/useAuth';

interface Website {
  id: string;
  url: string;
  status: ('initializing' | 'up' | 'down')[];
}

function Dashboard() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWebsiteUrl, setNewWebsiteUrl] = useState('');
  const { accessToken } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState('');

  useEffect(() => {
    console.log(accessToken);
    if (accessToken) {
      updateWebsiteTicks();
    }
  },[accessToken])

  setTimeout(() => {
    if (accessToken) {
      updateWebsiteTicks();
    }
  }, 60*1000);

  const updateWebsiteTicks = async() => {
    const websitesRes = await axios.get(`${conf.BackendUrl}/websites`, {
      headers: {
        Authorization: `${accessToken}`
      }
    })
    const Websites: {url: string, id: string}[] = websitesRes.data;
    const updateWebsite = Websites.map(website => ({
      id: website.id,
      url: website.url,
      status: Array(10).fill('initializing'),
    }));

    const updatedWebsite = await Promise.all(
      updateWebsite.map(async(website) => {
        const ticksRes = await axios.get(`${conf.BackendUrl}/website/ticks?websiteId=${website.id}`, {
          headers: {
            Authorization: `${accessToken}`
          }
        })
        const ticks: { status: 'Good'|'Bad', createdAt: string }[] = ticksRes.data.ticks;
        for (let i=0; i<10 && i<ticks.length; i++) {
          const idx = 10-i-1;
          website.status[idx] = ticks[i].status==='Bad'?'down':'up';
        }
        return website;
      })
    )
    setWebsites(updatedWebsite);
  }

  const addWebsite = async() => {
    if (newWebsiteUrl) {
      try {
        const createWebsiteRes = await axios.post(`${conf.BackendUrl}/website`, {
          url: newWebsiteUrl
        }, {
          headers: {
            Authorization: `${accessToken}`
          }
        })
  
        const website: Website = {
          id: createWebsiteRes.data.id,
          url: newWebsiteUrl,
          status: Array(10).fill('initializing')
        };
        setWebsites(prev => [...prev, website]);
        setNewWebsiteUrl('');
        setShowAddModal(false);
      } catch (error) {
        console.error(error);
      }
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

  const handleDeleteWebsite = async(id: string) => {
    if (id && accessToken) {
      try {
        await axios.delete(`${conf.BackendUrl}/website?websiteId=${id}`, {
          headers: {
            Authorization: `${accessToken}`
          }
        })
        setWebsites(prev => prev.filter(website => website.id!==id));
        setShowDeleteModal('');
      } catch (error) {
        console.error(error);
      }
    }
  }

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
                    <h3 className="text-xl font-semibold">{website.url}</h3>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <ExternalLink className="w-4 h-4" />
                      <a href={website.url} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">
                        {website.url}
                      </a>
                    </div>
                  </div>
                  <div className='flex items-center space-x-6'>
                    <div className="flex items-center space-x-2">
                      {website.status.map((status, index) => (
                        <div
                          key={index}
                          className={`w-3 h-8 rounded-sm ${getStatusColor(status)}`}
                          title={`Status ${index + 1}: ${status}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setShowDeleteModal(website.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete website"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
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
                <label className="block text-sm font-medium text-gray-300 mb-1">Website URL</label>
                <input
                  type="url"
                  value={newWebsiteUrl}
                  onChange={(e) => setNewWebsiteUrl(e.target.value)}
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
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Delete Website</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this website? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal('')}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteWebsite(showDeleteModal)}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
              >
                Delete Website
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;