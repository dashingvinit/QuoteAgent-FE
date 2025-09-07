import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Axios } from '@/services';
import { Save, Plus, Trash2, MapPin, Globe, Building, Edit, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useOrg } from '@/context/org-provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const OrganizationEditPage = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const { activeOrg } = useOrg();

  // Refs for section navigation
  const basicInfoRef = useRef(null);
  const addressRef = useRef(null);
  const zonesRef = useRef(null);

  // Initialize form data with default structure
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    email: '',
    support_email: '',
    about: '',
    logo: '',
    terms: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'USA',
      currency: 'USD',
    },
    zoneinfo: [],
    VAT: 20,
  });

  // Fetch organization data
  const {
    data: organization,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['organization', activeOrg?._id],
    queryFn: async () => {
      const { data } = await Axios.get('/organizations/' + activeOrg._id);
      return data.data;
    },
    enabled: !!activeOrg?._id,
  });

  // Update organization mutation
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await Axios.put('/organizations/' + activeOrg?._id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['organization']);
      setIsEditing(false);
    },
  });

  // Initialize form data when organization loads
  useEffect(() => {
    if (organization) {
      setFormData({
        ...organization,
        address: {
          street: organization.address?.street || '',
          city: organization.address?.city || '',
          state: organization.address?.state || '',
          zip: organization.address?.zip || '',
          country: organization.address?.country || 'USA',
          currency: organization.address?.currency || 'USD',
        },
        zoneinfo: organization.zoneinfo || [],
      });
    }
  }, [organization]);

  // Intersection Observer to track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) {
              setActiveSection(sectionId);
            }
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
      }
    );

    const sections = [basicInfoRef, addressRef, zonesRef];
    sections.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [organization]);

  const handleInputChange = (field, value) => {
    if (field.includes('address.')) {
      const addressField = field.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleZoneChange = (index, field, value) => {
    const updatedZones = [...formData.zoneinfo];
    if (field.includes('coverage.')) {
      const coverageField = field.split('.')[1];
      if (coverageField === 'centerCoordinates') {
        const coordField = field.split('.')[2];
        updatedZones[index].coverage = {
          ...updatedZones[index].coverage,
          centerCoordinates: {
            ...updatedZones[index].coverage.centerCoordinates,
            [coordField]: parseFloat(value) || 0,
          },
        };
      } else if (['postalCodes', 'cities', 'states'].includes(coverageField)) {
        updatedZones[index].coverage = {
          ...updatedZones[index].coverage,
          [coverageField]: value
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item),
        };
      } else {
        updatedZones[index].coverage = {
          ...updatedZones[index].coverage,
          [coverageField]: value,
        };
      }
    } else {
      updatedZones[index] = {
        ...updatedZones[index],
        [field]: field === 'deliveryFee' ? parseFloat(value) || 0 : value,
      };
    }
    setFormData((prev) => ({
      ...prev,
      zoneinfo: updatedZones,
    }));
  };

  const addZone = () => {
    const newZone = {
      zoneName: '',
      zoneCode: '',
      deliveryFee: 0,
      isActive: true,
      description: '',
      coverage: {
        postalCodes: [],
        cities: [],
        states: [],
        radius: 0,
        centerCoordinates: {
          latitude: 0,
          longitude: 0,
        },
      },
    };
    setFormData((prev) => ({
      ...prev,
      zoneinfo: [...prev.zoneinfo, newZone],
    }));
  };

  const removeZone = (index) => {
    setFormData((prev) => ({
      ...prev,
      zoneinfo: prev.zoneinfo.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleCancel = () => {
    if (organization) {
      setFormData({
        ...organization,
        address: {
          street: organization.address?.street || '',
          city: organization.address?.city || '',
          state: organization.address?.state || '',
          zip: organization.address?.zip || '',
          country: organization.address?.country || 'USA',
          currency: organization.address?.currency || 'USD',
        },
        zoneinfo: organization.zoneinfo || [],
      });
    }
    setIsEditing(false);
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const sidebarItems = [
    {
      id: 'basic',
      label: 'Basic Information',
      icon: Building,
      ref: basicInfoRef,
    },
    {
      id: 'address',
      label: 'Address',
      icon: MapPin,
      ref: addressRef,
    },
    {
      id: 'zones',
      label: 'Delivery Zones',
      icon: Globe,
      ref: zonesRef,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error Loading Organization:</strong> {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-3rem)] flex bg-muted/20">
      {/* Fixed Sidebar */}
      <div className="w-64 bg-muted/50 backdrop-blur-sm border-r border-border p-4 flex-shrink-0 shadow-sm">
        <div className="sticky top-4 space-y-6">
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">Navigation</h3>
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.ref)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 text-left ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md scale-105'
                        : 'hover:bg-accent/80 hover:text-accent-foreground hover:scale-102 hover:shadow-sm'
                    }`}>
                    <IconComponent size={16} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="bg-muted/30 p-4 rounded-lg border">
            {/* Edit Button */}
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="w-full flex items-center gap-2 mb-2">
                <Edit size={16} />
                Edit Organization
              </Button>
            ) : (
              <div className="flex flex-col gap-2 mb-2">
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isLoading}
                  className="w-full flex items-center gap-2">
                  <Save size={16} />
                  {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button onClick={handleCancel} variant="secondary" className="w-full">
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="container mx-auto p-6">
          <div className="mb-8 bg-background/80 backdrop-blur-sm rounded-lg p-6 border shadow-sm">
            <h1 className="text-3xl font-bold text-foreground">Organization Settings</h1>
            <p className="text-muted-foreground mt-2">Manage your organization's profile and configuration</p>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <Card
              ref={basicInfoRef}
              data-section="basic"
              className="bg-background/60 backdrop-blur-sm shadow-md border-l-4 border-l-primary">
              <CardHeader className="bg-muted/40 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Building size={24} className="text-primary" />
                  Basic Information
                </CardTitle>
                <p className="text-sm text-muted-foreground">Essential organization details and contact information</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground font-medium">
                      Organization Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter organization name"
                      className="bg-muted/30 border-muted-foreground/20 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      disabled={!isEditing}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      placeholder="contact@example.com"
                      className="bg-muted/30 border-muted-foreground/20 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support_email">Support Email</Label>
                    <Input
                      id="support_email"
                      type="email"
                      value={formData.support_email}
                      onChange={(e) => handleInputChange('support_email', e.target.value)}
                      disabled={!isEditing}
                      placeholder="support@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input
                      id="logo"
                      type="url"
                      value={formData.logo}
                      onChange={(e) => handleInputChange('logo', e.target.value)}
                      disabled={!isEditing}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vat">VAT (%)</Label>
                    <Input
                      id="vat"
                      type="number"
                      value={formData.VAT}
                      onChange={(e) => handleInputChange('VAT', parseFloat(e.target.value) || 0)}
                      disabled={!isEditing}
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about">About</Label>
                  <Textarea
                    id="about"
                    value={formData.about}
                    onChange={(e) => handleInputChange('about', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Tell us about your organization..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    value={formData.terms}
                    onChange={(e) => handleInputChange('terms', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Enter terms and conditions..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card
              ref={addressRef}
              data-section="address"
              className="bg-background/60 backdrop-blur-sm shadow-md border-l-4 border-l-orange-500">
              <CardHeader className="bg-muted/40 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <MapPin size={24} className="text-orange-500" />
                  Address
                </CardTitle>
                <p className="text-sm text-muted-foreground">Physical location and regional settings</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="street">Street</Label>
                    <Input
                      id="street"
                      value={formData.address.street}
                      onChange={(e) => handleInputChange('address.street', e.target.value)}
                      disabled={!isEditing}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      disabled={!isEditing}
                      placeholder="New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.address.state}
                      onChange={(e) => handleInputChange('address.state', e.target.value)}
                      disabled={!isEditing}
                      placeholder="NY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      value={formData.address.zip}
                      onChange={(e) => handleInputChange('address.zip', e.target.value)}
                      disabled={!isEditing}
                      placeholder="10001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.address.country}
                      onChange={(e) => handleInputChange('address.country', e.target.value)}
                      disabled={!isEditing}
                      placeholder="USA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={formData.address.currency}
                      onChange={(e) => handleInputChange('address.currency', e.target.value)}
                      disabled={!isEditing}
                      placeholder="USD"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Zone Information */}
            <Card
              ref={zonesRef}
              data-section="zones"
              className="bg-background/60 backdrop-blur-sm shadow-md border-l-4 border-l-green-500">
              <CardHeader className="bg-muted/40 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Globe size={24} className="text-green-500" />
                      Delivery Zones
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Configure delivery coverage areas and pricing</p>
                  </div>
                  {isEditing && (
                    <Button
                      onClick={addZone}
                      size="sm"
                      className="flex items-center gap-2 bg-primary hover:bg-primary/80">
                      <Plus size={16} />
                      Add Zone
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.zoneinfo.length > 0 ? (
                  formData.zoneinfo.map((zone, index) => (
                    <Card key={index} className="border bg-muted/20 shadow-sm">
                      <CardHeader className="bg-muted/30 rounded-t-lg">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg text-foreground">Zone {index + 1}</CardTitle>
                          {isEditing && (
                            <Button
                              onClick={() => removeZone(index)}
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive/80 hover:bg-destructive/10">
                              <Trash2 size={20} />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-foreground font-medium">
                              Zone Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              value={zone.zoneName}
                              onChange={(e) => handleZoneChange(index, 'zoneName', e.target.value)}
                              disabled={!isEditing}
                              placeholder="Downtown Zone"
                              className="bg-muted/30 border-muted-foreground/20 focus:border-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-foreground font-medium">
                              Zone Code <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              value={zone.zoneCode}
                              onChange={(e) => handleZoneChange(index, 'zoneCode', e.target.value)}
                              disabled={!isEditing}
                              placeholder="DT001"
                              className="bg-muted/30 border-muted-foreground/20 focus:border-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Delivery Fee ($)</Label>
                            <Input
                              type="number"
                              value={zone.deliveryFee}
                              onChange={(e) => handleZoneChange(index, 'deliveryFee', e.target.value)}
                              disabled={!isEditing}
                              min="0"
                              step="0.01"
                              placeholder="5.00"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`active-${index}`}
                            checked={zone.isActive}
                            onCheckedChange={(checked) => handleZoneChange(index, 'isActive', checked)}
                            disabled={!isEditing}
                          />
                          <Label htmlFor={`active-${index}`}>Active Zone</Label>
                        </div>

                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={zone.description}
                            onChange={(e) => handleZoneChange(index, 'description', e.target.value)}
                            disabled={!isEditing}
                            rows={2}
                            placeholder="Zone description..."
                          />
                        </div>

                        <Separator />

                        <div>
                          <Label className="text-base font-medium">Coverage Details</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div className="space-y-2">
                              <Label>Postal Codes (comma-separated)</Label>
                              <Input
                                value={zone.coverage?.postalCodes?.join(', ') || ''}
                                onChange={(e) => handleZoneChange(index, 'coverage.postalCodes', e.target.value)}
                                disabled={!isEditing}
                                placeholder="10001, 10002, 10003"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Cities (comma-separated)</Label>
                              <Input
                                value={zone.coverage?.cities?.join(', ') || ''}
                                onChange={(e) => handleZoneChange(index, 'coverage.cities', e.target.value)}
                                disabled={!isEditing}
                                placeholder="New York, Brooklyn"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>States (comma-separated)</Label>
                              <Input
                                value={zone.coverage?.states?.join(', ') || ''}
                                onChange={(e) => handleZoneChange(index, 'coverage.states', e.target.value)}
                                disabled={!isEditing}
                                placeholder="NY, NJ"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Radius (km)</Label>
                              <Input
                                type="number"
                                value={zone.coverage?.radius || ''}
                                onChange={(e) => handleZoneChange(index, 'coverage.radius', e.target.value)}
                                disabled={!isEditing}
                                min="0"
                                step="0.1"
                                placeholder="10.5"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Center Latitude</Label>
                              <Input
                                type="number"
                                value={zone.coverage?.centerCoordinates?.latitude || ''}
                                onChange={(e) =>
                                  handleZoneChange(index, 'coverage.centerCoordinates.latitude', e.target.value)
                                }
                                disabled={!isEditing}
                                step="any"
                                placeholder="40.7128"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Center Longitude</Label>
                              <Input
                                type="number"
                                value={zone.coverage?.centerCoordinates?.longitude || ''}
                                onChange={(e) =>
                                  handleZoneChange(index, 'coverage.centerCoordinates.longitude', e.target.value)
                                }
                                disabled={!isEditing}
                                step="any"
                                placeholder="-74.0060"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/30">
                    <Globe size={48} className="mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg mb-2 text-foreground font-medium">No delivery zones configured</p>
                    <p className="text-sm mb-4 text-muted-foreground">
                      Add zones to define your delivery coverage areas
                    </p>
                    {isEditing && (
                      <Button onClick={addZone} className="bg-primary hover:bg-primary/80">
                        <Plus size={16} className="mr-2" />
                        Add First Zone
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Messages */}
            {updateMutation.isError && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Error updating organization:</strong>{' '}
                  {updateMutation.error?.message || 'Unknown error occurred'}
                </AlertDescription>
              </Alert>
            )}

            {updateMutation.isSuccess && (
              <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Organization updated successfully!</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default OrganizationEditPage;
