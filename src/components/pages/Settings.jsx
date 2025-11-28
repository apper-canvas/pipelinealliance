import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { create, getAll, update } from "@/services/api/companiesService";
import profileService from "@/services/api/profileService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Company from "@/components/pages/Company";

function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  
  const tabs = [
    { id: 'profile', label: 'My Profile', icon: 'User' },
    { id: 'company', label: 'Company Profile', icon: 'Building2' },
{ id: 'subscription', label: 'Subscription', icon: 'CreditCard' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'profile' && <MyProfileTab />}
        {activeTab === 'company' && <CompanyProfileTab />}
        {activeTab === 'subscription' && <SubscriptionTab />}
      </div>
    </div>
  );
}

// My Profile Tab Component
function MyProfileTab() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    title: 'Sales Manager',
    department: 'Sales',
    timezone: 'America/New_York',
    language: 'English',
    profilePhoto: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await profileService.updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
};

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPG, PNG, or GIF)');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Update form data with new photo
      setFormData(prev => ({ ...prev, profilePhoto: previewUrl }));
      
      // Here you would typically upload to a server
      // For now, we'll simulate an upload with profileService
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload delay
      
      toast.success('Profile photo updated successfully!');
    } catch (error) {
      console.error('Photo upload error:', error);
      toast.error('Failed to update profile photo. Please try again.');
      // Reset to previous state on error
      setFormData(prev => ({ ...prev, profilePhoto: null }));
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-2xl">
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
          <p className="text-sm text-gray-600 mt-1">Update your personal details and preferences</p>
        </div>

        {/* Avatar Section */}
        <div className="mb-6 flex items-center gap-6">
          <div className="relative">
<div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-semibold overflow-hidden">
            {formData.profilePhoto ? (
              <img 
                src={formData.profilePhoto} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              'JD'
            )}
          </div>
          <button 
            onClick={triggerFileInput}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
          >
            <ApperIcon 
              name={uploading ? "Loader2" : "Camera"} 
              size={16} 
              className={`text-gray-600 ${uploading ? 'animate-spin' : ''}`} 
            />
          </button>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Profile Photo</h3>
          <p className="text-sm text-gray-600">Upload a new avatar. JPG, PNG or GIF format. Max 5MB.</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={triggerFileInput}
            disabled={uploading}
          >
            <ApperIcon name={uploading ? "Loader2" : "Upload"} size={16} className={uploading ? 'animate-spin' : ''} />
            {uploading ? 'Uploading...' : 'Change Photo'}
          </Button>
        </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              required
            />
          </div>

          <Input
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />

          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Job Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
            <Input
              label="Department"
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Timezone"
              value={formData.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
            />
            <Input
              label="Language"
              value={formData.language}
              onChange={(e) => handleChange('language', e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? <ApperIcon name="Loader2" size={16} className="animate-spin" /> : null}
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// Company Profile Tab Component
function CompanyProfileTab() {
  const [loading, setLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    companyName: 'Acme Corporation',
    website: 'https://acme.com',
    industry: 'Technology',
    companySize: '50-200',
    address: '123 Business Ave',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    logo: null
  });

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const profileData = { ...formData };
      if (logoFile) {
        profileData.logo = logoFile;
      }
      await profileService.updateCompanyProfile(profileData);
      toast.success('Company profile updated successfully');
    } catch (error) {
      toast.error('Failed to update company profile');
    } finally {
      setLoading(false);
    }
  };

const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setLogoUploading(true);
    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      setLogoFile(file);
      setFormData(prev => ({ ...prev, logo: file.name }));
      toast.success('Logo selected successfully');
    } catch (error) {
      toast.error('Failed to process image');
    } finally {
      setLogoUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview(null);
    setLogoFile(null);
    setFormData(prev => ({ ...prev, logo: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl">
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>
          <p className="text-sm text-gray-600 mt-1">Update your organization's details</p>
        </div>

        {/* Company Logo Section */}
        <div className="mb-6 flex items-center gap-6">
<div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
            {logoPreview ? (
              <img 
                src={logoPreview} 
                alt="Company logo preview" 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <ApperIcon name="Building2" size={24} className="text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Company Logo</h3>
            <p className="text-sm text-gray-600">Upload your company logo. Recommended size: 200x200px, max 5MB</p>
            <div className="flex items-center gap-2 mt-2">
              <Button 
                type="button"
                variant="outline" 
                onClick={handleLogoUpload}
                disabled={logoUploading}
              >
                {logoUploading ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Upload" size={16} />
                    {logoPreview ? 'Change Logo' : 'Upload Logo'}
                  </>
                )}
              </Button>
              {logoPreview && (
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleRemoveLogo}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <ApperIcon name="Trash2" size={16} />
                  Remove
                </Button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Company Name"
            value={formData.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            required
          />

          <Input
            label="Website"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Industry"
              value={formData.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
            />
            <Input
              label="Company Size"
              value={formData.companySize}
              onChange={(e) => handleChange('companySize', e.target.value)}
            />
          </div>

          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
            />
            <Input
              label="State"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
            />
            <Input
              label="ZIP Code"
              value={formData.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
            />
          </div>

          <Input
            label="Country"
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
          />

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? <ApperIcon name="Loader2" size={16} className="animate-spin" /> : null}
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
// Subscription Tab Component
function SubscriptionTab() {
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState({
    name: 'Professional',
    price: 29,
    billing: 'monthly',
    features: [
      'Up to 10 team members',
      'Advanced analytics',
      'Priority support',
      'Custom integrations'
    ],
    nextBilling: '2024-02-15',
    status: 'active'
  });

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9,
      description: 'Perfect for small teams getting started',
      features: [
        'Up to 3 team members',
        'Basic analytics',
        'Email support',
        'Standard integrations'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 29,
      description: 'Great for growing businesses',
      features: [
        'Up to 10 team members',
        'Advanced analytics',
        'Priority support',
        'Custom integrations'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      description: 'For large organizations with advanced needs',
      features: [
        'Unlimited team members',
        'Enterprise analytics',
        'Dedicated support',
        'Custom solutions'
      ]
    }
  ];

  const handlePlanChange = async (planId) => {
    setLoading(true);
    try {
      // Simulate API call for plan change
      await new Promise(resolve => setTimeout(resolve, 1500));
      const selectedPlan = plans.find(p => p.id === planId);
      if (selectedPlan) {
        setCurrentPlan(prev => ({
          ...prev,
          name: selectedPlan.name,
          price: selectedPlan.price
        }));
        toast.success(`Successfully upgraded to ${selectedPlan.name} plan`);
      }
    } catch (error) {
      toast.error('Failed to change subscription plan');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call for cancellation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentPlan(prev => ({ ...prev, status: 'cancelled' }));
      toast.success('Subscription cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Current Plan */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your subscription and billing</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{currentPlan.name}</h3>
              <Badge variant={currentPlan.status === 'active' ? 'success' : 'destructive'}>
                {currentPlan.status === 'active' ? 'Active' : 'Cancelled'}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-primary">
              ${currentPlan.price}<span className="text-sm font-normal text-gray-600">/month</span>
            </p>
            {currentPlan.status === 'active' && (
              <p className="text-sm text-gray-600 mt-1">
                Next billing date: {new Date(currentPlan.nextBilling).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="text-right">
            <Button 
              variant="outline" 
              onClick={handleCancelSubscription}
              disabled={loading || currentPlan.status !== 'active'}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {loading ? (
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
              ) : (
                <ApperIcon name="X" size={16} />
              )}
              Cancel Subscription
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Current Plan Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {currentPlan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <ApperIcon name="Check" size={16} className="text-green-600" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Available Plans */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Available Plans</h2>
          <p className="text-sm text-gray-600 mt-1">Choose the plan that best fits your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative border rounded-lg p-6 ${
                plan.popular ? 'border-primary ring-2 ring-primary ring-opacity-20' : 'border-gray-200'
              } ${currentPlan.name.toLowerCase() === plan.name.toLowerCase() ? 'bg-gray-50' : 'bg-white'}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-white">Most Popular</Badge>
                </div>
              )}
              
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-sm text-gray-600">/month</span>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <ApperIcon name="Check" size={14} className="text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                className="w-full"
                variant={currentPlan.name.toLowerCase() === plan.name.toLowerCase() ? 'outline' : 'default'}
                disabled={currentPlan.name.toLowerCase() === plan.name.toLowerCase() || loading}
                onClick={() => handlePlanChange(plan.id)}
              >
                {loading ? (
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                ) : currentPlan.name.toLowerCase() === plan.name.toLowerCase() ? (
                  'Current Plan'
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Billing History */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Billing History</h2>
          <p className="text-sm text-gray-600 mt-1">View your past invoices and payments</p>
        </div>

        <div className="space-y-3">
          {[
            { date: '2024-01-15', amount: 29, status: 'paid', invoice: 'INV-2024-001' },
            { date: '2023-12-15', amount: 29, status: 'paid', invoice: 'INV-2023-012' },
            { date: '2023-11-15', amount: 29, status: 'paid', invoice: 'INV-2023-011' },
          ].map((transaction, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <ApperIcon name="Check" size={14} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{transaction.invoice}</p>
                  <p className="text-xs text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">${transaction.amount}</p>
                <Badge variant="success" className="text-xs">Paid</Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button variant="outline" className="text-sm">
            <ApperIcon name="Download" size={14} />
            Download All Invoices
          </Button>
        </div>
      </Card>
    </div>
  );
}

// User Management Tab Component

export default Settings;