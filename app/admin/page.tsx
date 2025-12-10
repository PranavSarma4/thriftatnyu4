'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Libraries } from '@react-google-maps/api';

const libraries: Libraries = ['places'];
import { 
  Search, 
  Filter,
  MapPin,
  List,
  Mail,
  Phone,
  Calendar,
  Package,
  Truck,
  Clock,
  Tag,
  DollarSign,
  ChevronDown,
  X,
  RefreshCw,
  Eye,
  Shield,
  Trash2,
  Save
} from 'lucide-react';
import { getSubmissions, updateSubmission, clearAllSubmissions } from '@/lib/store';
import { ClothingSubmission, SubmissionStatus, STATUS_LABELS } from '@/lib/types';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '16px',
};

const defaultCenter = {
  lat: 40.7308,
  lng: -73.9973,
};

const statusOptions: SubmissionStatus[] = ['pending', 'scheduled', 'picked_up', 'processing', 'listed', 'sold'];

const statusIcons: Record<SubmissionStatus, typeof Package> = {
  pending: Clock,
  scheduled: Calendar,
  picked_up: Truck,
  processing: Package,
  listed: Tag,
  sold: DollarSign,
};

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM'
];

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<ClothingSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<ClothingSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedSubmission, setSelectedSubmission] = useState<ClothingSubmission | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);
  const [mapSelectedMarker, setMapSelectedMarker] = useState<ClothingSubmission | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Scheduling state
  const [editingSchedule, setEditingSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const loadSubmissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadSubmissions();
    }
  }, [isAuthenticated, loadSubmissions]);

  useEffect(() => {
    let filtered = submissions;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.customerName.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.pickupAddress.toLowerCase().includes(query) ||
        s.id.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }
    
    setFilteredSubmissions(filtered);
  }, [searchQuery, statusFilter, submissions]);

  // Update selected submission when editing
  useEffect(() => {
    if (selectedSubmission) {
      setScheduleDate(selectedSubmission.scheduledPickupDate || '');
      setScheduleTime(selectedSubmission.scheduledPickupTime || '');
      setAdminNotes(selectedSubmission.adminNotes || '');
    }
  }, [selectedSubmission]);

  const handleStatusChange = async (id: string, newStatus: SubmissionStatus) => {
    const updated = await updateSubmission(id, { status: newStatus });
    await loadSubmissions();
    setShowStatusDropdown(null);
    
    if (selectedSubmission?.id === id && updated) {
      setSelectedSubmission(updated);
    }
  };

  const handleSaveSchedule = async () => {
    if (!selectedSubmission) return;
    
    const updated = await updateSubmission(selectedSubmission.id, {
      status: scheduleDate ? 'scheduled' : selectedSubmission.status,
      scheduledPickupDate: scheduleDate || undefined,
      scheduledPickupTime: scheduleTime || undefined,
      adminNotes: adminNotes || undefined,
    });
    
    if (updated) {
      setSelectedSubmission(updated);
      await loadSubmissions();
    }
    setEditingSchedule(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid password');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: SubmissionStatus) => {
    const colors: Record<SubmissionStatus, string> = {
      pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      scheduled: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      picked_up: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      processing: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      listed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      sold: 'bg-green-600/10 text-green-600 border-green-600/20',
    };
    return colors[status];
  };

  const getMarkerColor = (status: SubmissionStatus) => {
    const colors: Record<SubmissionStatus, string> = {
      pending: '#f59e0b',
      scheduled: '#3b82f6',
      picked_up: '#a855f7',
      processing: '#6366f1',
      listed: '#10b981',
      sold: '#16a34a',
    };
    return colors[status];
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md mx-4"
        >
          <div className="bg-[var(--surface)] rounded-2xl p-8 border border-[var(--border)] shadow-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-[var(--accent)]" />
              </div>
              <h1 className="text-2xl font-bold">Admin Access</h1>
              <p className="text-[var(--muted)] mt-2">Enter password to continue</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="input-field"
                />
                {authError && (
                  <p className="text-red-500 text-sm mt-2">{authError}</p>
                )}
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full"
              >
                <span>Login</span>
              </motion.button>
            </form>
            
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-[var(--muted)]">Manage pickup submissions and track orders</p>
          </div>
          
          {/* Stats */}
          <div className="flex gap-4 flex-wrap">
            {[
              { label: 'Total', value: submissions.length, color: 'var(--accent)' },
              { label: 'Pending', value: submissions.filter(s => s.status === 'pending').length, color: '#f59e0b' },
              { label: 'Scheduled', value: submissions.filter(s => s.status === 'scheduled').length, color: '#3b82f6' },
              { label: 'Completed', value: submissions.filter(s => s.status === 'sold').length, color: '#16a34a' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[var(--surface)] rounded-xl px-4 py-3 border border-[var(--border)]"
              >
                <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs text-[var(--muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, address, or ID..."
              className="input-field pr-12"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as SubmissionStatus | 'all')}
              className="input-field appearance-none pr-10 min-w-[180px]"
            >
              <option value="all">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
          </div>
          
          {/* View Toggle */}
          <div className="flex bg-[var(--surface)] rounded-xl border border-[var(--border)] p-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'list' 
                  ? 'bg-[var(--accent)] text-white' 
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'map' 
                  ? 'bg-[var(--accent)] text-white' 
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Map</span>
            </motion.button>
          </div>
          
          {/* Refresh */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadSubmissions}
            disabled={isLoading}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </motion.button>
          
          {/* Clear Data */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={async () => {
              if (confirm('Are you sure you want to clear all submissions? This cannot be undone.')) {
                await clearAllSubmissions();
                await loadSubmissions();
                setSelectedSubmission(null);
              }
            }}
            className="btn-secondary flex items-center gap-2 text-red-500 hover:text-red-600 hover:border-red-500"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear All</span>
          </motion.button>
        </motion.div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className={`${selectedSubmission ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <AnimatePresence mode="wait">
              {viewMode === 'list' ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden"
                >
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 p-4 bg-[var(--surface-elevated)] border-b border-[var(--border)] text-sm font-medium text-[var(--muted)]">
                    <div className="col-span-3">Customer</div>
                    <div className="col-span-3">Pickup Address</div>
                    <div className="col-span-2">Items</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  
                  {/* Table Body */}
                  <div className="divide-y divide-[var(--border)] max-h-[600px] overflow-y-auto">
                    {filteredSubmissions.length === 0 ? (
                      <div className="p-12 text-center">
                        <Package className="w-12 h-12 mx-auto text-[var(--muted)] mb-4" />
                        <p className="text-[var(--muted)]">No submissions found</p>
                      </div>
                    ) : (
                      filteredSubmissions.map((submission, index) => {
                        const StatusIcon = statusIcons[submission.status];
                        
                        return (
                          <motion.div
                            key={submission.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer ${
                              selectedSubmission?.id === submission.id ? 'bg-[var(--accent)]/5' : ''
                            }`}
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            {/* Customer */}
                            <div className="col-span-3">
                              <p className="font-medium truncate">{submission.customerName}</p>
                              <p className="text-sm text-[var(--muted)] truncate">{submission.email}</p>
                            </div>
                            
                            {/* Address */}
                            <div className="col-span-3">
                              <p className="text-sm truncate">{submission.pickupAddress}</p>
                              {submission.scheduledPickupDate && (
                                <p className="text-xs text-blue-500 mt-1">
                                  📅 {formatDate(submission.scheduledPickupDate)}
                                  {submission.scheduledPickupTime && ` at ${submission.scheduledPickupTime}`}
                                </p>
                              )}
                            </div>
                            
                            {/* Items */}
                            <div className="col-span-2">
                              <p className="font-medium">{submission.estimatedItems} items</p>
                            </div>
                            
                            {/* Status */}
                            <div className="col-span-2 relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowStatusDropdown(showStatusDropdown === submission.id ? null : submission.id);
                                }}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${getStatusColor(submission.status)}`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                {STATUS_LABELS[submission.status]}
                                <ChevronDown className="w-3 h-3" />
                              </button>
                              
                              {/* Dropdown */}
                              <AnimatePresence>
                                {showStatusDropdown === submission.id && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 mt-1 z-[100] bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden min-w-[160px]"
                                  >
                                    {statusOptions.map((status) => {
                                      const Icon = statusIcons[status];
                                      return (
                                        <button
                                          key={status}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleStatusChange(submission.id, status);
                                          }}
                                          className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--surface-elevated)] transition-colors ${
                                            submission.status === status ? 'bg-[var(--accent)]/5 text-[var(--accent)]' : ''
                                          }`}
                                        >
                                          <Icon className="w-4 h-4" />
                                          {STATUS_LABELS[status]}
                                        </button>
                                      );
                                    })}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            
                            {/* Actions */}
                            <div className="col-span-2 flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSubmission(submission);
                                }}
                                className="p-2 rounded-lg hover:bg-[var(--accent)]/10 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="map"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden"
                  style={{ height: '600px' }}
                >
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={defaultCenter}
                      zoom={13}
                      options={{
                        disableDefaultUI: false,
                        zoomControl: true,
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: true,
                      }}
                    >
                      {filteredSubmissions.map((submission) => {
                        if (!submission.pickupLat || !submission.pickupLng) return null;
                        
                        return (
                          <Marker
                            key={submission.id}
                            position={{ lat: submission.pickupLat, lng: submission.pickupLng }}
                            onClick={() => {
                              setMapSelectedMarker(submission);
                              setSelectedSubmission(submission);
                            }}
                            icon={{
                              path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                              fillColor: getMarkerColor(submission.status),
                              fillOpacity: 1,
                              strokeWeight: 2,
                              strokeColor: '#fff',
                              scale: 1.5,
                              anchor: new google.maps.Point(12, 24),
                            }}
                          />
                        );
                      })}
                      
                      {mapSelectedMarker && mapSelectedMarker.pickupLat && mapSelectedMarker.pickupLng && (
                        <InfoWindow
                          position={{ lat: mapSelectedMarker.pickupLat, lng: mapSelectedMarker.pickupLng }}
                          onCloseClick={() => setMapSelectedMarker(null)}
                        >
                          <div className="p-2 min-w-[200px]">
                            <p className="font-bold text-gray-900">{mapSelectedMarker.customerName}</p>
                            <p className="text-sm text-gray-600">{mapSelectedMarker.pickupAddress}</p>
                            <p className="text-sm mt-2">
                              <span className="font-medium">Status:</span> {STATUS_LABELS[mapSelectedMarker.status]}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Items:</span> {mapSelectedMarker.estimatedItems}
                            </p>
                            {mapSelectedMarker.scheduledPickupDate && (
                              <p className="text-sm text-blue-600 mt-1">
                                📅 {formatDate(mapSelectedMarker.scheduledPickupDate)}
                                {mapSelectedMarker.scheduledPickupTime && ` at ${mapSelectedMarker.scheduledPickupTime}`}
                              </p>
                            )}
                          </div>
                        </InfoWindow>
                      )}
                    </GoogleMap>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 border-2 border-[var(--accent)]/20 border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[var(--muted)]">Loading map...</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Map Legend */}
            {viewMode === 'map' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-[var(--surface)] rounded-xl p-4 border border-[var(--border)]"
              >
                <p className="text-sm font-medium mb-3">Map Legend</p>
                <div className="flex flex-wrap gap-4">
                  {statusOptions.map((status) => (
                    <div key={status} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getMarkerColor(status) }}
                      />
                      <span className="text-sm text-[var(--muted)]">{STATUS_LABELS[status]}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Detail Panel */}
          <AnimatePresence>
            {selectedSubmission && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-1"
              >
                <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                  {/* Header */}
                  <div className="p-6 border-b border-[var(--border)]">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-[var(--muted)]">Submission Details</p>
                        <h3 className="text-xl font-bold">{selectedSubmission.customerName}</h3>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedSubmission(null)}
                        className="p-2 rounded-lg hover:bg-[var(--surface-elevated)] transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>
                    
                    <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(selectedSubmission.status)}`}>
                      {(() => {
                        const Icon = statusIcons[selectedSubmission.status];
                        return <Icon className="w-4 h-4" />;
                      })()}
                      {STATUS_LABELS[selectedSubmission.status]}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Contact Info */}
                    <div>
                      <h4 className="text-sm font-medium text-[var(--muted)] mb-3">Contact Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-[var(--muted)]" />
                          <a href={`mailto:${selectedSubmission.email}`} className="text-sm hover:text-[var(--accent)]">
                            {selectedSubmission.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-[var(--muted)]" />
                          <a href={`tel:${selectedSubmission.phone}`} className="text-sm hover:text-[var(--accent)]">
                            {selectedSubmission.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-4 h-4 text-[var(--muted)]" />
                          <span className="text-sm">Zelle: {selectedSubmission.zelleInfo}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Pickup Location */}
                    <div>
                      <h4 className="text-sm font-medium text-[var(--muted)] mb-3">Pickup Location</h4>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-[var(--muted)] mt-1" />
                        <p className="text-sm">{selectedSubmission.pickupAddress}</p>
                      </div>
                    </div>
                    
                    {/* Schedule Pickup */}
                    <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          Schedule Pickup
                        </h4>
                        {!editingSchedule && (
                          <button
                            onClick={() => setEditingSchedule(true)}
                            className="text-xs text-blue-500 hover:underline"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                      
                      {editingSchedule ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-[var(--muted)] mb-1">Date</label>
                            <input
                              type="date"
                              value={scheduleDate}
                              onChange={(e) => setScheduleDate(e.target.value)}
                              min={getMinDate()}
                              className="input-field text-sm py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[var(--muted)] mb-1">Time</label>
                            <select
                              value={scheduleTime}
                              onChange={(e) => setScheduleTime(e.target.value)}
                              className="input-field text-sm py-2"
                            >
                              <option value="">Select time</option>
                              {timeSlots.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-[var(--muted)] mb-1">Admin Notes</label>
                            <textarea
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Internal notes..."
                              rows={2}
                              className="input-field text-sm py-2 resize-none"
                            />
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleSaveSchedule}
                              className="btn-primary text-sm py-2 flex-1 flex items-center justify-center gap-2"
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setEditingSchedule(false)}
                              className="btn-secondary text-sm py-2"
                            >
                              Cancel
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm">
                          {selectedSubmission.scheduledPickupDate ? (
                            <div className="space-y-1">
                              <p className="font-medium text-blue-600">
                                📅 {formatDate(selectedSubmission.scheduledPickupDate)}
                                {selectedSubmission.scheduledPickupTime && ` at ${selectedSubmission.scheduledPickupTime}`}
                              </p>
                              {selectedSubmission.adminNotes && (
                                <p className="text-xs text-[var(--muted)]">
                                  Notes: {selectedSubmission.adminNotes}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-[var(--muted)]">Not scheduled yet</p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Items */}
                    <div>
                      <h4 className="text-sm font-medium text-[var(--muted)] mb-3">Clothing Items</h4>
                      <p className="text-sm mb-2">{selectedSubmission.estimatedItems} estimated items</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSubmission.clothingItems.map((item, i) => (
                          <span 
                            key={i}
                            className="px-2 py-1 bg-[var(--surface-elevated)] rounded-lg text-xs"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                      {selectedSubmission.clothingDescription && (
                        <p className="text-sm text-[var(--muted)] mt-3">
                          {selectedSubmission.clothingDescription}
                        </p>
                      )}
                    </div>
                    
                    {/* Dates */}
                    <div>
                      <h4 className="text-sm font-medium text-[var(--muted)] mb-3">Timeline</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[var(--muted)]">Submitted</span>
                          <span>{formatDateTime(selectedSubmission.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--muted)]">Last Updated</span>
                          <span>{formatDateTime(selectedSubmission.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tracking ID */}
                    <div className="pt-4 border-t border-[var(--border)]">
                      <p className="text-xs text-[var(--muted)] mb-1">Tracking ID</p>
                      <p className="font-mono text-sm">{selectedSubmission.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
